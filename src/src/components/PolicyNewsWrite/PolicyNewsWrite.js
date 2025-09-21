'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './PolicyNewsWrite.css';

const PolicyNewsWrite = () => {
  const router = useRouter();

  // 관리자 권한 체크 (추후 실제 권한 체크 로직으로 대체)
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    tags: '',
    thumbnail: '',
    isMainNews: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // 카테고리 옵션
  const categories = [
    { value: '', label: '카테고리 선택' },
    { value: '지원사업', label: '지원사업' },
    { value: '제조업', label: '제조업' },
    { value: '창업지원', label: '창업지원' },
    { value: '기술개발', label: '기술개발' },
    { value: '금융지원', label: '금융지원' },
    { value: '경영지원', label: '경영지원' },
    { value: '수출지원', label: '수출지원' },
    { value: '기술지원', label: '기술지원' },
    { value: '특별지원', label: '특별지원' },
    { value: '환경지원', label: '환경지원' },
  ];

  useEffect(() => {
    // 추후 실제 관리자 권한 체크 로직 구현
    // 예: API 호출하여 사용자 권한 확인
    // setIsAdmin(true); // 관리자인 경우
    setIsAdmin(false); // 현재는 false로 설정
  }, []);

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 이미지 URL 처리
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, thumbnail: url }));

    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // 에디터 툴바 기능 (간단한 구현)
  const insertFormatting = (format) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        newText = `<em>${selectedText}</em>`;
        break;
      case 'heading':
        newText = `<h3>${selectedText}</h3>`;
        break;
      case 'link':
        newText = `<a href="#">${selectedText}</a>`;
        break;
      default:
        newText = selectedText;
    }

    const newContent =
      formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = '요약을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }
    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = '썸네일 이미지를 설정해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 태그 처리
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const submitData = {
      ...formData,
      tags: tagsArray,
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
      views: 0,
      likes: 0,
      comments: 0,
    };

    console.log('제출 데이터:', submitData);

    // TODO: API 호출하여 데이터 저장
    alert('정책뉴스가 성공적으로 등록되었습니다.');
    router.push('/policy-analysis');
  };

  // 취소
  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      router.back();
    }
  };

  // 임시저장
  const handleSaveDraft = () => {
    localStorage.setItem('policyNewsDraft', JSON.stringify(formData));
    alert('임시저장되었습니다.');
  };

  // 임시저장 불러오기
  const handleLoadDraft = () => {
    const draft = localStorage.getItem('policyNewsDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setFormData(parsedDraft);
      if (parsedDraft.thumbnail) {
        setImagePreview(parsedDraft.thumbnail);
      }
      alert('임시저장된 내용을 불러왔습니다.');
    } else {
      alert('임시저장된 내용이 없습니다.');
    }
  };

  return (
    <div className="policy-news-write">
      <div className="write-header">
        <h1>정책뉴스 작성</h1>
        <p>최신 정책 동향과 지원사업 소식을 작성해주세요</p>
      </div>

      <form className="write-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="뉴스 제목을 입력하세요"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">
              카테고리 <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">
            요약 <span className="required">*</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="뉴스 내용을 간략히 요약해주세요 (최대 200자)"
            maxLength="200"
            rows="3"
            className={errors.excerpt ? 'error' : ''}
          />
          <div className="char-count">{formData.excerpt.length} / 200</div>
          {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">
            내용 <span className="required">*</span>
          </label>
          <div className="editor-toolbar">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => insertFormatting('bold')}
              title="굵게"
            >
              <i className="fas fa-bold"></i>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => insertFormatting('italic')}
              title="기울임"
            >
              <i className="fas fa-italic"></i>
            </button>
            <span className="toolbar-separator"></span>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => insertFormatting('heading')}
              title="제목"
            >
              <i className="fas fa-heading"></i>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => insertFormatting('link')}
              title="링크"
            >
              <i className="fas fa-link"></i>
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="뉴스 내용을 자세히 작성해주세요. HTML 태그를 사용할 수 있습니다."
            rows="15"
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">
            썸네일 이미지 <span className="required">*</span>
          </label>
          <div className="image-upload-area">
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleImageUrlChange}
              placeholder="이미지 URL을 입력하세요 (예: https://example.com/image.jpg)"
              className={errors.thumbnail ? 'error' : ''}
            />
            {errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}

            <div className="upload-box">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>이미지 URL을 위에 입력해주세요</p>
              <p className="upload-info">권장 크기: 1200x630px (JPG, PNG)</p>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="썸네일 미리보기" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, thumbnail: '' }));
                    setImagePreview(null);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tags">태그 (쉼표로 구분)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="정책자금, 중소기업, 지원사업"
            />
            <p className="help-text">관련 키워드를 입력하면 검색에 도움이 됩니다</p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isMainNews"
                checked={formData.isMainNews}
                onChange={handleChange}
              />
              <span>메인 뉴스로 설정</span>
            </label>
            <p className="help-text">메인 뉴스로 설정하면 슬라이드에 표시됩니다.</p>
          </div>
        </div>

        {/* 관리자에게만 표시되는 액션 버튼들 */}
        {isAdmin && (
          <div className="form-actions">
            <div className="left-actions">
              <button type="button" className="btn-draft" onClick={handleSaveDraft}>
                <i className="fas fa-save"></i> 임시저장
              </button>
              <button type="button" className="btn-load" onClick={handleLoadDraft}>
                <i className="fas fa-folder-open"></i> 불러오기
              </button>
            </div>

            <div className="right-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                <i className="fas fa-times"></i> 취소
              </button>
              <button type="submit" className="btn-submit">
                <i className="fas fa-check"></i> 등록
              </button>
            </div>
          </div>
        )}

        {/* 관리자가 아닌 경우 메시지 표시 */}
        {!isAdmin && (
          <div className="admin-notice">
            <i className="fas fa-lock"></i>
            <p>정책뉴스 작성은 관리자 권한이 필요합니다.</p>
            <button type="button" onClick={() => router.push('/policy-analysis')}>
              목록으로 돌아가기
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PolicyNewsWrite;
