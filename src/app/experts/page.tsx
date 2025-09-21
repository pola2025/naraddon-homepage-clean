"use client";

import React from "react";
import Link from "next/link";
import "./page.css";
import TrustGuarantee from "./components/TrustGuarantee";
import SavingsImpact from "./components/SavingsImpact";

type Service = {
  title: string;
  items: string[];
};

type ServiceCategory = {
  title: string;
  icon: string;
  services: Service[];
};

const expertServices: Record<string, ServiceCategory> = {
  management: {
    title: "비즈니스 운영",
    icon: "🏢",
    services: [
      {
        title: "경영 컨설팅",
        items: ["사업계 계획 수립", "조직 구조 조정", "성과 지표 설계"],
      },
      {
        title: "인사·노무",
        items: ["채용 전략", "보상·복리후생", "노무 이슈 대응"],
      },
      {
        title: "재무 관리",
        items: ["비용 최적화", "내부 통제", "위험 관리"],
      },
    ],
  },
  finance: {
    title: "금융·회계",
    icon: "💰",
    services: [
      {
        title: "자금 조달",
        items: ["정책 자금", "투자 유치", "운전자금 확보"],
      },
      {
        title: "회계 자문",
        items: ["재무제표 작성", "세무 전략", "비용 구조 분석"],
      },
      {
        title: "금융 전략",
        items: ["현금흐름 관리", "투자 검토", "M&A 지원"],
      },
    ],
  },
  growth: {
    title: "성장 전략",
    icon: "📈",
    services: [
      {
        title: "디지털 전환",
        items: ["업무 자동화", "데이터 활용", "클라우드 전환"],
      },
      {
        title: "마케팅 설계",
        items: ["브랜드 전략", "콘텐츠 마케팅", "디지털 채널"],
      },
      {
        title: "신사업 개발",
        items: ["아이디어 검증", "시장 진입 전략", "프로토타입 지원"],
      },
    ],
  },
  industry: {
    title: "산업 특화",
    icon: "🏭",
    services: [
      {
        title: "제조 혁신",
        items: ["공정 최적화", "스마트 팩토리", "품질 관리"],
      },
      {
        title: "서비스 혁신",
        items: ["고객 경험", "운영 효율화", "프로세스 개선"],
      },
      {
        title: "공공·협력",
        items: ["정부 과제 대응", "파트너십 구축", "규제 검토"],
      },
    ],
  },
};

export default function ExpertServicesPage() {
  return (
    <div className="expert-services">
      <section
        className="expert-services__hero"
        aria-labelledby="expert-services-hero-title"
      >
        <div className="expert-services__hero-inner">
          <h1
            id="expert-services-hero-title"
            className="expert-services__hero-title"
          >
            전문가 서비스를 만나보세요
          </h1>
          <p className="expert-services__hero-description">
            나라똔 전문가들이 비즈니스 성장을 위해 필요한 모든 영역에서 함께합니다.
          </p>
        </div>
      </section>

      <TrustGuarantee />

      <SavingsImpact />

      <section
        className="expert-services__categories"
        aria-labelledby="expert-services-categories-title"
      >
        <div className="expert-services__categories-inner">
          <div className="expert-services__categories-headline">
            <h2
              id="expert-services-categories-title"
              className="expert-services__categories-title"
            >
              분야별 전문가 서비스를 한눈에
            </h2>
            <p className="expert-services__categories-description">
              필요한 지원을 빠르게 찾을 수 있도록 영역별 주요 서비스를 정리했습니다.
            </p>
          </div>

          <div className="expert-services__category-grid">
            {Object.entries(expertServices).map(([key, category]) => (
              <article key={key} className="expert-services__category">
                <header className="expert-services__category-header">
                  <span
                    className="expert-services__category-icon"
                    aria-hidden="true"
                  >
                    {category.icon}
                  </span>
                  <h3 className="expert-services__category-title">
                    {category.title}
                  </h3>
                </header>

                <div className="expert-services__service-list">
                  {category.services.map((service) => (
                    <section
                      key={service.title}
                      className="expert-services__service"
                      aria-label={service.title}
                    >
                      <h4 className="expert-services__service-title">
                        {service.title}
                      </h4>
                      <ul className="expert-services__service-tags">
                        {service.items.map((item) => (
                          <li
                            key={`${service.title}-${item}`}
                            className="expert-services__service-tag"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="expert-services__cta"
        aria-labelledby="expert-services-cta-title"
      >
        <div className="expert-services__cta-inner">
          <div className="expert-services__cta-text">
            <h2
              id="expert-services-cta-title"
              className="expert-services__cta-title"
            >
              도움이 필요하신가요?
            </h2>
            <p className="expert-services__cta-description">
              간단한 상담 요청만 주시면 전문가가 맞춤형 솔루션을 제안해 드립니다.
            </p>
          </div>
          <Link
            href="/consultation-request"
            className="expert-services__cta-button"
          >
            상담 바로 요청하기
          </Link>
        </div>
      </section>
    </div>
  );
}

