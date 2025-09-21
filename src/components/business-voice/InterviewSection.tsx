'use client';

import { useState, useEffect, useRef } from 'react';

interface InterviewVideo {
  _id: string;
  youtubeUrl: string;
  youtubeId?: string;
  displayThumbnail?: string;
  title: string;
  description?: string;
  author?: string;
  company?: string;
  amount?: string;
  views?: number;
}

export default function InterviewSection() {
  const [videos, setVideos] = useState<InterviewVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Upload form states
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    title: '',
    description: '',
    author: '',
    company: '',
    amount: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 영상 목록 불러오기
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business-voice/interview-videos');
      const data = await response.json();

      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 확인
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setIsVerifying(true);

    try {
      const response = await fetch('/api/business-voice/interview-videos/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setShowPasswordModal(false);
        setShowUploadForm(true);
        setPassword(''); // 비밀번호 초기화
      } else {
        setPasswordError(data.message || '비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      setPasswordError('인증 처리 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 썸네일 파일 선택
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setThumbnailFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 영상 등록 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.youtubeUrl || !formData.title) {
      alert('YouTube URL과 제목은 필수입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      let thumbnailUrl = '';

      // 썸네일 업로드 (선택사항) - Cloudflare R2 사용
      if (thumbnailFile) {
        try {
          // 1. Presigned URL 가져오기
          const presignResponse = await fetch('/api/business-voice/interview-videos/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              password,
              fileName: thumbnailFile.name,
              contentType: thumbnailFile.type,
            }),
          });

          const presignData = await presignResponse.json();

          if (!presignData.success) {
            throw new Error(presignData.message || '업로드 URL 생성 실패');
          }

          // 2. 파일 업로드
          const uploadResponse = await fetch(presignData.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': thumbnailFile.type,
            },
            body: thumbnailFile,
          });

          if (!uploadResponse.ok) {
            throw new Error('이미지 업로드 실패');
          }

          // 3. 공개 URL 사용
          thumbnailUrl = presignData.publicUrl;
        } catch (uploadError) {
          console.error('Thumbnail upload error:', uploadError);
          if (!confirm('썸네일 업로드에 실패했습니다. 썸네일 없이 계속하시겠습니까?')) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      const response = await fetch('/api/business-voice/interview-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password, // 저장된 비밀번호 사용
          ...formData,
          thumbnailUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('영상이 성공적으로 등록되었습니다.');
        setShowUploadForm(false);
        setFormData({
          youtubeUrl: '',
          title: '',
          description: '',
          author: '',
          company: '',
          amount: '',
        });
        setThumbnailFile(null);
        setThumbnailPreview('');
        fetchVideos(); // 목록 새로고침
      } else {
        alert(data.message || '영상 등록에 실패했습니다.');
      }
    } catch (error) {
      alert('영상 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 슬라이드 이동
  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < Math.max(0, videos.length - 3)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 3개씩 표시할 비디오
  const visibleVideos = videos.slice(currentIndex, currentIndex + 3);

  return (
    <section id="interview-section" className="interview-section-new">
      <div className="section-header">
        <h2>🎬 나라똔과 함께한 대표님 인터뷰</h2>
        <p>실제 정부지원금을 받은 대표님들의 생생한 이야기</p>
      </div>

      <div className="interview-videos-container">
        {/* 영상 슬라이더 */}
        <div className="videos-slider">
          {videos.length > 3 && currentIndex > 0 && (
            <button className="slider-arrow arrow-left" onClick={handlePrevSlide}>
              ‹
            </button>
          )}

          <div className="videos-grid">
            {isLoading ? (
              <div className="loading-message">영상을 불러오는 중...</div>
            ) : visibleVideos.length > 0 ? (
              visibleVideos.map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    {video.displayThumbnail ? (
                      <img src={video.displayThumbnail} alt={video.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <span>📹</span>
                      </div>
                    )}
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="play-overlay"
                    >
                      <span className="play-icon">▶</span>
                    </a>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    {video.author && (
                      <p className="video-meta">
                        {video.author}
                        {video.company && ` | ${video.company}`}
                      </p>
                    )}
                    {video.amount && (
                      <span className="amount-badge">💰 {video.amount}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-videos-message">
                아직 등록된 영상이 없습니다.
              </div>
            )}
          </div>

          {videos.length > 3 && currentIndex < videos.length - 3 && (
            <button className="slider-arrow arrow-right" onClick={handleNextSlide}>
              ›
            </button>
          )}
        </div>

        {/* 영상 등록 버튼 */}
        <button
          className="add-video-btn"
          onClick={() => setShowPasswordModal(true)}
        >
          영상등록하기
        </button>
      </div>

      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>관리자 인증</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="cancel-btn"
                >
                  취소
                </button>
                <button type="submit" disabled={isVerifying}>
                  {isVerifying ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 업로드 폼 모달 */}
      {showUploadForm && (
        <div className="modal-overlay" onClick={() => setShowUploadForm(false)}>
          <div className="modal-content upload-form" onClick={(e) => e.stopPropagation()}>
            <h3>영상 등록하기</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>YouTube URL *</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>제목 *</label>
                <input
                  type="text"
                  placeholder="예: 5억 R&D 지원금 선정 비결"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  placeholder="영상에 대한 간단한 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>대표님 성함</label>
                  <input
                    type="text"
                    placeholder="예: 김○○ 대표"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>회사명</label>
                  <input
                    type="text"
                    placeholder="예: IT스타트업"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>지원금액</label>
                <input
                  type="text"
                  placeholder="예: 5억원"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>썸네일 이미지 (선택)</label>
                <div className="thumbnail-upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="thumbnail-select-btn"
                  >
                    이미지 선택
                  </button>
                  {thumbnailPreview && (
                    <div className="thumbnail-preview">
                      <img src={thumbnailPreview} alt="썸네일 미리보기" />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                        }}
                        className="remove-thumbnail"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="form-help">
                  썸네일을 등록하지 않으면 YouTube 기본 썸네일이 표시됩니다.
                </p>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="cancel-btn"
                >
                  취소
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}