import '@/styles/cta-shared.css';
import Link from 'next/link';
type StandardBottomCtaProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonHref: string;
  buttonLabel: string;
  className?: string;
  buttonAriaLabel?: string;
};

export function StandardBottomCta({
  eyebrow,
  title,
  subtitle,
  buttonHref,
  buttonLabel,
  className,
  buttonAriaLabel,
}: StandardBottomCtaProps) {
  return (
    <div className={`certified-examiners__cta ${className ?? ''}`.trim()}>
      <div className="certified-examiners__cta-banner">
        <div className="certified-examiners__cta-content">
          {eyebrow ? <p className="certified-examiners__cta-eyebrow">{eyebrow}</p> : null}
          <h3 className="certified-examiners__cta-title">{title}</h3>
          {subtitle ? <p className="certified-examiners__cta-subtitle">{subtitle}</p> : null}
        </div>
        <Link
          href={buttonHref}
          className="certified-examiners__cta-button"
          aria-label={buttonAriaLabel ?? buttonLabel}
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}

