import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { deleteR2Object } from '@/lib/r2';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const adminPassword = process.env.NARADDON_TUBE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password, entryId } = body;

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    if (!entryId) {
      return NextResponse.json(
        { message: '삭제할 항목 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection('naraddon-tube');

    // 먼저 엔트리를 찾아서 썸네일 URL 확인
    const entry = await collection.findOne({ _id: new ObjectId(entryId) });

    if (!entry) {
      return NextResponse.json(
        { message: '해당 항목을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // R2에서 썸네일 삭제 (R2 URL인 경우만)
    if (entry.thumbnailUrl && entry.thumbnailUrl.includes('r2.cloudflarestorage.com')) {
      try {
        const url = new URL(entry.thumbnailUrl);
        const pathParts = url.pathname.split('/');
        const objectKey = pathParts.slice(1).join('/'); // 버킷 이름 제외

        await deleteR2Object(objectKey);
      } catch (error) {
        console.error('[naraddon-tube][delete] R2 deletion error:', error);
        // R2 삭제 실패해도 계속 진행
      }
    }

    // MongoDB에서 엔트리 삭제
    const result = await collection.deleteOne({ _id: new ObjectId(entryId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: '항목을 삭제하지 못했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '항목이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('[naraddon-tube][delete]', error);
    return NextResponse.json(
      { message: '항목 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}