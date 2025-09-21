'use client';

import React, { useState } from 'react';
import './NaraddonTube.css';

// 커스텀 이미지 사용
const thumb1 = '/images/youtube/20250901__image1.jpg';
const thumb2 = '/images/youtube/20250901_image2.jpg';
const thumb3 = '/images/youtube/20250901__image3.jpg';
const thumb4 = '/images/youtube/20250901_image4.jpg';

// 나라똔튜브 실제 데이터 - YouTube 영상 연동
const thumbnailData = [
  {
    id: 1,
    title: '피해사례 주의보',
    image: thumb1,
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

const NaraddonTube = () => {
  const [expandedThumb, setExpandedThumb] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // 썸네일 클릭 시 확장/축소 토글
  const handleThumbnailClick = (id: number) => {
    if (isTransitioning) return;
    setExpandedThumb(expandedThumb === id ? null : id);
  };

  // 호버 시 부드러운 전환
  const handleMouseEnter = (id: number) => {
    // 기존 타임아웃 클리어
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    // 이미 다른 것이 확장되어 있으면 전환 애니메이션
    if (expandedThumb && expandedThumb !== id) {
      setIsTransitioning(true);
      setExpandedThumb(null);

      // 짧은 딜레이 후 새로운 것 확장
      const timeout = setTimeout(() => {
        setExpandedThumb(id);
        setIsTransitioning(false);
      }, 300);
      setHoverTimeout(timeout);
    } else if (!expandedThumb) {
      // 아무것도 확장되어 있지 않으면 바로 확장
      setExpandedThumb(id);
    }
  };

  // 마우스가 나갈 때 - 영역 감지 개선
  const handleMouseLeave = (e: React.MouseEvent, id: number) => {
    // 마우스가 카드 영역 내에 있으면 유지
    const card = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    // relatedTarget이 null이거나 Node가 아닌 경우 처리
    if (relatedTarget && card && card.contains && relatedTarget instanceof Node) {
      if (card.contains(relatedTarget)) {
        return; // 같은 카드 내에서 이동하면 유지
      }
    }

    // 기존 타임아웃 클리어
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    // 약간의 딜레이를 주어 실수로 벗어났을 때 바로 닫히지 않도록
    const timeout = setTimeout(() => {
      if (expandedThumb === id) {
        setExpandedThumb(null);
      }
    }, 300); // 딜레이 증가
    setHoverTimeout(timeout);
  };

  // 영상 클릭 시 확대 재생
  const handleVideoClick = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideo(videoId);
  };

  // 모달 닫기
  const handleClose = () => {
    setPlayingVideo(null);
  };

  // 컴포넌트 언마운트 시 타임아웃 클리어
  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <section className="naraddon-tube-section">
      <div className="naraddon-tube-container">
        <div className="section-header">
          <h2 className="section-title">나라똔튜브</h2>
        </div>
        <p className="section-subtitle">성공적인 정책자금 활용 사례를 영상으로 만나보세요</p>

        {/* YouTube 스타일 가로 4개 배열 레이아웃 */}
        <div className="youtube-style-grid">
          {thumbnailData.map((item) => {
            const isExpanded = expandedThumb === item.id;

            return (
              <div
                key={item.id}
                className={`youtube-card ${isExpanded ? 'expanded' : ''}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={(e) => handleMouseLeave(e, item.id)}
              >
                {/* 썸네일 이미지 섹션 - 항상 표시 */}
                <div className="thumbnail-section" onClick={() => handleThumbnailClick(item.id)}>
                  <div className="thumbnail-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="thumbnail-image"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg';
                      }}
                    />
                    {/* YouTube 마크 제거 - 이미지만 표시 */}
                  </div>
                  <div className="thumbnail-info">
                    <h3 className="thumbnail-title" style={isExpanded ? { color: 'white' } : {}}>
                      {item.title}
                    </h3>
                    <p className="video-count" style={isExpanded ? { color: '#00ffff' } : {}}>
                      {item.videos.length}개 영상
                    </p>
                  </div>
                </div>

                {/* 확장 시 하단에 나타나는 영상 목록 */}
                {isExpanded && (
                  <div className="expanded-videos">
                    <div className="videos-grid">
                      {item.videos.map((video) => (
                        <div
                          key={video.id}
                          className="video-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoClick(video.youtubeId || video.id, e);
                          }}
                        >
                          <div className="video-thumbnail">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="video-thumb-img"
                            />
                            <div className="video-hover-overlay">
                              <svg className="play-icon-small" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" fill="white" />
                              </svg>
                              <span className="watch-now" style={{ color: 'white' }}>
                                시청하기
                              </span>
                            </div>
                          </div>
                          <p className="video-title" style={{ color: 'white' }}>
                            {video.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* YouTube 영상 재생 모달 */}
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

export default NaraddonTube;
