import React, { useEffect, useState } from 'react';
import './IntroVideo.css';

const IntroVideo = ({
  showStartButton,
  currentCaption,
  currentSubCaption,
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
          onLoadedData={() => console.log('영상 로드 성공!')}
          onError={(e) => {
            console.error('영상 로드 실패:', e);
            setVideoError(true);
          }}
          src="/videos/Naraddon_main_2nd.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>

        {/* 초록색 반투명 오버레이 */}
        {showGreenOverlay && <div className="green-overlay"></div>}

        {/* 자막 */}
        {(currentCaption || currentSubCaption) && (
          <div
            className={`video-caption ${!isCaptionVisible ? 'fade-out' : ''} ${currentSubCaption ? 'with-sub' : ''}`}
          >
            {currentCaption && <div className="main-caption">{currentCaption}</div>}
            {currentSubCaption && <div className="sub-caption">{currentSubCaption}</div>}
          </div>
        )}
      </div>

      {/* 시작 버튼 */}
      <div
        className="start-button-container"
        style={{
          zIndex: showGreenOverlay ? 3 : 100,
        }}
      >
        <button className="start-button" onClick={onStartClick}>
          <span className="button-text">나라똔과 함께하기</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default IntroVideo;
