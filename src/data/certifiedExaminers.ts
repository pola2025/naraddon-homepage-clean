// Auto-generated from Rails certified_examiners.json
// Keep in sync with H:/nara/config/data/certified_examiners.json

export type CertifiedExaminerHero = {
  title: string;
  highlight: string;
  subtitle: string;
  stats: Array<{ label: string; value: string }>;
};

export type CertifiedExaminer = {
  name: string;
  companyName: string;
  position: string;
  category: string;
  brandIcon: string;
  rating: number | null;
  successRate: number | null;
  consultCount: number | null;
  imageKey: string;
  expertiseTags: string[];
  expertiseDescription: string;
  expertiseDetail: string[];
};

export const certifiedExaminerHero: CertifiedExaminerHero = {
  "title": "인증 기업심사관",
  "highlight": "정책자금부터 인증까지 100% 통과 전략",
  "subtitle": "정부 인증을 받은 심사관과 함께 신청 전략을 설계하세요. 실전 경험과 데이터를 바탕으로 성공률을 높여드립니다.",
  "stats": [
    {
      "label": "등록 심사관",
      "value": "20명"
    },
    {
      "label": "평균 만족도",
      "value": "4.8점"
    },
    {
      "label": "평균 성공률",
      "value": "94%"
    }
  ]
} as const;

export const certifiedExaminers: CertifiedExaminer[] = [
  {
    "name": "권혁중",
    "companyName": "주식회사 레토",
    "position": "수출지원 전문가",
    "category": "export",
    "brandIcon": "fas fa-building",
    "rating": 4.8,
    "successRate": 96,
    "consultCount": 234,
    "imageKey": "kwon-hyuk-jung",
    "expertiseTags": [
      "정책자금",
      "수출지원",
      "제조업특화",
      "기업인증",
      "창업지원"
    ],
    "expertiseDescription": "정책자금 지원금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 지원금 자문컨설팅",
      "수출지원컨설팅"
    ]
  },
  {
    "name": "길진영",
    "companyName": "TF 컨설팅",
    "position": "정책자금 전문가",
    "category": "funding",
    "brandIcon": "fas fa-briefcase",
    "rating": 4.9,
    "successRate": 97,
    "consultCount": 187,
    "imageKey": "gil-jin-young",
    "expertiseTags": [
      "정책자금",
      "신용보증",
      "운전자금",
      "시설자금",
      "기술평가"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "김범준",
    "companyName": "에스제이파트너스",
    "position": "정책자금 컨설턴트",
    "category": "funding",
    "brandIcon": "fas fa-chart-line",
    "rating": 4.8,
    "successRate": 98,
    "consultCount": 156,
    "imageKey": "kim-beom-jun",
    "expertiseTags": [
      "정책자금",
      "벤처투자",
      "정부과제",
      "세제혜택",
      "고용지원"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "김수빈",
    "companyName": "주식회사 유에스이노웨이브",
    "position": "기업인증 전문가",
    "category": "certification",
    "brandIcon": "fas fa-lightbulb",
    "rating": 4.9,
    "successRate": 96,
    "consultCount": 289,
    "imageKey": "kim-su-bin",
    "expertiseTags": [
      "기업인증",
      "ISO인증",
      "벤처인증",
      "이노비즈",
      "메인비즈"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅",
      "기업인증",
      "ISO 국제심사원",
      "수출 컨설팅"
    ]
  },
  {
    "name": "김영희",
    "companyName": "세움 기업지원센터",
    "position": "창업지원 컨설턴트",
    "category": "funding",
    "brandIcon": "fas fa-rocket",
    "rating": 4.8,
    "successRate": 97,
    "consultCount": 123,
    "imageKey": "kim-young-hee",
    "expertiseTags": [
      "정책자금",
      "창업지원",
      "여성기업",
      "청년창업",
      "소상공인"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "김태수",
    "companyName": "비즈레스큐",
    "position": "기술금융 전문가",
    "category": "funding",
    "brandIcon": "fas fa-shield-alt",
    "rating": 4.9,
    "successRate": 98,
    "consultCount": 245,
    "imageKey": "kim-tae-soo",
    "expertiseTags": [
      "정책자금",
      "기술사업화",
      "특허전략",
      "R&D지원",
      "기술금융"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "김태은",
    "companyName": "가나안 기업지원센터",
    "position": "사회적경제 전문가",
    "category": "funding",
    "brandIcon": "fas fa-award",
    "rating": 4.8,
    "successRate": 96,
    "consultCount": 192,
    "imageKey": "kim-tae-eun",
    "expertiseTags": [
      "정책자금",
      "창업지원",
      "사회적기업",
      "협동조합",
      "마을기업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "박민재",
    "companyName": "푸른중소기업 경영지원센터",
    "position": "제조업 컨설턴트",
    "category": "manufacturing",
    "brandIcon": "fas fa-building",
    "rating": 4.9,
    "successRate": 97,
    "consultCount": 276,
    "imageKey": "park-min-jae",
    "expertiseTags": [
      "정책자금",
      "제조업특화",
      "스마트공장",
      "디지털전환",
      "수출지원"
    ],
    "expertiseDescription": "정책자금 및 지원금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 및 지원금 자문컨설팅",
      "투자협약"
    ]
  },
  {
    "name": "박성훈",
    "companyName": "비즈스카이",
    "position": "금융컨설턴트",
    "category": "funding",
    "brandIcon": "fas fa-briefcase",
    "rating": 4.8,
    "successRate": 98,
    "consultCount": 167,
    "imageKey": "park-sung-hoon",
    "expertiseTags": [
      "정책자금",
      "운전자금",
      "시설자금",
      "매출채권",
      "무역금융"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "박현숙",
    "companyName": "케이피제이",
    "position": "여성기업 전문가",
    "category": "funding",
    "brandIcon": "fas fa-chart-line",
    "rating": 4.9,
    "successRate": 96,
    "consultCount": 198,
    "imageKey": "park-hyun-sook",
    "expertiseTags": [
      "정책자금",
      "여성기업",
      "재창업지원",
      "소상공인",
      "전통시장"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "손지숙",
    "companyName": "손스타컴퍼니",
    "position": "서비스업 컨설턴트",
    "category": "funding",
    "brandIcon": "fas fa-lightbulb",
    "rating": 4.8,
    "successRate": 97,
    "consultCount": 178,
    "imageKey": "son-ji-sook",
    "expertiseTags": [
      "정책자금",
      "서비스업",
      "프랜차이즈",
      "유통업",
      "온라인사업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "양미진",
    "companyName": "에스제이파트너스",
    "position": "바이오산업 전문가",
    "category": "funding",
    "brandIcon": "fas fa-rocket",
    "rating": 4.9,
    "successRate": 98,
    "consultCount": 201,
    "imageKey": "yang-mi-jin",
    "expertiseTags": [
      "정책자금",
      "바이오",
      "의료기기",
      "헬스케어",
      "제약산업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "이용흔",
    "companyName": "제이제이에스 기업지원센터",
    "position": "부동산금융 전문가",
    "category": "funding",
    "brandIcon": "fas fa-shield-alt",
    "rating": 4.8,
    "successRate": 96,
    "consultCount": 134,
    "imageKey": "lee-yong-heun",
    "expertiseTags": [
      "정책자금",
      "부동산금융",
      "PF대출",
      "시설자금",
      "건설업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅",
      "주거형담보대출",
      "특수물건담보대출",
      "PF대출",
      "토탈 금융컨설팅"
    ]
  },
  {
    "name": "전예진",
    "companyName": "비젠파트너스",
    "position": "IT/콘텐츠 전문가",
    "category": "funding",
    "brandIcon": "fas fa-award",
    "rating": 4.9,
    "successRate": 97,
    "consultCount": 212,
    "imageKey": "jeon-ye-jin",
    "expertiseTags": [
      "정책자금",
      "IT/SW",
      "콘텐츠",
      "게임산업",
      "문화예술"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "전윤지",
    "companyName": "열린정책자금연구소",
    "position": "농식품산업 전문가",
    "category": "funding",
    "brandIcon": "fas fa-building",
    "rating": 4.8,
    "successRate": 98,
    "consultCount": 223,
    "imageKey": "jeon-yoon-ji",
    "expertiseTags": [
      "정책자금",
      "농식품",
      "6차산업",
      "로컬푸드",
      "친환경"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "전지선",
    "companyName": "제이티엘파트너스",
    "position": "ISO인증 전문가",
    "category": "certification",
    "brandIcon": "fas fa-briefcase",
    "rating": 4.9,
    "successRate": 96,
    "consultCount": 256,
    "imageKey": "jeon-ji-sun",
    "expertiseTags": [
      "기업인증",
      "ISO인증",
      "품질경영",
      "환경경영",
      "안전보건"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅",
      "ISO국제 선임심사원"
    ]
  },
  {
    "name": "천명숙",
    "companyName": "씨에스파트너스",
    "position": "관광산업 컨설턴트",
    "category": "funding",
    "brandIcon": "fas fa-chart-line",
    "rating": 4.8,
    "successRate": 97,
    "consultCount": 189,
    "imageKey": "cheon-myung-sook",
    "expertiseTags": [
      "정책자금",
      "관광산업",
      "숙박업",
      "MICE",
      "레저스포츠"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "태건호",
    "companyName": "경영지원컨설팅",
    "position": "청년창업 멘토",
    "category": "startup",
    "brandIcon": "fas fa-lightbulb",
    "rating": 4.9,
    "successRate": 98,
    "consultCount": 143,
    "imageKey": "tae-gun-ho",
    "expertiseTags": [
      "창업지원",
      "청년창업",
      "대학생창업",
      "예비창업",
      "초기창업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "팽성희",
    "companyName": "기업성장지원플랫폼",
    "position": "스타트업 액셀러레이터",
    "category": "startup",
    "brandIcon": "fas fa-rocket",
    "rating": 4.8,
    "successRate": 96,
    "consultCount": 267,
    "imageKey": "paeng-sung-hee",
    "expertiseTags": [
      "창업지원",
      "기술창업",
      "스타트업",
      "엑셀러레이팅",
      "투자유치"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  },
  {
    "name": "황만규",
    "companyName": "바름경영지원센터",
    "position": "뿌리산업 전문가",
    "category": "manufacturing",
    "brandIcon": "fas fa-shield-alt",
    "rating": 4.9,
    "successRate": 97,
    "consultCount": 298,
    "imageKey": "hwang-man-gyu",
    "expertiseTags": [
      "정책자금",
      "제조업특화",
      "뿌리산업",
      "소재부품",
      "장비산업"
    ],
    "expertiseDescription": "정책자금 자문컨설팅",
    "expertiseDetail": [
      "정책자금 자문컨설팅"
    ]
  }
];