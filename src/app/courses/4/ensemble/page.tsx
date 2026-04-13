"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const songs = [
  { name: "河馬歌", emoji: "🦛", videoId: "1OjkOZ7HhFc", desc: "可愛的河馬歌" },
  { name: "A Ram Sam Sam", emoji: "🎵", videoId: "t59wPLPdzcM", desc: "經典律動歌曲" },
  { name: "擁抱世界擁抱你", emoji: "🤗", videoId: "rBvJ3CFnnQU", desc: "溫暖的擁抱歌" },
  { name: "人人做環保", emoji: "♻️", videoId: "-Cmj65rNdok", desc: "環保小尖兵" },
  { name: "捏泥巴", emoji: "🏺", videoId: "qn_0T9gerCA", desc: "手作泥巴歌" },
  { name: "丟丟銅仔", emoji: "🎼", videoId: "baRAM0RVhn8", desc: "台灣民謠經典" },
];

const cardBgs = [
  "var(--color-postit-yellow)", "var(--color-postit-pink)", "var(--color-postit-blue)",
  "var(--color-postit-green)", "#F3E5F5", "#FFF3E0",
];

export default function EnsemblePage() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const playSong = (index: number) => {
    const s = songs[index];
    setVideoTitle(`🎵 ${s.name}`);
    setVideoSrc(`https://www.youtube.com/embed/${s.videoId}?autoplay=1&feature=oembed`);
    setShowVideo(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeVideo = () => {
    setVideoSrc("");
    setShowVideo(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 1000, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/4" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 5 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🎶 合唱合奏</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>選一首歌，大家一起唱！</p>
      </div>

      {showVideo && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)" }}>{videoTitle}</h2>
            <button className="btn btn-outline" onClick={closeVideo}>X 關閉</button>
          </div>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-sketch)", background: "#000" }}>
            <iframe
              src={videoSrc}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              title="合唱合奏"
            />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-lg)" }}>
        {songs.map((s, i) => (
          <div key={i} onClick={() => playSong(i)} style={{
            background: cardBgs[i], border: "var(--border-width) solid var(--color-border)",
            borderRadius: i % 3 === 0 ? "var(--wobble-1)" : i % 3 === 1 ? "var(--wobble-2)" : "var(--wobble-3)",
            padding: "var(--space-xl)", display: "flex", alignItems: "center", gap: "var(--space-lg)",
            cursor: "pointer", transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch)",
          }}>
            <span style={{ fontSize: 48, flexShrink: 0 }}>{s.emoji}</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", fontWeight: 700 }}>{s.name}</h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-base)" }}>{s.desc}</p>
            </div>
            <div style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
          </div>
        ))}
      </div>

      </div>
      <FloatingNav prev={{ href: "/courses/4/talent-show", label: "才藝表演" }} next={{ href: "/courses/4", label: "回課程" }} />
    </div>
  );
}
