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

  return (
    <div className="intro-video-section">
      {/* 배경 영상 */}
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => {
            console.error('영상 로드 실패:', e);
            setVideoError(true);
          }}
        >
          <source src="/videos/Naraddon_main_2nd.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>

        {/* 초록색 반투명 오버레이 */}
        {showGreenOverlay && <div className="green-overlay"></div>}
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

