import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';

const getAdminPassword = () => process.env.EXPERT_SERVICES_ADMIN_PASSWORD ?? '';

export async function POST(request: NextRequest) {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    await connectDB();

    // 모든 심사관 데이터 가져오기
    const allExaminers = await ExpertExaminer.find({}).sort({ createdAt: 1 }).lean();

    // 이름과 소속으로 중복 확인
    const uniqueMap = new Map<string, any>();
    const duplicateIds: string[] = [];

    for (const examiner of allExaminers) {
      const key = `${examiner.name}_${examiner.companyName || 'none'}`;

      if (uniqueMap.has(key)) {
        // 중복 발견 - 나중에 생성된 것을 삭제 대상으로
        duplicateIds.push(examiner._id.toString());
      } else {
        uniqueMap.set(key, examiner);
      }
    }

    // 중복된 문서 삭제
    let deletedCount = 0;
    if (duplicateIds.length > 0) {
      const result = await ExpertExaminer.deleteMany({
        _id: { $in: duplicateIds }
      });
      deletedCount = result.deletedCount || 0;
    }

    // 남은 심사관 수 확인
    const remainingCount = await ExpertExaminer.countDocuments();

    return NextResponse.json({
      message: `중복 제거 완료: ${deletedCount}개 삭제됨`,
      deletedCount,
      duplicateIds,
      remainingCount
    });

  } catch (error) {
    console.error('[expert-services/examiners/cleanup][POST]', error);
    return NextResponse.json({ message: 'Failed to cleanup duplicate examiners.' }, { status: 500 });
  }
}