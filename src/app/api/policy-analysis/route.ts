import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PolicyAnalysisPost from '@/models/PolicyAnalysisPost';
import { certifiedExaminers } from '@/data/certifiedExaminers';
import crypto from 'crypto';

const ALLOWED_SORT_FIELDS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  views: { views: -1, createdAt: -1 },
};

const ACCESS_COOKIE = 'policy-analysis-access';

const buildCookieValue = (password: string) =>
  crypto.createHash('sha256').update(password).digest('hex');

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const examinerKey = searchParams.get('examinerKey');
    const rawLimit = searchParams.get('limit');
    const rawSearch = searchParams.get('search');
    const sortKey = searchParams.get('sort') || 'newest';

    const query: Record<string, unknown> = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (examinerKey) {
      query['examiner.key'] = examinerKey;
    }

    if (rawSearch) {
      const searchRegex = new RegExp(rawSearch.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { 'examiner.name': searchRegex },
        { tags: searchRegex },
      ];
    }

    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : undefined;
    const sort = ALLOWED_SORT_FIELDS[sortKey] || ALLOWED_SORT_FIELDS.newest;

    let postsQuery = PolicyAnalysisPost.find(query).sort(sort);
    if (limit && !Number.isNaN(limit)) {
      postsQuery = postsQuery.limit(limit);
    }

    const posts = await postsQuery.lean();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('[policy-analysis][GET]', error);
    return NextResponse.json(
      { message: '정책분석 게시글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

interface CreatePayload {
  password?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  isStructured?: boolean;
  sections?: Array<{ id: string; title: string; content: string }>;
  tags?: string[];
  thumbnail?: string;
  images?: Array<{ url: string; name?: string; caption?: string }>;
  attachments?: Array<{
    key: string;
    fileName: string;
    mimeType?: string;
    size: number;
    sourceUrl?: string;
    cdnUrl?: string;
    checksum?: string;
    uploadedBy?: string;
    uploadedAt?: string;
  }>;
  examinerKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.POLICY_ANALYSIS_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { message: '정책분석 게시판 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = (await request.json()) as CreatePayload;
    const {
      password,
      title,
      category,
      excerpt,
      content,
      isStructured,
      sections,
      tags,
      thumbnail,
      images,
      examinerKey,
    } = body;

    const trimmedPassword = password?.trim();
    const hasValidAccessCookie =
      request.cookies.get(ACCESS_COOKIE)?.value === buildCookieValue(adminPassword);

    if (trimmedPassword && trimmedPassword !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!trimmedPassword && !hasValidAccessCookie) {
      return NextResponse.json({ message: '비밀번호 인증이 필요합니다.' }, { status: 401 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ message: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ message: '내용을 입력해주세요.' }, { status: 400 });
    }

    if (!examinerKey) {
      return NextResponse.json({ message: '인증된 기업심사관을 선택해주세요.' }, { status: 400 });
    }

    const examiner = certifiedExaminers.find((item) => item.imageKey === examinerKey);
    if (!examiner) {
      return NextResponse.json(
        { message: '선택한 기업심사관 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await connectDB();

    const normalizedTags = Array.isArray(tags)
      ? tags
          .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
          .map((tag) => tag.trim())
      : [];

    const normalizedSections = Array.isArray(sections)
      ? sections
          .filter((section) => section && section.id && section.title && section.content)
          .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.content,
          }))
      : [];

    const normalizedImages = Array.isArray(images)
      ? images
          .filter((image) => image && image.url)
          .map((image) => ({
            url: image.url,
            name: image.name?.trim() || '',
            caption: image.caption?.trim() || '',
          }))
      : [];

    const post = await PolicyAnalysisPost.create({
      title: title.trim(),
      category: category?.trim() || '기타',
      excerpt: excerpt?.trim() || '',
      content,
      isStructured: isStructured !== false,
      sections: normalizedSections,
      tags: normalizedTags,
      thumbnail: thumbnail?.trim() || '',
      images: normalizedImages,
      examiner: {
        key: examiner.imageKey,
        name: examiner.name,
        companyName: examiner.companyName,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('[policy-analysis][POST]', error);
    return NextResponse.json(
      { message: '정책분석 게시글을 저장하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}



