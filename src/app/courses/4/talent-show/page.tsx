"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const categories = [
  { name: "唱歌", emoji: "🎤", examples: "兒歌、老歌、流行歌、民謠" },
  { name: "跳舞", emoji: "💃", examples: "民族舞、現代舞、廣場舞、兒童舞" },
  { name: "說故事", emoji: "📖", examples: "童話、民間故事、生活故事、歷史故事" },
  { name: "繪畫手工", emoji: "🎨", examples: "畫畫、摺紙、剪紙、書法" },
  { name: "運動技能", emoji: "🏃", examples: "太極拳、體操、球類、武術" },
  { name: "樂器演奏", emoji: "🎹", examples: "鋼琴、吉他、口琴、打擊樂" },
];

const cardBgs = [
  "var(--color-postit-pink)", "var(--color-postit-blue)", "var(--color-postit-yellow)",
  "var(--color-postit-green)", "#F3E5F5", "#FFF3E0",
];

export default function TalentShowPage() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showPerformerSelect, setShowPerformerSelect] = useState(false);
  const [showStage, setShowStage] = useState(false);
  const [performer, setPerformer] = useState("");

  const selectCategory = (index: number) => {
    setSelectedCategory(categories[index]);
    setSelectedIndex(index);
    setShowPerformerSelect(true);
    setShowStage(false);
  };

  const startShow = (who: "child" | "elder") => {
    setPerformer(who === "child" ? "👧 小朋友正在表演..." : "👴 長輩正在表演...");
    setShowStage(true);
  };

  const endShow = () => {
    setShowStage(false);
    setShowPerformerSelect(false);
    setSelectedCategory(null);
    setSelectedIndex(null);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 900, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/4" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 5 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🎤 才藝表演</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>選一個才藝類別，大家一起表演吧！</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
        {categories.map((c, i) => (
          <div key={i} onClick={() => selectCategory(i)} style={{
            background: selectedIndex === i ? "var(--color-primary-lighter)" : cardBgs[i],
            border: `var(--border-width) solid ${selectedIndex === i ? "var(--color-primary)" : "var(--color-border)"}`,
            borderRadius: i % 3 === 0 ? "var(--wobble-1)" : i % 3 === 1 ? "var(--wobble-2)" : "var(--wobble-3)",
            padding: "var(--space-xl)", textAlign: "center", cursor: "pointer",
            transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)",
          }}>
            <span style={{ fontSize: 56, display: "block", marginBottom: "var(--space-sm)" }}>{c.emoji}</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", fontWeight: 700, marginBottom: "var(--space-xs)", display: "block" }}>{c.name}</span>
            <span style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-muted)" }}>{c.examples}</span>
          </div>
        ))}
      </div>

      {showPerformerSelect && !showStage && (
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)", animation: "fadeInUp 0.4s ease both" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>誰先表演？</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)" }}>
            <div onClick={() => startShow("child")} style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl) var(--space-2xl)", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)" }}>
              <span style={{ fontSize: 56, display: "block", marginBottom: "var(--space-sm)" }}>👧</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>小朋友先</span>
            </div>
            <div onClick={() => startShow("elder")} style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl) var(--space-2xl)", textAlign: "center", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)" }}>
              <span style={{ fontSize: 56, display: "block", marginBottom: "var(--space-sm)" }}>👴</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>長輩先</span>
            </div>
          </div>
        </div>
      )}

      {showStage && selectedCategory && (
        <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", textAlign: "center", color: "white", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)", animation: "celebrate 0.5s ease both" }}>
          <span style={{ fontSize: 100, display: "block", marginBottom: "var(--space-md)" }}>{selectedCategory.emoji}</span>
          <h2 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-xs)" }}>{selectedCategory.name}表演</h2>
          <p style={{ fontSize: "var(--font-size-xl)", opacity: 0.85, marginBottom: "var(--space-lg)" }}>{performer}</p>
          <button className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }} onClick={endShow}>👏 結束表演</button>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "var(--wobble-3)", padding: "var(--space-md)", marginTop: "var(--space-lg)", fontSize: "var(--font-size-lg)" }}>
            💡 觀眾們，請給表演者掌聲鼓勵！每人 2-3 分鐘表演時間
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/4", label: "課程" }} next={{ href: "/courses/4/ensemble", label: "合唱合奏" }} />
    </div>
  );
}
