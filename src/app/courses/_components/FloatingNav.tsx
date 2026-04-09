"use client";
import Link from "next/link";

type NavItem = { href: string; label: string } | null;
type ClickAction = { onClick: () => void; label: string } | null;

/**
 * FloatingNav - 左右大面積點擊區域導航
 *
 * 支援兩種模式：
 * 1. Link 模式（prev/next）— 點擊跳轉頁面
 * 2. Action 模式（onPrev/onNext）— 點擊執行函式（如換頁、換步驟）
 *
 * Action 優先於 Link。
 */
export default function FloatingNav({
  prev,
  next,
  onPrev,
  onNext,
}: {
  prev?: NavItem;
  next?: NavItem;
  onPrev?: ClickAction;
  onNext?: ClickAction;
}) {
  const zoneStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    bottom: 0,
    width: 120,
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textDecoration: "none",
    color: "var(--color-text-muted)",
    transition: "background 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    fontSize: "var(--font-size-sm, 16px)",
    textAlign: "center",
    lineHeight: 1.3,
    opacity: 0.4,
    transition: "opacity 0.2s ease",
    pointerEvents: "none",
  };

  const hoverIn = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
    const label = (e.currentTarget as HTMLElement).querySelector("[data-label]") as HTMLElement;
    if (label) label.style.opacity = "1";
  };
  const hoverOut = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.background = "";
    const label = (e.currentTarget as HTMLElement).querySelector("[data-label]") as HTMLElement;
    if (label) label.style.opacity = "0.4";
  };

  const prevAction = onPrev || prev;
  const nextAction = onNext || next;

  return (
    <>
      {prevAction && (
        onPrev ? (
          <div
            onClick={onPrev.onClick}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            style={{ ...zoneStyle, left: 0 }}
          >
            <div data-label="" style={labelStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>{onPrev.label}</span>
            </div>
          </div>
        ) : prev ? (
          <Link
            href={prev.href}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            style={{ ...zoneStyle, left: 0 }}
          >
            <div data-label="" style={labelStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>{prev.label}</span>
            </div>
          </Link>
        ) : null
      )}
      {nextAction && (
        onNext ? (
          <div
            onClick={onNext.onClick}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            style={{ ...zoneStyle, right: 0 }}
          >
            <div data-label="" style={labelStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span>{onNext.label}</span>
            </div>
          </div>
        ) : next ? (
          <Link
            href={next.href}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            style={{ ...zoneStyle, right: 0 }}
          >
            <div data-label="" style={labelStyle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span>{next.label}</span>
            </div>
          </Link>
        ) : null
      )}
    </>
  );
}
