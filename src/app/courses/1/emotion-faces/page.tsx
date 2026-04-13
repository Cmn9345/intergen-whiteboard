"use client";

import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const emotions = [
  { emoji: "😄", name: "開心", bg: "var(--color-happy-light)" },
  { emoji: "😢", name: "難過", bg: "var(--color-sad-light)" },
  { emoji: "😠", name: "生氣", bg: "var(--color-angry-light)" },
  { emoji: "😨", name: "害怕", bg: "#FFF3E0" },
  { emoji: "😲", name: "驚訝", bg: "#F3E5F5" },
];

const wobbles = ["var(--wobble-1)", "var(--wobble-2)", "var(--wobble-3)", "var(--wobble-4)", "var(--wobble-1)"];

export default function EmotionFacesPage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 900, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/1" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 2 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          認識情緒表情
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>認識 5 種基本情緒，學習表達自己的心情</p>
      </div>

      <div className="emotion-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}>
        {emotions.map((e, i) => (
          <div key={i} style={{
            background: e.bg,
            border: "var(--border-width) solid var(--color-border)",
            borderRadius: wobbles[i],
            padding: "var(--space-xl)",
            textAlign: "center",
            boxShadow: "var(--shadow-sketch)",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 64, marginBottom: "var(--space-md)", display: "block" }}>{e.emoji}</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", fontWeight: 700 }}>{e.name}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          活動目標
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0 }}>
          {["認識 5 種基本情緒", "學習用表情表達不同的情緒", "練習觀察他人的表情", "學會用語言描述自己的心情"].map((item, i) => (
            <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="m9 18 6-6-6-6"/></svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          活動方式
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0 }}>
          {["看看上面的表情，跟著做出一樣的表情", "猜猜你的夥伴現在是什麼心情", "分享一件讓你有這種心情的事"].map((item, i) => (
            <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="m9 18 6-6-6-6"/></svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      </div>
      <FloatingNav prev={{ href: "/courses/1/find-partner", label: "找夥伴" }} next={{ href: "/courses/1/emotion-wheel", label: "情緒輪盤" }} />
    </div>
  );
}
