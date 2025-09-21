// 백업: 신규정책소식 롤링 배너 컴포넌트
// 백업 날짜: 2024-08-24
// 원본 파일: Home.js

import React from 'react';

const RollingBanner = ({ heroVisible }) => {
  return (
    <section className={`new-hero-section ${heroVisible ? 'visible' : ''}`}>
      {/* 장식 요소 */}
      <div className="decoration-1"></div>
      <div className="decoration-2"></div>

      <div className="hero-container">
        {/* 왼쪽: 메인 콘텐츠 + CTA */}
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              대한민국 500만 사장님의 성공!
              <br />
              <span className="highlight">가장 믿음직한 동행, 나라똔이 함께합니다.</span>
            </h1>
          </div>

          {/* CTA 버튼 */}
          <div className="cta-wrapper">
            <a href="/consultation" className="cta-button cta-primary">
              <i className="fas fa-comments"></i>
              <span>무료상담신청</span>
            </a>
            <a href="/certified-inspectors" className="cta-button cta-secondary">
              <i className="fas fa-search"></i>
              <span>전문가찾기</span>
            </a>
          </div>
        </div>

        {/* 오른쪽: 이미지 슬라이더 */}
        <div className="image-wrapper">
          <div className="image-slider" id="heroImageSlider">
            <div className="slide-container">
              {/* 첫 번째 슬라이드 */}
              <div className="slide active">
                <img src={`/images/display1.png`} alt="정책자금 플랫폼 서비스" />
              </div>

              {/* 두 번째 슬라이드 */}
              <div className="slide">
                <img src={`/images/display2.png`} alt="전문가 컨설팅 서비스" />
              </div>
            </div>

            {/* 플로팅 배지 */}
            <div className="floating-badge">신규정책소식</div>

            {/* 확대 아이콘 */}
            <div className="zoom-icon">
              <i className="fas fa-search-plus"></i>
            </div>

            {/* 슬라이드 화살표 */}
            <div className="slide-arrow prev">
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className="slide-arrow next">
              <i className="fas fa-chevron-right"></i>
            </div>

            {/* 슬라이드 인디케이터 */}
            <div className="slide-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RollingBanner;

// JavaScript 코드 백업 (useEffect 내부)
/*
// 슬라이드 관련 변수
var currentSlide = 0;
var slides = document.querySelectorAll('.new-hero-section .slide');
var indicators = document.querySelectorAll('.new-hero-section .indicator');
var imageSlider = document.querySelector('.new-hero-section .image-slider');
var modal = document.getElementById('imageModal');
var modalImg = document.getElementById('modalImage');
var modalClose = document.querySelector('.modal-close');

// 슬라이드 변경 함수
function changeSlide(index) {
  slides.forEach(function(slide, i) {
    slide.classList.toggle('active', i === index);
  });
  indicators.forEach(function(indicator, i) {
    indicator.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

// 자동 슬라이드
setInterval(function() {
  var nextSlide = (currentSlide + 1) % slides.length;
  changeSlide(nextSlide);
}, 5000);

// 인디케이터 클릭
indicators.forEach(function(indicator, index) {
  indicator.addEventListener('click', function() {
    changeSlide(index);
  });
});

// 이미지 슬라이더 클릭 시 모달 열기
if (imageSlider) {
  imageSlider.addEventListener('click', function(e) {
    if (!e.target.closest('.slide-arrow') && !e.target.closest('.indicator')) {
      modal.classList.add('show');
      modalImg.src = images[currentSlide];
      modalArrowPrev.style.display = images.length > 1 ? 'flex' : 'none';
      modalArrowNext.style.display = images.length > 1 ? 'flex' : 'none';
    }
  });
}

// 슬라이드 화살표
var slideArrows = document.querySelectorAll('.new-hero-section .slide-arrow');
slideArrows.forEach(function(arrow) {
  arrow.addEventListener('click', function(e) {
    e.stopPropagation();
    if (arrow.classList.contains('prev')) {
      var prevSlide = (currentSlide - 1 + slides.length) % slides.length;
      changeSlide(prevSlide);
    } else {
      var nextSlide = (currentSlide + 1) % slides.length;
      changeSlide(nextSlide);
    }
  });
});
*/
