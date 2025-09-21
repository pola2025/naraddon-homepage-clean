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

  // 영상 소스 설정
  // 옵션 1: 로컬 파일 (현재)
  const videoSrc = '/videos/Naraddon_main_2nd.mp4';

  // 옵션 2: 외부 CDN (필요시 아래 주석 해제)
  // const videoSrc = "https://storage.googleapis.com/your-bucket/Naraddon_main_2nd.mp4";
  // const videoSrc = "https://res.cloudinary.com/your-cloud/video/upload/Naraddon_main_2nd.mp4";

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
            console.error('❌ 영상 로드 실패:', e);
            console.error('영상 경로:', videoSrc);
            setVideoError(true);

            // 에러 시 대체 콘텐츠 표시
            const videoElement = e.target;
            if (videoElement && videoElement.parentElement) {
              videoElement.style.display = 'none';
              // 대체 배경 설정
              videoElement.parentElement.style.background =
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* 브라우저 호환성을 위한 대체 메시지 */}
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
      <div className={`video-caption ${currentCaption && isCaptionVisible ? 'visible' : 'hidden'}`}>
        {currentCaption && <div className="main-caption">{currentCaption}</div>}
      </div>

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

