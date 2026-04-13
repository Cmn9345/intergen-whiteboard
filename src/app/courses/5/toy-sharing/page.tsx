"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const toys: Record<string, { emoji: string; name: string; desc: string }[]> = {
  traditional: [
    { emoji: "🪀", name: "陀螺", desc: "用繩子纏繞後用力甩出" },
    { emoji: "🪶", name: "毽子", desc: "用腳踢不讓它落地" },
    { emoji: "🌀", name: "竹蜻蜓", desc: "搓轉讓它飛上天" },
    { emoji: "🔮", name: "彈珠", desc: "用手指彈射玻璃珠" },
    { emoji: "⬜", name: "跳房子", desc: "在地上畫格子跳" },
    { emoji: "🧵", name: "翻花繩", desc: "用繩子變出不同花樣" },
  ],
  modern: [
    { emoji: "🧱", name: "樂高", desc: "用積木拼出任何東西" },
    { emoji: "👸", name: "芭比娃娃", desc: "幫娃娃換衣服打扮" },
    { emoji: "🚗", name: "遙控車", desc: "用遙控器操控小車" },
    { emoji: "🎮", name: "電子遊戲", desc: "在螢幕上玩遊戲" },
    { emoji: "🧩", name: "拼圖", desc: "把碎片拼成完整圖案" },
    { emoji: "🧊", name: "魔術方塊", desc: "轉動讓每面同色" },
  ],
};

const games = [
  { emoji: "✊✌️🖐️", name: "猜拳", rules: "石頭剪刀布！\n石頭贏剪刀，剪刀贏布，布贏石頭。\n三局兩勝制！" },
  { emoji: "🙈", name: "躲貓貓", rules: "一個人當鬼閉眼數到十，其他人趕快找地方躲起來！\n鬼要找到所有人才算贏。" },
  { emoji: "🦅🐥", name: "老鷹抓小雞", rules: "一個人當老鷹，一個人當母雞，其他人排在母雞後面當小雞。\n老鷹要抓到小雞，母雞要保護小雞！" },
  { emoji: "🪢", name: "跳繩", rules: "兩個人搖繩子，其他人輪流跳進去！\n看誰跳最多下不被絆到。" },
];

export default function ToySharingPage() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [rulesTitle, setRulesTitle] = useState("");
  const [rulesText, setRulesText] = useState("");

  const selectEra = (era: string) => {
    setSelectedEra(era);
  };

  const openRules = (index: number) => {
    const g = games[index];
    setRulesTitle(`${g.emoji} ${g.name}`);
    setRulesText(g.rules);
    setShowRules(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 960, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/5" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 6 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🎠 玩具時光機</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>一起來認識不同時代的玩具</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)", marginBottom: "var(--space-2xl)" }}>
        {[
          { key: "traditional", emoji: "🏺", name: "古早玩具", bg: "var(--color-postit-yellow)" },
          { key: "modern", emoji: "🤖", name: "現代玩具", bg: "var(--color-postit-blue)" },
        ].map((era, i) => (
          <div key={era.key} onClick={() => selectEra(era.key)} style={{
            background: selectedEra === era.key ? "var(--color-primary-lighter)" : era.bg,
            border: `var(--border-width) solid ${selectedEra === era.key ? "var(--color-primary)" : "var(--color-border)"}`,
            borderRadius: i === 0 ? "var(--wobble-1)" : "var(--wobble-2)",
            padding: "var(--space-xl) var(--space-2xl)", textAlign: "center", cursor: "pointer",
            transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)", minWidth: 200,
          }}>
            <span style={{ fontSize: 56, display: "block", marginBottom: "var(--space-sm)" }}>{era.emoji}</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", fontWeight: 700 }}>{era.name}</span>
          </div>
        ))}
      </div>

      {selectedEra && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)", animation: "fadeInUp 0.4s ease both" }}>
            {toys[selectedEra].map((t, i) => (
              <div key={i} style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-lg)", textAlign: "center", boxShadow: "var(--shadow-sketch)", transition: "all 0.2s ease" }}>
                <span style={{ fontSize: 56, display: "block", marginBottom: "var(--space-sm)" }}>{t.emoji}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700, marginBottom: "var(--space-xs)", display: "block" }}>{t.name}</span>
                <span style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-muted)" }}>{t.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-postit-green)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-lg)", textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", marginBottom: "var(--space-sm)" }}>💬 分享時間</h3>
            <p style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)" }}>和你的夥伴互相介紹自己時代最喜歡的玩具吧！</p>
          </div>
        </>
      )}

      <div style={{ marginTop: "var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", textAlign: "center", marginBottom: "var(--space-lg)" }}>🎯 傳統遊戲體驗</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-lg)" }}>
          {games.map((g, i) => (
            <div key={i} onClick={() => openRules(i)} style={{
              background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)",
              borderRadius: i % 2 === 0 ? "var(--wobble-1)" : "var(--wobble-2)",
              padding: "var(--space-xl)", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)",
            }}>
              <span style={{ fontSize: 48, display: "block", marginBottom: "var(--space-sm)" }}>{g.emoji}</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{g.name}</span>
            </div>
          ))}
        </div>
      </div>

      {showRules && (
        <div onClick={() => setShowRules(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", textAlign: "center", color: "white", maxWidth: 500, width: "90%", boxShadow: "var(--shadow-sketch)", animation: "celebrate 0.5s ease both" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>{rulesTitle}</h2>
            <p style={{ fontSize: "var(--font-size-xl)", lineHeight: 1.8, marginBottom: "var(--space-lg)", whiteSpace: "pre-line" }}>{rulesText}</p>
            <button className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }} onClick={() => setShowRules(false)}>👍 知道了</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/5", label: "課程" }} next={{ href: "/courses/5/storybook", label: "繪本故事" }} />
    </div>
  );
}
