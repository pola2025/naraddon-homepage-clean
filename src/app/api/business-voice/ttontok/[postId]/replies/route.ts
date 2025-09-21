import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connectDB from '@/lib/mongodb';
import TtontokPost from '@/models/TtontokPost';
import TtontokReply, { TtontokReplyRole } from '@/models/TtontokReply';

const sanitizeContent = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 4000);
};

const sanitizeNickname = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 24);
};

const parseRole = (value: unknown): TtontokReplyRole => {
  if (typeof value !== 'string') return 'general';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'certified_examiner' || normalized === 'expert') {
    return normalized;
  }
  return 'general';
};

const toObjectId = (value: unknown): Types.ObjectId | undefined => {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  if (!Types.ObjectId.isValid(value)) return undefined;
  return new Types.ObjectId(value);
};

export async function GET(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  await connectDB();

  const { postId } = context.params;
  if (!postId || !Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ message: '게시글 ID가 올바르지 않습니다.' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const sortOrder = (searchParams.get('sort') ?? 'chronological').toLowerCase();
  const sort = sortOrder === 'recent' ? { createdAt: -1 } : { createdAt: 1 };

  const replies = await TtontokReply.find({ postId })
    .sort(sort)
    .lean();

  return NextResponse.json(
    replies.map((reply) => ({
      id: reply._id,
      content: reply.content,
      nickname: reply.nickname,
      role: reply.role,
      isAccepted: reply.isAccepted,
      likeCount: reply.likeCount,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    }))
  );
}

export async function POST(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  await connectDB();

  const { postId } = context.params;
  if (!postId || !Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ message: '게시글 ID가 올바르지 않습니다.' }, { status: 400 });
  }

  const post = await TtontokPost.findById(postId);
  if (!post || post.isArchived) {
    return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('[ttontok] invalid reply payload', error);
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const content = sanitizeContent(payload.content);
  const nickname = sanitizeNickname(payload.nickname);
  const role = parseRole(payload.role);
  const memberId = toObjectId(payload.memberId);

  if (!content || !nickname) {
    return NextResponse.json({ message: '내용과 닉네임을 입력해 주세요.' }, { status: 400 });
  }

  try {
    const created = await TtontokReply.create({
      postId: post._id,
      content,
      nickname,
      role,
      memberId,
    });

    await TtontokPost.findByIdAndUpdate(post._id, { $inc: { replyCount: 1 } }).exec();

    return NextResponse.json(
      {
        id: created._id,
        content: created.content,
        nickname: created.nickname,
        role: created.role,
        isAccepted: created.isAccepted,
        likeCount: created.likeCount,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ttontok] failed to create reply', error);
    return NextResponse.json({ message: '댓글을 저장하지 못했습니다.' }, { status: 500 });
  }
}