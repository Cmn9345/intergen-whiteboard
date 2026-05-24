"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FloatingNav from "./FloatingNav";

type NavItem = { href: string; label: string };

export default function PdfStorybook({
  emoji = "📖",
  title,
  desc,
  imageBase,
  pageCount,
  ext = "jpg",
  backLink,
  backLabel,
  pdfHref,
  nav,
}: {
  emoji?: string;
  title: string;
  desc?: string;
  imageBase: string;
  pageCount: number;
  ext?: "jpg" | "png";
  backLink: string;
  backLabel: string;
  pdfHref?: string;
  nav?: { prev?: NavItem; next?: NavItem };
}) {
  const [page, setPage] = useState(1);
  const last = pageCount;

  const go = (delta: number) => setPage((p) => Math.min(last, Math.max(1, p + delta)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const src = `${imageBase}/page-${pad(page)}.${ext}`;

  const arrowBtn: React.CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "var(--border-width) solid var(--color-border)",
    background: "var(--color-bg-card)",
    boxShadow: "var(--shadow-sketch-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--color-text-secondary)",
    flexShrink: 0,
    transition: "all 0.15s ease",
  };
  const arrowBtnDisabled: React.CSSProperties = {
    ...arrowBtn,
    opacity: 0.35,
    cursor: "not-allowed",
    boxShadow: "none",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
        <div style={{ marginBottom: "var(--space-lg)", display: "flex", gap: "var(--space-sm)", alignItems: "center", flexWrap: "wrap", maxWidth: 1100, margin: "0 auto var(--space-lg)" }}>
          <Link href={backLink} className="back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            {backLabel}
          </Link>
          {pdfHref && (
            <a href={pdfHref} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 20px", borderRadius: "var(--wobble-4)", background: "var(--color-postit-yellow)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              下載原始 PDF
            </a>
          )}
        </div>

        <div
          onClick={() => page < last && go(1)}
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "var(--wobble-1)",
            border: "var(--border-width) solid var(--color-border)",
            background: "var(--color-bg-card)",
            boxShadow: "var(--shadow-sketch)",
            overflow: "hidden",
            cursor: page < last ? "pointer" : "default",
            userSelect: "none",
            marginBottom: "var(--space-md)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${title} 第 ${page} 頁`} style={{ width: "100%", display: "block" }} />

          <button
            aria-label="上一頁"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            disabled={page === 1}
            style={{
              ...(page === 1 ? arrowBtnDisabled : arrowBtn),
              position: "absolute",
              left: "var(--space-lg)",
              top: "50%",
              transform: "translateY(-50%)",
              background: page === 1 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <button
            aria-label="下一頁"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            disabled={page === last}
            style={{
              ...(page === last ? arrowBtnDisabled : arrowBtn),
              position: "absolute",
              right: "var(--space-lg)",
              top: "50%",
              transform: "translateY(-50%)",
              background: page === last ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>

          <div style={{
            position: "absolute",
            bottom: "var(--space-md)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 16px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--font-size-base)",
            fontWeight: 700,
            letterSpacing: 1,
          }}>
            {page} / {last}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: "var(--space-2xl)", flexWrap: "wrap", maxWidth: 1100, margin: "0 auto var(--space-2xl)" }}>
          {Array.from({ length: last }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-label={`跳到第 ${p} 頁`}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid var(--color-border)",
                background: p === page ? "var(--color-primary)" : "var(--color-bg-card)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "var(--space-md) 0 var(--space-xl)" }}>
          <Link href={backLink} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            回到課程列表
          </Link>
        </div>
      </div>
      {nav && <FloatingNav prev={nav.prev ?? undefined} next={nav.next ?? undefined} />}
    </div>
  );
}
