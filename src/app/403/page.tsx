import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <p className="text-2xl font-semibold text-gray-600 mt-2">접근 권한 없음</p>
        </div>

        <div className="mb-8">
          <p className="text-gray-500">이 페이지에 접근할 권한이 없습니다.</p>
          <p className="text-gray-500 mt-2">
            필요한 권한이 있다고 생각되시면 관리자에게 문의해주세요.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/consultation-request"
            className="block w-full bg-gray-200 text-gray-700 rounded-md py-3 px-4 hover:bg-gray-300 transition-colors"
          >
            상담 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
