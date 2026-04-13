"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Home, RotateCcw, Trophy, Timer, Sparkles } from "lucide-react";

type Card = {
  id: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const CARD_SETS = {
  animals: {
    name: "動物",
    icon: "🐾",
    pairs: [
      { emoji: "🐶", label: "小狗" },
      { emoji: "🐱", label: "小貓" },
      { emoji: "🐰", label: "兔子" },
      { emoji: "🐼", label: "熊貓" },
      { emoji: "🦊", label: "狐狸" },
      { emoji: "🐸", label: "青蛙" },
    ],
  },
  fruits: {
    name: "水果",
    icon: "🍎",
    pairs: [
      { emoji: "🍎", label: "蘋果" },
      { emoji: "🍊", label: "橘子" },
      { emoji: "🍇", label: "葡萄" },
      { emoji: "🍓", label: "草莓" },
      { emoji: "🍑", label: "桃子" },
      { emoji: "🍌", label: "香蕉" },
    ],
  },
  nature: {
    name: "自然",
    icon: "🌿",
    pairs: [
      { emoji: "🌸", label: "櫻花" },
      { emoji: "🌻", label: "向日葵" },
      { emoji: "🌈", label: "彩虹" },
      { emoji: "⭐", label: "星星" },
      { emoji: "🌙", label: "月亮" },
      { emoji: "☀️", label: "太陽" },
    ],
  },
};

type SetKey = keyof typeof CARD_SETS;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCards(setKey: SetKey): Card[] {
  const pairs = CARD_SETS[setKey].pairs;
  const cards: Card[] = [];
  pairs.forEach((pair, index) => {
    cards.push(
      { id: index * 2, emoji: pair.emoji, label: pair.label, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji: pair.emoji, label: pair.label, isFlipped: false, isMatched: false }
    );
  });
  return shuffleArray(cards);
}

export default function GamesPage() {
  const [selectedSet, setSelectedSet] = useState<SetKey | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalPairs = selectedSet ? CARD_SETS[selectedSet].pairs.length : 0;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startGame = useCallback((setKey: SetKey) => {
    setSelectedSet(setKey);
    setCards(createCards(setKey));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setGameComplete(false);
    setSeconds(0);
    setIsRunning(true);
    setShowCelebration(false);
  }, []);

  const resetGame = useCallback(() => {
    if (selectedSet) startGame(selectedSet);
  }, [selectedSet, startGame]);

  const backToMenu = useCallback(() => {
    setSelectedSet(null);
    setIsRunning(false);
    setGameComplete(false);
    setShowCelebration(false);
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || gameComplete) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;
      if (flippedIds.length >= 2) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, isFlipped: true } : c
      );
      setCards(newCards);
      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setIsChecking(true);
        const [first, second] = newFlipped.map((fid) =>
          newCards.find((c) => c.id === fid)!
        );

        if (first.emoji === second.emoji) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first.id || c.id === second.id
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            const newMatchedPairs = matchedPairs + 1;
            setMatchedPairs(newMatchedPairs);
            setFlippedIds([]);
            setIsChecking(false);

            if (newMatchedPairs === totalPairs) {
              setGameComplete(true);
              setIsRunning(false);
              setShowCelebration(true);
            }
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first.id || c.id === second.id
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, isChecking, gameComplete, matchedPairs, totalPairs]
  );

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getStars = () => {
    if (moves <= totalPairs + 2) return 3;
    if (moves <= totalPairs * 2) return 2;
    return 1;
  };

  // Theme selection screen
  if (!selectedSet) {
    return (
      <main
        className="min-h-screen flex flex-col"
        style={{ background: "var(--bg)" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--happy), var(--primary-light))",
              }}
            >
              🎮
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                趣味遊戲
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                祖孫一起動動腦
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-md"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          >
            <Home size={16} />
            返回首頁
          </Link>
        </header>

        {/* Game intro */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 pb-8">
          <div className="text-center mb-10">
            <div
              className="text-6xl mb-4"
              style={{ animation: "celebrate 0.6s ease" }}
            >
              🧩
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              翻牌配對遊戲
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              找出所有配對的卡片，訓練記憶力！請選擇主題開始遊戲
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full max-w-[900px]">
            {(Object.keys(CARD_SETS) as SetKey[]).map((key, i) => {
              const set = CARD_SETS[key];
              const colors = [
                {
                  bg: "var(--primary-lighter)",
                  text: "var(--primary)",
                  accent: "var(--primary)",
                },
                {
                  bg: "var(--secondary-lighter)",
                  text: "var(--secondary)",
                  accent: "var(--secondary)",
                },
                {
                  bg: "var(--happy-light)",
                  text: "#D4A017",
                  accent: "var(--happy)",
                },
              ][i];
              return (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className="group relative rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    boxShadow: "var(--shadow-sm)",
                    animation: `fade-in-up 0.4s ease both`,
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all group-hover:h-1.5"
                    style={{ background: colors.accent }}
                  />
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 text-4xl"
                    style={{ background: colors.bg }}
                  >
                    {set.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {set.name}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {set.pairs.length} 組配對
                  </p>
                  <div className="text-2xl flex gap-1">
                    {set.pairs.map((p, j) => (
                      <span key={j}>{p.emoji}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <footer
          className="text-center py-3 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          代間共學互動平台 &copy; 2026
        </footer>
      </main>
    );
  }

  // Game board
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={backToMenu}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            選擇主題
          </button>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {CARD_SETS[selectedSet].icon} {CARD_SETS[selectedSet].name}配對
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <Timer size={18} style={{ color: "var(--secondary)" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {formatTime(seconds)}
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <Sparkles size={18} style={{ color: "var(--happy)" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {matchedPairs} / {totalPairs}
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              翻牌次數
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {moves}
            </span>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={16} />
            重新開始
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-10 flex-shrink-0">
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(matchedPairs / totalPairs) * 100}%`,
              background:
                "linear-gradient(90deg, var(--secondary), var(--primary))",
            }}
          />
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 flex items-center justify-center px-10 py-6">
        <div className="grid grid-cols-4 gap-5 w-full max-w-[700px]">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className="aspect-square rounded-2xl transition-all duration-300 cursor-pointer"
              style={{
                perspective: "600px",
                animation: card.isMatched
                  ? "celebrate 0.4s ease"
                  : `fade-in-up 0.3s ease both`,
              }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    card.isFlipped || card.isMatched
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                }}
              >
                {/* Card back */}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center transition-shadow hover:shadow-lg"
                  style={{
                    backfaceVisibility: "hidden",
                    background:
                      "linear-gradient(135deg, var(--secondary), var(--secondary-dark))",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <span className="text-4xl opacity-60">❓</span>
                </div>

                {/* Card front */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: card.isMatched
                      ? "linear-gradient(135deg, var(--success-light), #d4edda)"
                      : "var(--bg-card)",
                    border: card.isMatched
                      ? "2px solid var(--success)"
                      : "2px solid var(--border-light)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <span className="text-5xl">{card.emoji}</span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: card.isMatched
                        ? "var(--success)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {card.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="rounded-3xl p-10 text-center max-w-md mx-4"
            style={{
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-xl)",
              animation: "celebrate 0.5s ease",
            }}
          >
            <div className="text-6xl mb-4">
              {getStars() === 3 ? "🏆" : getStars() === 2 ? "🎉" : "👏"}
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              太棒了！
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              你完成了 {CARD_SETS[selectedSet].name} 配對遊戲！
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((star) => (
                <Trophy
                  key={star}
                  size={32}
                  fill={star <= getStars() ? "#F5C842" : "none"}
                  stroke={star <= getStars() ? "#D4A017" : "var(--border)"}
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: "var(--surface)" }}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: "var(--text-muted)" }}>翻牌次數</span>
                  <div
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {moves} 次
                  </div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>花費時間</span>
                  <div
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formatTime(seconds)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-md"
                style={{
                  background: "var(--secondary)",
                  color: "white",
                }}
              >
                <RotateCcw size={18} />
                再玩一次
              </button>
              <button
                onClick={backToMenu}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-md"
                style={{
                  background: "var(--primary)",
                  color: "white",
                }}
              >
                換個主題
              </button>
            </div>
          </div>
        </div>
      )}

      <footer
        className="text-center py-2 text-xs flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        代間共學互動平台 &copy; 2026
      </footer>
    </main>
  );
}
