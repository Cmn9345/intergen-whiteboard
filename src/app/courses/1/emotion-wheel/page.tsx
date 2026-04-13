"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const emotions = [
  { name: "開心", color: "#F5C842", lightColor: "#FFF8E1", icon: "happy", questions: ["什麼事情讓你最開心？", "你開心的時候會做什麼？", "分享一件最近讓你開心的事"] },
  { name: "害怕", color: "#EF5350", lightColor: "#FFEBEE", icon: "fear", questions: ["你害怕什麼東西？", "害怕的時候你會怎麼做？", "誰會讓你覺得安心？"] },
  { name: "難過", color: "#5B9BD5", lightColor: "#E3F2FD", icon: "sad", questions: ["什麼時候你會難過？", "難過的時候你會找誰？", "怎樣可以讓自己好起來？"] },
  { name: "生氣", color: "#C62828", lightColor: "#FFCDD2", icon: "angry", questions: ["什麼事情會讓你生氣？", "生氣的時候可以怎麼做？", "有沒有讓你消氣的方法？"] },
  { name: "驚訝", color: "#7E57C2", lightColor: "#F3E5F5", icon: "surprise", questions: ["最近有什麼讓你驚訝的事？", "驚訝的時候你會有什麼反應？", "你覺得驚訝是好的還是不好的？"] },
];

const SECTOR_ANGLE = 360 / emotions.length;

function EmotionFaceSvg({ emotion, size = 28 }: { emotion: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      {emotion === "開心" && <><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>}
      {emotion === "害怕" && <><path d="M8 15s1.5-1 4-1 4 1 4 1" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M8 6.5 9.5 8.5" /><path d="M16 6.5 14.5 8.5" /></>}
      {emotion === "難過" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /><path d="M10 13.5 9 15.5" /></>}
      {emotion === "生氣" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><path d="M7.5 8 10 9" /><path d="M16.5 8 14 9" /></>}
      {emotion === "驚訝" && <><circle cx="12" cy="16" r="2" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><path d="M8 7 9 8.5" /><path d="M16 7 15 8.5" /></>}
    </svg>
  );
}

function buildWheelSectors() {
  const cx = 200, cy = 200, r = 190;
  return emotions.map((e, i) => {
    const startAngle = (i * SECTOR_ANGLE - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * SECTOR_ANGLE - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = SECTOR_ANGLE > 180 ? 1 : 0;
    const midAngle = ((i + 0.5) * SECTOR_ANGLE - 90) * Math.PI / 180;
    const tx = cx + r * 0.48 * Math.cos(midAngle);
    const ty = cy + r * 0.48 * Math.sin(midAngle);
    const ix = cx + r * 0.72 * Math.cos(midAngle);
    const iy = cy + r * 0.72 * Math.sin(midAngle);
    const textAngle = (i + 0.5) * SECTOR_ANGLE;
    return { e, i, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`, tx, ty, ix, iy, textAngle };
  });
}

const sectors = buildWheelSectors();

export default function EmotionWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [result, setResult] = useState<typeof emotions[0] | null>(null);
  const [showReading, setShowReading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const rotationRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload tick sound
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create a simple tick using AudioContext
      audioRef.current = null;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW"; u.rate = 1.2; u.pitch = 1.4; u.volume = 1.0;
    u.onstart = () => setShowReading(true);
    u.onend = () => setShowReading(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    setShowResult(false);

    // Random 5-8 full spins + random landing
    const spins = (5 + Math.random() * 3) * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotationRef.current + spins + randomAngle;
    rotationRef.current = newRotation;
    setCurrentRotation(newRotation);

    // Wait for animation to finish (4.5s matches CSS transition)
    setTimeout(() => {
      setIsSpinning(false);
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const sectorIndex = Math.floor(normalizedAngle / SECTOR_ANGLE) % emotions.length;
      const emotion = emotions[sectorIndex];
      setResult(emotion);
      setShowResult(true);
      speak(emotion.name);
      setTimeout(() => speak(`你什麼時候會${emotion.name}？`), 1800);
    }, 4500);
  }, [isSpinning, speak]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--color-bg)" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md) var(--space-xl)", flexShrink: 0 }}>
        <Link href="/courses/1" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 2 週
        </Link>
        <h1 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "var(--space-sm)", margin: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          情緒輪盤
        </h1>
        <div style={{ width: 100 }} />
      </div>

      {/* Main content: side by side */}
      <div className="wheel-layout" style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", padding: "0 var(--space-xl) var(--space-lg)" }}>

        {/* Left: Wheel + Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          {/* Wheel Container - enlarged */}
          <div className="wheel-container" style={{ position: "relative", width: 560, height: 560, flexShrink: 0 }}>

            {/* Outer ring decoration */}
            <div style={{
              position: "absolute", inset: -14,
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, #F5C842, #EF5350, #5B9BD5, #C62828, #7E57C2, #F5C842)",
              opacity: 0.15,
              filter: "blur(10px)",
            }} />

            {/* Wheel border ring */}
            <div style={{
              position: "absolute", inset: -8,
              borderRadius: "50%",
              border: "4px solid var(--color-border)",
              background: "var(--color-bg-card)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 2px 8px rgba(0,0,0,0.05)",
            }} />

            {/* Pointer arrow at top */}
            <div className="wheel-pointer" style={{
              position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)",
              zIndex: 20, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}>
              <svg width="44" height="40" viewBox="0 0 40 36">
                <path d="M20 36 L8 4 Q20 0 32 4 Z" fill="var(--color-marker-black)" stroke="var(--color-border)" strokeWidth="1.5" />
                <circle cx="20" cy="10" r="3" fill="white" />
              </svg>
            </div>

            {/* Spinning wheel */}
            <svg
              viewBox="0 0 400 400"
              style={{
                width: "100%", height: "100%",
                position: "relative", zIndex: 5,
                borderRadius: "50%",
                transition: isSpinning
                  ? "transform 4.5s cubic-bezier(0.15, 0.6, 0.15, 1)"
                  : "none",
                transform: `rotate(${currentRotation}deg)`,
              }}
            >
              {sectors.map(({ e, i, path, tx, ty, ix, iy, textAngle }) => (
                <g key={i}>
                  <path d={path} fill={e.color} stroke="white" strokeWidth="2.5" />
                  {/* Emotion face icon */}
                  <g transform={`rotate(${textAngle}, ${ix}, ${iy})`}>
                    <g transform={`translate(${ix - 18}, ${iy - 18})`}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
                        <circle cx="12" cy="12" r="10" />
                        {e.icon === "happy" && <><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="9" r="0.5" fill="white" /><circle cx="15" cy="9" r="0.5" fill="white" /></>}
                        {e.icon === "fear" && <><path d="M8 15s1.5-1 4-1 4 1 4 1" /><circle cx="9" cy="9" r="0.5" fill="white" /><circle cx="15" cy="9" r="0.5" fill="white" /><path d="M8 6 9.5 8" /><path d="M16 6 14.5 8" /></>}
                        {e.icon === "sad" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><circle cx="9" cy="9" r="0.5" fill="white" /><circle cx="15" cy="9" r="0.5" fill="white" /><path d="M10 13 9 15" /></>}
                        {e.icon === "angry" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><path d="M7.5 8 10 9" /><path d="M16.5 8 14 9" /></>}
                        {e.icon === "surprise" && <><circle cx="12" cy="16" r="2" /><circle cx="9" cy="9" r="0.5" fill="white" /><circle cx="15" cy="9" r="0.5" fill="white" /><path d="M8 7 9 8.5" /><path d="M16 7 15 8.5" /></>}
                      </svg>
                    </g>
                  </g>
                  {/* Emotion name */}
                  <g transform={`rotate(${textAngle}, ${tx}, ${ty})`}>
                    <text x={tx} y={ty + 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Noto Sans TC, sans-serif">
                      {e.name}
                    </text>
                  </g>
                </g>
              ))}
              <circle cx="200" cy="200" r="38" fill="var(--color-bg-card)" stroke="var(--color-border)" strokeWidth="3" />
              <circle cx="200" cy="200" r="28" fill="var(--color-marker-black)" />
              <circle cx="200" cy="200" r="6" fill="white" />
            </svg>

            {/* Decorative dots */}
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i * 11.25) * Math.PI / 180;
              const x = 280 + 290 * Math.cos(angle);
              const y = 280 + 290 * Math.sin(angle);
              return (
                <div key={i} className="wheel-dots" style={{
                  position: "absolute",
                  left: x - 5, top: y - 5,
                  width: 10, height: 10,
                  borderRadius: "50%",
                  background: i % 2 === 0 ? "var(--color-happy)" : "var(--color-bg-card)",
                  border: "1.5px solid var(--color-border)",
                  zIndex: 1,
                }} />
              );
            })}
          </div>

          {/* Spin Button */}
          <button
            className="wheel-spin-btn"
            onClick={spin}
            disabled={isSpinning}
            style={{
              marginTop: "var(--space-lg)",
              padding: "18px 48px",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              borderRadius: "var(--wobble-2)",
              border: "var(--border-width) solid var(--color-marker-black)",
              background: isSpinning ? "var(--color-border-light)" : "var(--color-primary)",
              color: isSpinning ? "var(--color-text-muted)" : "var(--color-text-inverse)",
              boxShadow: isSpinning ? "none" : "var(--shadow-sketch)",
              cursor: isSpinning ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              transition: "all 0.2s ease",
              transform: isSpinning ? "none" : "rotate(-1deg)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
            {isSpinning ? "轉動中..." : "轉動輪盤！"}
          </button>
        </div>

        {/* Right: Result panel */}
        <div className="wheel-result" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingLeft: "var(--space-2xl)", minWidth: 0 }}>

          {/* Reading indicator */}
          {showReading && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
              padding: "var(--space-sm) var(--space-md)",
              background: "var(--color-postit-blue)",
              border: "2px solid var(--color-border)",
              borderRadius: "var(--wobble-3)",
              fontFamily: "var(--font-heading)",
              fontSize: "var(--font-size-lg)",
              marginBottom: "var(--space-md)",
              animation: "pulse 1s ease-in-out infinite",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              正在朗讀...
            </div>
          )}

          {showResult && result ? (
            <div style={{
              width: "100%", maxWidth: 420,
              background: "var(--color-bg-card)",
              border: "var(--border-width) solid var(--color-border)",
              borderRadius: "var(--wobble-1)",
              padding: "var(--space-2xl)",
              boxShadow: "var(--shadow-sketch)",
              animation: "celebrate 0.5s ease both",
              textAlign: "center",
            }}>
              <div style={{
                width: 96, height: 96,
                borderRadius: "50%",
                background: result.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto var(--space-md)",
                boxShadow: `0 4px 16px ${result.color}40`,
              }}>
                <EmotionFaceSvg emotion={result.name} size={52} />
              </div>

              <div style={{
                fontSize: "var(--font-size-3xl)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                marginBottom: "var(--space-lg)",
                color: result.color,
              }}>
                {result.name}
              </div>

              <div style={{
                textAlign: "left",
                background: result.lightColor,
                border: "2px solid var(--color-border)",
                borderRadius: "var(--wobble-2)",
                padding: "var(--space-lg)",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  marginBottom: "var(--space-md)",
                  display: "flex", alignItems: "center", gap: "var(--space-sm)",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  討論問題
                </h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0 }}>
                  {result.questions.map((q, i) => (
                    <li key={i} style={{
                      fontSize: "var(--font-size-lg)",
                      color: "var(--color-text-secondary)",
                      display: "flex", alignItems: "flex-start", gap: "var(--space-sm)",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={result.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-heading)",
              fontSize: "var(--font-size-xl)",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto var(--space-md)", opacity: 0.4 }}>
                <path d="m9 18 6-6-6-6" />
              </svg>
              轉動輪盤，看看今天的情緒
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      <FloatingNav prev={{ href: "/courses/1/emotion-faces", label: "情緒表情" }} next={{ href: "/courses/1", label: "回課程" }} />
    </div>
  );
}
