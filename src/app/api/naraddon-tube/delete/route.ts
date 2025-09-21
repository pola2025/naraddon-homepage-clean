import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
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

    const client = await clientPromise;
    const db = client.db('naraddon');
    const collection = db.collection('naraddontubeentries'); // Mongoose 디폴트 콜렉션 이름

    // 먼저 엔트리를 찾아서 썸네일 URL 확인
    console.log('[delete] Finding entry with ID:', entryId);

    // 먼저 문자열 ID로 시도
    let entry = await collection.findOne({ _id: entryId });

    // 문자열로 못 찾으면 ObjectId로 시도
    if (!entry && ObjectId.isValid(entryId)) {
      console.log('[delete] Trying with ObjectId...');
      entry = await collection.findOne({ _id: new ObjectId(entryId) });
    }

    if (!entry) {
      // 디버깅: 모든 문서의 ID 확인
      const allDocs = await collection.find({}).limit(5).toArray();
      console.log('[delete] Sample IDs in collection:', allDocs.map(d => ({ _id: d._id, type: typeof d._id })));
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

    // MongoDB에서 엔트리 삭제 (같은 방식으로)
    const deleteQuery = typeof entry._id === 'string' ? { _id: entryId } : { _id: new ObjectId(entryId) };
    const result = await collection.deleteOne(deleteQuery);

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