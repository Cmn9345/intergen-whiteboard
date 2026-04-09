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
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>😊 認識情緒表情</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>認識 5 種基本情緒，學習表達自己的心情</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}>
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
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>🎯 活動目標</h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0 }}>
          {["認識 5 種基本情緒", "學習用表情表達不同的情緒", "練習觀察他人的表情", "學會用語言描述自己的心情"].map((item, i) => (
            <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
              <span style={{ flexShrink: 0 }}>🎯</span> {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>💡 活動方式</h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0 }}>
          {["看看上面的表情，跟著做出一樣的表情", "猜猜你的夥伴現在是什麼心情", "分享一件讓你有這種心情的事"].map((item, i) => (
            <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
              <span style={{ flexShrink: 0 }}>🎯</span> {item}
            </li>
          ))}
        </ul>
      </div>

      </div>
      <FloatingNav prev={{ href: "/courses/1/find-partner", label: "找夥伴" }} next={{ href: "/courses/1/emotion-wheel", label: "情緒輪盤" }} />
    </div>
  );
}
