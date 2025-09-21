'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import './PolicyAnalysisWrite.css';

const PolicyAnalysisWrite = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // 카테고리별 필수 작성 항목 정의
  const categoryFields = {
    government: {
      name: '정부정책자금',
      icon: 'fas fa-landmark',
      sections: [
        {
          id: 'target',
          title: '지원 대상',
          placeholder:
            '지원 대상 기업 조건을 입력하세요\n예: 중소기업, 스타트업, 창업 3년 이내 기업 등',
          required: true,
        },
        {
          id: 'scale',
          title: '지원 규모',
          placeholder: '지원 금액 및 규모를 입력하세요\n예: 최대 5억원, 프로젝트 비용의 70% 이내',
          required: true,
        },
        {
          id: 'qualification',
          title: '신청 자격',
          placeholder: '신청 자격 요건을 상세히 입력하세요',
          required: true,
        },
        {
          id: 'method',
          title: '신청 방법',
          placeholder: '신청 방법 및 절차를 단계별로 입력하세요',
          required: true,
        },
        {
          id: 'documents',
          title: '제출 서류',
          placeholder: '필요한 서류 목록을 입력하세요',
          required: true,
        },
        {
          id: 'criteria',
          title: '선정 기준',
          placeholder: '평가 항목 및 선정 기준을 입력하세요',
          required: true,
        },
        {
          id: 'process',
          title: '지원 절차',
          placeholder: '전체 지원 절차를 시간 순서대로 입력하세요',
          required: true,
        },
        {
          id: 'tips',
          title: '선정 팁',
          placeholder: '선정률을 높이는 노하우를 입력하세요',
          required: false,
        },
        {
          id: 'contact',
          title: '문의처',
          placeholder: '담당 기관 및 연락처를 입력하세요',
          required: false,
        },
      ],
    },
    support: {
      name: '정부지원자금',
      icon: 'fas fa-hand-holding-usd',
      sections: [
        {
          id: 'purpose',
          title: '사업 목적',
          placeholder: '지원 사업의 목적을 입력하세요',
          required: true,
        },
        {
          id: 'target',
          title: '지원 대상',
          placeholder: '지원 대상 기업 또는 개인을 입력하세요',
          required: true,
        },
        {
          id: 'content',
          title: '지원 내용',
          placeholder: '구체적인 지원 내용을 입력하세요',
          required: true,
        },
        {
          id: 'condition',
          title: '지원 조건',
          placeholder: '지원받기 위한 조건을 입력하세요',
          required: true,
        },
        {
          id: 'period',
          title: '신청 기간',
          placeholder: '신청 시작일과 마감일을 입력하세요',
          required: true,
        },
        {
          id: 'method',
          title: '신청 방법',
          placeholder: '온라인/오프라인 신청 방법을 입력하세요',
          required: true,
        },
        {
          id: 'evaluation',
          title: '평가 방법',
          placeholder: '서류 평가, 면접 등 평가 방법을 입력하세요',
          required: false,
        },
        {
          id: 'benefit',
          title: '기대 효과',
          placeholder: '지원받을 경우의 기대 효과를 입력하세요',
          required: false,
        },
        {
          id: 'contact',
          title: '문의처',
          placeholder: '담당 부서 및 연락처를 입력하세요',
          required: true,
        },
      ],
    },
    manufacturing: {
      name: '제조업특화자금',
      icon: 'fas fa-industry',
      sections: [
        {
          id: 'industry',
          title: '지원 업종',
          placeholder: '지원 가능한 제조업 업종을 입력하세요',
          required: true,
        },
        {
          id: 'scale',
          title: '지원 규모',
          placeholder: '대출 한도 및 규모를 입력하세요',
          required: true,
        },
        {
          id: 'loanCondition',
          title: '대출 조건',
          placeholder: '대출 기간, 상환 방법 등을 입력하세요',
          required: true,
        },
        {
          id: 'interestRate',
          title: '금리 우대',
          placeholder: '기본 금리 및 우대 조건을 입력하세요',
          required: true,
        },
        {
          id: 'repayment',
          title: '상환 조건',
          placeholder: '거치 기간, 상환 기간 등을 입력하세요',
          required: true,
        },
        {
          id: 'documents',
          title: '필요 서류',
          placeholder: '제출해야 할 서류 목록을 입력하세요',
          required: true,
        },
        {
          id: 'criteria',
          title: '심사 기준',
          placeholder: '신용 등급, 매출액 등 심사 기준을 입력하세요',
          required: true,
        },
        {
          id: 'benefits',
          title: '추가 혜택',
          placeholder: '컨설팅, 기술 지원 등 추가 혜택을 입력하세요',
          required: false,
        },
        {
          id: 'caution',
          title: '주의사항',
          placeholder: '신청 시 주의해야 할 사항을 입력하세요',
          required: false,
        },
      ],
    },
    other: {
      name: '기타자금',
      icon: 'fas fa-ellipsis-h',
      sections: [
        {
          id: 'type',
          title: '자금 종류',
          placeholder: '자금의 종류 및 성격을 입력하세요',
          required: true,
        },
        { id: 'target', title: '지원 대상', placeholder: '지원 대상을 입력하세요', required: true },
        {
          id: 'content',
          title: '지원 내용',
          placeholder: '구체적인 지원 내용을 입력하세요',
          required: true,
        },
        { id: 'method', title: '신청 방법', placeholder: '신청 방법을 입력하세요', required: true },
        {
          id: 'documents',
          title: '제출 서류',
          placeholder: '필요한 서류를 입력하세요',
          required: true,
        },
        { id: 'schedule', title: '일정', placeholder: '주요 일정을 입력하세요', required: false },
        {
          id: 'caution',
          title: '주의사항',
          placeholder: '신청 시 주의사항을 입력하세요',
          required: true,
        },
        { id: 'faq', title: '자주 묻는 질문', placeholder: 'FAQ를 입력하세요', required: false },
      ],
    },
  };

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    category: 'government',
    sections: {}, // �� ���Ǻ� ���� ����
    tags: '',
    images: [],
    thumbnailIndex: 0,
    useStructured: true, // ����ȭ�� �� ��� ����
    freeContent: '',
    examinerKey: '',
  });

  const [examinerOptions, setExaminerOptions] = useState([]);
  const [isLoadingExaminers, setIsLoadingExaminers] = useState(false);
  const [examinerError, setExaminerError] = useState('');

  // 카테고리 변경 시 섹션 초기화
  useEffect(() => {
    const currentCategory = categoryFields[formData.category];
    const initialSections = {};
    currentCategory.sections.forEach((section) => {
      if (!formData.sections[section.id]) {
        initialSections[section.id] = '';
      } else {
        initialSections[section.id] = formData.sections[section.id];
      }
    });
    setFormData((prev) => ({
      ...prev,
      sections: initialSections,
    }));
  }, [formData.category]);

  useEffect(() => {
    const loadExaminers = async () => {
      try {
        setIsLoadingExaminers(true);
        setExaminerError('');
        const response = await fetch('/api/expert-services/examiners');
        if (!response.ok) {
          throw new Error('인증 기업심사관을 불러오지 못했습니다.');
        }
        const data = await response.json().catch(() => null);
        const list = Array.isArray(data?.examiners) ? data.examiners : [];
        setExaminerOptions(list);
      } catch (error) {
        console.error('[PolicyAnalysisWrite] fetch examiners', error);
        setExaminerOptions([]);
        setExaminerError(error instanceof Error ? error.message : '인증 기업심사관을 불러오지 못했습니다.');
      } finally {
        setIsLoadingExaminers(false);
      }
    };

    loadExaminers();
  }, []);

  useEffect(() => {
    if (!formData.examinerKey && examinerOptions.length > 0) {
      const firstExaminer = examinerOptions[0];
      const optionValue =
        (firstExaminer && (firstExaminer._id || firstExaminer.legacyKey || firstExaminer.imageKey)) || '';
      if (optionValue) {
        setFormData((prev) => ({ ...prev, examinerKey: optionValue }));
      }
    }
  }, [examinerOptions, formData.examinerKey]);

  // 임시 저장 상태
  const [isSaved, setIsSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // 기본 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsSaved(false);
  };

  // 섹션 입력 핸들러
  const handleSectionChange = (sectionId, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: value,
      },
    }));
    setIsSaved(false);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  // 구조화/자유 작성 모드 전환
  const toggleWriteMode = () => {
    setFormData((prev) => ({
      ...prev,
      useStructured: !prev.useStructured,
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                id: Date.now() + Math.random(),
                file: file,
                url: event.target.result,
                name: file.name,
                size: file.size,
                type: file.type,
              },
            ],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // 이미지 삭제
  const handleImageDelete = (imageId) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((img) => img.id !== imageId);
      const deletedIndex = prev.images.findIndex((img) => img.id === imageId);

      let newThumbnailIndex = prev.thumbnailIndex;
      if (deletedIndex <= prev.thumbnailIndex && prev.thumbnailIndex > 0) {
        newThumbnailIndex--;
      }

      return {
        ...prev,
        images: newImages,
        thumbnailIndex: Math.min(newThumbnailIndex, Math.max(0, newImages.length - 1)),
      };
    });
  };

  // 대표 이미지 설정
  const handleSetThumbnail = (index) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailIndex: index,
    }));
  };

  // 현재 선택된 섹션 추적
  const [focusedSection, setFocusedSection] = useState(null);

  // 이미지를 특정 섹션에 삽입
  const insertImageToSection = (sectionId, imageUrl, imageName) => {
    const currentValue = formData.sections[sectionId] || '';
    const imageMarkdown = `\n\n![이미지 - ${imageName}](${imageUrl})\n\n`;

    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: currentValue + imageMarkdown,
      },
    }));
  };

  // 태그 관리
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
        setFormData((prev) => ({
          ...prev,
          tags: [...tags, newTag].join(', '),
        }));
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
    setFormData((prev) => ({
      ...prev,
      tags: newTags.join(', '),
    }));
  };

  // 임시 저장
  const handleAutoSave = () => {
    localStorage.setItem('policyAnalysisDraft', JSON.stringify(formData));
    setIsSaved(true);
    setLastSavedTime(new Date().toLocaleTimeString('ko-KR'));
  };

  // 자동 저장
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.title || Object.values(formData.sections).some((section) => section)) {
        handleAutoSave();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [formData]);

  // 페이지 로드 시 임시 저장 데이터 복원
  useEffect(() => {
    const savedDraft = localStorage.getItem('policyAnalysisDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      if (window.confirm('임시 저장된 글이 있습니다. 불러오시겠습니까?')) {
        setFormData(draft);
        if (draft.tags) {
          setTags(draft.tags.split(', ').filter((tag) => tag));
        }
      }
    }
  }, []);

  // 미리보기 모드
  const [isPreview, setIsPreview] = useState(false);

  // 구조화된 내용을 마크다운으로 변환
  const generateMarkdownContent = () => {
    const currentCategory = categoryFields[formData.category];
    let content = '';

    currentCategory.sections.forEach((section) => {
      if (formData.sections[section.id]) {
        content += `## ${section.title}\n\n${formData.sections[section.id]}\n\n`;
      }
    });

    return content;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.examinerKey) {
      alert('인증된 기업심사관을 선택해주세요.');
      return;
    }

    const currentCategory = categoryFields[formData.category];

    let structuredSections = [];
    if (formData.useStructured) {
      const missingSections = currentCategory.sections
        .filter((section) => section.required && !formData.sections[section.id]?.trim())
        .map((section) => section.title);

      if (missingSections.length > 0) {
        alert(`필수 항목을 모두 입력해주세요:
${missingSections.join(', ')}`);
        return;
      }

      structuredSections = currentCategory.sections
        .filter((section) => formData.sections[section.id]?.trim())
        .map((section) => ({
          id: section.id,
          title: section.title,
          content: formData.sections[section.id],
        }));
    }

    const finalContent = formData.useStructured ? generateMarkdownContent() : formData.freeContent || '';

    if (!finalContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      alert('게시글 비밀번호를 입력해주세요.');
      return;
    }

    const excerpt = finalContent
      .replace(/[#*`>\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140);

    const imagesPayload = formData.images.map((image, index) => ({
      url: image.url,
      name: image.name || `image-${index + 1}`,
      caption: image.caption || '',
    }));

    const payload = {
      password: password.trim(),
      title: formData.title.trim(),
      category: formData.category,
      excerpt,
      content: finalContent,
      isStructured: formData.useStructured,
      sections: structuredSections,
      tags,
      thumbnail: formData.images[formData.thumbnailIndex]?.url || '',
      images: imagesPayload,
      examinerKey: formData.examinerKey,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/policy-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result?.message || '정책분석 게시글 등록에 실패했습니다.');
        return;
      }

      localStorage.removeItem('policyAnalysisDraft');
      alert('정책분석 게시글이 등록되었습니다.');
      const nextId = result?.post?._id || result?.post?.id;
      router.push(nextId ? `/policy-analysis/${nextId}` : '/policy-analysis');
    } catch (error) {
      console.error('정책분석 작성 오류', error);
      alert('정책분석 게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (formData.title || Object.values(formData.sections).some((section) => section)) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
        router.push('/policy-analysis');
      }
    } else {
      router.push('/policy-analysis');
    }
  };

  // Markdown 렌더링 (미리보기용 - 이미지 포함)
  const renderMarkdown = (text) => {
    return text
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<div class="content-image-wrapper"><img src="$2" alt="$1" class="content-image" /><span class="image-caption">$1</span></div>'
      )
      .replace(/\n/g, '<br />');
  };

  const selectedExaminer = examinerOptions.find((examiner) => {
    const optionValue = examiner?._id || examiner?.legacyKey || examiner?.imageKey;
    return optionValue === formData.examinerKey;
  });
  const currentCategory = categoryFields[formData.category];

  return (
    <div className="write-page">
      {/* 헤더 */}
      <div className="write-header">
        <div className="header-left">
          <h1>
            <i className="fas fa-pen-fancy"></i>
            정책분석 작성
          </h1>
          {isSaved && lastSavedTime && (
            <span className="save-status">
              <i className="fas fa-check-circle"></i>
              {lastSavedTime} 자동 저장됨
            </span>
          )}
        </div>
        <div className="header-actions">
          <button type="button" className="btn-mode-toggle" onClick={toggleWriteMode}>
            <i className={formData.useStructured ? 'fas fa-list-alt' : 'fas fa-file-alt'}></i>
            {formData.useStructured ? '구조화 작성' : '자유 작성'}
          </button>
          <button type="button" className="btn-preview" onClick={() => setIsPreview(!isPreview)}>
            <i className={isPreview ? 'fas fa-edit' : 'fas fa-eye'}></i>
            {isPreview ? '편집' : '미리보기'}
          </button>
          <button type="button" className="btn-temp-save" onClick={handleAutoSave}>
            <i className="fas fa-save"></i>
            임시 저장
          </button>
        </div>
      </div>

      {/* 작성 폼 또는 미리보기 */}
      {!isPreview ? (
        <form onSubmit={handleSubmit} className="write-form">
          <div className="form-container">
            {/* 기본 정보 섹션 */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-info-circle"></i>
                기본 정보
              </h2>

              {/* 제목 */}
              <div className="form-group">
                <label htmlFor="title">
                  제목 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="정책분석 제목을 입력하세요 (예: 2024년 중소기업 R&D 지원사업 완벽 가이드)"
                  maxLength="100"
                  required
                />
                <span className="char-count">{formData.title.length}/100</span>
              </div>

              {/* 카테고리 */}
              <div className="form-group">
                <label htmlFor="category">
                  카테고리 <span className="required">*</span>
                </label>
                <div className="category-select">
                  {Object.entries(categoryFields).map(([key, cat]) => (
                    <label key={key} className="category-option">
                      <input
                        type="radio"
                        name="category"
                        value={key}
                        checked={formData.category === key}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      />
                      <span className="category-card">
                        <i className={cat.icon}></i>
                        <span>{cat.name}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 인증 기업심사관 */}
              <div className="form-group examiner-group">
                <label htmlFor="examiner">
                  인증 기업심사관 <span className="required">*</span>
                </label>
                <select
                  id="examiner"
                  value={formData.examinerKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      examinerKey: e.target.value,
                    }))
                  }
                  disabled={isLoadingExaminers || examinerOptions.length === 0}
                  required
                >
                  <option value="">인증기업심사관을 선택해주세요</option>
                  {examinerOptions.map((examiner) => {
                    const optionValue = examiner?._id || examiner?.legacyKey || examiner?.imageKey;
                    if (!optionValue) {
                      return null;
                    }
                    return (
                      <option key={optionValue} value={optionValue}>
                        {examiner.name} 인증기업심사관{examiner.companyName ? ` | ${examiner.companyName}` : ''}
                      </option>
                    );
                  })}
                </select>
                {isLoadingExaminers ? (
                  <p className="examiner-helper">인증 기업심사관을 불러오는 중입니다...</p>
                ) : null}
                {examinerError ? (
                  <p className="examiner-helper examiner-helper--error">{examinerError}</p>
                ) : null}
                {selectedExaminer && (
                  <div className="examiner-highlight">
                    <div className="examiner-header">
                      <strong>{selectedExaminer.name}</strong>
                      <span>인증기업심사관</span>
                    </div>
                    <p className="examiner-company">{selectedExaminer.companyName}</p>
                    <div className="examiner-tags">
                      {(selectedExaminer.specialties || []).slice(0, 3).map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* 태그 */}
              <div className="form-group">
                <label htmlFor="tags">
                  태그
                  <span className="label-desc">(Enter 또는 쉼표로 구분)</span>
                </label>
                <div className="tag-input-wrapper">
                  <div className="tag-list">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        #{tag}
                        <button
                          type="button"
                          className="tag-delete"
                          onClick={() => handleTagDelete(tag)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInput}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newTag = tagInput.trim();
                          if (newTag && !tags.includes(newTag)) {
                            setTags([...tags, newTag]);
                            setTagInput('');
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...tags, newTag].join(', '),
                            }));
                          }
                        }
                      }}
                      placeholder={tags.length === 0 ? '태그를 입력하세요' : ''}
                      className="tag-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-images"></i>
                이미지 관리
              </h2>

              <div className="form-group">
                <label>
                  이미지 업로드
                  <span className="label-desc">(대표 이미지로 지정하면 썸네일로 사용됩니다)</span>
                </label>

                <div className="image-upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="imageUpload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="upload-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>이미지 선택</span>
                  </button>
                </div>

                {formData.images.length > 0 && (
                  <div className="image-gallery">
                    {formData.images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`image-item ${index === formData.thumbnailIndex ? 'is-thumbnail' : ''}`}
                      >
                        <img src={image.url} alt={image.name} />
                        <div className="image-overlay">
                          <div className="image-info">
                            <span className="image-name">{image.name}</span>
                            <span className="image-size">{(image.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <div className="image-actions">
                            {index === formData.thumbnailIndex ? (
                              <span className="thumbnail-badge">
                                <i className="fas fa-star"></i> 대표
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="btn-set-thumbnail"
                                onClick={() => handleSetThumbnail(index)}
                                title="대표 이미지로 설정"
                              >
                                <i className="far fa-star"></i>
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn-delete-image"
                              onClick={() => handleImageDelete(image.id)}
                              title="삭제"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 내용 작성 섹션 - 구조화된 폼 */}
            {formData.useStructured ? (
              <div className="form-section">
                <h2 className="section-title">
                  <i className="fas fa-file-alt"></i>
                  내용 작성 - {currentCategory.name}
                  <span className="section-subtitle">
                    <span className="required">*</span> 표시는 필수 항목입니다
                  </span>
                </h2>

                <div className="structured-sections">
                  {currentCategory.sections.map((section, index) => (
                    <div key={section.id} className="section-input-group">
                      <div className="section-header">
                        <span className="section-number">{index + 1}</span>
                        <label htmlFor={section.id}>
                          {section.title}
                          {section.required && <span className="required">*</span>}
                        </label>
                        {formData.sections[section.id] && (
                          <span className="section-status">
                            <i className="fas fa-check-circle"></i>
                          </span>
                        )}
                      </div>
                      <textarea
                        id={section.id}
                        value={formData.sections[section.id] || ''}
                        onChange={(e) => handleSectionChange(section.id, e.target.value)}
                        onFocus={() => setFocusedSection(section.id)}
                        onBlur={() => setTimeout(() => setFocusedSection(null), 200)}
                        placeholder={section.placeholder}
                        rows="6"
                        className="section-textarea"
                        required={section.required}
                      />
                      <div className="section-footer">
                        <div className="section-char-count">
                          {(formData.sections[section.id] || '').length}자
                        </div>
                        {formData.images.length > 0 && focusedSection === section.id && (
                          <div className="section-image-insert">
                            <span className="insert-hint">클릭하여 이미지 삽입:</span>
                            <div className="insert-image-list">
                              {formData.images.map((image, idx) => (
                                <button
                                  key={image.id}
                                  type="button"
                                  className="insert-image-btn"
                                  onClick={() =>
                                    insertImageToSection(section.id, image.url, image.name)
                                  }
                                  title={`${image.name} 삽입`}
                                >
                                  <img src={image.url} alt={image.name} />
                                  {idx === formData.thumbnailIndex && (
                                    <span className="thumb-indicator">대표</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 자유 작성 모드 (기존 에디터 모드)
              <div className="form-section">
                <h2 className="section-title">
                  <i className="fas fa-file-alt"></i>
                  내용 작성 (자유 작성 모드)
                </h2>
                <div className="form-group">
                  <textarea
                    name="freeContent"
                    value={formData.freeContent || ''}
                    onChange={handleInputChange}
                    placeholder="자유롭게 내용을 작성하세요..."
                    rows="25"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 게시글 비밀번호 */}
          <div className="form-group password-group">
            <label htmlFor="policy-password">
              게시글 비밀번호 <span className="required">*</span>
            </label>
            <input
              type="password"
              id="policy-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="환경변수에 등록된 비밀번호를 입력하세요"
              required
            />
          </div>

          {/* 하단 버튼 */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <i className="fas fa-times"></i>
              취소
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              <i className="fas fa-check"></i>
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      ) : (
        /* 미리보기 모드 */
        <div className="preview-container">
          <article className="preview-content">
            <div className="preview-header">
              <span className="preview-category">{currentCategory.name}</span>
              <h1 className="preview-title">{formData.title || '제목 없음'}</h1>
              <div className="preview-meta">
                <span className="author">
                  <i className="fas fa-shield-alt"></i>{' '}
                  {selectedExaminer ? `${selectedExaminer.name} 인증기업심사관` : '인증기업심사관'}
                </span>
                <span className="company">
                  <i className="fas fa-building"></i>{' '}
                  {selectedExaminer ? selectedExaminer.companyName : '기업명을 선택해주세요'}
                </span>
                <span className="date">
                  <i className="fas fa-calendar"></i> {new Date().toLocaleDateString('ko-KR')}
                </span>
              </div>
              {tags.length > 0 && (
                <div className="preview-tags">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {formData.images.length > 0 && formData.images[formData.thumbnailIndex] && (
              <div className="preview-thumbnail">
                <img src={formData.images[formData.thumbnailIndex].url} alt="대표 이미지" />
              </div>
            )}

            <div className="preview-body">
              {formData.useStructured ? (
                <div
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(generateMarkdownContent()) }}
                />
              ) : (
                <div>{formData.freeContent || '내용이 없습니다.'}</div>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default PolicyAnalysisWrite;









