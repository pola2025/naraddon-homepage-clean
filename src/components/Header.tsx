"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";

import { useAuth } from "@/contexts/AuthContext";
import CanAccess from "./CanAccess";
import styles from "./Header.module.css";

const LOGO_URL = "/images/Logo_old.png";
const LOGO_FALLBACK_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0NCIgdmlld0JveD0iMCAwIDQ0IDQ0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHJ4PSI4IiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1NCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJQcmV0ZW5kYXJkLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IndoaXRlIj5OPC90ZXh0Pjwvc3ZnPg==";
const BRAND_NAME = "Naraddon";
const TAGLINE = "No.1 정책자금 플랫폼";
const LOGIN_LABEL = "로그인";
const MORE_LABEL = "더보기";

type NavItem = {
  href: string;
  label: string;
};

type Viewport = "desktop" | "tablet" | "mobile";

const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "나라똔" },
  { href: "/policy-analysis", label: "정책분석" },
  { href: "/business-voice", label: "사업자 목소리" },
  { href: "/certified-examiners", label: "인증 기업심사관" },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/expert-services", label: "전문가 서비스" },
  { href: "/consultation-request", label: "상담신청" },
];

const ALL_NAV_ITEMS = [...PRIMARY_NAV, ...SECONDARY_NAV];

const ADMIN_NAV: NavItem = { href: "/admin", label: "관리자" };
const EXAMINER_NAV: NavItem = { href: "/examiner", label: "심사관" };

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const [logoError, setLogoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("desktop");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const calculateViewport = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setViewport("mobile");
      } else if (width <= 1024) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    };

    calculateViewport();
    window.addEventListener("resize", calculateViewport);
    return () => window.removeEventListener("resize", calculateViewport);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsSecondaryOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSecondaryOpen(false);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsSecondaryOpen(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/hero-preview") {
    return null;
  }

  const visiblePrimary = useMemo(() => {
    if (viewport === "tablet") {
      return PRIMARY_NAV.slice(0, 3);
    }
    return PRIMARY_NAV;
  }, [viewport]);

  const dropdownItems = useMemo(() => {
    if (viewport === "tablet") {
      const extra = PRIMARY_NAV[3];
      return extra ? [...SECONDARY_NAV, extra] : SECONDARY_NAV;
    }
    return SECONDARY_NAV;
  }, [viewport]);

  const isActivePath = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name?.[0] || user?.email?.[0] || "U";
  const roleLabel =
    user?.role === "admin"
      ? "관리자"
      : user?.role === "examiner"
        ? "심사관"
        : "일반 회원";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderNavLink = (item: NavItem, className: string, onClick?: () => void) => (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );

  return (
    <>
      <header className={clsx(styles.header, isScrolled && styles.scrolled)}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className={styles.hamburgerIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              {!logoError ? (
                <img
                  src={LOGO_URL}
                  alt="나라똔 로고"
                  className={styles.logo}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <img src={LOGO_FALLBACK_URL} alt="나라똔 로고" className={styles.logo} />
              )}
              <div className={styles.brandText}>
                <span className={styles.brandName}>{BRAND_NAME}</span>
                <span className={styles.tagline}>{TAGLINE}</span>
              </div>
            </Link>
          </div>

          <nav className={styles.nav} aria-label="주요 메뉴">
            <ul className={styles.navList}>
              {visiblePrimary.map((item) => (
                <li key={item.href} className={styles.navItem}>
                  {renderNavLink(
                    item,
                    clsx(styles.navLink, isActivePath(item.href) && styles.navLinkActive)
                  )}
                </li>
              ))}
            </ul>

            <div ref={dropdownRef} className={styles.dropdownWrapper}>
              <button
                type="button"
                className={clsx(styles.dropdownButton, isSecondaryOpen && styles.dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isSecondaryOpen}
                aria-controls="secondary-navigation"
                onClick={() => setIsSecondaryOpen((prev) => !prev)}
              >
                {MORE_LABEL}
                <svg className={styles.caretIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id="secondary-navigation"
                className={clsx(styles.dropdownMenu, isSecondaryOpen && styles.dropdownMenuOpen)}
                role="menu"
              >
                <ul className={styles.dropdownList}>
                  {dropdownItems.map((item) => (
                    <li key={item.href}>
                      {renderNavLink(
                        item,
                        clsx(styles.dropdownItem, isActivePath(item.href) && styles.navLinkActive)
                      )}
                    </li>
                  ))}

                  <li className={styles.dropdownDivider} role="presentation" />

                  <CanAccess role="admin" key="admin-dropdown">
                    <li>{renderNavLink(ADMIN_NAV, styles.dropdownItem)}</li>
                  </CanAccess>
                  <CanAccess role="examiner" key="examiner-dropdown">
                    <li>{renderNavLink(EXAMINER_NAV, styles.dropdownItem)}</li>
                  </CanAccess>
                </ul>
              </div>
            </div>
          </nav>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <div ref={profileRef} className={styles.profileDropdown}>
                <button
                  type="button"
                  className={clsx(styles.profileButton, isProfileOpen && styles.profileOpen)}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                  aria-controls="profile-menu"
                >
                  <span className={styles.profileInitial}>{initials}</span>
                  <span className={styles.profileName}>
                    {user?.name || user?.email?.split("@")[0] || "회원"}
                  </span>
                  <svg className={styles.caretIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  id="profile-menu"
                  className={clsx(styles.profileMenu, isProfileOpen && styles.profileMenuOpen)}
                  role="menu"
                >
                  <div className={styles.profileHeader}>
                    <div className={styles.profileHeaderName}>
                      {user?.name || "회원"}
                    </div>
                    <div className={styles.profileHeaderEmail}>{user?.email}</div>
                    {user?.role && <span className={styles.profileRole}>{roleLabel}</span>}
                  </div>

                  <div className={styles.profileList}>
                    <Link href="/profile" className={styles.profileLink}>
                      프로필 관리
                    </Link>
                    <CanAccess role="admin" key="admin-mobile">
                      <Link href="/admin/dashboard" className={styles.profileLink}>
                        관리자 대시보드
                      </Link>
                    </CanAccess>
                    <CanAccess role="examiner" key="examiner-mobile">
                      <Link href="/examiner/dashboard" className={styles.profileLink}>
                        심사관 대시보드
                      </Link>
                    </CanAccess>
                    <Link href="/my-consultations" className={styles.profileLink}>
                      내 상담 내역
                    </Link>
                    <button type="button" className={styles.profileLogout} onClick={handleLogout}>
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className={styles.loginButton}>
                {LOGIN_LABEL}
              </Link>
            )}
          </div>
        </div>
      </header>

      <aside
        className={clsx(styles.mobileDrawer, isMobileMenuOpen && styles.mobileDrawerOpen)}
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileDrawerHeader}>
          <Link href="/" className={styles.mobileBrandLink} onClick={closeMobileMenu}>
            {!logoError ? (
              <img src={LOGO_URL} alt="나라똔 로고" className={styles.logo} />
            ) : (
              <img src={LOGO_FALLBACK_URL} alt="나라똔 로고" className={styles.logo} />
            )}
            {BRAND_NAME}
          </Link>
          <button
            type="button"
            className={styles.mobileCloseButton}
            aria-label="메뉴 닫기"
            onClick={closeMobileMenu}
          >
            <svg className={styles.closeIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {isAuthenticated ? (
          <div className={styles.mobileProfileSummary}>
            <span className={styles.profileInitial}>{initials}</span>
            <div className={styles.mobileProfileInfo}>
              <span className={styles.mobileProfileName}>{user?.name || "회원"}</span>
              <span className={styles.mobileProfileEmail}>{user?.email}</span>
              {user?.role && <span className={styles.profileRole}>{roleLabel}</span>}
            </div>
          </div>
        ) : (
          <Link href="/auth/login" className={styles.loginButton} onClick={closeMobileMenu}>
            {LOGIN_LABEL}
          </Link>
        )}

        <nav className={styles.mobileNav} aria-label="모바일 메뉴">
          <ul className={styles.mobileNavList}>
            {ALL_NAV_ITEMS.map((item) => (
              <li key={item.href} className={styles.mobileNavItem}>
                {renderNavLink(
                  item,
                  clsx(styles.mobileNavLink, isActivePath(item.href) && styles.mobileNavLinkActive),
                  closeMobileMenu
                )}
              </li>
            ))}
            <CanAccess role="admin" key="admin-mobile">
              <li className={styles.mobileNavItem}>
                {renderNavLink(
                  ADMIN_NAV,
                  clsx(styles.mobileNavLink, isActivePath(ADMIN_NAV.href) && styles.mobileNavLinkActive),
                  closeMobileMenu
                )}
              </li>
            </CanAccess>
            <CanAccess role="examiner" key="examiner-mobile">
              <li className={styles.mobileNavItem}>
                {renderNavLink(
                  EXAMINER_NAV,
                  clsx(styles.mobileNavLink, isActivePath(EXAMINER_NAV.href) && styles.mobileNavLinkActive),
                  closeMobileMenu
                )}
              </li>
            </CanAccess>
          </ul>
        </nav>

        {isAuthenticated && (
          <div className={styles.mobileFooter}>
            <Link href="/profile" className={styles.mobileFooterLink} onClick={closeMobileMenu}>
              프로필 관리
            </Link>
            <Link href="/my-consultations" className={styles.mobileFooterLink} onClick={closeMobileMenu}>
              내 상담 내역
            </Link>
            <button type="button" className={styles.mobileLogoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        )}
      </aside>

      <div
        className={clsx(styles.mobileBackdrop, isMobileMenuOpen && styles.mobileBackdropOpen)}
        onClick={closeMobileMenu}
        role="presentation"
      />
    </>
  );
}
