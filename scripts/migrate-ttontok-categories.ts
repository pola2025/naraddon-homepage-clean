import path from 'node:path';
import fs from 'node:fs';

import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';

import connectDB from '../src/lib/mongodb';
import TtontokPost, { TtontokCategory } from '../src/models/TtontokPost';

const envFiles = ['.env.local', '.env'];
for (const filename of envFiles) {
  const fullPath = path.resolve(process.cwd(), filename);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
  }
}

const args = new Set(process.argv.slice(2));
const dryRun = !args.has('--apply');
const fallbackToEtc = args.has('--fallback-etc');

const ALLOWED_CATEGORIES: readonly TtontokCategory[] = [
  'funding',
  'tax',
  'hr',
  'marketing',
  'strategy',
  'tech',
  'legal',
  'etc',
];

const FALLBACK_CATEGORY: TtontokCategory = 'etc';

const RAW_CATEGORY_MAPPINGS: Array<[string, TtontokCategory]> = [
  ['startup', 'strategy'],
  ['start-up', 'strategy'],
  ['창업', 'strategy'],
  ['pre-startup', 'strategy'],
  ['prestartup', 'strategy'],
  ['operation', 'strategy'],
  ['operations', 'strategy'],
  ['운영', 'strategy'],
  ['biz', 'strategy'],
  ['business', 'strategy'],
  ['business strategy', 'strategy'],
  ['strategy', 'strategy'],
  ['전략', 'strategy'],
  ['success', 'strategy'],
  ['성공사례', 'strategy'],
  ['성공', 'strategy'],
  ['trouble', 'etc'],
  ['complaint', 'etc'],
  ['painpoint', 'etc'],
  ['pain point', 'etc'],
  ['고충', 'etc'],
  ['support', 'funding'],
  ['supporting', 'funding'],
  ['지원', 'funding'],
  ['지원금', 'funding'],
  ['funding', 'funding'],
  ['finance', 'funding'],
  ['financial', 'funding'],
  ['capital', 'funding'],
  ['자금', 'funding'],
  ['grant', 'funding'],
  ['grants', 'funding'],
  ['loan', 'funding'],
  ['loans', 'funding'],
  ['policy fund', 'funding'],
  ['policy-fund', 'funding'],
  ['세무', 'tax'],
  ['tax', 'tax'],
  ['taxation', 'tax'],
  ['vat', 'tax'],
  ['회계', 'tax'],
  ['accounting', 'tax'],
  ['인사', 'hr'],
  ['hr', 'hr'],
  ['labor', 'hr'],
  ['노무', 'hr'],
  ['employment', 'hr'],
  ['recruit', 'hr'],
  ['recruiting', 'hr'],
  ['채용', 'hr'],
  ['인턴', 'hr'],
  ['마케팅', 'marketing'],
  ['marketing', 'marketing'],
  ['sales', 'marketing'],
  ['세일즈', 'marketing'],
  ['brand', 'marketing'],
  ['branding', 'marketing'],
  ['network', 'marketing'],
  ['networking', 'marketing'],
  ['네트워킹', 'marketing'],
  ['홍보', 'marketing'],
  ['promotion', 'marketing'],
  ['tech', 'tech'],
  ['기술', 'tech'],
  ['it', 'tech'],
  ['digital', 'tech'],
  ['product', 'tech'],
  ['개발', 'tech'],
  ['legal', 'legal'],
  ['법무', 'legal'],
  ['compliance', 'legal'],
  ['규제', 'legal'],
  ['contract', 'legal'],
  ['contracts', 'legal'],
  ['수수료', 'legal'],
  ['fee', 'legal'],
  ['fees', 'legal'],
  ['question', 'etc'],
  ['questions', 'etc'],
  ['q&a', 'etc'],
  ['qa', 'etc'],
  ['질문', 'etc'],
  ['기타', 'etc'],
  ['others', 'etc'],
  ['misc', 'etc'],
  ['기타문의', 'etc'],
];

const CATEGORY_MAPPINGS = RAW_CATEGORY_MAPPINGS.reduce<Record<string, TtontokCategory>>((acc, [source, target]) => {
  const trimmed = source.trim();
  if (!trimmed) {
    return acc;
  }
  acc[trimmed.toLowerCase()] = target;
  acc[trimmed] = target;
  return acc;
}, {});

interface PostRecord {
  _id: Types.ObjectId;
  category?: unknown;
}

const normalizeValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return '';
};

async function migrate() {
  await connectDB();
  console.log('[migrate-ttontok] Connected to DB');

  // 전체 컬렉션 목록 확인
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('[migrate-ttontok] Available collections:', collections.map(c => c.name));

  // ttontokpost 컬렉션 데이터 수 확인
  const count = await TtontokPost.countDocuments();
  console.log('[migrate-ttontok] Total document count:', count);

  const allowedSet = new Set(ALLOWED_CATEGORIES);
  console.log('[migrate-ttontok] Fetching posts...');
  const posts = await TtontokPost.find({}, { category: 1 }).lean<PostRecord>();
  console.log('[migrate-ttontok] Found posts:', posts.length);

  const operations: Array<{
    updateOne: {
      filter: { _id: Types.ObjectId };
      update: { $set: { category: TtontokCategory } };
    };
  }> = [];

  const unmatched = new Map<string, number>();
  const stats = {
    total: 0,
    alreadyValid: 0,
    mapped: 0,
    fallback: 0,
    skipped: 0,
    plannedUpdates: 0,
  };

  for (const post of posts) {
    stats.total += 1;
    const rawCategory = normalizeValue(post.category);

    if (!rawCategory) {
      stats.skipped += 1;
      unmatched.set('(empty)', (unmatched.get('(empty)') ?? 0) + 1);
      continue;
    }

    const normalized = rawCategory.toLowerCase();
    if (allowedSet.has(normalized as TtontokCategory)) {
      stats.alreadyValid += 1;
      continue;
    }

    const candidates = rawCategory.split(/[\/|,]/).map((token) => token.trim()).filter(Boolean);
    if (candidates.length === 0) {
      candidates.push(rawCategory);
    }

    let resolved: TtontokCategory | null = null;
    for (const candidate of candidates) {
      const normalizedCandidate = candidate.toLowerCase();
      if (allowedSet.has(normalizedCandidate as TtontokCategory)) {
        resolved = normalizedCandidate as TtontokCategory;
        break;
      }
      const mapped = CATEGORY_MAPPINGS[normalizedCandidate] ?? CATEGORY_MAPPINGS[candidate];
      if (mapped) {
        resolved = mapped;
        break;
      }
    }

    if (resolved) {
      stats.mapped += 1;
      stats.plannedUpdates += 1;
      if (!dryRun) {
        operations.push({
          updateOne: {
            filter: { _id: post._id },
            update: { $set: { category: resolved } },
          },
        });
      }
      continue;
    }

    if (fallbackToEtc) {
      stats.fallback += 1;
      stats.plannedUpdates += 1;
      if (!dryRun) {
        operations.push({
          updateOne: {
            filter: { _id: post._id },
            update: { $set: { category: FALLBACK_CATEGORY } },
          },
        });
      }
      continue;
    }

    stats.skipped += 1;
    unmatched.set(rawCategory, (unmatched.get(rawCategory) ?? 0) + 1);
  }

  if (!dryRun && operations.length > 0) {
    const result = await TtontokPost.bulkWrite(operations, { ordered: false });
    console.log('[migrate-ttontok] bulkWrite result', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  }

  console.log('[migrate-ttontok] summary', stats);

  if (unmatched.size > 0) {
    console.log('[migrate-ttontok] unmatched categories');
    for (const [value, count] of unmatched.entries()) {
      console.log(`  ${value}: ${count}`);
    }
  }

  if (dryRun) {
    console.log('[migrate-ttontok] dry-run complete. Re-run with --apply to persist changes.');
  } else {
    console.log('[migrate-ttontok] migration complete.');
  }
}

migrate()
  .catch((error) => {
    console.error('[migrate-ttontok] unexpected error', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
