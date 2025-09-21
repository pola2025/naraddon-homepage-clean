'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api-client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Consultation {
  id: string;
  consultationType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestDate: string;
  scheduledDate?: string;
  examinerName?: string;
  amount: string;
  companyName: string;
  description: string;
}

export default function MyConsultationsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
  >('all');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      // 실제 API 호출로 교체 필요
      // const data = await api.get<Consultation[]>('/user/consultations')
      // setConsultations(data)

      // 임시 더미 데이터
      setConsultations([
        {
          id: '1',
          consultationType: 'R&D 자금 상담',
          status: 'completed',
          requestDate: '2024-01-10',
          scheduledDate: '2024-01-15 14:00',
          examinerName: '김심사관',
          amount: '5억원',
          companyName: '(주)테크이노베이션',
          description: 'AI 기반 헬스케어 플랫폼 개발 프로젝트',
        },
        {
          id: '2',
          consultationType: '수출바우처 상담',
          status: 'in_progress',
          requestDate: '2024-01-18',
          scheduledDate: '2024-01-22 10:00',
          examinerName: '이심사관',
          amount: '3억원',
          companyName: '글로벌트레이드',
          description: '동남아시아 시장 진출을 위한 수출 지원',
        },
        {
          id: '3',
          consultationType: '창업지원금 상담',
          status: 'pending',
          requestDate: '2024-01-20',
          amount: '1억원',
          companyName: '스타트업허브',
          description: '핀테크 스타트업 초기 자금 지원',
        },
      ]);
    } catch (error) {
      console.error('Consultations fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      pending: '대기중',
      in_progress: '진행중',
      completed: '완료',
      cancelled: '취소됨',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const filteredConsultations =
    filter === 'all' ? consultations : consultations.filter((c) => c.status === filter);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">내 상담 내역</h1>
            <p className="mt-2 text-gray-600">신청하신 상담 내역을 확인하고 관리할 수 있습니다.</p>
          </div>

          {/* 필터 탭 */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(['all', 'pending', 'in_progress', 'completed', 'cancelled'] as const).map(
                (status) => {
                  const labels = {
                    all: '전체',
                    pending: '대기중',
                    in_progress: '진행중',
                    completed: '완료',
                    cancelled: '취소됨',
                  };

                  const count =
                    status === 'all'
                      ? consultations.length
                      : consultations.filter((c) => c.status === status).length;

                  return (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        filter === status
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    >
                      {labels[status]}
                      {count > 0 && (
                        <span
                          className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            filter === status
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </nav>
          </div>

          {/* 상담 목록 */}
          {loading ? (
            <LoadingSpinner message="상담 내역을 불러오는 중..." fullScreen />
          ) : filteredConsultations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">상담 내역이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? '아직 신청한 상담이 없습니다.'
                  : `${filter} 상태의 상담이 없습니다.`}
              </p>
              {filter === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/consultation-request"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    상담 신청하기
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {consultation.consultationType}
                          </h3>
                          <div className="ml-3">{getStatusBadge(consultation.status)}</div>
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">회사명:</span> {consultation.companyName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">신청 금액:</span> {consultation.amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">내용:</span> {consultation.description}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            신청일: {consultation.requestDate}
                          </span>
                          {consultation.scheduledDate && (
                            <span>
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
                              예정일: {consultation.scheduledDate}
                            </span>
                          )}
                          {consultation.examinerName && (
                            <span>
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
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              담당자: {consultation.examinerName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-6 flex flex-col space-y-2">
                        <Link
                          href={`/consultation/${consultation.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          상세보기
                        </Link>
                        {consultation.status === 'pending' && (
                          <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            취소하기
                          </button>
                        )}
                        {consultation.status === 'completed' && (
                          <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                            리뷰 작성
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 새 상담 신청 버튼 */}
          {!loading && consultations.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/consultation-request"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                새 상담 신청하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
