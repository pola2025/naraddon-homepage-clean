'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    position: '',
    bio: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API 호출로 프로필 업데이트
      // await api.put('/user/profile', profileData)
      console.log('Profile update:', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    const roleStyles = {
      admin: 'bg-red-100 text-red-800',
      examiner: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    };

    const roleLabels = {
      admin: '관리자',
      examiner: '인증 심사관',
      user: '일반 사용자',
    };

    const style = roleStyles[role as keyof typeof roleStyles] || roleStyles.user;
    const label = roleLabels[role as keyof typeof roleLabels] || '사용자';

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style}`}
      >
        {label}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* 프로필 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    프로필 수정
                  </button>
                )}
              </div>
            </div>

            {/* 프로필 내용 */}
            <div className="p-6">
              {loading ? (
                <LoadingSpinner message="저장 중..." />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* 프로필 이미지 & 역할 */}
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name?.[0] || user?.email?.[0] || 'U'}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {user?.name || '사용자'}
                        </h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="mt-2">{getRoleBadge(user?.role)}</div>
                      </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          이름
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          이메일
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          전화번호
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="010-0000-0000"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-gray-700"
                        >
                          회사명
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={profileData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="나라똔"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed px-3 py-2 border"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium text-gray-700"
                        >
                          직책
                        </label>
                        <input
                          type="text"
                          id="position"
                          name="position"
                          value={profileData.position}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="대표이사"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed px-3 py-2 border"
                        />
                      </div>
                    </div>

                    {/* 자기소개 */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        자기소개
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="간단한 자기소개를 작성해주세요."
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed px-3 py-2 border"
                      />
                    </div>

                    {/* 버튼 */}
                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          저장
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* 추가 정보 섹션 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-3">계정 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">가입일</span>
                  <span className="text-gray-900">2024년 1월 1일</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">마지막 로그인</span>
                  <span className="text-gray-900">2024년 1월 20일</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상담 신청 횟수</span>
                  <span className="text-gray-900">12회</span>
                </div>
              </div>
            </div>
          </div>

          {/* 위험 영역 */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h3 className="text-lg font-medium text-red-900">위험 영역</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">비밀번호 변경</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    소셜 로그인을 사용하는 경우 해당 서비스에서 변경해주세요.
                  </p>
                  <button className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    비밀번호 변경
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">계정 삭제</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                  </p>
                  <button className="mt-2 px-4 py-2 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50">
                    계정 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
