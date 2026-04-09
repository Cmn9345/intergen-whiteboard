"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const emotions = [
  { name: "開心", emoji: "😄", color: "#F5C842", questions: ["什麼事情讓你最開心？", "你開心的時候會做什麼？", "分享一件最近讓你開心的事"] },
  { name: "害怕", emoji: "😨", color: "#EF5350", questions: ["你害怕什麼東西？", "害怕的時候你會怎麼做？", "誰會讓你覺得安心？"] },
  { name: "難過", emoji: "😢", color: "#5B9BD5", questions: ["什麼時候你會難過？", "難過的時候你會找誰？", "怎樣可以讓自己好起來？"] },
  { name: "生氣", emoji: "😠", color: "#C62828", questions: ["什麼事情會讓你生氣？", "生氣的時候可以怎麼做？", "有沒有讓你消氣的方法？"] },
  { name: "驚訝", emoji: "😲", color: "#7E57C2", questions: ["最近有什麼讓你驚訝的事？", "驚訝的時候你會有什麼反應？", "你覺得驚訝是好的還是不好的？"] },
];

const sectorAngle = 360 / emotions.length;

function buildWheelSvg() {
  const cx = 150, cy = 150, r = 140;
  let paths = "";
  emotions.forEach((e, i) => {
    const startAngle = (i * sectorAngle - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * sectorAngle - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sectorAngle > 180 ? 1 : 0;
    paths += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${e.color}" stroke="#2D2D2D" stroke-width="2"/>`;
    const midAngle = ((i + 0.5) * sectorAngle - 90) * Math.PI / 180;
    const tx = cx + r * 0.6 * Math.cos(midAngle);
    const ty = cy + r * 0.6 * Math.sin(midAngle);
    const textAngle = (i + 0.5) * sectorAngle;
    paths += `<text x="${tx}" y="${ty - 8}" text-anchor="middle" fill="white" font-size="28" transform="rotate(${textAngle}, ${tx}, ${ty})">${e.emoji}</text>`;
    paths += `<text x="${tx}" y="${ty + 18}" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Noto Sans TC" transform="rotate(${textAngle}, ${tx}, ${ty})">${e.name}</text>`;
  });
  return paths;
}

const wheelSvgContent = buildWheelSvg();

export default function EmotionWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [result, setResult] = useState<typeof emotions[0] | null>(null);
  const [showReading, setShowReading] = useState(false);
  const rotationRef = useRef(0);

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
    const extraSpins = 5 * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotationRef.current + extraSpins + randomAngle;
    rotationRef.current = newRotation;
    setCurrentRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const sectorIndex = Math.floor(normalizedAngle / sectorAngle) % emotions.length;
      const emotion = emotions[sectorIndex];
      setResult(emotion);
      speak(emotion.name);
      setTimeout(() => speak(`你什麼時候會${emotion.name}？`), 1500);
    }, 3200);
  }, [isSpinning, speak]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 700, margin: "0 auto", padding: "var(--space-lg)", width: "100%", textAlign: "center" }}>
      <div style={{ marginBottom: "var(--space-lg)", textAlign: "left" }}>
        <Link href="/courses/1" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 2 週
        </Link>
      </div>

      <div style={{ marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-xs)" }}>🎡 情緒輪盤</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)" }}>轉動輪盤，說說你什麼時候會有這種心情</p>
      </div>

      <div style={{ position: "relative", width: 360, height: 360, margin: "0 auto var(--space-xl)" }}>
        <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 36, zIndex: 10, filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))" }}>▼</div>
        <svg
          viewBox="0 0 300 300"
          style={{
            width: "100%", height: "100%",
            transition: "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
            borderRadius: "50%", border: "var(--border-width) solid var(--color-border)",
            boxShadow: "var(--shadow-sketch)", transform: `rotate(${currentRotation}deg)`,
          }}
          dangerouslySetInnerHTML={{ __html: wheelSvgContent }}
        />
      </div>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <button className="btn btn-primary btn-lg" onClick={spin} disabled={isSpinning}>🎰 轉動輪盤！</button>
      </div>

      {showReading && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-sm) var(--space-md)", background: "var(--color-postit-blue)", border: "2px solid var(--color-border)", borderRadius: "var(--wobble-3)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", marginBottom: "var(--space-md)", animation: "pulse 1s ease-in-out infinite" }}>
          🔊 正在朗讀...
        </div>
      )}

      {result && (
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)", animation: "celebrate 0.5s ease both" }}>
          <div style={{ fontSize: 80, marginBottom: "var(--space-md)" }}>{result.emoji}</div>
          <div style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "var(--space-lg)" }}>{result.name}</div>
          <div style={{ textAlign: "left", background: "var(--color-postit-yellow)", border: "2px solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-lg)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>💬 討論問題</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0 }}>
              {result.questions.map((q, i) => (
                <li key={i} style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)" }}>💬 {q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/1/emotion-faces", label: "情緒表情" }} next={{ href: "/courses/1", label: "回課程" }} />
    </div>
  );
}
