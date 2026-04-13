"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const animals = [
  { name: "斑馬", emoji: "🦓", feet: 4 },
  { name: "長頸鹿", emoji: "🦒", feet: 4 },
  { name: "兔子", emoji: "🐰", feet: 4 },
  { name: "雞", emoji: "🐔", feet: 2 },
  { name: "鴨子", emoji: "🦆", feet: 2 },
  { name: "豬", emoji: "🐷", feet: 4 },
  { name: "台灣黑熊", emoji: "🐻", feet: 4 },
  { name: "大象", emoji: "🐘", feet: 4 },
  { name: "貓", emoji: "🐱", feet: 4 },
  { name: "狗", emoji: "🐶", feet: 4 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GuessFeetPage() {
  const [screen, setScreen] = useState<"start" | "game" | "results">("start");
  const [shuffledAnimals, setShuffledAnimals] = useState<typeof animals>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [btnStates, setBtnStates] = useState<Record<number, "correct" | "wrong">>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW"; u.rate = 1.2; u.pitch = 1.4;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }, []);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("results");
  }, []);

  const startGame = useCallback(() => {
    const shuffled = shuffle(animals);
    setShuffledAnimals(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(30);
    setAnswered(false);
    setFeedback(null);
    setBtnStates({});
    setScreen("game");

    if (timerRef.current) clearInterval(timerRef.current);
    let t = 30;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        setScreen("results");
      }
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const answerFn = useCallback((feet: number) => {
    if (answered) return;
    setAnswered(true);
    const animal = shuffledAnimals[currentIndex % shuffledAnimals.length];
    const isCorrect = feet === animal.feet;
    const otherFeet = feet === 2 ? 4 : 2;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setBtnStates({ [feet]: "correct" });
      setFeedback("✅");
    } else {
      setBtnStates({ [feet]: "wrong", [otherFeet]: "correct" });
      setFeedback("❌");
    }

    speak(`${animal.name}有${animal.feet}隻腳`);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
      setFeedback(null);
      setBtnStates({});
    }, 1200);
  }, [answered, shuffledAnimals, currentIndex, speak]);

  const getResultMessage = () => {
    if (score >= 8) return "🏆 太厲害了！動物專家！";
    if (score >= 5) return "👏 很棒！繼續加油！";
    if (score >= 3) return "😊 不錯喔！再試試看！";
    return "💪 加油！下次一定更好！";
  };

  const currentAnimal = shuffledAnimals.length > 0 ? shuffledAnimals[currentIndex % shuffledAnimals.length] : null;

  const answerBtnStyle = (feet: number): React.CSSProperties => {
    const state = btnStates[feet];
    const base: React.CSSProperties = {
      background: feet === 2 ? "var(--color-postit-blue)" : "var(--color-postit-yellow)",
      border: "var(--border-width) solid var(--color-border)",
      borderRadius: "var(--wobble-2)", padding: "var(--space-xl) var(--space-2xl)",
      cursor: answered ? "default" : "pointer", transition: "all 0.2s ease",
      boxShadow: "var(--shadow-sketch)", minWidth: 160, textAlign: "center",
    };
    if (state === "correct") return { ...base, borderColor: "var(--color-success)", boxShadow: "0 0 0 4px var(--color-success-light), var(--shadow-sketch)" };
    if (state === "wrong") return { ...base, borderColor: "var(--color-danger)", boxShadow: "0 0 0 4px var(--color-angry-light), var(--shadow-sketch)" };
    return base;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 700, margin: "0 auto", padding: "var(--space-lg)", width: "100%", textAlign: "center" }}>
      <div style={{ marginBottom: "var(--space-lg)", textAlign: "left" }}>
        <Link href="/courses/6" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 7 週
        </Link>
      </div>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-xs)" }}>🐾 猜猜動物腳</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)" }}>這隻動物是 2 隻腳還是 4 隻腳？</p>
      </div>

      {/* Start Screen */}
      {screen === "start" && (
        <div style={{ margin: "var(--space-2xl) 0" }}>
          <span style={{ fontSize: 120, marginBottom: "var(--space-lg)", display: "block" }}>🐾</span>
          <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>30 秒內答對越多越好！</p>
          <button className="btn btn-primary btn-lg" onClick={startGame}>🎮 開始遊戲！</button>
        </div>
      )}

      {/* Game Screen */}
      {screen === "game" && currentAnimal && (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
            <div style={{
              background: timeLeft <= 10 ? "var(--color-angry-light)" : "var(--color-postit-pink)",
              border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)",
              padding: "var(--space-sm) var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)",
              fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700,
              animation: timeLeft <= 10 ? "pulse 0.5s ease-in-out infinite" : "none",
            }}>
              ⏱ {timeLeft} 秒
            </div>
            <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-sm) var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>
              ✅ {score} 分
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)", marginBottom: "var(--space-xl)" }}>
              <span style={{ fontSize: 100, display: "block", marginBottom: "var(--space-md)" }}>{currentAnimal.emoji}</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-3xl)", fontWeight: 700 }}>{currentAnimal.name}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)" }}>
              <div onClick={() => answerFn(2)} onMouseEnter={() => speak("2隻腳")} style={answerBtnStyle(2)}>
                <span style={{ fontSize: 48, display: "block", fontFamily: "var(--font-heading)", fontWeight: 700 }}>2</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>隻腳</span>
              </div>
              <div onClick={() => answerFn(4)} onMouseEnter={() => speak("4隻腳")} style={answerBtnStyle(4)}>
                <span style={{ fontSize: 48, display: "block", fontFamily: "var(--font-heading)", fontWeight: 700 }}>4</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>隻腳</span>
              </div>
            </div>

            {feedback && (
              <span style={{ fontSize: 60, marginTop: "var(--space-md)", display: "block", animation: "feedbackPop 0.6s ease both" }}>{feedback}</span>
            )}
          </div>
        </>
      )}

      {/* Results Screen */}
      {screen === "results" && (
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)" }}>
          <div style={{ fontSize: 80, marginBottom: "var(--space-md)" }}>🎉</div>
          <div style={{ fontSize: "var(--font-size-5xl)", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--color-primary)" }}>{score}</div>
          <div style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-muted)", marginBottom: "var(--space-lg)" }}>答對題數</div>
          <div style={{ fontSize: "var(--font-size-2xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-xl)" }}>{getResultMessage()}</div>
          <button className="btn btn-primary btn-lg" onClick={startGame}>🔄 再玩一次</button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes feedbackPop { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/6", label: "課程" }} next={{ href: "/courses/6/storybook", label: "繪本故事" }} />
    </div>
  );
}
