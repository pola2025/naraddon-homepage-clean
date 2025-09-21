import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import TtontokPost from '@/models/TtontokPost';
import TtontokReply from '@/models/TtontokReply';

const DEFAULT_REPLY_LIMIT = 20;

export async function GET(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  await connectDB();

  const { postId } = context.params;
  if (!postId) {
    return NextResponse.json({ message: '게시글 ID가 필요합니다.' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const includeReplies = (searchParams.get('includeReplies') ?? 'true') !== 'false';
  const replyLimit = Math.max(1, Math.min(Number(searchParams.get('replyLimit')) || DEFAULT_REPLY_LIMIT, 100));

  const post = await TtontokPost.findById(postId).lean();
  if (!post || post.isArchived) {
    return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }

  const response: Record<string, unknown> = {
    id: post._id,
    title: post.title,
    content: post.content,
    category: post.category,
    nickname: post.nickname,
    tags: post.tags,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    replyCount: post.replyCount,
    isPinned: post.isPinned,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  if (includeReplies) {
    const replies = await TtontokReply.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .limit(replyLimit)
      .lean();

    response.replies = replies.map((reply) => ({
      id: reply._id,
      content: reply.content,
      nickname: reply.nickname,
      role: reply.role,
      isAccepted: reply.isAccepted,
      likeCount: reply.likeCount,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    }));
  }

  return NextResponse.json(response);
}