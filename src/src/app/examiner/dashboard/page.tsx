'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api-client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ExaminerStats {
  assignedConsultations: number;
  completedConsultations: number;
  pendingReviews: number;
  averageRating: number;
  recentConsultations: Consultation[];
}

interface Consultation {
  id: string;
  clientName: string;
  companyName: string;
  consultationType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'review';
  scheduledDate: string;
  amount?: string;
}

export default function ExaminerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ExaminerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExaminerStats();
  }, []);

  const fetchExaminerStats = async () => {
    try {
      setLoading(true);
      // 실제 API 호출로 교체 필요
      // const data = await api.get<ExaminerStats>('/examiner/stats')
      // setStats(data)

      // 임시 더미 데이터
      setStats({
        assignedConsultations: 24,
        completedConsultations: 156,
        pendingReviews: 5,
        averageRating: 4.8,
        recentConsultations: [
          {
            id: '1',
            clientName: '김대표',
            companyName: '(주)테크스타트',
            consultationType: 'R&D 자금 상담',
            status: 'in_progress',
            scheduledDate: '2024-01-21 10:00',
            amount: '5억원',
          },
          {
            id: '2',
            clientName: '이사장',
            companyName: '스마트팩토리',
            consultationType: '수출바우처 상담',
            status: 'pending',
            scheduledDate: '2024-01-21 14:00',
            amount: '3억원',
          },
          {
            id: '3',
            clientName: '박대표',
            companyName: '그린에너지',
            consultationType: '창업지원금 상담',
            status: 'review',
            scheduledDate: '2024-01-20 16:00',
            amount: '1억원',
          },
        ],
      });
    } catch (error) {
      console.error('Examiner stats error:', error);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      review: 'bg-purple-100 text-purple-800',
    };

    const statusLabels = {
      pending: '대기중',
      in_progress: '진행중',
      completed: '완료',
      review: '검토중',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  return (
    <ProtectedRoute requiredRole="examiner">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">심사관 대시보드</h1>
            <p className="mt-2 text-gray-600">안녕하세요, {user?.name || '심사관'}님</p>
          </div>

          {loading ? (
            <LoadingSpinner message="데이터를 불러오는 중..." fullScreen />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">배정된 상담</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.assignedConsultations}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">완료된 상담</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.completedConsultations}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">검토 대기</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats?.pendingReviews}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">평균 평점</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats?.averageRating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오늘의 일정 */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">오늘의 상담 일정</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats?.recentConsultations
                      .filter((c) => c.status === 'pending' || c.status === 'in_progress')
                      .map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="text-sm font-medium text-gray-900">
                                {consultation.companyName}
                              </h3>
                              <span className="ml-2 text-sm text-gray-500">
                                ({consultation.clientName})
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {consultation.consultationType}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className="text-xs text-gray-500">
                                <svg
                                  className="inline h-4 w-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {consultation.scheduledDate}
                              </span>
                              {consultation.amount && (
                                <span className="text-xs text-gray-500">
                                  <svg
                                    className="inline h-4 w-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {consultation.amount}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(consultation.status)}
                            <Link
                              href={`/examiner/consultation/${consultation.id}`}
                              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                              상세보기
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* 빠른 메뉴 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Link
                  href="/examiner/consultations"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">전체 상담 목록</h3>
                      <p className="mt-1 text-sm text-gray-500">배정된 모든 상담 확인</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/examiner/schedule"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">일정 관리</h3>
                      <p className="mt-1 text-sm text-gray-500">상담 일정 확인 및 조정</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/examiner/reports"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8m5 2h2m-5 2h8a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">보고서 작성</h3>
                      <p className="mt-1 text-sm text-gray-500">상담 결과 보고서 관리</p>
                    </div>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
