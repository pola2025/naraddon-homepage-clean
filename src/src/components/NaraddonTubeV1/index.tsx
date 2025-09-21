'use client';

import React, { useState } from 'react';
import './styles.css';

// 썸네일 데이터
const thumbnailData = [
  {
    id: 1,
    title: '정책자금 성공사례 1',
    image: '/api/placeholder/400/300',
    videos: [
      { id: 'v1', title: '기업 성장 스토리', src: '/videos/naraddon_background_low.mp4' },
      { id: 'v2', title: '대표 인터뷰', src: '/videos/Naraddon_main_2nd.mp4' },
    ],
  },
  {
    id: 2,
    title: '정책자금 성공사례 2',
    image: '/api/placeholder/400/300',
    videos: [
      { id: 'v3', title: '사업 확장 과정', src: '/videos/naraddon_background_low.mp4' },
      { id: 'v4', title: '성과 분석', src: '/videos/Naraddon_main_2nd.mp4' },
    ],
  },
  {
    id: 3,
    title: '정책자금 성공사례 3',
    image: '/api/placeholder/400/300',
    videos: [
      { id: 'v5', title: '혁신 제품 개발', src: '/videos/naraddon_background_low.mp4' },
      { id: 'v6', title: '시장 진출기', src: '/videos/Naraddon_main_2nd.mp4' },
    ],
  },
  {
    id: 4,
    title: '정책자금 성공사례 4',
    image: '/api/placeholder/400/300',
    videos: [
      { id: 'v7', title: '디지털 전환', src: '/videos/naraddon_background_low.mp4' },
      { id: 'v8', title: '글로벌 도약', src: '/videos/Naraddon_main_2nd.mp4' },
    ],
  },
];

const NaraddonTubeV1 = () => {
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // 영상 클릭 시 확대 재생
  const handleVideoClick = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideo(videoId);
  };

  // 모달 닫기
  const handleClose = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="naraddon-tube-v1">
      <div className="container">
        <div className="header">
          <h2 className="title">나라똔튜브</h2>
          <p className="subtitle">성공적인 정책자금 활용 사례를 영상으로 만나보세요</p>
        </div>

        {/* 썸네일 그리드 */}
        <div className="thumbnails-grid">
          {thumbnailData.map((item) => {
            const isHovered = hoveredThumb === item.id;

            return (
              <div
                key={item.id}
                className={`thumbnail-item ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredThumb(item.id)}
                onMouseLeave={() => setHoveredThumb(null)}
              >
                <div className="thumbnail-content">
                  <div className="thumbnail-image">
                    <div className="placeholder-4-3">
                      <span className="placeholder-text">썸네일 {item.id}</span>
                      <span className="ratio-label">4:3</span>
                    </div>
                    {!isHovered && (
                      <div className="play-overlay">
                        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="thumbnail-title">{item.title}</h3>
                </div>

                {/* 호버 시 나타나는 영상 목록 */}
                {isHovered && (
                  <div className="hover-videos">
                    <div className="videos-container">
                      {item.videos.map((video) => (
                        <div
                          key={video.id}
                          className="video-card"
                          onClick={(e) => handleVideoClick(video.id, e)}
                        >
                          <div className="video-thumb">
                            <video src={video.src} className="video-preview" muted />
                            <div className="video-overlay">
                              <svg
                                className="play-icon-small"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <p className="video-name">{video.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 영상 재생 모달 */}
        {playingVideo && (
          <>
            <div className="video-modal-backdrop" onClick={handleClose} />
            <div className="video-modal">
              <button className="close-button" onClick={handleClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="video-player-container">
                <video
                  src={
                    thumbnailData.flatMap((t) => t.videos).find((v) => v.id === playingVideo)?.src
                  }
                  controls
                  autoPlay
                  className="video-player"
                />
                <h3 className="playing-video-title">
                  {thumbnailData.flatMap((t) => t.videos).find((v) => v.id === playingVideo)?.title}
                </h3>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NaraddonTubeV1;
