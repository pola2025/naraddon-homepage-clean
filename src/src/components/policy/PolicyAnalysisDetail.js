'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './PolicyAnalysisDetail.css';

const PolicyAnalysisDetail = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Unsplash 이미지 풀
  const unsplashImages = [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80',
  ];

  // 샘플 데이터
  const samplePost = {
    id: postId,
    title: '2024년 중소기업 R&D 지원사업 심층 분석',
    category: '정부정책자금',
    author: '김철수',
    authorTitle: '수석 기업심사관',
    date: '2024.03.15',
    views: 4567,
    likes: 342,
    mainImage: unsplashImages[parseInt(postId) % 4],

    // 구조화된 콘텐츠
    sections: [
      {
        type: 'overview',
        icon: '📌',
        title: '정책 개요',
        content: {
          정책명: '2024년 중소기업 기술혁신개발사업',
          담당부처: '중소벤처기업부',
          신청기간: '2024.03.01 ~ 2024.04.30',
          지원규모: '총 1조 2,000억원 (기업당 최대 5억원)',
        },
      },
      {
        type: 'target',
        icon: '🎯',
        title: '지원 대상',
        content: {
          '대상 기업': [
            '중소기업기본법 제2조에 따른 중소기업',
            '창업 후 3년 이상 경과한 기업',
            '기술혁신형 중소기업 (벤처기업, 이노비즈 등)',
          ],
          '자격 요건': [
            '신청일 현재 사업자등록증 보유',
            '국세 및 지방세 완납',
            '기업부설연구소 또는 연구개발전담부서 보유',
          ],
          '제외 대상': [
            '휴·폐업 중인 기업',
            '정부 지원사업 참여 제한 중인 기업',
            '부채비율 1000% 이상 기업',
          ],
        },
      },
      {
        type: 'support',
        icon: '💰',
        title: '지원 내용',
        content: {
          '지원 금액': '과제당 최대 5억원 (2년간)',
          '지원 비율': '정부출연금 75%, 기업부담금 25% (현금 10%, 현물 15%)',
          '지원 분야': [
            'ICT 융합 (AI, 빅데이터, IoT)',
            '바이오·헬스케어',
            '친환경·에너지',
            '소재·부품·장비',
            '서비스 R&D',
          ],
        },
      },
      {
        type: 'method',
        icon: '📋',
        title: '신청 방법',
        content: {
          '신청 절차': [
            '1단계: 사업계획서 작성 및 온라인 신청',
            '2단계: 서류 평가 (기술성, 사업성)',
            '3단계: 발표 평가 (대면 PT)',
            '4단계: 현장 실태조사',
            '5단계: 최종 선정 및 협약',
          ],
          '필요 서류': [
            '사업계획서 (지정 양식)',
            '재무제표 (최근 3개년)',
            '기술개발 실적 증빙',
            '연구인력 현황표',
            '신용등급 확인서',
          ],
          '신청 채널': 'www.smtech.go.kr (중소기업 기술개발사업 종합관리시스템)',
        },
      },
      {
        type: 'analysis',
        icon: '💡',
        title: '전문가 분석',
        content: {
          '핵심 포인트': [
            '기술성 평가 비중이 60%에서 70%로 상향 조정',
            '사업화 가능성보다 기술 혁신성에 중점',
            '협업 과제 우대 (가점 5점)',
            'ESG 경영 실천 기업 우대',
          ],
          주의사항: [
            '유사 과제 중복 신청 불가',
            '타 부처 R&D 과제와 중복 수행 제한',
            '연구개발비 집행 기준 엄격 적용',
            '성과 미달성 시 환수 조치',
          ],
          '추천 대상': [
            '기술 개발 역량을 보유한 제조업',
            '특허 3건 이상 보유 기업',
            '전년도 R&D 투자 비율 5% 이상 기업',
          ],
        },
      },
    ],

    // 관련 링크
    links: [
      { title: '공식 공고문', url: 'https://www.smtech.go.kr' },
      { title: '신청 시스템', url: 'https://www.smtech.go.kr/apply' },
      { title: 'FAQ 자료', url: 'https://www.smtech.go.kr/faq' },
    ],
  };

  // 관련 게시글 샘플
  const sampleRelatedPosts = [
    {
      id: '101',
      title: '스마트공장 구축 지원사업 신청 가이드',
      category: '제조업특화자금',
      views: 2341,
      thumbnail: unsplashImages[0],
    },
    {
      id: '102',
      title: '청년창업 특별자금 활용 전략',
      category: '정부지원자금',
      views: 1892,
      thumbnail: unsplashImages[1],
    },
    {
      id: '103',
      title: '수출바우처 사업 성과 극대화 방법',
      category: '기타자금',
      views: 1567,
      thumbnail: unsplashImages[2],
    },
  ];

  useEffect(() => {
    // 실제로는 API 호출
    setPost(samplePost);
    setRelatedPosts(sampleRelatedPosts);
  }, [postId]);

  if (!post) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="policy-detail-page">
      {/* 헤더 */}
      <div className="detail-header">
        <div className="header-content">
          <div className="breadcrumb">
            <a href="/">홈</a>
            <i className="fas fa-chevron-right"></i>
            <a href="/policy-analysis">정책분석</a>
            <i className="fas fa-chevron-right"></i>
            <span>{post.category}</span>
          </div>

          <div className="header-info">
            <span className="category-tag">{post.category}</span>
            <h1>{post.title}</h1>

            <div className="meta-info">
              <div className="author-info">
                <i className="fas fa-user-tie"></i>
                <span>
                  {post.author} {post.authorTitle}
                </span>
              </div>
              <div className="post-stats">
                <span>
                  <i className="fas fa-calendar"></i> {post.date}
                </span>
                <span>
                  <i className="fas fa-eye"></i> {post.views.toLocaleString()}
                </span>
                <span>
                  <i className="fas fa-heart"></i> {post.likes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 이미지 */}
      <div className="main-visual">
        <img src={post.mainImage} alt={post.title} />
        <div className="visual-overlay">
          <div className="visual-text">
            <h2>정책 분석 리포트</h2>
            <p>나라똔 기업심사관이 분석한 핵심 내용</p>
          </div>
        </div>
      </div>

      {/* 본문 콘텐츠 */}
      <div className="detail-content">
        <div className="content-wrapper">
          {/* 구조화된 섹션들 */}
          <div className="sections-container">
            {post.sections.map((section, index) => (
              <div key={index} className="content-section">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h2 className="section-title">{section.title}</h2>
                </div>

                <div className="section-body">
                  {Object.entries(section.content).map(([key, value]) => (
                    <div key={key} className="field-group">
                      <div className="field-label">{key}</div>
                      <div className="field-value">
                        {Array.isArray(value) ? (
                          <ul className="value-list">
                            {value.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 관련 링크 */}
          {post.links && (
            <div className="links-section">
              <h3>
                <i className="fas fa-link"></i> 관련 링크
              </h3>
              <div className="links-grid">
                {post.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-item"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* CTA 버튼 */}
          <div className="detail-cta">
            <h3>이 정책에 대해 더 자세한 상담이 필요하신가요?</h3>
            <p>나라똔 기업심사관이 1:1 맞춤 상담을 제공합니다</p>
            <a href="/consultation" className="cta-btn">
              <i className="fas fa-comments"></i>
              무료 상담 신청하기
            </a>
          </div>
        </div>

        {/* 사이드바 */}
        <aside className="detail-sidebar">
          {/* 작성자 정보 */}
          <div className="author-card">
            <h4>작성자</h4>
            <div className="author-profile">
              <div className="author-avatar">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="author-details">
                <strong>{post.author}</strong>
                <span>{post.authorTitle}</span>
              </div>
            </div>
          </div>

          {/* 관련 게시글 */}
          <div className="related-posts">
            <h4>관련 정책분석</h4>
            {relatedPosts.map((related) => (
              <a key={related.id} href={`/policy-analysis/${related.id}`} className="related-item">
                <img src={related.thumbnail} alt={related.title} />
                <div className="related-info">
                  <span className="related-category">{related.category}</span>
                  <h5>{related.title}</h5>
                  <span className="related-views">
                    <i className="fas fa-eye"></i> {related.views.toLocaleString()}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* 정부기관 배너 */}
          <div className="gov-banner">
            <h4>협력 정부기관</h4>
            <div className="gov-logos-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="gov-logo-item">
                  <img src={`/images/${num}.png`} alt={`정부기관 ${num}`} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 목록으로 버튼 */}
      <div className="back-to-list">
        <button onClick={() => router.push('/policy-analysis')} className="back-btn">
          <i className="fas fa-list"></i>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PolicyAnalysisDetail;
