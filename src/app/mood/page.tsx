"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronLeft, ChevronRight, PieChart, Users,
  Smile, Frown, Angry, Check, X,
} from "lucide-react";
import {
  getStudents, getMoods, voteMood as apiVoteMood,
  groupStudents, getStudentName,
  type Student, type MoodRecord,
} from "@/lib/api";

type MoodType = "happy" | "sad" | "angry";

const MOOD_CONFIG: Record<MoodType, { label: string; desc: string; icon: typeof Smile; iconBg: string; iconColor: string; tagBg: string; tagColor: string; emotional: string }> = {
  happy: { label: "開心", desc: "今天心情很好", icon: Smile, iconBg: "var(--happy-light)", iconColor: "#D4A017", tagBg: "var(--happy-light)", tagColor: "#9A7400", emotional: "sun/happy" },
  sad:   { label: "難過", desc: "今天有點低落", icon: Frown, iconBg: "var(--sad-light)", iconColor: "var(--sad)", tagBg: "var(--sad-light)", tagColor: "#2E6CA3", emotional: "cloudy-sun/sad" },
  angry: { label: "生氣", desc: "今天不太開心", icon: Angry, iconBg: "var(--angry-light)", iconColor: "var(--angry)", tagBg: "var(--angry-light)", tagColor: "#A33030", emotional: "storm/angry" },
};

function classifyMood(emotional: string): MoodType {
  if (emotional?.includes("happy") || emotional?.includes("sun")) return "happy";
  if (emotional?.includes("angry") || emotional?.includes("storm") || emotional?.includes("rain")) return "angry";
  return "sad";
}

export default function MoodPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Student[]>>({});
  const [moods, setMoods] = useState<MoodRecord[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [votedNames, setVotedNames] = useState<Set<string>>(new Set());

  // Modal state
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState("1");

  useEffect(() => {
    (async () => {
      const data = await getStudents();
      if (data) { setStudents(data); setGrouped(groupStudents(data)); }
    })();
  }, []);

  const loadMoods = useCallback(async () => {
    const records = await getMoods(String(currentWeek));
    setMoods(records);
    setVotedNames(new Set(records.map((m) => m.Name)));
  }, [currentWeek]);

  useEffect(() => { loadMoods(); }, [loadMoods]);

  // Stats
  const happy = moods.filter((m) => classifyMood(m.emotional) === "happy");
  const sad = moods.filter((m) => classifyMood(m.emotional) === "sad");
  const angry = moods.filter((m) => classifyMood(m.emotional) === "angry");
  const total = moods.length || 1;

  function selectMood(mood: MoodType) {
    setSelectedMood(mood);
    setModalOpen(true);
  }

  async function doVote(name: string, group: string) {
    if (!selectedMood) return;
    try {
      await apiVoteMood(name, group, String(currentWeek), MOOD_CONFIG[selectedMood].emotional);
      setModalOpen(false);
      await loadMoods();
    } catch (err: unknown) {
      setModalOpen(false);
      alert(err instanceof Error && err.message === "DUPLICATE" ? `${name} 本週已投票過了` : "投票失敗，請重試");
    }
  }

  const groups = Object.keys(grouped).sort();

  // Donut chart SVG
  const hPct = (happy.length / total) * 100;
  const sPct = (sad.length / total) * 100;
  const aPct = (angry.length / total) * 100;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 shrink-0">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}>
            <ArrowLeft size={18} /> 返回
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>心情溫度計</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
          <span className="font-semibold text-sm">第 {currentWeek} 週</span>
          <button onClick={() => currentWeek > 1 && setCurrentWeek(currentWeek - 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: "var(--text-muted)" }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => currentWeek < 9 && setCurrentWeek(currentWeek + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: "var(--text-muted)" }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* Body - 2 columns */}
      <div className="flex-1 grid grid-cols-2 gap-6 px-8 pb-6 overflow-hidden">
        {/* Left: Mood options */}
        <div className="flex flex-col items-center justify-center gap-5">
          {(["happy", "sad", "angry"] as MoodType[]).map((mood) => {
            const cfg = MOOD_CONFIG[mood];
            const Icon = cfg.icon;
            return (
              <button key={mood} onClick={() => selectMood(mood)}
                className="w-full max-w-[380px] flex items-center gap-4 px-6 py-5 rounded-2xl border-2 border-transparent transition-all text-left hover:translate-x-1"
                style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", borderColor: selectedMood === mood ? cfg.iconColor : "var(--border-light)" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.iconBg, color: cfg.iconColor }}>
                  <Icon size={30} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{cfg.label}</div>
                  <div className="text-sm" style={{ color: "var(--text-muted)" }}>{cfg.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col gap-5 overflow-y-auto">
          {/* Donut chart card */}
          <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-5" style={{ color: "var(--text-primary)" }}>
              <PieChart size={20} /> 投票統計
            </h3>
            <div className="flex items-center gap-8">
              {/* Donut */}
              <div className="relative w-[160px] h-[160px] shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface)" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--happy)" strokeWidth="3.8" strokeDasharray={`${hPct} ${100 - hPct}`} strokeDashoffset="0" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--sad)" strokeWidth="3.8" strokeDasharray={`${sPct} ${100 - sPct}`} strokeDashoffset={`${-hPct}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--angry)" strokeWidth="3.8" strokeDasharray={`${aPct} ${100 - aPct}`} strokeDashoffset={`${-(hPct + sPct)}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{moods.length}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>總票數</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-3 flex-1">
                {([["happy", happy, "var(--happy)"], ["sad", sad, "var(--sad)"], ["angry", angry, "var(--angry)"]] as const).map(([key, arr, color]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
                    <span className="font-medium flex-1">{MOOD_CONFIG[key].label}</span>
                    <span className="font-bold">{arr.length}</span>
                    <span className="text-sm min-w-[40px] text-right" style={{ color: "var(--text-muted)" }}>{Math.round(arr.length / total * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voter lists */}
          <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: "var(--text-primary)" }}>
              <Users size={20} /> 投票名單
            </h3>
            {(["happy", "sad", "angry"] as MoodType[]).map((mood) => {
              const cfg = MOOD_CONFIG[mood];
              const items = mood === "happy" ? happy : mood === "sad" ? sad : angry;
              return (
                <div key={mood} className="mb-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-3 h-3 rounded-sm" style={{ background: mood === "happy" ? "var(--happy)" : mood === "sad" ? "var(--sad)" : "var(--angry)" }} />
                    {cfg.label} ({items.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {items.length === 0
                      ? <span className="text-sm" style={{ color: "var(--text-muted)" }}>尚無投票</span>
                      : items.map((m) => (
                        <span key={m.id} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: cfg.tagBg, color: cfg.tagColor }}>
                          {m.Name}
                        </span>
                      ))
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member selection modal */}
      {modalOpen && selectedMood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(45,37,32,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="w-[480px] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-xl)", animation: "scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <h3 className="text-xl font-bold">投票：{MOOD_CONFIG[selectedMood].label}</h3>
              <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: "var(--text-muted)" }}>
                <X size={22} />
              </button>
            </div>
            {/* Group tabs */}
            <div className="flex gap-1 px-6 pt-3 pb-1 overflow-x-auto" style={{ background: "var(--surface)" }}>
              {groups.map((g) => (
                <button key={g} onClick={() => setModalGroup(g)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: g === modalGroup ? "var(--bg-card)" : "transparent", color: g === modalGroup ? "var(--text-primary)" : "var(--text-muted)", boxShadow: g === modalGroup ? "var(--shadow-sm)" : "none" }}>
                  第 {g} 組
                </button>
              ))}
            </div>
            {/* Member grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-2">
              {(grouped[modalGroup] || []).map((m) => {
                const name = getStudentName(m);
                const voted = votedNames.has(name);
                return (
                  <button key={m.id || name} onClick={() => !voted && doVote(name, m.group || modalGroup)} disabled={voted}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-transparent transition-all text-left ${voted ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--primary-lighter)] hover:border-[var(--primary-light)]"}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ background: "var(--primary-lighter)", color: "var(--primary)" }}>
                      {name[0]}
                    </div>
                    <span className="font-semibold flex-1">{name}</span>
                    {voted && <Check size={18} style={{ color: "var(--success)" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
