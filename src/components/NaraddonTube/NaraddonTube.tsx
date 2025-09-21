'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './NaraddonTube.css';

type NaraddonTubeProps = {
  isExpanded?: boolean;
  onExpandToggle?: () => void;
};

type TubeVideo = {
  title: string;
  youtubeId: string;
  url: string;
  customThumbnail?: string;
};

type TubeEntry = {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl: string;
  videos: TubeVideo[];
};

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

type UploadFormState = {
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  video1Title: string;
  video1Url: string;
  video2Title: string;
  video2Url: string;
  sortOrder: number;
  isPublished: boolean;
};

const FALLBACK_THUMBNAIL = '';

const initialUploadForm: UploadFormState = {
  title: '',
  subtitle: '',
  description: '',
  thumbnailUrl: '',
  video1Title: '',
  video1Url: '',
  video2Title: '',
  video2Url: '',
  sortOrder: 0,
  isPublished: true,
};

const NaraddonTube: React.FC<NaraddonTubeProps> = () => {
  const router = useRouter();
  const [entries, setEntries] = useState<TubeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedThumb, setExpandedThumb] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState<UploadFormState>(initialUploadForm);
  const [uploadFeedback, setUploadFeedback] = useState<FeedbackState>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTubeEntries = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const response = await fetch('/api/naraddon-tube', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('영상 목록을 불러오는 데 실패했습니다.');
      }

      const data = await response.json();
      if (Array.isArray(data?.entries)) {
        setEntries(data.entries);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('[NaraddonTube] fetch error', error);
      setFetchError('영상 정보를 불러오지 못했습니다.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTubeEntries();
  }, [fetchTubeEntries]);

  useEffect(() => {
    if (expandedThumb && !entries.some((entry) => entry._id === expandedThumb)) {
      setExpandedThumb(null);
    }
  }, [entries, expandedThumb]);

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleThumbnailClick = (id: string) => {
    if (isTransitioning) return;
    setExpandedThumb((prev) => (prev === id ? null : id));
  };

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    if (expandedThumb && expandedThumb !== id) {
      setIsTransitioning(true);
      setExpandedThumb(null);

      const timeout = setTimeout(() => {
        setExpandedThumb(id);
        setIsTransitioning(false);
      }, 300);
      setHoverTimeout(timeout);
    } else if (!expandedThumb) {
      setExpandedThumb(id);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent, id: string) => {
    const card = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (relatedTarget && card && card.contains && relatedTarget instanceof Node) {
      if (card.contains(relatedTarget)) {
        return;
      }
    }

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    const timeout = setTimeout(() => {
      setExpandedThumb((prev) => (prev === id ? null : prev));
    }, 300);

    setHoverTimeout(timeout);
  };

  const handleVideoClick = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideo(videoId);
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  const handleAdminButtonClick = () => {
    router.push('/naraddon-tube/admin');
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!passwordInput.trim()) {
      setPasswordFeedback('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsVerifyingPassword(true);
      setPasswordFeedback(null);

      const response = await fetch('/api/naraddon-tube/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        setPasswordFeedback(data?.message || '비밀번호가 올바르지 않습니다.');
        return;
      }

      setIsAuthorized(true);
      setAdminPassword(passwordInput.trim());
      setShowPasswordModal(false);
      setShowUploadModal(true);
    } catch (error) {
      console.error('[NaraddonTube] verify error', error);
      setPasswordFeedback('비밀번호 확인에 실패했습니다.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleUploadFieldChange = (
    field: keyof UploadFormState,
    value: string | number | boolean
  ) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetUploadForm = () => {
    setUploadForm(initialUploadForm);
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!uploadForm.title.trim()) {
      setUploadFeedback({ type: 'error', text: '카드 제목을 입력해주세요.' });
      return;
    }

    if (!uploadForm.thumbnailUrl.trim()) {
      setUploadFeedback({
        type: 'error',
        text: '썸네일 이미지를 업로드하거나 URL을 입력해주세요.',
      });
      return;
    }

    if (!uploadForm.video1Url.trim() || !uploadForm.video2Url.trim()) {
      setUploadFeedback({ type: 'error', text: '영상 링크 2개를 모두 입력해주세요.' });
      return;
    }

    const payload = {
      password: adminPassword,
      title: uploadForm.title.trim(),
      subtitle: uploadForm.subtitle.trim(),
      description: uploadForm.description.trim(),
      thumbnailUrl: uploadForm.thumbnailUrl.trim(),
      sortOrder: Number.isFinite(uploadForm.sortOrder) ? uploadForm.sortOrder : 0,
      isPublished: uploadForm.isPublished,
      videos: [
        { title: uploadForm.video1Title.trim(), youtubeUrl: uploadForm.video1Url.trim() },
        { title: uploadForm.video2Title.trim(), youtubeUrl: uploadForm.video2Url.trim() },
      ],
    };

    try {
      setIsSaving(true);
      setUploadFeedback(null);

      const response = await fetch('/api/naraddon-tube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || '영상 정보를 저장하지 못했습니다.');
      }

      setUploadFeedback({ type: 'success', text: '영상이 등록되었습니다.' });
      resetUploadForm();
      await fetchTubeEntries();
    } catch (error) {
      console.error('[NaraddonTube] upload error', error);
      setUploadFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : '영상 등록 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closePasswordModal = () => {
    if (isVerifyingPassword) return;
    setShowPasswordModal(false);
  };

  const closeUploadModal = () => {
    if (isSaving) return;
    setShowUploadModal(false);
  };

  const getVideoThumbnail = (video: TubeVideo) => {
    if (video.customThumbnail && video.customThumbnail.trim()) {
      return video.customThumbnail;
    }
    return `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
  };

  const hasEntries = entries.length > 0;

  return (
    <>
      <section className="naraddon-tube-section">
        <div className="naraddon-tube-container">
          <div className="tube-header">
            <div className="tube-heading">
              <span className="tube-eyebrow">나라똔에서 전해드리는</span>
              <h2 className="tube-title">나라똔 튜브</h2>
            </div>
            <p className="tube-subtitle">
              영상으로 만나는 정책자금 활용 사례와 실전 가이드를 만나보세요
            </p>
            <div className="tube-actions">
              <button type="button" className="tube-admin-button" onClick={handleAdminButtonClick}>
                영상 등록
              </button>
            </div>
          </div>

          {loading && <p className="tube-status-message">영상 정보를 불러오는 중입니다...</p>}

          {!loading && fetchError && (
            <p className="tube-status-message tube-status-message--error">{fetchError}</p>
          )}

          {!loading && !hasEntries && !fetchError && (
            <p className="tube-status-message">영상 업데이트를 준비 중입니다.</p>
          )}

          {hasEntries && (
            <div className="youtube-style-grid">
              {entries.map((item) => {
                // 메인 썸네일은 업로드된 썸네일만 사용
                const mainThumbnail = item.thumbnailUrl || '';
                const isExpanded = expandedThumb === item._id;

                return (
                  <div
                    key={item._id}
                    className={`youtube-card ${isExpanded ? 'expanded' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item._id)}
                    onMouseLeave={(e) => handleMouseLeave(e, item._id)}
                  >
                    <div
                      className="thumbnail-section"
                      onClick={() => handleThumbnailClick(item._id)}
                    >
                      <div className="thumbnail-wrapper">
                        <img
                          src={mainThumbnail}
                          alt={item.title}
                          className="thumbnail-image"
                          onError={(e) => {
                            console.error('[NaraddonTube] Thumbnail load failed:', item.thumbnailUrl);
                          }}
                        />
                      </div>
                      <div className="thumbnail-info">
                        <h3 className="thumbnail-title">{item.title}</h3>
                        <p className="video-count">
                          {item.videos && item.videos.length > 0 ? `${item.videos.length}개 영상` : '영상 준비중'}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="expanded-videos">
                        {item.videos && item.videos.length > 0 ? (
                          <div className="videos-grid">
                            {item.videos.map((video) => (
                            <div
                              key={video.youtubeId}
                              className="video-item"
                              onClick={(e) => handleVideoClick(video.youtubeId, e)}
                            >
                              <div className="video-thumbnail">
                                <img
                                  src={getVideoThumbnail(video)}
                                  alt={video.title}
                                  className="video-thumb-img"
                                />
                                <div className="video-hover-overlay">
                                  <svg className="play-icon-small" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z" fill="white" />
                                  </svg>
                                  <span className="watch-now">시청하기</span>
                                </div>
                              </div>
                              <p className="video-title">{video.title}</p>
                            </div>
                            ))}
                          </div>
                        ) : (
                          <div className="video-preparing-message">
                            <svg className="preparing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <p>영상 준비 중입니다</p>
                            <span className="preparing-subtitle">곧 업로드 예정이에요!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {playingVideo && (
        <>
          <div className="video-modal-backdrop" onClick={handleCloseVideo} />
          <div className="video-modal">
            <button className="close-button" onClick={handleCloseVideo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="video-player-container">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-player"
              />
            </div>
          </div>
        </>
      )}

      {showPasswordModal && (
        <>
          <div className="video-modal-backdrop" onClick={closePasswordModal} />
          <div className="video-modal naraddon-modal naraddon-modal--form">
            <button className="close-button" onClick={closePasswordModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="naraddon-modal__title">관리자 비밀번호 입력</h3>
            <p className="naraddon-modal__description">
              영상 등록을 위해 관리자 비밀번호를 입력해주세요.
            </p>

            <form className="naraddon-modal__form" onSubmit={handlePasswordSubmit}>
              <label className="naraddon-modal__label" htmlFor="naraddon-tube-password">
                비밀번호
              </label>
              <input
                id="naraddon-tube-password"
                type="password"
                className="naraddon-modal__input"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />

              {passwordFeedback && (
                <p className="naraddon-modal__feedback naraddon-modal__feedback--error">
                  {passwordFeedback}
                </p>
              )}

              <button
                className="naraddon-modal__submit"
                type="submit"
                disabled={isVerifyingPassword}
              >
                {isVerifyingPassword ? '확인 중...' : '확인'}
              </button>
            </form>
          </div>
        </>
      )}

      {showUploadModal && (
        <>
          <div className="video-modal-backdrop" onClick={closeUploadModal} />
          <div className="video-modal naraddon-modal naraddon-modal--form">
            <button className="close-button" onClick={closeUploadModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 className="naraddon-modal__title">나라똔 튜브 영상 등록</h3>
            <p className="naraddon-modal__description">썸네일과 영상 링크 2개를 입력해 주세요.</p>

            {uploadFeedback && (
              <p
                className={`naraddon-modal__feedback ${
                  uploadFeedback.type === 'error'
                    ? 'naraddon-modal__feedback--error'
                    : 'naraddon-modal__feedback--success'
                }`}
              >
                {uploadFeedback.text}
              </p>
            )}

            <form className="naraddon-modal__form" onSubmit={handleUploadSubmit}>
              <label className="naraddon-modal__label" htmlFor="tube-title">
                카드 제목
              </label>
              <input
                id="tube-title"
                className="naraddon-modal__input"
                value={uploadForm.title}
                onChange={(e) => handleUploadFieldChange('title', e.target.value)}
                required
              />

              <label className="naraddon-modal__label" htmlFor="tube-subtitle">
                부제목 (선택)
              </label>
              <input
                id="tube-subtitle"
                className="naraddon-modal__input"
                value={uploadForm.subtitle}
                onChange={(e) => handleUploadFieldChange('subtitle', e.target.value)}
              />

              <label className="naraddon-modal__label" htmlFor="tube-description">
                설명 (선택)
              </label>
              <textarea
                id="tube-description"
                className="naraddon-modal__textarea"
                value={uploadForm.description}
                onChange={(e) => handleUploadFieldChange('description', e.target.value)}
                rows={3}
              />

              <label className="naraddon-modal__label" htmlFor="tube-thumbnail">
                썸네일 이미지 URL
              </label>
              <input
                id="tube-thumbnail"
                className="naraddon-modal__input"
                value={uploadForm.thumbnailUrl}
                onChange={(e) => handleUploadFieldChange('thumbnailUrl', e.target.value)}
                placeholder="https://... (이미지 업로드 후 URL)"
                required
              />

              <div className="naraddon-modal__fieldset">
                <span className="naraddon-modal__fieldset-title">영상 1</span>
                <label className="naraddon-modal__label" htmlFor="tube-video1-title">
                  영상 제목
                </label>
                <input
                  id="tube-video1-title"
                  className="naraddon-modal__input"
                  value={uploadForm.video1Title}
                  onChange={(e) => handleUploadFieldChange('video1Title', e.target.value)}
                  placeholder="영상 제목 (선택)"
                />
                <label className="naraddon-modal__label" htmlFor="tube-video1-url">
                  YouTube 링크 또는 ID
                </label>
                <input
                  id="tube-video1-url"
                  className="naraddon-modal__input"
                  value={uploadForm.video1Url}
                  onChange={(e) => handleUploadFieldChange('video1Url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="naraddon-modal__fieldset">
                <span className="naraddon-modal__fieldset-title">영상 2</span>
                <label className="naraddon-modal__label" htmlFor="tube-video2-title">
                  영상 제목
                </label>
                <input
                  id="tube-video2-title"
                  className="naraddon-modal__input"
                  value={uploadForm.video2Title}
                  onChange={(e) => handleUploadFieldChange('video2Title', e.target.value)}
                  placeholder="영상 제목 (선택)"
                />
                <label className="naraddon-modal__label" htmlFor="tube-video2-url">
                  YouTube 링크 또는 ID
                </label>
                <input
                  id="tube-video2-url"
                  className="naraddon-modal__input"
                  value={uploadForm.video2Url}
                  onChange={(e) => handleUploadFieldChange('video2Url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="naraddon-modal__grid">
                <div>
                  <label className="naraddon-modal__label" htmlFor="tube-sort-order">
                    정렬 우선순위
                  </label>
                  <input
                    id="tube-sort-order"
                    type="number"
                    className="naraddon-modal__input"
                    value={uploadForm.sortOrder}
                    onChange={(e) => handleUploadFieldChange('sortOrder', Number(e.target.value))}
                    min={0}
                  />
                </div>
                <label className="naraddon-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={uploadForm.isPublished}
                    onChange={(e) => handleUploadFieldChange('isPublished', e.target.checked)}
                  />
                  <span>메인에 노출</span>
                </label>
              </div>

              <button className="naraddon-modal__submit" type="submit" disabled={isSaving}>
                {isSaving ? '저장 중...' : '영상 등록'}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default NaraddonTube;
