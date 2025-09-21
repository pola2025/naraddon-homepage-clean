import React, { useEffect, useState } from 'react';
import './Home.css';

function HeroPreview() {
  const [liveCount, setLiveCount] = useState(23);

  // 대한민국 도시 목록
  const cities = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '수원',
    '성남',
    '고양',
    '용인',
    '부천',
    '안산',
    '안양',
    '남양주',
    '화성',
    '평택',
    '의정부',
    '시흥',
    '파주',
    '김포',
    '광명',
    '광주',
    '군포',
    '하남',
    '오산',
    '양주',
    '이천',
    '구리',
    '안성',
    '포천',
    '의왕',
    '양평',
    '여주',
    '동두천',
    '과천',
    '가평',
    '연천',
    '춘천',
    '원주',
    '강릉',
    '동해',
    '태백',
    '속초',
    '삼척',
    '청주',
    '충주',
    '제천',
    '천안',
    '공주',
    '보령',
    '아산',
    '서산',
    '논산',
    '계룡',
    '당진',
    '전주',
    '군산',
    '익산',
    '정읍',
    '남원',
    '김제',
    '목포',
    '여수',
    '순천',
    '나주',
    '광양',
    '포항',
    '경주',
    '김천',
    '안동',
    '구미',
    '영주',
    '영천',
    '상주',
    '문경',
    '경산',
    '창원',
    '진주',
    '통영',
    '사천',
    '김해',
    '밀양',
    '거제',
    '양산',
    '제주',
    '서귀포',
  ];

  // 회사명/대표자명 생성 함수
  const generateCompanyName = () => {
    const prefixes = [
      '김',
      '이',
      '박',
      '최',
      '정',
      '강',
      '조',
      '윤',
      '장',
      '임',
      '한',
      '오',
      '서',
      '신',
      '권',
      '황',
      '안',
      '송',
      '전',
      '홍',
    ];
    const suffixes = [
      '기업',
      '산업',
      '테크',
      '컴퍼니',
      '코퍼레이션',
      '그룹',
      '인더스트리',
      '솔루션',
      '시스템',
      '네트웍스',
      '파트너스',
      '벤처스',
      '이노베이션',
      '엔터프라이즈',
      '홀딩스',
    ];
    const types = ['(주)', '㈜', ''];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];

    // 다양한 형태로 생성
    const patterns = [
      `${randomPrefix}○○${randomSuffix}`,
      `○○${randomPrefix}${randomSuffix}`,
      `${randomPrefix}○${randomSuffix}`,
      `${randomType}${randomPrefix}○○`,
      `${randomPrefix}○○${randomType}`,
      `○○${randomSuffix}${randomType}`,
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // 대표자명 생성 함수
  const generateCEOName = () => {
    const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
    const titles = ['대표', '대표님', '사장님', '대표이사', '회장님'];

    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    return `${randomLastName}○○${randomTitle}`;
  };

  // 알림 메시지 생성 함수
  const generateNotification = () => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const messageTypes = [
      `${city}시 ${generateCompanyName()}이 매칭을 시작했습니다`,
      `${city}시 ${generateCEOName()}이 정책자금을 확보했습니다`,
      `${city}시 ${generateCompanyName()}가 전문가 상담을 예약했습니다`,
      `${city}시 ${generateCompanyName()}이 성공적으로 매칭되었습니다`,
      `${city}시 ${generateCEOName()}이 서류 심사를 통과했습니다`,
      `${city}시 ${generateCompanyName()}에서 추가 상담을 신청했습니다`,
      `${city}시 ${generateCEOName()}이 정책자금 지원을 받았습니다`,
    ];

    return messageTypes[Math.floor(Math.random() * messageTypes.length)];
  };

  useEffect(() => {
    const video = document.querySelector('.hero-video');
    if (video) {
      // 비디오 로드 완료 시 클래스 추가
      video.addEventListener('loadeddata', () => {
        video.classList.add('loaded');
      });

      // 비디오 끝나면 다시 재생
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
    }

    // 숫자 카운팅 애니메이션
    const animateNumbers = () => {
      const numbers = document.querySelectorAll('.indicator-number');
      numbers.forEach((num) => {
        const target = parseFloat(num.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateNumber = () => {
          if (current < target) {
            current += increment;
            if (num.getAttribute('data-target') === '4.8') {
              num.textContent = current.toFixed(1);
            } else {
              num.textContent = Math.floor(current).toLocaleString();
            }
            requestAnimationFrame(updateNumber);
          } else {
            if (num.getAttribute('data-target') === '4.8') {
              num.textContent = target.toFixed(1);
            } else {
              num.textContent = Math.floor(target).toLocaleString();
            }
          }
        };
        updateNumber();
      });
    };

    // 스크롤 시 숫자 애니메이션 트리거
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumbers();
          observer.unobserve(entry.target);
        }
      });
    });

    const indicators = document.querySelector('.trust-indicators');
    if (indicators) {
      observer.observe(indicators);
    }

    // 실시간 알림 표시
    const showNotification = () => {
      const toast = document.getElementById('toast');
      const message = toast.querySelector('.toast-message');

      message.textContent = generateNotification();
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    };

    // 5초 후 첫 알림, 그 후 10초마다
    setTimeout(() => {
      showNotification();
      setInterval(showNotification, 10000);
    }, 5000);

    // 실시간 상담 대기 수 변경
    const updateLiveCount = () => {
      setLiveCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 ~ +2
        const newCount = prev + change;
        return Math.max(15, Math.min(35, newCount)); // 15~35 범위
      });
    };

    setInterval(updateLiveCount, 5000);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        {/* 배경 비디오 */}
        <video className="hero-video" autoPlay muted loop playsInline preload="auto">
          {/* 원본 파일 사용 */}
          <source src={`/videos/Naraddon_main_2nd.mp4`} type="video/mp4" />
          {/* 대체 비디오 */}
          <source
            src="https://res.cloudinary.com/demo/video/upload/v1312461204/sample_video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* 검정색 반투명 오버레이 */}
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-title-wrapper">
              <h1 className="hero-title">국내 유일, 100% 보증 플랫폼</h1>
              <div className="hero-subtitle-badge">
                <h2 className="hero-subtitle">나라똔 인증 기업심사관</h2>
              </div>
            </div>
            <p className="hero-description">
              플랫폼이 직접 보증하는 검증된 전문가와
              <br />
              정책자금의 성공 가능성을 높이세요
            </p>

            {/* 검색바 추가 */}
            <div className="hero-search">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="어떤 정책자금을 찾으시나요? (지역, 업종, 지원금액으로 검색)"
                  className="search-input"
                />
                <button className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary">
                지금 전문가 찾기
                <span className="cta-urgent">오늘 신청 시 우선 심사</span>
              </button>
              <button className="btn-secondary">
                플랫폼 둘러보기
                <span className="cta-live">현재 {liveCount}명 상담 대기 중</span>
              </button>
            </div>

            {/* 신뢰 지표 */}
            <div className="trust-indicators">
              <div className="indicator-item">
                <span className="indicator-number" data-target="12847">
                  0
                </span>
                <span className="indicator-label">누적 매칭 건수</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-number" data-target="347">
                  0
                </span>
                <span className="indicator-label">활동 전문가</span>
              </div>
              <div className="indicator-item">
                <span className="indicator-number" data-target="4.8">
                  0
                </span>
                <span className="indicator-label">평균 만족도</span>
              </div>
            </div>
          </div>
        </div>
        {/* 스크롤 화살표 */}
        <div
          className="scroll-indicator"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          ⌄
        </div>
      </section>

      {/* 실시간 알림 토스트 */}
      <div className="notification-toast" id="toast">
        <div className="toast-content">
          <span className="toast-icon">🔔</span>
          <span className="toast-message"></span>
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <div className="floating-actions">
        <button className="fab-button chat-button">
          <span className="fab-icon">💬</span>
          <span className="fab-label">실시간 상담</span>
        </button>
        <button className="fab-button phone-button">
          <span className="fab-icon">📞</span>
          <span className="fab-label">1588-0000</span>
        </button>
      </div>
    </>
  );
}

export default HeroPreview;
