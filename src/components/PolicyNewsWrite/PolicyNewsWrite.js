'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './PolicyNewsWrite.css';

const categories = [
  { value: '', label: '카테고리를 선택해주세요' },
  { value: '정부지원', label: '정부지원' },
  { value: '중소기업', label: '중소기업' },
  { value: '창업지원', label: '창업지원' },
  { value: '연구개발', label: '연구개발' },
  { value: '금융지원', label: '금융지원' },
  { value: '세제지원', label: '세제지원' },
  { value: '고용지원', label: '고용지원' },
  { value: '지역정책', label: '지역정책' },
  { value: '환경정책', label: '환경정책' },
  { value: '기타', label: '기타' },
];

const defaultFormData = {
  title: '',
  category: '',
  excerpt: '',
  content: '',
  tags: '',
  thumbnail: '',
  isMainNews: false,
};

const PolicyNewsWrite = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const cached = sessionStorage.getItem('policyNewsAuthorized');
    if (cached === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized || typeof window === 'undefined') {
      return;
    }
    const draft = localStorage.getItem('policyNewsDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData({ ...defaultFormData, ...parsed });
        if (parsed.thumbnail) {
          setImagePreview(parsed.thumbnail);
        }
      } catch (error) {
        console.warn('임시 저장된 데이터를 불러오지 못했습니다.', error);
      }
    }
  }, [isAuthorized]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setVerifyError('');

    if (errors.password) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.password;
        return nextErrors;
      });
    }
  };

  const handleImageUrlChange = (event) => {
    const url = event.target.value;
    setFormData((prev) => ({ ...prev, thumbnail: url }));

    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }

    if (errors.thumbnail) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.thumbnail;
        return nextErrors;
      });
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('content');
    if (!textarea) {
      return;
    }

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = formData.content.substring(selectionStart, selectionEnd);
    let wrapped = selectedText;

    switch (format) {
      case 'bold':
        wrapped = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        wrapped = `<em>${selectedText}</em>`;
        break;
      case 'heading':
        wrapped = `<h3>${selectedText}</h3>`;
        break;
      case 'link':
        wrapped = `<a href="#">${selectedText || '링크'}</a>`;
        break;
      default:
        break;
    }

    const nextValue =
      formData.content.substring(0, selectionStart) + wrapped + formData.content.substring(selectionEnd);

    setFormData((prev) => ({ ...prev, content: nextValue }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.category) {
      nextErrors.category = '카테고리를 선택해주세요.';
    }
    if (!formData.excerpt.trim()) {
      nextErrors.excerpt = '요약을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      nextErrors.content = '내용을 입력해주세요.';
    }
    if (!formData.thumbnail.trim()) {
      nextErrors.thumbnail = '표지 이미지를 입력해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const verifyPassword = async (event) => {
    event.preventDefault();
    if (!password.trim()) {
      setVerifyError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      setVerifyError('');
      const response = await fetch('/api/policy-news/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setVerifyError(result?.message || '비밀번호가 올바르지 않습니다.');
        return;
      }

      setIsAuthorized(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('policyNewsAuthorized', 'true');
      }
    } catch (error) {
      console.error('비밀번호 검증 실패', error);
      setVerifyError('비밀번호 검증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: '게시글 비밀번호를 입력해주세요.' }));
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title: formData.title,
      category: formData.category,
      excerpt: formData.excerpt,
      content: formData.content,
      thumbnail: formData.thumbnail,
      tags: tagsArray,
      isMain: formData.isMainNews,
      password,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/policy-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(result?.message || '게시글 등록에 실패했습니다.');
        return;
      }

      localStorage.removeItem('policyNewsDraft');
      alert('정책소식이 등록되었습니다.');
      router.push(`/policy-news/${result.post._id}`);
    } catch (error) {
      console.error('정책소식 등록 실패', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용을 취소하시겠습니까?')) {
      router.back();
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('policyNewsDraft', JSON.stringify(formData));
    alert('임시 저장되었습니다.');
  };

  const handleLoadDraft = () => {
    const draft = localStorage.getItem('policyNewsDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData({ ...defaultFormData, ...parsed });
      if (parsed.thumbnail) {
        setImagePreview(parsed.thumbnail);
      }
      alert('임시 저장된 내용을 불러왔습니다.');
    } else {
      alert('임시 저장된 데이터가 없습니다.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="policy-news-write">
        <div className="write-header">
          <h1>정책소식 작성</h1>
          <p>비밀번호를 입력하세요.</p>
        </div>
        <form className="password-verify-form" onSubmit={verifyPassword}>
          <label htmlFor="verify-password">게시글 비밀번호</label>
          <input
            type="password"
            id="verify-password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
          />
          {verifyError && <span className="error-message">{verifyError}</span>}
          <button type="submit" className="btn-submit" disabled={isVerifying}>
            <i className="fas fa-lock"></i> {isVerifying ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="policy-news-write">
      <div className="write-header">
        <h1>정책소식 작성</h1>
        <p>비밀번호를 입력하면 게시글을 등록할 수 있습니다.</p>
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
              placeholder="게시글 제목을 입력해주세요"
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
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
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
            placeholder="게시글 요약을 입력해주세요"
            rows={3}
            className={errors.excerpt ? 'error' : ''}
          />
          {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">
            내용 <span className="required">*</span>
          </label>
          <div className="editor-toolbar">
            <button type="button" className="toolbar-btn" onClick={() => insertFormatting('bold')}>
              <i className="fas fa-bold"></i>
            </button>
            <button type="button" className="toolbar-btn" onClick={() => insertFormatting('italic')}>
              <i className="fas fa-italic"></i>
            </button>
            <button type="button" className="toolbar-btn" onClick={() => insertFormatting('heading')}>
              <i className="fas fa-heading"></i>
            </button>
            <button type="button" className="toolbar-btn" onClick={() => insertFormatting('link')}>
              <i className="fas fa-link"></i>
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="정책소식 내용을 입력해주세요. HTML 태그를 사용할 수 있습니다."
            rows={15}
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">
            표지 이미지 URL <span className="required">*</span>
          </label>
          <div className="image-upload-area">
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/thumbnail.jpg"
              className={errors.thumbnail ? 'error' : ''}
            />
            {errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}

            <div className="upload-box">
              <i className="fas fa-cloud-upload-alt"></i>
              <p>이미지 URL을 입력해주세요 (권장 1200x630px)</p>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="미리보기" />
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
            <label htmlFor="tags">태그</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="정책, 지원사업, 정부지원"
            />
            <p className="help-text">쉼표로 구분해 입력하면 됩니다.</p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isMainNews"
                checked={formData.isMainNews}
                onChange={handleChange}
              />
              <span>메인 슬라이드에 노출</span>
            </label>
            <p className="help-text">선택 시 정책소식 슬라이드 영역에 노출됩니다.</p>
          </div>
        </div>

        <div className="form-group password-group">
          <label htmlFor="post-password">
            게시글 비밀번호 <span className="required">*</span>
          </label>
          <input
            type="password"
            id="post-password"
            name="post-password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-actions">
          <div className="left-actions">
            <button type="button" className="btn-draft" onClick={handleSaveDraft}>
              <i className="fas fa-save"></i> 임시 저장
            </button>
            <button type="button" className="btn-load" onClick={handleLoadDraft}>
              <i className="fas fa-folder-open"></i> 불러오기
            </button>
          </div>

          <div className="right-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <i className="fas fa-times"></i> 취소
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              <i className="fas fa-check"></i> {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PolicyNewsWrite;

