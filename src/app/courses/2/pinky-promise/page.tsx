"use client";

import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

export default function PinkyPromisePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 900, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <Link
            href="/courses/2"
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
              padding: "12px 24px", borderRadius: "var(--wobble-4, 12px)",
              background: "var(--color-bg-card)", border: "2px solid var(--color-border)",
              color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)",
              boxShadow: "var(--shadow-sketch-sm)", fontSize: "var(--font-size-base, 18px)",
              textDecoration: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            回到第 3 週
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
            打勾勾
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>
            跟著影片一起唱打勾勾，說出你的夢想與約定
          </p>
        </div>

        {/* YouTube Video */}
        <div style={{ marginBottom: "var(--space-2xl)", background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-lg)", boxShadow: "var(--shadow-sketch)" }}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "var(--wobble-2)", overflow: "hidden", border: "var(--border-width) solid var(--color-border)" }}>
            <iframe
              src="https://www.youtube.com/embed/iJaD3OIVXcQ"
              title="打勾勾"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>

        {/* Activity instructions */}
        <div style={{ background: "var(--color-postit-yellow)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            活動說明
          </h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0 }}>
            {[
              "跟著影片一起唱「打勾勾」",
              "祖孫互相伸出小指頭，勾在一起",
              "輪流說出一個想跟對方一起完成的夢想或約定",
              "打勾勾、蓋印章，把心意留下來",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="m9 18 6-6-6-6"/></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Discussion prompts */}
        <div style={{ background: "var(--color-postit-pink, #FFE0E0)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-md)" }}>
            💬 聊聊看
          </h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0 }}>
            {[
              "阿公阿嬤小時候有跟誰打過勾勾嗎？約定了什麼？",
              "小朋友最想跟阿公阿嬤一起做什麼事？",
              "說好的事情沒做到，可以怎麼辦？",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                <span style={{ flexShrink: 0, marginTop: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--color-marker-red)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FloatingNav prev={{ href: "/courses/2", label: "回課程" }} next={{ href: "/courses/2/career-maze", label: "職業迷宮" }} />
    </div>
  );
}
