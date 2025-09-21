"use client";

import styles from "./TrustGuarantee.module.css";

type Feature = {
  iconClass: string;
  text: string;
};

type Guarantee = {
  iconClass: string;
  title: string;
  description: string;
};

const featureHighlights: Feature[] = [
  { iconClass: "fas fa-users", text: "혼자가 아닙니다, 함께합니다" },
  { iconClass: "fas fa-hand-holding-usd", text: "안 되면 돈 안 받습니다" },
  { iconClass: "fas fa-redo", text: "될 때까지 도와드립니다" },
];

const guaranteeDetails: Guarantee[] = [
  {
    iconClass: "fas fa-undo-alt",
    title: "전액 환불",
    description: "서비스 불만족 시 100% 환불",
  },
  {
    iconClass: "fas fa-file-contract",
    title: "계약서 보장",
    description: "법적 효력 있는 문서로 보증",
  },
  {
    iconClass: "fas fa-user-shield",
    title: "전문가 책임",
    description: "실명 전문가가 1:1 전담",
  },
  {
    iconClass: "fas fa-handshake",
    title: "손해 배상",
    description: "과실 발생 시 즉시 보상",
  },
];

export default function TrustGuarantee() {
  return (
    <section className={styles.section} aria-labelledby="experts-trust-title">
      <div className={styles.layout}>
        <div className={styles.leftColumn}>
          <div className={styles.shieldGroup}>
            <div className={styles.shieldIcon}>
              <i className="fas fa-shield-alt" aria-hidden="true" />
              <div className={styles.shieldPulse} aria-hidden="true" />
              <span className={styles.bonusBadge}>100%</span>
            </div>

            <div className={styles.titleGroup}>
              <h2 id="experts-trust-title" className={styles.heading}>
                나라똔이 보증하는 전문 기업심사관이
                <span className={styles.highlight}>최대한도 자금 끝까지 책임집니다</span>
              </h2>
              <p className={styles.subtitle}>
                <span className={styles.brand}>나라똔</span>
                <span className={styles.system}>100% 책임보증 시스템</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.centerColumn}>
          <ul className={styles.featureList}>
            {featureHighlights.map(({ iconClass, text }) => (
              <li key={text} className={styles.featureItem}>
                <i className={iconClass} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.guaranteeGrid}>
            {guaranteeDetails.map(({ iconClass, title, description }) => (
              <article key={title} className={styles.guaranteeCard}>
                <i className={iconClass} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.note}>*나라똔 표준계약서에 근거한 보증제도</p>
        </div>
      </div>
    </section>
  );
}
