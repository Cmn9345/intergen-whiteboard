"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const activities = [
  { name: "煮飯", emoji: "🍳" },
  { name: "掃地", emoji: "🧹" },
  { name: "洗碗", emoji: "🍽️" },
  { name: "澆花", emoji: "🌻" },
  { name: "曬衣服", emoji: "👕" },
  { name: "說故事", emoji: "📖" },
  { name: "遛狗", emoji: "🐕" },
  { name: "修東西", emoji: "🔧" },
];

const familyMembers = [
  { name: "爸爸", emoji: "👨" },
  { name: "媽媽", emoji: "👩" },
  { name: "阿公", emoji: "👴" },
  { name: "阿嬤", emoji: "👵" },
  { name: "哥哥", emoji: "👦" },
  { name: "姊姊", emoji: "👧" },
  { name: "弟弟", emoji: "🧒" },
  { name: "妹妹", emoji: "👶" },
  { name: "我", emoji: "🙋" },
];

export default function CharadesPage() {
  const [currentActivity, setCurrentActivity] = useState<typeof activities[0] | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [showReading, setShowReading] = useState(false);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW"; u.rate = 1.2; u.pitch = 1.4;
    u.onstart = () => setShowReading(true);
    u.onend = () => setShowReading(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }, []);

  const drawCard = useCallback(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    setCurrentActivity(activity);
    setSelectedMembers(new Set());
    setShowCard(true);
    setShowDiscussion(false);
    setTimeout(() => speak(activity.name), 3000);
  }, [speak]);

  const toggleMember = useCallback((name: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    setCurrentActivity(null);
    setSelectedMembers(new Set());
    setShowCard(false);
    setShowDiscussion(false);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 800, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/3" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 4 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🎭 比手畫腳</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>抽一張家事卡，猜猜家裡誰在做這件事</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <button className="btn btn-primary btn-lg" onClick={drawCard}>🎴 抽一張家事卡</button>
      </div>

      {showReading && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-xs) var(--space-md)", background: "var(--color-postit-blue)", border: "2px solid var(--color-border)", borderRadius: 20, fontSize: "var(--font-size-base)", animation: "pulse 1s ease-in-out infinite" }}>🔊 正在朗讀...</div>
      )}

      {showCard && currentActivity && (
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", textAlign: "center", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)", animation: "celebrate 0.5s ease both" }}>
          <span style={{ fontSize: 100, marginBottom: "var(--space-md)", display: "block" }}>{currentActivity.emoji}</span>
          <div style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>{currentActivity.name}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => speak(currentActivity.name)}>🔊 再唸一次</button>
            <button className="btn btn-primary" onClick={() => setShowDiscussion(true)}>👨‍👩‍👧‍👦 誰在做這件事？</button>
          </div>
        </div>
      )}

      {showDiscussion && currentActivity && (
        <div style={{ background: "var(--color-postit-green)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>👨‍👩‍👧‍👦 家裡誰在做「{currentActivity.name}」？</h2>
          <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)" }}>點選家人的圖示</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
            {familyMembers.map((m) => (
              <div key={m.name} onClick={() => toggleMember(m.name)} style={{
                background: selectedMembers.has(m.name) ? "var(--color-primary-lighter)" : "var(--color-bg-card)",
                border: `${selectedMembers.has(m.name) ? "3px" : "2px"} solid ${selectedMembers.has(m.name) ? "var(--color-primary)" : "var(--color-border)"}`,
                borderRadius: "var(--wobble-3)", padding: "var(--space-md)", textAlign: "center",
                cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch-sm)",
              }}>
                <span style={{ fontSize: 40, display: "block", marginBottom: "var(--space-xs)" }}>{m.emoji}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--font-size-lg)" }}>{m.name}</span>
              </div>
            ))}
          </div>
          {selectedMembers.size > 0 && (
            <div style={{ background: "var(--color-postit-yellow)", border: "2px solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-md)", marginTop: "var(--space-md)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--space-sm)" }}>你選的是：</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
                {[...selectedMembers].map((name) => {
                  const m = familyMembers.find((f) => f.name === name)!;
                  return <span key={name} style={{ background: "var(--color-bg-card)", border: "2px solid var(--color-border)", borderRadius: 20, padding: "var(--space-xs) var(--space-md)", fontFamily: "var(--font-heading)", fontWeight: 700 }}>{m.emoji} {m.name}</span>;
                })}
              </div>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "var(--space-lg)" }}>
            <button className="btn btn-outline" onClick={drawCard}>🎴 抽下一張</button>{" "}
            <button className="btn btn-ghost" onClick={resetGame}>🔄 重新開始</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/3/family-quiz", label: "家庭測驗" }} next={{ href: "/courses/3", label: "回課程" }} />
    </div>
  );
}
