import path from 'node:path';
import fs from 'node:fs/promises';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../src/lib/mongodb';
import TtontokPost from '../src/models/TtontokPost';
import TtontokReply from '../src/models/TtontokReply';

const SEED_PATH = path.resolve(process.cwd(), 'data', 'ttontok-seed.json');

async function loadSeedData() {
  try {
    const file = await fs.readFile(SEED_PATH, 'utf8');
    const parsed = JSON.parse(file);
    const posts = Array.isArray(parsed?.posts) ? parsed.posts : [];
    const replies = Array.isArray(parsed?.replies) ? parsed.replies : [];
    return { posts, replies };
  } catch (error) {
    console.error('[seed-ttontok] failed to read seed file', error);
    throw error;
  }
}

async function seed() {
  await connectDB();
  const { posts, replies } = await loadSeedData();

  if (posts.length === 0) {
    console.warn('[seed-ttontok] no posts to seed; aborting');
    return;
  }

  await TtontokReply.deleteMany({});
  await TtontokPost.deleteMany({});

  const insertedPosts = await TtontokPost.insertMany(posts, { ordered: true });
  const postIdMap = new Map<string, string>();
  insertedPosts.forEach((post, index) => {
    if (posts[index]?.legacyKey) {
      postIdMap.set(posts[index].legacyKey, post._id.toString());
    }
  });

  if (replies.length > 0) {
    const normalizedReplies = replies
      .map((reply) => {
        const legacyKey = reply.postLegacyKey;
        const mappedPostId = legacyKey ? postIdMap.get(legacyKey) : null;
        return {
          ...reply,
          postId: mappedPostId ?? reply.postId,
        };
      })
      .filter((reply) => reply.postId);

    if (normalizedReplies.length > 0) {
      await TtontokReply.insertMany(normalizedReplies, { ordered: true });
    }
  }

  console.log('[seed-ttontok] seeding complete');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[seed-ttontok] unexpected error', error);
    process.exit(1);
  });
