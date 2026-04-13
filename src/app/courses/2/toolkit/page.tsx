"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const professions = [
  { name: "醫生", emoji: "👨‍⚕️", tools: [
    { emoji: "🩺", name: "聽診器" }, { emoji: "🌡️", name: "體溫計" },
    { emoji: "💉", name: "注射器" }, { emoji: "😷", name: "口罩" },
  ]},
  { name: "廚師", emoji: "👨‍🍳", tools: [
    { emoji: "🍲", name: "鍋子" }, { emoji: "🥄", name: "鍋鏟" },
    { emoji: "🔪", name: "菜刀" }, { emoji: "👨‍🍳", name: "圍裙" },
  ]},
  { name: "老師", emoji: "👩‍🏫", tools: [
    { emoji: "🖊️", name: "粉筆" }, { emoji: "📋", name: "黑板" },
    { emoji: "📖", name: "書本" }, { emoji: "👓", name: "眼鏡" },
  ]},
  { name: "警察", emoji: "👮", tools: [
    { emoji: "🪪", name: "警徽" }, { emoji: "⛓️", name: "手銬" },
    { emoji: "📻", name: "對講機" }, { emoji: "🚔", name: "警車" },
  ]},
  { name: "消防員", emoji: "🧑‍🚒", tools: [
    { emoji: "🚒", name: "消防車" }, { emoji: "🪣", name: "水管" },
    { emoji: "⛑️", name: "安全帽" }, { emoji: "🪜", name: "梯子" },
  ]},
  { name: "建築師", emoji: "👷", tools: [
    { emoji: "📏", name: "尺" }, { emoji: "✏️", name: "鉛筆" },
    { emoji: "📐", name: "設計圖" }, { emoji: "🧮", name: "計算機" },
  ]},
];

const pairsData = [
  { adult: "👨‍⚕️", child: "🧒", label: "醫生", adultLabel: "大醫生", childLabel: "小醫生" },
  { adult: "👨‍🍳", child: "🧒", label: "廚師", adultLabel: "大廚師", childLabel: "小廚師" },
  { adult: "👩‍🏫", child: "🧒", label: "老師", adultLabel: "大老師", childLabel: "小老師" },
  { adult: "👮", child: "🧒", label: "警察", adultLabel: "大警察", childLabel: "小警察" },
  { adult: "🧑‍🚒", child: "🧒", label: "消防員", adultLabel: "大消防員", childLabel: "小消防員" },
  { adult: "👷", child: "🧒", label: "建築師", adultLabel: "大建築師", childLabel: "小建築師" },
];

const wobbles = ["var(--wobble-1)", "var(--wobble-2)", "var(--wobble-3)"];

export default function ToolkitPage() {
  const [mode, setMode] = useState<"tools" | "pairs">("tools");
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 960, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/2" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 3 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🔧 職業工具箱</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>認識不同職業和他們的工具</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
        <button className={mode === "tools" ? "btn btn-primary" : "btn btn-outline"} onClick={() => setMode("tools")}>🔧 工具探索</button>
        <button className={mode === "pairs" ? "btn btn-primary" : "btn btn-outline"} onClick={() => setMode("pairs")}>👫 職業配對</button>
      </div>

      {mode === "tools" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
            {professions.map((p, i) => (
              <div key={i} onClick={() => setSelectedProfession(i)} style={{
                background: selectedProfession === i ? "var(--color-primary-lighter)" : "var(--color-bg-card)",
                border: `var(--border-width) solid ${selectedProfession === i ? "var(--color-primary)" : "var(--color-border)"}`,
                borderRadius: wobbles[i % 3], padding: "var(--space-xl)", textAlign: "center",
                cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)",
              }}>
                <span style={{ fontSize: 56, marginBottom: "var(--space-sm)", display: "block" }}>{p.emoji}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", fontWeight: 700 }}>{p.name}</span>
              </div>
            ))}
          </div>
          {selectedProfession !== null && (
            <div style={{ marginTop: "var(--space-xl)", background: "var(--color-postit-yellow)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", animation: "celebrate 0.4s ease both" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)", textAlign: "center" }}>
                {professions[selectedProfession].emoji} {professions[selectedProfession].name}的工具
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-md)" }}>
                {professions[selectedProfession].tools.map((t, i) => (
                  <div key={i} style={{ background: "var(--color-bg-card)", border: "2px solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-md)", textAlign: "center", boxShadow: "var(--shadow-sketch-sm)" }}>
                    <span style={{ fontSize: 40, display: "block", marginBottom: "var(--space-xs)" }}>{t.emoji}</span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {mode === "pairs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}>
          {pairsData.map((p, i) => (
            <div key={i} style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-lg)", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)" }}>
              <div style={{ fontSize: 48, marginBottom: "var(--space-md)", display: "flex", justifyContent: "center", gap: "var(--space-md)" }}>
                <span>{p.adult}</span><span>↔</span><span>{p.child}</span>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{p.label}</div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-base)", marginTop: "var(--space-xs)" }}>{p.adultLabel} vs {p.childLabel}</div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/2/storybook", label: "繪本故事" }} next={{ href: "/courses/2", label: "回課程" }} />
    </div>
  );
}
