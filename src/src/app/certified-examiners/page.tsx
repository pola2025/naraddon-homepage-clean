'use client';

import React, { useState } from 'react';
import './page.css';

export default function CertifiedExaminersPage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 전문영역 카테고리
  const categories = [
    { id: 'all', name: '전체', count: 152 },
    { id: 'funding', name: '정책자금', count: 45 },
    { id: 'manufacturing', name: '제조업특화', count: 38 },
    { id: 'certification', name: '기업인증', count: 32 },
    { id: 'export', name: '수출지원', count: 21 },
    { id: 'startup', name: '창업지원', count: 16 },
  ];

  // 임의의 회사명 배열 (대기업 이름 제외)
  const companyNames = [
    '한국기업지원센터',
    '글로벌비즈파트너스',
    '스마트경영파트너스',
    'K-비즈니스센터',
    '미래기업컨설팅',
    '원스톱비즈파트너',
    '프리미엄경영지원센터',
    '비즈니스플러스',
    '기업성장파트너스',
    '성공기업지원센터',
    '리더스컨설팅그룹',
    '비전경영파트너스',
    '탑비즈니스센터',
    '엑스퍼트컨설팅',
  ];

  // 인터뷰 영상 데이터 - YouTube 링크 연결
  const interviewVideos = [
    {
      id: 1,
      title: '정책자금 승인의 핵심 포인트',
      examinerName: '김성진',
      position: '정책자금 전문가',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[0],
      videoUrl: 'https://youtu.be/P60GUAk8RCY?si=ySVc0MQIFzEUZGWc',
      embedUrl: 'https://www.youtube.com/embed/P60GUAk8RCY',
      thumbnail: '/assets/images/people/people (1).jpg',
      duration: '12:35',
      views: '15,234회',
      description: '정책자금 전문가가 알려주는 승인 비결',
    },
    {
      id: 2,
      title: '벤처기업 인증, 이것만 알면 된다',
      examinerName: '이미경',
      position: '기업인증 전문가',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[1],
      videoUrl: 'https://youtu.be/zsJtl_-_LhM?si=T4hFGnPFnCTt0_7H',
      embedUrl: 'https://www.youtube.com/embed/zsJtl_-_LhM',
      thumbnail: '/assets/images/people/people (2).jpg',
      duration: '18:42',
      views: '23,567회',
      description: '벤처기업 인증의 모든 것을 한 번에 정리',
    },
    {
      id: 3,
      title: '제조업 지원사업의 모든 것',
      examinerName: '박준호',
      position: '제조업 컨설턴트',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[2],
      videoUrl: 'https://youtu.be/qfjTLCMdUPE?si=fqrovZbqCqQL5OXI',
      embedUrl: 'https://www.youtube.com/embed/qfjTLCMdUPE',
      thumbnail: '/assets/images/people/people (3).jpg',
      duration: '15:28',
      views: '19,832회',
      description: '제조업 전문가가 직접 밝히는 지원 전략',
    },
    {
      id: 4,
      title: '수출 지원사업 완벽 가이드',
      examinerName: '최지훈',
      position: '수출지원 전문가',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[3],
      videoUrl: 'https://youtu.be/ohVmBFj2mk0?si=gWi5NR7zGF8YL7M5',
      embedUrl: 'https://www.youtube.com/embed/ohVmBFj2mk0',
      thumbnail: '/assets/images/people/people (4).jpg',
      duration: '20:15',
      views: '12,456회',
      description: '해외 진출을 위한 정부 지원 프로그램 총정리',
    },
  ];

  // 전문영역 라벨
  const expertiseLabels = [
    '정책자금',
    '제조업특화',
    '기업인증',
    '수출지원',
    '창업지원',
    '기술사업화',
    '벤처투자',
    '정부과제',
    '세제혜택',
    '고용지원',
    '시설자금',
    '운전자금',
    '기술평가',
    '신용보증',
    '특허전략',
  ];

  // 랜덤 전문영역 선택 함수
  function getRandomExpertise(count) {
    const shuffled = [...expertiseLabels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 브랜드 아이콘 배열
  const brandIcons = [
    'fas fa-building',
    'fas fa-briefcase',
    'fas fa-chart-line',
    'fas fa-lightbulb',
    'fas fa-rocket',
    'fas fa-shield-alt',
    'fas fa-award',
  ];

  // 기업심사관 프로필 데이터
  const examinerProfiles = [
    {
      id: 1,
      name: '김성진',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[0],
      brandIcon: brandIcons[0],
      position: '정책자금 전문가',
      successRate: '92%',
      consultCount: '1,234',
      image: '/assets/images/people/people (5).jpg',
      expertise: getRandomExpertise(5),
      category: 'funding',
      rating: 4.9,
      description: '중소기업 정책자금 전문가',
    },
    {
      id: 2,
      name: '이미경',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[1],
      brandIcon: brandIcons[1],
      position: '기업인증 전문가',
      successRate: '89%',
      consultCount: '987',
      image: '/assets/images/people/people (6).jpg',
      expertise: getRandomExpertise(5),
      category: 'certification',
      rating: 4.8,
      description: '벤처기업 인증 전문가',
    },
    {
      id: 3,
      name: '박준호',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[2],
      brandIcon: brandIcons[2],
      position: '제조업 컨설턴트',
      successRate: '94%',
      consultCount: '856',
      image: '/assets/images/people/people (7).jpg',
      expertise: getRandomExpertise(5),
      category: 'manufacturing',
      rating: 4.9,
      description: '제조업 지원사업 전문가',
    },
    {
      id: 4,
      name: '정수연',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[4],
      brandIcon: brandIcons[3],
      position: '금융컨설턴트',
      successRate: '91%',
      consultCount: '723',
      image: '/assets/images/people/people (8).jpg',
      expertise: getRandomExpertise(5),
      category: 'funding',
      rating: 4.7,
      description: '신용보증 및 금융지원 전문가',
    },
    {
      id: 5,
      name: '최재훈',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[5],
      brandIcon: brandIcons[4],
      position: '기술금융 전문가',
      successRate: '88%',
      consultCount: '1,102',
      image: '/assets/images/people/people (9).jpg',
      expertise: getRandomExpertise(5),
      category: 'funding',
      rating: 4.8,
      description: '기술금융 평가 전문가',
    },
    {
      id: 6,
      name: '한지원',
      company: '나라똔 인증 기업심사관',
      companyName: companyNames[6],
      brandIcon: brandIcons[5],
      position: '수출지원 전문가',
      successRate: '90%',
      consultCount: '645',
      image: '/assets/images/people/people (10).jpg',
      expertise: getRandomExpertise(5),
      category: 'export',
      rating: 4.9,
      description: '수출지원사업 전문가',
    },
  ];

  // 필터링된 프로필
  const filteredProfiles =
    selectedCategory === 'all'
      ? examinerProfiles
      : examinerProfiles.filter((profile) => profile.category === selectedCategory);

  // 비디오 네비게이션
  const handlePrevVideo = () => {
    setCurrentVideo((prev) => (prev === 0 ? interviewVideos.length - 1 : prev - 1));
  };

  const handleNextVideo = () => {
    setCurrentVideo((prev) => (prev === interviewVideos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="certified-examiners-page">
      {/* 히어로 섹션 - 가로 배너 */}
      <section className="examiner-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            나라똔 인증 기업심사관
            <span className="highlight">정부정책을 가장 잘 이해하는 전문가와 함께</span>
          </h1>
          <p className="hero-description">
            나라똔에서는 인증 기업심사관과 업무 진행시 문제 발생하면{' '}
            <strong style={{ color: '#FFD700' }}>100% 보증</strong>해드립니다
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">152</span>
              <span className="stat-label">인증 심사관</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">92%</span>
              <span className="stat-label">평균 승인율</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">나라똔 보증</span>
            </div>
          </div>
        </div>
      </section>

      {/* 인터뷰 영상 섹션 */}
      <section className="interview-section">
        <div className="container">
          <h2 className="section-title">나라똔 인증기업심사관이 이야기하는 정책자금 장점</h2>
          <p className="section-subtitle">전문가가 직접 전하는 성공 노하우</p>

          <div className="video-slider">
            <button className="slider-arrow prev" onClick={handlePrevVideo}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="video-main">
              <div
                className="video-player"
                onClick={() => window.open(interviewVideos[currentVideo].videoUrl, '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={interviewVideos[currentVideo].thumbnail}
                  alt={interviewVideos[currentVideo].title}
                />
                <div className="play-overlay">
                  <i className="fas fa-play-circle"></i>
                </div>
              </div>

              <div className="video-info">
                <div className="video-details">
                  <div className="video-profile-inline">
                    <img
                      src={interviewVideos[currentVideo].thumbnail}
                      alt={interviewVideos[currentVideo].examinerName}
                    />
                    <div className="profile-info">
                      <p className="company-name">{interviewVideos[currentVideo].companyName}</p>
                      <h4 className="examiner-name">
                        {interviewVideos[currentVideo].examinerName}
                      </h4>
                    </div>
                  </div>
                  <h3>{interviewVideos[currentVideo].title}</h3>
                  <p className="video-description">{interviewVideos[currentVideo].description}</p>
                  <div className="video-meta">
                    <span className="position">{interviewVideos[currentVideo].position}</span>
                    <span className="company">{interviewVideos[currentVideo].company}</span>
                  </div>
                  <div className="video-stats">
                    <span>
                      <i className="far fa-clock"></i> {interviewVideos[currentVideo].duration}
                    </span>
                    <span>
                      <i className="far fa-eye"></i> {interviewVideos[currentVideo].views}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button className="slider-arrow next" onClick={handleNextVideo}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* 비디오 썸네일 리스트 */}
          <div className="video-thumbnails">
            {interviewVideos.map((video, index) => (
              <div
                key={video.id}
                className={`thumbnail-item ${index === currentVideo ? 'active' : ''}`}
                onClick={() => {
                  setCurrentVideo(index);
                  window.open(video.videoUrl, '_blank');
                }}
                style={{ cursor: 'pointer' }}
              >
                <img src={video.thumbnail} alt={video.title} />
                <div className="thumbnail-info">
                  <span className="duration">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 심사관 프로필 섹션 */}
      <section className="profiles-section">
        <div className="container">
          <h2 className="section-title">나라똔 인증 기업심사관</h2>
          <p className="section-subtitle">
            각 분야 최고의 전문가를 만나보세요
            <br />
            <strong style={{ color: '#667eea', fontSize: '18px' }}>
              나라똔에서 100% 보증하는 인증 기업심사관
            </strong>
          </p>

          {/* 카테고리 필터 */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <span className="count">{category.count}</span>
              </button>
            ))}
          </div>

          {/* 프로필 그리드 */}
          <div className="profiles-grid">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <div className="profile-image">
                  <img src={profile.image} alt={profile.name} />
                  <div className="success-badge">나라똔 보증</div>
                </div>

                <div className="profile-content">
                  <div className="profile-header">
                    <h3>{profile.name}</h3>
                    <div className="brand-logo">
                      <i className={profile.brandIcon || 'fas fa-building'}></i>
                      <span>{profile.companyName}</span>
                    </div>
                  </div>
                  <p className="company">{profile.company}</p>
                  <p className="position">{profile.position}</p>

                  <div className="expertise-tags">
                    {profile.expertise.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="description">{profile.description}</p>

                  <div className="profile-stats">
                    <div className="stat">
                      <i className="fas fa-star"></i>
                      <span>{profile.rating}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-chart-line"></i>
                      <span>승인율 {profile.successRate}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-briefcase"></i>
                      <span>{profile.consultCount}건</span>
                    </div>
                  </div>

                  <button className="consult-btn">
                    <i className="fas fa-comment"></i>
                    상담 신청
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="load-more-btn">
            더 많은 심사관 보기
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </section>
    </div>
  );
}
