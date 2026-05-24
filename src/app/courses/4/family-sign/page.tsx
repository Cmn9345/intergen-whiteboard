"use client";

import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

export default function FamilySignPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 1000, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
          <Link href="/courses/4" className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            回到第 5 週
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", transform: "rotate(-0.5deg)" }}>🤟 一家人手語</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>跟著影片學唱《一家人》並比手語</p>
        </div>

        <div style={{
          position: "relative", width: "100%", paddingBottom: "56.25%",
          borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-border)",
          overflow: "hidden", boxShadow: "var(--shadow-sketch)", background: "#000",
        }}>
          <iframe
            src="https://www.youtube.com/embed/1QcIwEhXxPI?feature=oembed"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title="一家人手語"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        <div style={{
          marginTop: "var(--space-xl)", background: "var(--color-postit-pink)",
          border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)",
          padding: "var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)",
        }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", marginBottom: "var(--space-sm)" }}>活動說明</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0, margin: 0 }}>
            {[
              "跟著影片學唱《一家人》並比手語",
              "感受家人之間的愛與連結",
              "祖孫一起比劃，留下溫暖回憶",
            ].map((t, i) => (
              <li key={i} style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)" }}>🤟 {t}</li>
            ))}
          </ul>
        </div>
      </div>
      <FloatingNav prev={{ href: "/courses/4/string-phone", label: "傳聲筒" }} next={{ href: "/courses/4", label: "回課程" }} />
    </div>
  );
}
