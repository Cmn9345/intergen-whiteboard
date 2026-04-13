"use client";

import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

export default function ClapAlongPage() {
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
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            如果開心你就跟我拍拍手
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>跟著音樂一起動起來，用肢體表達開心的心情</p>
        </div>

        {/* YouTube Video */}
        <div style={{ marginBottom: "var(--space-2xl)", background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-lg)", boxShadow: "var(--shadow-sketch)" }}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "var(--wobble-2)", overflow: "hidden", border: "var(--border-width) solid var(--color-border)" }}>
            <iframe
              src="https://www.youtube.com/embed/wAGJVPXaHHk"
              title="如果開心你就跟我拍拍手"
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
              "跟著影片一起唱「如果開心你就拍拍手」",
              "開心 → 拍拍手，難過 → 跺跺腳，生氣 → 握握拳",
              "祖孫一起做動作，看誰反應最快",
              "用肢體動作表達不同的情緒",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: "var(--space-sm)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="m9 18 6-6-6-6"/></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FloatingNav prev={{ href: "/courses/1", label: "回課程" }} next={{ href: "/courses/1/emotion-faces", label: "情緒表情" }} />
    </div>
  );
}
