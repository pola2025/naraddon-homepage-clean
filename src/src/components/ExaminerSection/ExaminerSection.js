import React, { useState } from 'react';
import './ExaminerSection.css';

function ExaminerSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  // 인터뷰 영상 데이터
  const interviewVideos = [
    {
      id: 1,
      title: '정책자금 성공 비결',
      examinerName: '김성진 심사관',
      company: '한국정책금융공사',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: '/images/interview-thumb-1.jpg',
    },
    {
      id: 2,
      title: '기업인증 완벽 가이드',
      examinerName: '이미경 심사관',
      company: '중소벤처기업부',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: '/images/interview-thumb-2.jpg',
    },
    {
      id: 3,
      title: 'R&D 지원사업 핵심전략',
      examinerName: '박준호 심사관',
      company: '한국산업기술진흥원',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: '/images/interview-thumb-3.jpg',
    },
  ];

  return (
    <section className="examiner-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">나라똔 인증 기업심사관</h2>
          <p className="section-subtitle">검증된 전문가가 여러분의 성공을 도와드립니다</p>
        </div>

        <div className="video-showcase">
          <div className="current-video">
            <h3>{interviewVideos[currentVideo].title}</h3>
            <p>{interviewVideos[currentVideo].examinerName}</p>
            <p>{interviewVideos[currentVideo].company}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExaminerSection;
