'use client';

import React, { useState } from 'react';
import './NaraddonTubeStrip.css';

// 커스텀 이미지 사용 (기존과 동일)
const thumb1 = '/images/youtube/20250901__image1.jpg';
const thumb2 = '/images/youtube/20250901_image2.jpg';
const thumb3 = '/images/youtube/20250901__image3.jpg';
const thumb4 = '/images/youtube/20250901_image4.jpg';

// 나라똔튜브 띠배너형 데이터 - 지그재그 배치
const stripData = [
  {
    id: 1,
    title: '피해사례 주의보',
    image: thumb1,
    position: 'left', // 이미지 왼쪽
    videos: [
      {
        id: 'v1',
        title: '피해사례 주의보 1',
        youtubeId: 'ieWLah6HzG0',
        thumbnail: 'https://img.youtube.com/vi/ieWLah6HzG0/mqdefault.jpg',
      },
      {
        id: 'v2',
        title: '피해사례 주의보 2',
        youtubeId: 'YLYMd0KUfyA',
        thumbnail: 'https://img.youtube.com/vi/YLYMd0KUfyA/mqdefault.jpg',
      },
    ],
  },
  {
    id: 2,
    title: '반드시 나라똔 이용하셔야 합니다',
    image: thumb2,
    position: 'right', // 이미지 오른쪽
    videos: [
      {
        id: 'v3',
        title: '나라똔 이용 안내 1',
        youtubeId: 'aCuMv1TV6YQ',
        thumbnail: 'https://img.youtube.com/vi/aCuMv1TV6YQ/mqdefault.jpg',
      },
      {
        id: 'v4',
        title: '나라똔 이용 안내 2',
        youtubeId: 'gEyR5cSxHIY',
        thumbnail: 'https://img.youtube.com/vi/gEyR5cSxHIY/mqdefault.jpg',
      },
    ],
  },
  {
    id: 3,
    title: '안심보증 100%',
    image: thumb3,
    position: 'left', // 이미지 왼쪽
    videos: [
      {
        id: 'v5',
        title: '안심보증 사례 1',
        youtubeId: 'Yg-Ww1xCSFA',
        thumbnail: 'https://img.youtube.com/vi/Yg-Ww1xCSFA/mqdefault.jpg',
      },
      {
        id: 'v6',
        title: '안심보증 사례 2',
        youtubeId: 'gId4FD7ESSs',
        thumbnail: 'https://img.youtube.com/vi/gId4FD7ESSs/mqdefault.jpg',
      },
    ],
  },
  {
    id: 4,
    title: '실제 대표님 인터뷰 꼭 보세요',
    image: thumb4,
    position: 'right', // 이미지 오른쪽
    videos: [
      {
        id: 'v7',
        title: '대표님 인터뷰 1',
        youtubeId: 'kiJ4XHJ_aXQ',
        thumbnail: 'https://img.youtube.com/vi/kiJ4XHJ_aXQ/mqdefault.jpg',
      },
      {
        id: 'v8',
        title: '대표님 인터뷰 2',
        youtubeId: 'P60GUAk8RCY',
        thumbnail: 'https://img.youtube.com/vi/P60GUAk8RCY/mqdefault.jpg',
      },
    ],
  },
];

const NaraddonTubeStrip = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredStrip, setHoveredStrip] = useState<number | null>(null);

  // 영상 클릭 시 재생
  const handleVideoClick = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  // 모달 닫기
  const handleClose = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="naraddon-tube-strip-section">
      <div className="strip-container">
        <div className="strip-header">
          <h2 className="strip-title">나라똔튜브 컬렉션</h2>
          <p className="strip-subtitle">핵심 콘텐츠를 한눈에 만나보세요</p>
        </div>

        <div className="strips-wrapper">
          {stripData.map((item) => (
            <div
              key={item.id}
              className={`strip-item ${item.position} ${hoveredStrip === item.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredStrip(item.id)}
              onMouseLeave={() => setHoveredStrip(null)}
            >
              {/* 이미지 섹션 */}
              <div className="strip-image-section">
                <div className="strip-image-wrapper">
                  <img src={item.image} alt={item.title} className="strip-image" />
                  <div className="strip-image-overlay">
                    <h3 className="strip-image-title">{item.title}</h3>
                  </div>
                </div>
              </div>

              {/* 영상 섹션 */}
              <div className="strip-videos-section">
                <div className="strip-videos-grid">
                  {item.videos.map((video) => (
                    <div
                      key={video.id}
                      className="strip-video-item"
                      onClick={() => handleVideoClick(video.youtubeId)}
                    >
                      <div className="strip-video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} className="strip-video-img" />
                        <div className="strip-video-overlay">
                          <svg className="strip-play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="strip-video-title">{video.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube 영상 재생 모달 (기존과 동일) */}
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
      </div>
    </section>
  );
};

export default NaraddonTubeStrip;
