'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InterviewSection from '@/components/business-voice/InterviewSection';
import './page.css';
import './qa-section.css';
import './qa-table.css';

const BusinessVoicePage = () => {
  const [expandedQA, setExpandedQA] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  // 좋아요 토글 함수
  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // 댓글 입력 처리
  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // 댓글 제출
  const submitComment = (postId: number) => {
    if (commentInputs[postId]?.trim()) {
      alert(`댓글이 등록되었습니다: ${commentInputs[postId]}`);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  // 댓글 더보기 토글
  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // 메인 인터뷰 영상 데이터
  const mainInterview = {
    id: 1,
    title: '5억 R&D 지원금 선정 비결',
    author: '김○○ 대표',
    company: 'IT스타트업',
    amount: '5억원',
    views: 15234,
    thumbnail: '/images/interview-main.jpg',
    date: '3일 전',
  };

  // 쇼츠 영상 데이터
  const shortsVideos = [
    { id: 1, title: '세무 절세 꿀팁', author: '이○○', views: 8921 },
    { id: 2, title: '벤처인증 1주일', author: '박○○', views: 6543 },
    { id: 3, title: '수출바우처 승인', author: '최○○', views: 5102 },
    { id: 4, title: '정부지원 서류', author: '정○○', views: 4567 },
    { id: 5, title: '창업 초기자본', author: '강○○', views: 3890 },
  ];

  // 똔톡 콤팩트 리스트 데이터 (2024년 7월 이후 실제 고충 기반)
  const ttontokList = [
    {
      id: 1,
      isHot: true,
      isNew: false,
      category: '창업',
      title: '전기료 지원 20만원 받으셨나요?',
      content:
        '연매출 6천만원 이하 소상공인이면 전기료 20만원 지원받을 수 있다고 하네요. 저는 이번달에 신청해서 받았습니다. 아직 모르시는 분들 계실까봐 공유드려요. 소상공인24 사이트에서 신청 가능합니다.',
      author: '커피한잔',
      business: '카페',
      location: '서울',
      comments: 12,
      likes: 45,
      views: 1234,
      date: '2025-01-09',
      time: '14:30',
      replies: [
        {
          id: 1,
          author: '이사장',
          content: '축하드립니다! 저도 창업 준비 중인데 용기 얻고 갑니다.',
          time: '14:35',
        },
        {
          id: 2,
          author: '박대표',
          content: '나라똔 지원금 어떤 프로그램 이용하셨나요?',
          time: '14:40',
        },
        {
          id: 3,
          author: '김대표',
          content: '청년창업 지원금과 소상공인 정책자금 이용했어요!',
          time: '14:45',
        },
        {
          id: 4,
          author: '최사장',
          content: '저도 창업 준비중인데 좋은 정보 감사합니다!',
          time: '14:50',
        },
        { id: 5, author: '이대표', content: '대박나세요! 번창하시길 바랍니다.', time: '14:55' },
        { id: 6, author: '송사장', content: '오픈 축하드려요. 위치가 어디인가요?', time: '15:00' },
      ],
    },
    {
      id: 2,
      isHot: false,
      isNew: true,
      category: '운영',
      title: '배달앱 수수료 절감 방법',
      content:
        '배달앱 수수료 때문에 고민이신 분들 많으시죠? 저희 가게는 자체 배달 시스템을 구축해서 월 200만원 이상 절감했습니다. 초기 투자는 필요하지만 장기적으로 봤을 때 훨씬 이득이에요.',
      author: '이사장',
      business: '카페',
      location: '경기',
      comments: 8,
      likes: 23,
      time: '30분전',
    },
    {
      id: 3,
      isHot: false,
      isNew: false,
      category: '고충',
      title: '임대료 5천만원 인상 통보받았어요',
      content:
        '3년째 운영 중인 가게인데 갑자기 임대료 5천만원 인상 통보를 받았습니다. 코로나 때도 버텼는데 이제 와서 이런 통보라니... 같은 고민 있으신 분들 어떻게 대처하셨나요?',
      author: '박대표',
      business: '소매업',
      location: '부산',
      comments: 34,
      likes: 89,
      time: '1시간',
    },
    {
      id: 4,
      isHot: false,
      isNew: false,
      category: '네트워킹',
      title: '강남 카페사장 모임 하실분',
      content:
        '강남에서 카페 운영하시는 사장님들 정기 모임 만들어보려고 합니다. 정보 공유도 하고 서로 도움도 주고받으면서 함께 성장했으면 좋겠어요. 관심 있으신 분들 댓글 남겨주세요!',
      author: '최사장',
      business: '카페',
      location: '강남',
      comments: 5,
      likes: 12,
      time: '2시간',
    },
    {
      id: 5,
      isHot: true,
      isNew: false,
      category: '지원',
      title: '전기료 지원 신청 방법 정리',
      content:
        '소상공인 전기료 지원 프로그램 신청 방법 정리해봤습니다. 서류 준비부터 신청까지 단계별로 설명드릴게요. 저는 이 방법으로 월 30만원 지원받고 있습니다.',
      author: '정대표',
      business: '제조업',
      location: '대구',
      comments: 45,
      likes: 156,
      views: 2456,
      date: '2025-01-09',
      time: '11:30',
      replies: [
        { id: 1, author: '최사장', content: '지원금 신청 서류가 복잡한가요?', time: '11:35' },
        {
          id: 2,
          author: '정대표',
          content: '생각보다 간단해요. 사업자등록증과 전기료 고지서만 있으면 됩니다.',
          time: '11:40',
        },
        {
          id: 3,
          author: '강대표',
          content: '이 정보 정말 유용하네요. 저도 신청해봐야겠어요!',
          time: '11:45',
        },
        { id: 4, author: '윤대표', content: '지원금 언제 입금되나요?', time: '11:50' },
        { id: 5, author: '정대표', content: '신청 후 약 2주 정도 걸립니다.', time: '11:55' },
        {
          id: 6,
          author: '한대표',
          content: '지원금 신청 자격 조건이 어떻게 되나요?',
          time: '12:00',
        },
        { id: 7, author: '정대표', content: '소상공인이면 누구나 가능합니다!', time: '12:05' },
      ],
    },
    {
      id: 6,
      isHot: false,
      isNew: false,
      category: '창업',
      title: '프랜차이즈 vs 개인창업 고민',
      content:
        '창업을 앞두고 프랜차이즈와 개인창업 사이에서 고민 중입니다. 각각의 장단점을 경험해보신 분들의 조언을 듣고 싶어요. 초기 자본금은 1억 정도 준비했습니다.',
      author: '익명',
      business: '',
      location: '',
      comments: 23,
      likes: 67,
      time: '5시간',
    },
    {
      id: 7,
      isHot: false,
      isNew: true,
      category: '운영',
      title: '직원 관리 노하우 공유합니다',
      content:
        '10년간 음식점을 운영하면서 터득한 직원 관리 노하우를 공유합니다. 직원과의 소통, 동기부여, 근무 스케줄 관리 등 실전에서 바로 적용 가능한 팁들입니다.',
      author: '송사장',
      business: '음식점',
      location: '인천',
      comments: 15,
      likes: 45,
      time: '8시간',
    },
    {
      id: 8,
      isHot: false,
      isNew: false,
      category: '고충',
      title: '악성 리뷰 대응 방법은?',
      content:
        '요즘 악성 리뷰 때문에 스트레스가 심합니다. 명백한 허위 사실인데도 플랫폼에서는 삭제해주지 않네요. 법적 대응까지 고민 중인데 경험 있으신 분 계신가요?',
      author: '익명',
      business: '',
      location: '',
      comments: 67,
      likes: 234,
      time: '1일전',
    },
    {
      id: 9,
      isHot: false,
      isNew: false,
      category: '네트워킹',
      title: '부산 요식업 단톡방 만들어요',
      content:
        '부산에서 요식업 하시는 분들 단톡방 만들려고 합니다. 식자재 공동구매, 정보 공유, 친목 도모 등 함께 하실 분들 연락주세요. 현재 15명 정도 모였습니다.',
      author: '한대표',
      business: '치킨집',
      location: '부산',
      comments: 12,
      likes: 28,
      time: '1일전',
    },
    {
      id: 10,
      isHot: true,
      isNew: false,
      category: '지원',
      title: '청년창업 지원금 후기',
      content:
        '청년창업 지원금 5천만원 받아서 스타트업 시작했습니다. 신청 과정부터 선정까지 6개월 걸렸는데, 준비 과정과 면접 팁 공유드립니다. 궁금한 점 있으면 댓글 주세요.',
      author: '윤대표',
      business: '스타트업',
      location: '서울',
      comments: 89,
      likes: 456,
      views: 5678,
      date: '2025-01-08',
      time: '16:00',
      replies: [
        {
          id: 1,
          author: '박사장',
          content: '와 5천만원이면 정말 큰 도움이 되겠네요!',
          time: '16:05',
        },
        { id: 2, author: '윤대표', content: '네, 초기 자본 부담이 많이 줄었어요.', time: '16:10' },
        { id: 3, author: '최대표', content: '면접 팁 공유 부탁드립니다!', time: '16:15' },
        {
          id: 4,
          author: '윤대표',
          content: '사업계획서를 철저히 준비하세요. 특히 시장분석 부분이 중요합니다.',
          time: '16:20',
        },
        { id: 5, author: '강사장', content: '청년 나이 제한이 있나요?', time: '16:25' },
        { id: 6, author: '윤대표', content: '만 39세 이하면 신청 가능합니다.', time: '16:30' },
        {
          id: 7,
          author: '이대표',
          content: '정보 감사합니다. 저도 도전해봐야겠어요!',
          time: '16:35',
        },
        { id: 8, author: '송사장', content: '성공을 기원합니다!', time: '16:40' },
      ],
    },
    {
      id: 11,
      isHot: false,
      isNew: true,
      category: '성공사례',
      title: '월매출 1억 달성 후기',
      content:
        '작년에 시작한 온라인 쇼핑몰이 드디어 월매출 1억을 달성했습니다. 나라똔 컨설팅과 마케팅 지원이 큰 도움이 되었어요. 저처럼 작게 시작하신 분들에게 희망이 되었으면 합니다.',
      author: '강대표',
      business: '온라인몰',
      location: '서울',
      comments: 156,
      likes: 892,
      time: '3일전',
    },
    {
      id: 12,
      isHot: false,
      isNew: false,
      category: '질문',
      title: '사업자 대출 어디가 좋나요?',
      content:
        '사업 확장을 위해 대출을 알아보고 있습니다. 1금융권, 2금융권, 정책자금 등 여러 곳을 비교 중인데 실제 이용해보신 분들의 후기가 궁금합니다.',
      author: '조대표',
      business: '무역업',
      location: '인천',
      comments: 34,
      likes: 78,
      time: '4일전',
    },
  ];

  // Q&A 데이터
  const popularQuestions = [
    '카페 창업 초기 자본금 얼마나 필요한가요?',
    '세무 신고 혼자서도 가능한가요?',
    '직원 채용시 주의사항은 무엇인가요?',
  ];

  const qaList = [
    {
      id: 1,
      question: '배달앱 수수료가 너무 비싸서 힘들어요',
      author: '블루라떼',
      time: '10분 전',
      answerCount: 3,
      isHot: false,
      answers: [
        {
          id: 1,
          author: '나라똔 컨설턴트',
          content:
            '자체 배달 시스템 구축을 추천드립니다. 초기 투자는 필요하지만 장기적으로 수수료를 크게 절감할 수 있습니다.',
          likes: 32,
          time: '5분 전',
          isExpert: true,
        },
        {
          id: 2,
          author: '산토끼',
          content:
            '포장 할인으로 배달 의존도를 줄이세요. 저희는 포장 20% 할인으로 매출 구조를 개선했습니다.',
          likes: 15,
          time: '8분 전',
          isExpert: false,
        },
        {
          id: 3,
          author: '하늘바다',
          content:
            '배민, 쿠팡이츠, 요기요 수수료 비교해서 가장 유리한 곳과 단독 계약하면 우대 조건 받을 수 있어요.',
          likes: 8,
          time: '방금',
          isExpert: false,
        },
      ],
    },
    {
      id: 2,
      question: '임대차 계약시 꼭 확인해야 할 사항은?',
      author: '달빛소나타',
      time: '1시간 전',
      answerCount: 5,
      isHot: false,
      answers: [],
    },
    {
      id: 3,
      question: '온라인 마케팅 어디서부터 시작해야 하나요?',
      author: '겨울나무',
      time: '2시간 전',
      answerCount: 2,
      isHot: false,
      answers: [],
    },
    {
      id: 4,
      question: '최저임금 인상 대응 방법 공유해주세요',
      author: '별똥별',
      time: '3시간 전',
      answerCount: 8,
      isHot: true,
      answers: [],
    },
    {
      id: 5,
      question: '정부지원금 신청 서류 준비 팁이 있나요?',
      author: '햇살가득',
      time: '5시간 전',
      answerCount: 12,
      isHot: true,
      answers: [],
    },
  ];

  const handleQAExpand = (id: number) => {
    setExpandedQA(expandedQA === id ? null : id);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="business-voice-container">
      {/* 헤더 섹션 */}
      <section className="expert-hero layout-hero relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100">
        <div className="layout-container">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
              BUSINESS VOICE
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              나라똔과 함께 성장하는
              <span className="block text-blue-600">사업자들의 생생한 목소리</span>
            </h1>
            <p className="mt-6 text-lg leading-7 text-slate-600">
              실제 사업자들의 경험과 노하우를 공유하는 커뮤니티
              <span className="block">성공 사례부터 실패 경험까지, 진솔한 이야기를 만나보세요</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="#ttontok-section"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-600"
              >
                <i className="fas fa-comments" aria-hidden="true" /> 커뮤니티 참여하기
              </Link>
              <Link
                href="/consultation-request#form-section"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg ring-1 ring-emerald-100 transition hover:bg-emerald-50"
              >
                <i className="fas fa-headset" aria-hidden="true" /> 무료 상담 신청
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 섹션 1: 나라똔과 함께한 대표님 인터뷰 - 새로운 컴포넌트 사용 */}
      <InterviewSection />

      {/* 섹션 2: 똔톡 */}
      <section id="ttontok-section" className="ttontok-section">
        <div className="section-header">
          <h2>💬 똔톡 - 실시간 사업자 이야기</h2>
          <p>사업자들의 생생한 경험과 노하우를 공유하는 공간</p>
        </div>

        <div className="ttontok-container">
          {/* Best 똔톡 2개 - 전체 내용 표시 */}
          <div className="best-ttontok-section">
            <h3 className="best-title">🏆 Best 똔톡</h3>
            <div className="best-ttontok-grid">
              {ttontokList
                .filter((item) => item.isHot && item.replies)
                .slice(0, 2)
                .map((item) => (
                  <div key={item.id} className="best-ttontok-card">
                    <div className="best-header">
                      <div className="best-header-left">
                        <span className={`ttontok-category category-${item.category}`}>
                          {item.category}
                        </span>
                        <span className="badge-best">🏆 BEST</span>
                      </div>
                      <div className="best-header-right">
                        <span className="best-date">{item.date}</span>
                        <span className="best-time">{item.time}</span>
                      </div>
                    </div>

                    <h3 className="best-title-text">{item.title}</h3>
                    <p className="best-content">{item.content}</p>

                    {/* 원본글 보기 링크 */}
                    <Link href={`/ttontok/${item.id}`} className="view-original-link">
                      <span className="link-icon">🔗</span>
                      <span className="link-text">원본글 보기</span>
                      <span className="link-arrow">→</span>
                    </Link>

                    <div className="best-author">
                      <span className="author-name">{item.author}</span>
                      <span className="author-info">
                        {item.business && `· ${item.business}`}
                        {item.location && ` · ${item.location}`}
                      </span>
                    </div>

                    <div className="best-interactions">
                      <button
                        className={`like-button ${likedPosts.includes(item.id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(item.id)}
                      >
                        <span className="like-icon">
                          {likedPosts.includes(item.id) ? '❤️' : '🤍'}
                        </span>
                        <span className="like-text">공감</span>
                        <span className="like-count">
                          {item.likes + (likedPosts.includes(item.id) ? 1 : 0)}
                        </span>
                      </button>
                      <div className="interaction-stats">
                        <span className="stat-badge">
                          <span className="stat-icon">👁</span>
                          <span className="stat-text">
                            조회 {item.views || Math.floor(Math.random() * 1000 + 500)}
                          </span>
                        </span>
                        <span className="stat-badge">
                          <span className="stat-icon">💬</span>
                          <span className="stat-text">댓글 {item.comments}</span>
                        </span>
                      </div>
                    </div>

                    {/* 댓글 영역 */}
                    <div className="best-comments">
                      <h4 className="comments-title">댓글 ({item.replies?.length || 0})</h4>
                      <div className="comments-list">
                        {item.replies
                          ?.slice(0, expandedComments[item.id] ? undefined : 3)
                          .map((reply) => (
                            <div key={reply.id} className="comment-item">
                              <div className="comment-header">
                                <span className="comment-author">{reply.author}</span>
                                <span className="comment-time">{reply.time}</span>
                              </div>
                              <p className="comment-content">{reply.content}</p>
                            </div>
                          ))}
                      </div>

                      {/* 댓글 더보기 버튼 */}
                      {item.replies && item.replies.length > 3 && (
                        <button
                          className="comments-more-btn"
                          onClick={() => toggleComments(item.id)}
                        >
                          {expandedComments[item.id]
                            ? '▲ 댓글 접기'
                            : `▼ 댓글 ${item.replies.length - 3}개 더보기`}
                        </button>
                      )}
                      {/* 댓글 작성 */}
                      <div className="comment-write">
                        <input
                          type="text"
                          placeholder="댓글을 입력하세요..."
                          value={commentInputs[item.id] || ''}
                          onChange={(e) => handleCommentChange(item.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitComment(item.id)}
                          className="comment-input"
                        />
                        <button onClick={() => submitComment(item.id)} className="comment-submit">
                          등록
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 일반 똔톡 그리드 */}
          <div className="regular-ttontok-section">
            <h3 className="regular-title">📢 최신 똔톡</h3>
            <div className="ttontok-grid">
              {ttontokList.map((item) => (
                <Link
                  key={item.id}
                  href={`/ttontok/${item.id}`}
                  className={`ttontok-card category-${item.category}`}
                >
                  {/* 헤더: 카테고리, 배지, 시간 */}
                  <div className="ttontok-header">
                    <div className="ttontok-header-left">
                      <span className={`ttontok-category category-${item.category}`}>
                        {item.category}
                      </span>
                      {item.isHot && <span className="badge-hot">🔥</span>}
                      {item.isNew && <span className="badge-new">NEW</span>}
                    </div>
                    <span className="ttontok-time">
                      {item.date || '2025-01-09'} {item.time}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="ttontok-title">{item.title}</h3>

                  {/* 내용 미리보기 - 1줄로 축소 */}
                  <p className="ttontok-content">{item.content}</p>

                  {/* 푸터: 작성자 정보 및 통계 */}
                  <div className="ttontok-footer">
                    <div className="ttontok-author-info">
                      {item.author === '익명' ? (
                        <span className="author-anonymous">익명</span>
                      ) : (
                        <>
                          <span className="author-name">{item.author}</span>
                          {item.business && (
                            <span className="author-business">·{item.business}</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="ttontok-stats">
                      <button
                        className={`like-btn-small ${likedPosts.includes(item.id) ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(item.id);
                        }}
                      >
                        {likedPosts.includes(item.id) ? '❤️' : '🤍'}
                        <span>{item.likes + (likedPosts.includes(item.id) ? 1 : 0)}</span>
                      </button>
                      <span className="stat-item">
                        <span className="stat-icon">💬</span>
                        <span className="stat-number">{item.comments}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="ttontok-actions">
          <Link href="/ttontok/write" className="write-btn">
            ➕ 글쓰기
          </Link>
          <Link href="/ttontok" className="more-btn">
            더보기 →
          </Link>
        </div>
      </section>

      {/* 섹션 3: Q&A - 질문/답변 구조 */}
      <section id="qa-section" className="qa-section">
        <div className="section-header">
          <h2>❓ 묻고 답하기</h2>
          <p className="section-desc">사업자들의 실시간 고민과 해결책을 확인하세요</p>
        </div>

        {/* 인기 Q&A */}
        <div className="qa-popular-container">
          {/* 질문 1 */}
          <div className="qa-item-card">
            <div className="qa-question-area">
              <div className="qa-question-header">
                <div className="qa-meta-info">
                  <span className="qa-ranking">🥇 1위</span>
                  <span className="category-badge category-수수료">수수료</span>
                  <span className="qa-author">블루라떼</span>
                  <span className="qa-time">10분 전</span>
                </div>
                <div className="qa-stats">
                  <span>👁 523</span>
                  <span>💬 5</span>
                </div>
              </div>
              <h3 className="qa-question-title">
                <span className="hot-badge">🔥</span>
                배달앱 수수료가 너무 비싸서 힘들어요
              </h3>
              <p className="qa-question-text">
                저는 치킨집을 운영하고 있는데요, 배달앱 수수료가 정말 너무 비싸서 힘듭니다.
                배민, 쿠팡이츠, 요기요 다 사용하고 있는데 수수료가 15~20%나 되네요.
                거기에 광고비까지 내면 거의 남는게 없어요. 다른 사장님들은 어떻게 하고 계신가요?
              </p>
            </div>

            <div className="qa-answers-area">
              <div className="qa-answer best-answer">
                <div className="answer-header">
                  <span className="answerer-name">산토끼</span>
                  <span className="best-badge">✓ 베스트</span>
                  <span className="answer-time">5분 전</span>
                </div>
                <p className="answer-text">
                  저도 같은 고민 많이 했었는데요, 자체 배달 시스템을 만드세요.
                  인스타그램이나 네이버 스마트스토어로 주문받고 직접 배달하면 수수료를 크게 줄일 수 있습니다.
                </p>
                <button className="helpful-btn">👍 23</button>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer-name">하늘바다</span>
                  <span className="answer-time">8분 전</span>
                </div>
                <p className="answer-text">
                  배달앱 완전히 끊기는 어렵지만, 비중을 줄이는게 답입니다.
                  네이버 스마트플레이스 활용하면 수수료 3.3%밖에 안됩니다.
                </p>
                <button className="helpful-btn">👍 15</button>
              </div>

              <div className="qa-answer">
                <div className="answer-header">
                  <span className="answerer-name">민들레</span>
                  <span className="answer-time">9분 전</span>
                </div>
                <p className="answer-text">
                  포장 할인 20% 주고 직접 픽업 유도하세요. 배달앱보다 이익이 더 많이 남습니다.
                </p>
                <button className="helpful-btn">👍 8</button>
              </div>
            </div>
          </div>

        </div>

        {/* 최신 질문 및 질문 작성 */}
        <div className="qa-latest-section">
          <div className="qa-latest-header">
            <h3>📝 최신 질문</h3>
            <div className="qa-filter-tabs">
              <button className="filter-tab active">전체</button>
              <button className="filter-tab">창업</button>
              <button className="filter-tab">운영</button>
              <button className="filter-tab">세무</button>
              <button className="filter-tab">인사</button>
              <button className="filter-tab">마케팅</button>
              <button className="filter-tab">지원금</button>
              <button className="filter-tab">기타</button>
            </div>
          </div>

          {/* 질문 작성 폼 */}
          <div className="qa-write-form">
            <h4>질문하기</h4>
            <div className="form-row">
              <select className="category-select">
                <option>카테고리 선택</option>
                <option>창업</option>
                <option>운영</option>
                <option>세무</option>
                <option>인사</option>
                <option>마케팅</option>
                <option>지원금</option>
                <option>기타</option>
              </select>
              <input
                type="text"
                placeholder="질문 제목을 입력하세요"
                className="question-title-input"
              />
            </div>
            <textarea
              placeholder="궁금한 내용을 자세히 작성해주세요. 자세할수록 더 좋은 답변을 받을 수 있습니다."
              className="question-content-input"
              rows={3}
            />
            <div className="form-actions">
              <button className="btn-submit-question">질문 등록</button>
            </div>
          </div>

          {/* 최신 질문 테이블 */}
          <div className="qa-table">
            <table className="questions-table">
              <thead>
                <tr>
                  <th className="th-no">번호</th>
                  <th className="th-category">분류</th>
                  <th className="th-title">제목</th>
                  <th className="th-author">작성자</th>
                  <th className="th-answers">답변</th>
                  <th className="th-views">조회</th>
                  <th className="th-date">작성일</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    no: 156,
                    category: '운영',
                    title: '배달앱 수수료가 너무 비싸서 힘들어요',
                    author: '블루라떼',
                    answers: 3,
                    views: 45,
                    date: '10분 전',
                    isHot: true,
                  },
                  {
                    no: 155,
                    category: '세무',
                    title: '부가세 신고 혼자서도 가능한가요?',
                    author: '달빛소나타',
                    answers: 5,
                    views: 67,
                    date: '30분 전',
                    isNew: true,
                  },
                  {
                    no: 154,
                    category: '창업',
                    title: '카페 창업 초기 자본금 얼마나 필요한가요?',
                    author: '겨울나무',
                    answers: 8,
                    views: 123,
                    date: '1시간 전',
                    isHot: true,
                  },
                  {
                    no: 153,
                    category: '인사',
                    title: '직원 채용시 주의사항은 무엇인가요?',
                    author: '별똥별',
                    answers: 2,
                    views: 34,
                    date: '2시간 전',
                  },
                  {
                    no: 152,
                    category: '지원금',
                    title: '정부지원금 서류 준비 팁 공유해주세요',
                    author: '햇살가득',
                    answers: 12,
                    views: 234,
                    date: '3시간 전',
                    isHot: true,
                  },
                  {
                    no: 151,
                    category: '마케팅',
                    title: '온라인 마케팅 어디서 시작해야 하나요?',
                    author: '은하수',
                    answers: 6,
                    views: 89,
                    date: '5시간 전',
                  },
                  {
                    no: 150,
                    category: '운영',
                    title: '최저임금 인상 대응 방법 공유해주세요',
                    author: '아침이슬',
                    answers: 9,
                    views: 156,
                    date: '6시간 전',
                  },
                  {
                    no: 149,
                    category: '기타',
                    title: '임대차 계약시 확인해야 할 사항들',
                    author: '구름빵',
                    answers: 4,
                    views: 78,
                    date: '8시간 전',
                  },
                  {
                    no: 148,
                    category: '창업',
                    title: '프랜차이즈 vs 개인창업 장단점 비교',
                    author: '봄바람',
                    answers: 15,
                    views: 345,
                    date: '10시간 전',
                  },
                  {
                    no: 147,
                    category: '지원금',
                    title: '사업자 대출 어디가 좋은가요?',
                    author: '푸른하늘',
                    answers: 7,
                    views: 198,
                    date: '12시간 전',
                  },
                ].map((q) => (
                  <tr
                    key={q.no}
                    className={`question-row ${q.isHot ? 'hot' : ''} ${q.isNew ? 'new' : ''}`}
                  >
                    <td className="td-no">{q.no}</td>
                    <td className="td-category">
                      <span className={`category-badge category-${q.category}`}>{q.category}</span>
                    </td>
                    <td className="td-title">
                      <Link href={`/qa/${q.no}`} className="question-link">
                        {q.title}
                      </Link>
                    </td>
                    <td className="td-author">{q.author}</td>
                    <td className="td-answers">{q.answers}</td>
                    <td className="td-views">{q.views}</td>
                    <td className="td-date">{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="qa-pagination">
              <button className="page-btn">이전</button>
              <button className="page-num active">1</button>
              <button className="page-num">2</button>
              <button className="page-num">3</button>
              <button className="page-num">4</button>
              <button className="page-num">5</button>
              <button className="page-btn">다음</button>
            </div>
          </div>
        </div>

        <div className="qa-actions">
          <button className="ask-btn">❓ 질문하기</button>
          <button className="more-qa-btn">모든 Q&A 보기 →</button>
        </div>
      </section>

      {/* CTA 섹션 - 정책분석과 동일한 스타일 적용 */}
      <section className="business-voice__cta-section" aria-labelledby="business-voice-cta-title">
        <div className="business-voice__cta-container">
          <div className="business-voice__cta-banner">
            <div className="business-voice__cta-content">
              <p className="business-voice__cta-eyebrow">Business Voice</p>
              <h2 id="business-voice-cta-title" className="business-voice__cta-title">
                인증 기업심사관과 함께 사업 고민을
                <br className="business-voice__cta-break" />
                해결하시겠어요?
              </h2>
              <p className="business-voice__cta-description">
                검증된 정책분석 전문가가 1:1로 맞춤 전략을 제안해드립니다.<br />대표님의 사업에 필요한 정책을 바로 안내해드립니다.
              </p>
            </div>
            <Link href="/consultation-request#form-section" className="business-voice__cta-button">
              상담 예약하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessVoicePage;
