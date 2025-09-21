'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ttontokCategories } from '@/utils/authorData';
import './page.css';

const CATEGORY_LABELS: Record<string, string> = {
  funding: '정책자금',
  tax: '세무',
  hr: '인사',
  marketing: '마케팅',
  strategy: '전략',
  tech: '기술',
  legal: '법무',
  etc: '기타',
};

const TtontokWritePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // 전문가/기업심사관 목록
  const [examiners, setExaminers] = useState<Array<{name: string, company: string}>>([]);
  const [experts, setExperts] = useState<Array<{name: string, company: string, title: string}>>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  // 폼 데이터
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    authorType: 'general' as 'expert' | 'examiner' | 'general',
    authorName: '',
    authorCompany: '',
    authorBusiness: '',
    authorLocation: '',
    password: '', // 수정/삭제용 비밀번호
    images: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 인증 확인
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/ttontok/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('ttontok_auth', 'true');
      } else {
        setAuthError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('인증 오류:', error);
      setAuthError('인증 중 오류가 발생했습니다.');
    }
  };

  // 세션 체크 및 작성자 목록 로드
  useEffect(() => {
    const auth = sessionStorage.getItem('ttontok_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // 전문가/기업심사관 목록 가져오기
    fetchAuthors();
  }, []);

  // 작성자 목록 API 호출
  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/board-authors');
      const data = await response.json();

      if (data.examiners) {
        setExaminers(data.examiners);
      }
      if (data.experts) {
        setExperts(data.experts);
      }
    } catch (error) {
      console.error('작성자 목록 조회 실패:', error);
      // 에러 시 빈 배열 유지
    } finally {
      setLoadingAuthors(false);
    }
  };

  // 작성자 타입 변경 시 처리
  const handleAuthorTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      authorType: type as 'expert' | 'examiner' | 'general',
      authorName: '',
      authorCompany: ''
    }));
  };

  // 전문가/기업심사관 선택 시 처리
  const handleProfessionalSelect = (value: string) => {
    const [name, company] = value.split('|');
    setFormData(prev => ({
      ...prev,
      authorName: name,
      authorCompany: company
    }));
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        // Cloudflare R2 업로드 API 호출
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '이미지 업로드 실패');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.category || !formData.title || !formData.content || !formData.authorName) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!formData.password) {
      alert('수정/삭제를 위한 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ttontok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('게시글이 등록되었습니다.');
        router.push('/ttontok');
      } else {
        alert(data.error || '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>똔톡 글쓰기</h2>
          <p>글쓰기 권한 확인이 필요합니다.</p>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="auth-input"
              autoFocus
            />
            {authError && <p className="auth-error">{authError}</p>}
            <div className="auth-buttons">
              <button type="submit" className="auth-submit">확인</button>
              <button type="button" onClick={() => router.back()} className="auth-cancel">
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 글쓰기 화면
  return (
    <div className="write-container">
      <div className="write-header">
        <h1>똔톡 글쓰기</h1>
        <p>사업자들의 생생한 이야기를 공유해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="write-form">
        {/* 카테고리 선택 */}
        <div className="form-group">
          <label htmlFor="category">카테고리 *</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">선택하세요</option>
            {ttontokCategories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat] ?? cat}
              </option>
            ))}
          </select>
        </div>

        {/* 작성자 유형 선택 */}
        <div className="form-group">
          <label>작성자 유형 *</label>
          <div className="author-type-selector">
            <button
              type="button"
              className={`type-btn ${formData.authorType === 'general' ? 'active' : ''}`}
              onClick={() => handleAuthorTypeChange('general')}
            >
              일반 사업자
            </button>
            <button
              type="button"
              className={`type-btn ${formData.authorType === 'examiner' ? 'active' : ''}`}
              onClick={() => handleAuthorTypeChange('examiner')}
            >
              기업심사관
            </button>
            <button
              type="button"
              className={`type-btn ${formData.authorType === 'expert' ? 'active' : ''}`}
              onClick={() => handleAuthorTypeChange('expert')}
            >
              전문가
            </button>
          </div>
        </div>

        {/* 작성자 정보 */}
        {formData.authorType === 'general' ? (
          <>
            <div className="form-group">
              <label htmlFor="authorName">닉네임 *</label>
              <input
                type="text"
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="authorBusiness">업종</label>
                <input
                  type="text"
                  id="authorBusiness"
                  value={formData.authorBusiness}
                  onChange={(e) => setFormData({ ...formData, authorBusiness: e.target.value })}
                  placeholder="예: 카페, IT, 제조업"
                />
              </div>
              <div className="form-group">
                <label htmlFor="authorLocation">지역</label>
                <input
                  type="text"
                  id="authorLocation"
                  value={formData.authorLocation}
                  onChange={(e) => setFormData({ ...formData, authorLocation: e.target.value })}
                  placeholder="예: 서울, 경기, 부산"
                />
              </div>
            </div>
          </>
        ) : formData.authorType === 'examiner' ? (
          <div className="form-group">
            <label htmlFor="examiner">기업심사관 선택 *</label>
            <select
              id="examiner"
              value={`${formData.authorName}|${formData.authorCompany}`}
              onChange={(e) => handleProfessionalSelect(e.target.value)}
              required
              disabled={loadingAuthors}
            >
              <option value="|">
                {loadingAuthors ? '목록 불러오는 중...' : '선택하세요'}
              </option>
              {examiners.map(examiner => (
                <option key={examiner.name} value={`${examiner.name}|${examiner.company}`}>
                  {examiner.name} ({examiner.company})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="expert">전문가 선택 *</label>
            <select
              id="expert"
              value={`${formData.authorName}|${formData.authorCompany}`}
              onChange={(e) => handleProfessionalSelect(e.target.value)}
              required
              disabled={loadingAuthors}
            >
              <option value="|">
                {loadingAuthors ? '목록 불러오는 중...' : '선택하세요'}
              </option>
              {experts.map(expert => (
                <option key={expert.name} value={`${expert.name}|${expert.company}`}>
                  {expert.name} ({expert.title} - {expert.company})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 제목 */}
        <div className="form-group">
          <label htmlFor="title">제목 *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 */}
        <div className="form-group">
          <label htmlFor="content">내용 *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="내용을 입력하세요"
            rows={10}
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="form-group">
          <label htmlFor="images">이미지 첨부</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage && <p className="upload-status">이미지 업로드 중...</p>}

          {formData.images.length > 0 && (
            <div className="image-preview">
              {formData.images.map((url, index) => (
                <div key={index} className="preview-item">
                  <img src={url} alt={`첨부 이미지 ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호 *</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="수정/삭제 시 필요한 비밀번호"
            required
          />
          <small>* 게시글 수정 및 삭제 시 필요합니다.</small>
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TtontokWritePage;