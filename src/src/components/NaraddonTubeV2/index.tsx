'use client';

import React, { useState } from 'react';
import './styles.css';

// 띠배너 데이터
const bannerData = [
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

const NaraddonTubeV2 = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [expandedBanner, setExpandedBanner] = useState<number | null>(null);

  const handleVideoClick = (videoId: string, bannerId: number) => {
    if (playingVideo === videoId) {
      setPlayingVideo(null);
      setExpandedBanner(null);
    } else {
      setPlayingVideo(videoId);
      setExpandedBanner(bannerId);
    }
  };

  const handleBannerClick = (bannerId: number) => {
    if (expandedBanner === bannerId) {
      setExpandedBanner(null);
      setPlayingVideo(null);
    } else {
      setExpandedBanner(bannerId);
      setPlayingVideo(null);
    }
  };

  return (
    <section className="naraddon-tube-v2">
      <div className="container">
        <div className="header">
          <h2 className="title">나라똔튜브 - 버전 2</h2>
          <p className="subtitle">띠배너형 - 가로로 긴 배너에 이미지와 영상이 함께 배치됩니다</p>
        </div>

        {/* 띠배너 리스트 */}
        <div className="banners-list">
          {bannerData.map((banner, index) => {
            const isReversed = index % 2 === 1;
            const isExpanded = expandedBanner === banner.id;

            return (
              <div
                key={banner.id}
                className={`banner-item ${isReversed ? 'reversed' : ''} ${isExpanded ? 'expanded' : ''}`}
              >
                {/* 이미지 섹션 */}
                <div className="banner-image-section" onClick={() => handleBannerClick(banner.id)}>
                  <div className="banner-image">
                    <div className="placeholder-4-3">
                      <span className="placeholder-text">이미지 {banner.id}</span>
                      <span className="ratio-label">4:3</span>
                    </div>
                    <div className="image-overlay">
                      <h3 className="banner-title">{banner.title}</h3>
                    </div>
                  </div>
                </div>

                {/* 비디오 섹션 */}
                <div className="banner-videos-section">
                  {banner.videos.map((video) => {
                    const isPlaying = playingVideo === video.id;

                    return (
                      <div
                        key={video.id}
                        className={`video-item ${isPlaying ? 'playing' : ''}`}
                        onClick={() => handleVideoClick(video.id, banner.id)}
                      >
                        {isPlaying ? (
                          <div className="video-player-wrapper">
                            <video src={video.src} controls autoPlay className="video-player" />
                          </div>
                        ) : (
                          <div className="video-thumbnail">
                            <video src={video.src} className="video-preview" muted />
                            <div className="video-overlay">
                              <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              <div className="video-info">
                                <p className="video-title">{video.title}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NaraddonTubeV2;
