import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connectDB from '@/lib/mongodb';
import TtontokPost from '@/models/TtontokPost';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: '잘못된 게시글 ID입니다.' }, { status: 400 });
  }

  await connectDB();

  const post = await TtontokPost.findById(id).lean();

  if (!post) {
    return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({
    post: {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString() ?? null,
      updatedAt: post.updatedAt?.toISOString() ?? null,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: '잘못된 게시글 ID입니다.' }, { status: 400 });
  }

  const { incrementViews } = await request.json();

  await connectDB();

  const update: { $inc?: { views: number } } = {};
  if (incrementViews) {
    update.$inc = { views: 1 };
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ message: '������ �׸��� �����ϴ�.' }, { status: 400 });
  }

  const post = await TtontokPost.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!post) {
    return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({
    post: {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString() ?? null,
      updatedAt: post.updatedAt?.toISOString() ?? null,
    },
  });
}
