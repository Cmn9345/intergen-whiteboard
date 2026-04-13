"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const animalPairs = [
  { young: "🐢", youngName: "小海龜", adult: "🐢", adultName: "海龜" },
  { young: "🐤", youngName: "小天鵝", adult: "🦢", adultName: "天鵝" },
  { young: "🐥", youngName: "小雞", adult: "🐓", adultName: "公雞" },
  { young: "🐛", youngName: "毛毛蟲", adult: "🦋", adultName: "蝴蝶" },
  { young: "🐸", youngName: "蝌蚪", adult: "🐸", adultName: "青蛙" },
  { young: "🦁", youngName: "小獅子", adult: "🦁", adultName: "獅子" },
  { young: "👶", youngName: "寶寶", adult: "🧑", adultName: "大人" },
  { young: "🦘", youngName: "小袋鼠", adult: "🦘", adultName: "袋鼠" },
  { young: "🐧", youngName: "小企鵝", adult: "🐧", adultName: "企鵝" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FindPartnerPage() {
  const pathname = usePathname();
  const weekMatch = pathname.match(/\/courses\/(\d+)\//);
  const weekNum = weekMatch ? parseInt(weekMatch[1]) : 1;
  const backHref = `/courses/${weekNum}`;
  const backText = `回到第 ${weekNum + 1} 週`;

  const floatingNav = useMemo(() => {
    if (pathname.includes("/courses/1")) {
      return { prev: { href: "/courses/1", label: "課程" }, next: { href: "/courses/1/emotion-faces", label: "情緒表情" } };
    }
    return { prev: { href: "/courses/3", label: "課程" }, next: { href: "/courses/3/family-quiz", label: "家庭測驗" } };
  }, [pathname]);

  const [youngOrder, setYoungOrder] = useState<number[]>([]);
  const [adultOrder, setAdultOrder] = useState<number[]>([]);
  const [selectedYoung, setSelectedYoung] = useState<number | null>(null);
  const [matchedYoung, setMatchedYoung] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type: "correct" | "wrong") => {
    try {
      const ctx = getAudioCtx();
      if (type === "correct") {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = "sine"; gain.gain.value = 0.15;
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.2);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 200; osc.type = "sawtooth"; gain.gain.value = 0.1;
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}
  }, [getAudioCtx]);

  const showFeedbackFn = useCallback((emoji: string) => {
    setFeedback(emoji);
    setTimeout(() => setFeedback(null), 800);
  }, []);

  const resetGame = useCallback(() => {
    setSelectedYoung(null);
    setMatchedYoung(new Set());
    setShowCelebration(false);
    setYoungOrder(shuffle([...Array(animalPairs.length).keys()]));
    setAdultOrder(shuffle([...Array(animalPairs.length).keys()]));
  }, []);

  useEffect(() => { resetGame(); }, [resetGame]);

  const selectYoung = (index: number) => {
    if (matchedYoung.has(index)) return;
    setSelectedYoung(index);
  };

  const selectAdult = (index: number) => {
    if (selectedYoung === null) return;
    const youngPairIndex = youngOrder[selectedYoung];
    const adultPairIndex = adultOrder[index];
    const matchedYoungIdx = youngOrder.indexOf(adultPairIndex);
    if (matchedYoung.has(matchedYoungIdx) && matchedYoungIdx !== selectedYoung) return;

    if (youngPairIndex === adultPairIndex) {
      const newMatched = new Set(matchedYoung);
      newMatched.add(selectedYoung);
      setMatchedYoung(newMatched);
      playSound("correct");
      showFeedbackFn("⭕");
      if (newMatched.size === animalPairs.length) {
        setTimeout(() => setShowCelebration(true), 500);
      }
    } else {
      playSound("wrong");
      showFeedbackFn("❌");
    }
    setSelectedYoung(null);
  };

  if (youngOrder.length === 0) return null;

  const cardStyle = (i: number, matched: boolean, selected: boolean): React.CSSProperties => ({
    background: selected ? "var(--color-primary-lighter)" : "var(--color-bg-card)",
    border: `var(--border-width) solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
    borderRadius: i % 3 === 0 ? "var(--wobble-1)" : i % 3 === 1 ? "var(--wobble-2)" : "var(--wobble-3)",
    padding: "var(--space-md)", display: "flex", alignItems: "center", gap: "var(--space-md)",
    cursor: matched ? "default" : "pointer", transition: "all 0.2s ease",
    boxShadow: selected ? "0 0 0 3px var(--color-primary), var(--shadow-sketch)" : "var(--shadow-sketch-sm)",
    minHeight: 80, opacity: matched ? 0.3 : 1, pointerEvents: matched ? "none" : "auto",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 1100, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "var(--space-md)" }}>
        <Link href={backHref} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          {backText}
        </Link>
        <button className="btn btn-outline" onClick={resetGame}>🔄 重新開始</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🐣 找夥伴配對遊戲</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-lg)" }}>點選幼年動物，再點選成年動物來配對</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-sm) var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>
          🎯 配對：{matchedYoung.size} / {animalPairs.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: "var(--space-md)", alignItems: "start" }}>
        <div>
          <div style={{ textAlign: "center", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "var(--space-md)" }}>🐣 幼年</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {youngOrder.map((pairIdx, i) => {
              const p = animalPairs[pairIdx];
              return (
                <div key={i} onClick={() => selectYoung(i)} style={cardStyle(i, matchedYoung.has(i), selectedYoung === i)}>
                  <span style={{ fontSize: 40, flexShrink: 0 }}>{p.young}</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{p.youngName}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-size-3xl)", paddingTop: 40, color: "var(--color-text-muted)" }}>↔</div>
        <div>
          <div style={{ textAlign: "center", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "var(--space-md)" }}>🦁 成年</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {adultOrder.map((pairIdx, i) => {
              const p = animalPairs[pairIdx];
              const matchedYoungIdx = youngOrder.indexOf(pairIdx);
              const matched = matchedYoung.has(matchedYoungIdx);
              return (
                <div key={i} onClick={() => selectAdult(i)} style={{ ...cardStyle(i, matched, false), background: "var(--color-bg-card)" }}>
                  <span style={{ fontSize: 40, flexShrink: 0 }}>{p.adult}</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>{p.adultName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {feedback && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, pointerEvents: "none" }}>
          <div style={{ fontSize: 120, animation: "feedbackPop 0.8s ease-out forwards" }}>{feedback}</div>
        </div>
      )}

      {showCelebration && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", textAlign: "center", boxShadow: "var(--shadow-sketch)", maxWidth: 400, animation: "celebrate 0.5s ease both" }}>
            <div style={{ fontSize: 60, marginBottom: "var(--space-md)" }}>🎉🎊🎈</div>
            <h2 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>太棒了！全部配對成功！</h2>
            <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)" }}>你是動物配對大師！</p>
            <button className="btn btn-primary btn-lg" onClick={resetGame}>🔄 再玩一次</button>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: "var(--space-lg)", right: "var(--space-lg)", background: "var(--color-postit-yellow)", border: "2px solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-md)", fontSize: "var(--font-size-base)", maxWidth: 250, boxShadow: "var(--shadow-sketch-sm)", zIndex: 50 }}>
        <h4 style={{ fontFamily: "var(--font-heading)", marginBottom: "var(--space-xs)" }}>📝 遊戲規則</h4>
        <p>1. 先點選左邊的幼年動物<br />2. 再點選右邊的成年動物<br />3. 配對成功會有音效提示</p>
      </div>

      <style>{`
        @keyframes feedbackPop { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1.3); } 100% { transform: scale(1); opacity: 0; } }
        @keyframes celebrate { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
      </div>
      <FloatingNav prev={floatingNav.prev} next={floatingNav.next} />
    </div>
  );
}
