'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './page.css';

const categories = [
  { id: 'startup', label: '창업스토리', icon: '💡' },
  { id: 'operation', label: '운영노하우', icon: '🔥' },
  { id: 'trouble', label: '고충토로', icon: '😤' },
  { id: 'network', label: '네트워킹', icon: '🤝' },
  { id: 'support', label: '지원정보', icon: '💰' },
];

export default function WritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    isAnonymous: false,
    businessType: '',
    region: '',
    yearsInBusiness: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (formData.content.trim().length < 30) {
      alert('내용을 30자 이상 입력해주세요.');
      return;
    }

    // TODO: API 호출하여 글 저장
    console.log('Form submitted:', formData);

    // 목록 페이지로 이동
    router.push('/ttontok');
  };

  return (
    <div className="write-container">
      <div className="write-header">
        <h1>스토리 작성</h1>
        <Link href="/ttontok" className="cancel-button">
          취소
        </Link>
      </div>

      <form className="write-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label required">카테고리</label>
          <div className="category-select">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-option ${formData.category === category.id ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, category: category.id }))}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="title" className="form-label required">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력해주세요"
            maxLength={100}
            className="form-input"
          />
          <div className="char-count">{formData.title.length}/100</div>
        </div>

        <div className="form-section">
          <label htmlFor="content" className="form-label required">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="다른 사업자분들과 공유하고 싶은 경험이나 정보를 자유롭게 작성해주세요.
            
- 창업 과정에서의 시행착오
- 운영 노하우나 팁
- 고충이나 어려움
- 네트워킹 제안
- 유용한 지원 정보

최소 30자 이상 작성해주세요."
            rows={15}
            className="form-input"
          />
          <div className="char-count">
            {formData.content.length}자 {formData.content.length < 30 && '(최소 30자)'}
          </div>
        </div>

        <div className="form-section">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            <label htmlFor="isAnonymous">익명으로 작성</label>
          </div>
        </div>

        {!formData.isAnonymous && (
          <div className="business-info-section">
            <h3 className="section-title">사업 정보 (선택)</h3>
            <p className="section-description">
              사업 정보를 입력하시면 다른 사업자분들이 더 신뢰할 수 있습니다.
            </p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessType">업종</label>
                <input
                  type="text"
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="예: 요식업, 카페, 소매업"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region">지역</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="예: 서울, 경기, 부산"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearsInBusiness">운영 연차</label>
                <input
                  type="number"
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  placeholder="예: 3"
                  min="0"
                  max="99"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            취소
          </button>
          <button type="submit" className="btn-primary">
            작성 완료
          </button>
        </div>
      </form>
    </div>
  );
}
