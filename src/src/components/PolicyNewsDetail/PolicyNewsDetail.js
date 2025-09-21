'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './PolicyNewsDetail.css';

const PolicyNewsDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [newsData, setNewsData] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 샘플 데이터 (실제로는 API에서 가져와야 함)
  const sampleNewsData = {
    id: 1,
    title: '2025년 중소기업 정책자금 지원사업 대폭 확대',
    category: '지원사업',
    date: '2025.01.08',
    views: 15234,
    likes: 523,
    comments: 87,
    tags: ['정책자금', '중소기업', '2025년', '디지털전환', '친환경'],
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80',
    excerpt:
      '정부가 2025년 중소기업 정책자금 지원 규모를 전년 대비 30% 확대하기로 결정했습니다. 특히 디지털 전환과 친환경 분야에 대한 지원이 크게 늘어날 예정입니다.',
    content: `
      <h2>2025년 중소기업 정책자금 대규모 확대</h2>
      
      <p>정부는 2025년 중소기업 정책자금 지원 규모를 전년 대비 30% 확대하기로 결정했다고 발표했습니다. 
      이번 결정은 경제 활성화와 중소기업의 경쟁력 강화를 위한 정부의 강력한 의지를 보여주는 것으로 평가됩니다.</p>
      
      <h3>주요 지원 분야</h3>
      
      <p><strong>1. 디지털 전환 지원 (40% 증액)</strong><br>
      중소기업의 디지털 전환을 가속화하기 위해 스마트공장 구축, AI·빅데이터 도입, 
      클라우드 전환 등에 대한 지원이 대폭 확대됩니다. 특히 제조업 분야의 스마트공장 구축에는 
      최대 2억원까지 지원이 가능해집니다.</p>
      
      <p><strong>2. 친환경 전환 지원 (35% 증액)</strong><br>
      탄소중립 실현을 위한 친환경 설비 도입, 에너지 효율화, ESG 경영 도입 등에 대한 
      지원이 강화됩니다. 친환경 인증을 받은 기업에게는 추가 인센티브가 제공됩니다.</p>
      
      <p><strong>3. 수출 및 해외진출 지원 (25% 증액)</strong><br>
      글로벌 시장 진출을 희망하는 중소기업을 위한 수출바우처, 해외 마케팅 지원, 
      현지화 컨설팅 등의 프로그램이 확대됩니다.</p>
      
      <h3>신청 자격 및 조건</h3>
      
      <ul>
        <li>중소기업기본법상 중소기업에 해당하는 기업</li>
        <li>신용등급 B등급 이상</li>
        <li>최근 3년간 국세 및 지방세 체납 사실이 없는 기업</li>
        <li>고용보험 및 산재보험 가입 기업</li>
      </ul>
      
      <h3>지원 규모 및 조건</h3>
      
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>지원 한도</th>
            <th>금리</th>
            <th>상환 기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>시설자금</td>
            <td>최대 100억원</td>
            <td>연 2.0~3.5%</td>
            <td>10년 이내(거치 3년)</td>
          </tr>
          <tr>
            <td>운전자금</td>
            <td>최대 10억원</td>
            <td>연 2.5~4.0%</td>
            <td>5년 이내(거치 1년)</td>
          </tr>
          <tr>
            <td>R&D자금</td>
            <td>최대 20억원</td>
            <td>연 1.5~3.0%</td>
            <td>7년 이내(거치 2년)</td>
          </tr>
        </tbody>
      </table>
      
      <h3>신청 방법 및 일정</h3>
      
      <p><strong>신청 기간:</strong> 2025년 1월 15일 ~ 2월 28일 (1차)<br>
      <strong>신청 방법:</strong> 중소벤처기업진흥공단 홈페이지(www.kosmes.or.kr) 온라인 신청<br>
      <strong>문의처:</strong> 중소기업 정책자금 콜센터 (☎ 1357)</p>
      
      <div class="highlight-box">
        <h4>💡 나라똔 전문가 TIP</h4>
        <p>정책자금 신청 시 사업계획서의 구체성과 실현가능성이 가장 중요한 평가 요소입니다. 
        특히 디지털 전환이나 친환경 관련 계획을 포함시키면 가점을 받을 수 있으니, 
        이 부분을 중점적으로 준비하시기 바랍니다.</p>
        
        <p>또한 신청 전 반드시 기업 신용등급을 확인하고, 필요하다면 신용등급 개선을 위한 
        조치를 먼저 취하는 것이 좋습니다. 나라똔의 기업심사관 상담 서비스를 통해 
        맞춤형 신청 전략을 수립할 수 있습니다.</p>
      </div>
      
      <h3>관련 링크</h3>
      <ul>
        <li><a href="https://www.kosmes.or.kr" target="_blank">중소벤처기업진흥공단 홈페이지</a></li>
        <li><a href="https://www.mss.go.kr" target="_blank">중소벤처기업부 홈페이지</a></li>
        <li><a href="/consultation">나라똔 정책자금 상담 신청</a></li>
      </ul>
    `,
    attachments: [
      { name: '2025년_정책자금_지원사업_안내.pdf', size: '2.3MB' },
      { name: '신청서류_체크리스트.xlsx', size: '45KB' },
    ],
  };

  // 관련 뉴스 샘플 데이터
  const sampleRelatedNews = [
    {
      id: 2,
      title: '스마트공장 구축 지원사업 신청 접수 시작',
      category: '제조업',
      date: '2025.01.07',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
      views: 8432,
    },
    {
      id: 3,
      title: '청년창업 특별자금 200억원 추가 편성',
      category: '창업지원',
      date: '2025.01.06',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80',
      views: 12543,
    },
    {
      id: 4,
      title: 'R&D 바우처 지원사업 선정기업 발표',
      category: '기술개발',
      date: '2025.01.05',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      views: 6789,
    },
  ];

  useEffect(() => {
    // 실제로는 params.id를 사용하여 API 호출
    setTimeout(() => {
      setNewsData(sampleNewsData);
      setRelatedNews(sampleRelatedNews);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  // 좋아요 처리
  const handleLike = () => {
    setNewsData((prev) => ({
      ...prev,
      likes: prev.likes + 1,
    }));
  };

  // 공유하기
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData.title,
        text: newsData.excerpt,
        url: window.location.href,
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다.');
    }
  };

  // 인쇄
  const handlePrint = () => {
    window.print();
  };

  // 목록으로
  const handleGoBack = () => {
    router.push('/policy-analysis');
  };

  if (isLoading) {
    return (
      <div className="news-detail-loading">
        <div className="loader">로딩 중...</div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="news-detail-error">
        <h2>뉴스를 찾을 수 없습니다.</h2>
        <button onClick={handleGoBack}>목록으로</button>
      </div>
    );
  }

  return (
    <div className="policy-news-detail">
      {/* 헤더 */}
      <div className="detail-header">
        <div className="header-container">
          <button className="back-button" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i> 목록으로
          </button>
          <div className="header-actions">
            <button className="action-btn" onClick={handleLike}>
              <i className="far fa-heart"></i> {newsData.likes}
            </button>
            <button className="action-btn" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> 공유
            </button>
            <button className="action-btn" onClick={handlePrint}>
              <i className="fas fa-print"></i> 인쇄
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <article className="detail-content">
        <div className="content-container">
          {/* 제목 섹션 */}
          <div className="title-section">
            <div className="news-category-badge">{newsData.category}</div>
            <h1 className="news-title">{newsData.title}</h1>
            <div className="news-meta">
              <span className="meta-item">
                <i className="far fa-calendar"></i> {newsData.date}
              </span>
              <span className="meta-item">
                <i className="far fa-eye"></i> 조회수 {newsData.views.toLocaleString()}
              </span>
              <span className="meta-item">
                <i className="far fa-heart"></i> 좋아요 {newsData.likes}
              </span>
              <span className="meta-item">
                <i className="far fa-comment"></i> 댓글 {newsData.comments}
              </span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          {newsData.thumbnail && (
            <div className="thumbnail-section">
              <img src={newsData.thumbnail} alt={newsData.title} />
            </div>
          )}

          {/* 요약 */}
          <div className="excerpt-section">
            <p>{newsData.excerpt}</p>
          </div>

          {/* 본문 */}
          <div className="content-section" dangerouslySetInnerHTML={{ __html: newsData.content }} />

          {/* 태그 */}
          <div className="tags-section">
            {newsData.tags.map((tag, idx) => (
              <span key={idx} className="news-tag">
                #{tag}
              </span>
            ))}
          </div>

          {/* 첨부파일 */}
          {newsData.attachments && newsData.attachments.length > 0 && (
            <div className="attachments-section">
              <h3>
                <i className="fas fa-paperclip"></i> 첨부파일
              </h3>
              <div className="attachment-list">
                {newsData.attachments.map((file, idx) => (
                  <div key={idx} className="attachment-item">
                    <i className="far fa-file"></i>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({file.size})</span>
                    <button className="download-btn">
                      <i className="fas fa-download"></i> 다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 하단 액션 */}
          <div className="bottom-actions">
            <button className="like-btn" onClick={handleLike}>
              <i className="far fa-heart"></i> 도움이 됐어요 ({newsData.likes})
            </button>
            <button className="share-btn" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> 공유하기
            </button>
          </div>
        </div>
      </article>

      {/* 관련 뉴스 */}
      <section className="related-news">
        <div className="related-container">
          <h2>관련 정책뉴스</h2>
          <div className="related-list">
            {relatedNews.map((news) => (
              <div
                key={news.id}
                className="related-item"
                onClick={() => router.push(`/policy-news/${news.id}`)}
              >
                <div className="related-thumbnail">
                  <img src={news.thumbnail} alt={news.title} />
                </div>
                <div className="related-content">
                  <span className="related-category">{news.category}</span>
                  <h4 className="related-title">{news.title}</h4>
                  <div className="related-meta">
                    <span>{news.date}</span>
                    <span>조회 {news.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>정책자금 신청에 어려움을 겪고 계신가요?</h2>
          <p>나라똔 전문가가 1:1 맞춤 컨설팅을 제공합니다</p>
          <button className="cta-button" onClick={() => router.push('/consultation')}>
            <i className="fas fa-comments"></i> 무료 상담 신청하기
          </button>
        </div>
      </section>
    </div>
  );
};

export default PolicyNewsDetail;
