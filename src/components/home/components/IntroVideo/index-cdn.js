import React from 'react';
import './IntroVideo.css';

const IntroVideo = ({
  showStartButton,
  currentCaption,
  isCaptionVisible,
  showGreenOverlay,
  onStartClick,
  videoError,
  setVideoError,
}) => {
  if (!showStartButton) return null;

  // 영상 로드 상태 체크
  const handleVideoLoad = () => {
    console.log('✅ 인트로 영상 로드 성공');
  };

  const handleVideoPlay = () => {
    console.log('▶️ 인트로 영상 재생 시작');
  };

  // CDN URL 설정 (Cloudinary 예시)
  // 1. Cloudinary에 가입 후 영상 업로드
  // 2. 아래 URL을 실제 Cloudinary URL로 교체
  const videoSrc =
    'https://res.cloudinary.com/[YOUR_CLOUD_NAME]/video/upload/v1/Naraddon_main_2nd.mp4';

  // 또는 다른 CDN 옵션들:
  // Firebase: "https://firebasestorage.googleapis.com/v0/b/[PROJECT]/o/Naraddon_main_2nd.mp4?alt=media"
  // Bunny CDN: "https://[YOUR_CDN].b-cdn.net/Naraddon_main_2nd.mp4"
  // YouTube (임베드는 다른 방식 필요): "https://www.youtube.com/embed/[VIDEO_ID]"

  // 임시 해결책: 로컬 파일 폴백
  const fallbackSrc = '/videos/Naraddon_main_2nd.mp4';

  return (
    <div className="intro-video-section">
      {/* 배경 영상 */}
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoad}
          onPlay={handleVideoPlay}
          onError={(e) => {
            console.error('❌ CDN 영상 로드 실패, 로컬 파일 시도:', e);

            // CDN 실패 시 로컬 파일로 폴백
            const videoElement = e.target;
            if (videoElement.src !== fallbackSrc) {
              console.log('🔄 로컬 파일로 폴백 시도...');
              videoElement.src = fallbackSrc;
            } else {
              console.error('❌ 모든 영상 소스 로드 실패');
              setVideoError(true);

              // 에러 시 대체 콘텐츠 표시
              if (videoElement.parentElement) {
                videoElement.style.display = 'none';
                videoElement.parentElement.style.background =
                  'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
              }
            }
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>

        {/* 초록색 반투명 오버레이 */}
        {showGreenOverlay && <div className="green-overlay"></div>}

        {/* 영상 로드 실패 시 대체 콘텐츠 */}
        {videoError && (
          <div className="video-fallback">
            <h1>나라똔</h1>
            <p>함께 만드는 성공의 길</p>
          </div>
        )}
      </div>

      {/* 자막 - 화면 중앙에 표시 */}
      {currentCaption && (
        <div className={`video-caption ${!isCaptionVisible ? 'fade-out' : ''}`}>
          <div className="main-caption">{currentCaption}</div>
        </div>
      )}

      {/* 시작 버튼 */}
      <div className="start-button-container">
        <button className="start-button" onClick={onStartClick}>
          <span className="button-text">나라똔과 함께하기</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default IntroVideo;
