"use client";

import styles from "./SavingsImpact.module.css";

type Feature = {
  iconClass: string;
  label: string;
};

type Detail = {
  iconClass: string;
  title: string;
  amount: string;
  description: string;
};

const featureHighlights: Feature[] = [
  { iconClass: "fas fa-hand-holding-usd", label: "전문가와 함께 최대한도" },
  { iconClass: "fas fa-rocket", label: "처리 기간 3배 단축" },
  { iconClass: "fas fa-trophy", label: "승인율 95% 달성" },
];

const savingsDetails: Detail[] = [
  {
    iconClass: "fas fa-calculator",
    title: "전문가와 함께 정책분석",
    amount: "1억 이상",
    description: "최대한도 자금확보 목표",
  },
  {
    iconClass: "fas fa-clock",
    title: "시간 단축",
    amount: "1,000만원",
    description: "시간의 가치",
  },
  {
    iconClass: "fas fa-chart-line",
    title: "성공률 향상",
    amount: "100만원 이상",
    description: "재신청 시간+비용 절감",
  },
  {
    iconClass: "fas fa-shield-alt",
    title: "리스크 방지",
    amount: "300만원",
    description: "실패 비용 예방",
  },
];

export default function SavingsImpact() {
  return (
    <section className={styles.section} aria-labelledby="experts-savings-title">
      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.coinGroup}>
            <div className={styles.coinIcon}>
              <i className="fas fa-calculator" aria-hidden="true" />
              <div className={styles.coinPulse} aria-hidden="true" />
              <span className={styles.amountBadge}>1억+</span>
            </div>
            <div className={styles.titleGroup}>
              <h2 id="experts-savings-title" className={styles.heading}>
                기업심사관과 함께
                <span className={styles.highlight}>한도는 높이고, 이자율은 낮추고</span>
              </h2>
              <p className={styles.subtitle}>
                <span className={styles.brand}>기업심사관</span>과 함께
                <span className={styles.system}>비용은 줄이고, 성공률은 높이고</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.centerColumn}>
          <ul className={styles.featureList}>
            {featureHighlights.map(({ iconClass, label }) => (
              <li key={label} className={styles.featureItem}>
                <i className={iconClass} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.detailGrid}>
            {savingsDetails.map(({ iconClass, title, amount, description }) => (
              <article key={title} className={styles.detailCard}>
                <i className={iconClass} aria-hidden="true" />
                <div className={styles.detailText}>
                  <h3>{title}</h3>
                  <span className={styles.detailAmount}>{amount}</span>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.note}>*평균 절감 비용 기준 (2024년 고객 데이터)</p>
        </div>
      </div>
    </section>
  );
}
