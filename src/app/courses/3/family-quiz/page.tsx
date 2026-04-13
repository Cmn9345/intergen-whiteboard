"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const members = [
  { name: "媽媽", emoji: "👩", gender: "f", hint: "留著長頭髮，溫柔的照顧全家人" },
  { name: "爸爸", emoji: "👨", gender: "m", hint: "高高的個子，每天辛苦工作" },
  { name: "阿嬤", emoji: "👵", gender: "f", hint: "頭髮白白的，煮的飯最好吃" },
  { name: "阿公", emoji: "👴", gender: "m", hint: "戴著眼鏡，喜歡說故事" },
  { name: "哥哥", emoji: "👦", gender: "m", hint: "比你高一點，會保護弟弟妹妹" },
  { name: "姊姊", emoji: "👧", gender: "f", hint: "綁著辮子，功課很好" },
  { name: "弟弟", emoji: "🧒", gender: "m", hint: "最小的男孩，很調皮" },
  { name: "妹妹", emoji: "👶", gender: "f", hint: "最小的女孩，很可愛" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FamilyQuizPage() {
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<typeof members[0] | null>(null);
  const [options, setOptions] = useState<typeof members>([]);
  const [answered, setAnswered] = useState(false);
  const [optionStates, setOptionStates] = useState<Record<number, "correct" | "wrong" | "disabled">>({});
  const [showNext, setShowNext] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hoverTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

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

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-TW"; u.rate = 1.2; u.pitch = 1.4;
    u.onstart = () => setShowReading(true);
    u.onend = () => setShowReading(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }, []);

  const generateQuestion = useCallback(() => {
    setAnswered(false);
    setOptionStates({});
    setShowNext(false);
    const correctIdx = Math.floor(Math.random() * members.length);
    const correct = members[correctIdx];
    setCurrentAnswer(correct);
    const sameGender = members.filter((m, i) => i !== correctIdx && m.gender === correct.gender);
    const diffGender = members.filter((m, i) => i !== correctIdx && m.gender !== correct.gender);
    const pool = shuffle(sameGender).concat(shuffle(diffGender));
    const distractors = pool.slice(0, 2);
    setOptions(shuffle([correct, ...distractors]));
    setQuestionCount((prev) => prev + 1);
  }, []);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  const answer = useCallback((optIndex: number, name: string) => {
    if (answered || !currentAnswer) return;
    setAnswered(true);
    const isCorrect = name === currentAnswer.name;
    const newStates: Record<number, "correct" | "wrong" | "disabled"> = {};
    if (isCorrect) {
      newStates[optIndex] = "correct";
      playSound("correct");
      setScore((prev) => prev + 1);
    } else {
      newStates[optIndex] = "wrong";
      playSound("wrong");
      options.forEach((opt, i) => {
        if (opt.name === currentAnswer.name) newStates[i] = "correct";
      });
    }
    options.forEach((_, i) => { if (!(i in newStates)) newStates[i] = "disabled"; });
    setOptionStates(newStates);
    setShowNext(true);
  }, [answered, currentAnswer, options, playSound]);

  const resetGame = useCallback(() => {
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
  }, [generateQuestion]);

  const getOptionStyle = (i: number): React.CSSProperties => {
    const state = optionStates[i];
    const base: React.CSSProperties = {
      background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)",
      borderRadius: "var(--wobble-2)", padding: "var(--space-lg)", display: "flex",
      alignItems: "center", gap: "var(--space-lg)", cursor: answered ? "default" : "pointer",
      transition: "all 0.2s ease", boxShadow: "var(--shadow-sketch-sm)",
      fontSize: "var(--font-size-xl)", fontFamily: "var(--font-heading)", fontWeight: 700,
    };
    if (state === "correct") return { ...base, background: "var(--color-success-light)", borderColor: "var(--color-success)", animation: "bounceIn 0.5s ease" };
    if (state === "wrong") return { ...base, background: "var(--color-angry-light)", borderColor: "var(--color-danger)", animation: "shake 0.5s ease" };
    if (state === "disabled") return { ...base, pointerEvents: "none", opacity: 0.5 };
    return base;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 700, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/3" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 4 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>👨‍👩‍👧‍👦 家庭小測驗</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>猜猜這是誰？認識家人稱呼</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-sm) var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>✅ 答對：{score}</div>
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-sm) var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", fontWeight: 700 }}>📝 題數：{questionCount}</div>
      </div>

      {showReading && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-xs) var(--space-md)", background: "var(--color-postit-blue)", border: "2px solid var(--color-border)", borderRadius: 20, fontSize: "var(--font-size-base)", marginBottom: "var(--space-md)", animation: "pulse 1s ease-in-out infinite" }}>🔊 正在朗讀...</div>
      )}

      {currentAnswer && (
        <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)", textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <span style={{ fontSize: 100, marginBottom: "var(--space-lg)", display: "block" }}>{currentAnswer.emoji}</span>
          <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-lg)", fontFamily: "var(--font-heading)", marginTop: "var(--space-sm)" }}>{currentAnswer.hint}</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
        {options.map((opt, i) => (
          <div key={`${questionCount}-${i}`} onClick={() => answer(i, opt.name)}
            onMouseEnter={() => { hoverTimersRef.current[i] = setTimeout(() => speak(opt.name), 1000); }}
            onMouseLeave={() => { clearTimeout(hoverTimersRef.current[i]); }}
            style={getOptionStyle(i)}>
            <span style={{ fontSize: 48 }}>{opt.emoji}</span>
            <span>{opt.name}</span>
          </div>
        ))}
      </div>

      {showNext && (
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-primary" onClick={generateQuestion}>下一題 ➡</button>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
        <button className="btn btn-outline" onClick={resetGame}>🔄 重新開始</button>
      </div>

      <style>{`
        @keyframes bounceIn { 0% { transform: scale(0.95); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
      </div>
      <FloatingNav prev={{ href: "/courses/3/find-partner", label: "找夥伴" }} next={{ href: "/courses/3/charades", label: "比手畫腳" }} />
    </div>
  );
}
