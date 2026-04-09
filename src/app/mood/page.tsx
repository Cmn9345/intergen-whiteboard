"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getStudents, getMoods, voteMood as apiVoteMood,
  groupStudents, getStudentName,
  type Student, type MoodRecord,
} from "@/lib/api";

type MoodType = "happy" | "sad" | "angry";

const MOOD_CFG: Record<MoodType, { label: string; desc: string; emotional: string; cssColor: string; lightColor: string }> = {
  happy: { label: "開心", desc: "今天心情很好", emotional: "sun/happy", cssColor: "var(--color-happy)", lightColor: "var(--color-happy-light)" },
  sad:   { label: "難過", desc: "今天有點低落", emotional: "cloudy-sun/sad", cssColor: "var(--color-sad)", lightColor: "var(--color-sad-light)" },
  angry: { label: "生氣", desc: "今天不太開心", emotional: "storm/angry", cssColor: "var(--color-angry)", lightColor: "var(--color-angry-light)" },
};

function classifyMood(emotional: string): MoodType {
  if (emotional?.includes("happy") || emotional?.includes("sun") || emotional === "開心") return "happy";
  if (emotional?.includes("angry") || emotional?.includes("storm") || emotional?.includes("rain") || emotional === "生氣") return "angry";
  return "sad";
}

export default function MoodPage() {
  const [members, setMembers] = useState<Student[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Student[]>>({});
  const [moods, setMoods] = useState<MoodRecord[]>([]);
  const [votedNames, setVotedNames] = useState<Set<string>>(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState("1");
  const [selectedMember, setSelectedMember] = useState<Student | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getStudents();
      setMembers(data);
      setGrouped(groupStudents(data));
    })();
  }, []);

  const loadMoods = useCallback(async () => {
    const records = await getMoods(String(currentWeek));
    setMoods(records);
    setVotedNames(new Set(records.map((m) => m.Name)));
  }, [currentWeek]);

  useEffect(() => { loadMoods(); }, [loadMoods]);

  const happy = moods.filter((m) => classifyMood(m.emotional) === "happy");
  const sad = moods.filter((m) => classifyMood(m.emotional) === "sad");
  const angry = moods.filter((m) => classifyMood(m.emotional) === "angry");
  const total = moods.length || 1;
  const hPct = (happy.length / total) * 100;
  const sPct = (sad.length / total) * 100;
  const aPct = (angry.length / total) * 100;
  const groups = Object.keys(grouped).sort();

  function selectMood(mood: MoodType) {
    setSelectedMood(mood);
    setSelectedMember(null);
    setModalOpen(true);
  }

  async function submitVote() {
    if (!selectedMember || !selectedMood) return;
    const name = getStudentName(selectedMember);
    try {
      await apiVoteMood(name, selectedMember.group, String(currentWeek), MOOD_CFG[selectedMood].emotional);
      setModalOpen(false);
      await loadMoods();
    } catch (err: unknown) {
      setModalOpen(false);
      alert(err instanceof Error && err.message === "DUPLICATE" ? `${name} 本週已投票過了` : "投票失敗，請重試");
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--color-bg)", backgroundImage: "radial-gradient(circle, #d5cfc5 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      {/* Header */}
      <header className="flex items-center justify-between shrink-0" style={{ padding: "var(--space-lg) var(--space-xl)" }}>
        <div className="flex items-center" style={{ gap: "var(--space-lg)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            返回
          </Link>
          <h1 style={{ fontSize: 42, fontWeight: 700, fontFamily: "var(--font-heading)", transform: "rotate(-0.8deg)" }}>心情溫度計</h1>
        </div>
        <div className="flex items-center" style={{ background: "var(--color-postit-yellow)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "8px 8px 8px 20px", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: 24, boxShadow: "var(--shadow-sketch-sm)", gap: "var(--space-sm)" }}>
          <span>第 {currentWeek} 週</span>
          <button onClick={() => currentWeek > 1 && setCurrentWeek(currentWeek - 1)} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-bg-card)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => currentWeek < 9 && setCurrentWeek(currentWeek + 1)} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-bg-card)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden" style={{ gap: "var(--space-xl)", padding: "0 var(--space-xl) var(--space-xl)" }}>
        {/* Left: Thermometer */}
        <div className="flex items-center justify-center" style={{ gap: "var(--space-xl)" }}>
          <div className="relative shrink-0" style={{ width: 140, height: 480 }}>
            <div className="absolute overflow-hidden" style={{ left: "50%", transform: "translateX(-50%)", width: 64, height: 380, top: 0, borderRadius: "32px 32px 8px 8px", background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", boxShadow: "var(--shadow-sketch-sm)" }}>
              {(["happy", "sad", "angry"] as MoodType[]).map((mood) => {
                const positions = { happy: { top: 0, borderRadius: "28px 28px 0 0" }, sad: { bottom: "33.33%" }, angry: { bottom: 0, borderRadius: "0 0 8px 8px" } };
                return (
                  <button key={mood} onClick={() => selectMood(mood)} className="absolute left-0 right-0 flex items-center justify-center"
                    style={{ height: "33.33%", background: MOOD_CFG[mood].cssColor, cursor: "pointer", border: "none", outline: selectedMood === mood ? "4px solid var(--color-marker-black)" : "none", outlineOffset: -4, zIndex: selectedMood === mood ? 6 : 5, ...positions[mood] }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.2))" }}>
                      <circle cx="12" cy="12" r="10"/>
                      {mood === "happy" && <><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
                      {mood === "sad" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
                      {mood === "angry" && <><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><path d="M7.5 8 10 9"/><path d="M16.5 8 14 9"/></>}
                    </svg>
                  </button>
                );
              })}
            </div>
            <div className="absolute flex items-center justify-center" style={{ bottom: 0, left: "50%", transform: "translateX(-50%)", width: 100, height: 100, borderRadius: "50%", background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", boxShadow: "var(--shadow-sketch)", zIndex: 2 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: selectedMood ? MOOD_CFG[selectedMood].cssColor : "var(--color-happy)", border: "2px solid var(--color-border)", transition: "background 0.3s ease" }} />
            </div>
          </div>
          <div className="flex flex-col justify-between" style={{ height: 380 }}>
            {(["happy", "sad", "angry"] as MoodType[]).map((mood, i) => {
              const wobbles = ["var(--wobble-1)", "var(--wobble-2)", "var(--wobble-3)"];
              return (
                <button key={mood} onClick={() => selectMood(mood)} className="flex items-center" style={{ gap: "var(--space-sm)", padding: "var(--space-md) var(--space-lg)", border: "var(--border-width) solid var(--color-border)", borderLeft: `6px solid ${MOOD_CFG[mood].cssColor}`, background: selectedMood === mood ? "var(--color-postit-yellow)" : "var(--color-bg-card)", boxShadow: "var(--shadow-sketch-sm)", borderRadius: wobbles[i], fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, cursor: "pointer" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--color-border)", background: MOOD_CFG[mood].cssColor, flexShrink: 0 }} />
                  <div className="flex flex-col text-left">
                    <span>{MOOD_CFG[mood].label}</span>
                    <span style={{ fontSize: 20, color: "var(--color-text-muted)", fontWeight: 400 }}>{MOOD_CFG[mood].desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col overflow-y-auto" style={{ gap: "var(--space-lg)" }}>
          <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-1)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)" }}>
            <div className="flex items-center" style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-lg)", gap: "var(--space-sm)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              投票統計
            </div>
            <div className="flex items-center" style={{ gap: "var(--space-xl)" }}>
              <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
                <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-surface)" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-happy)" strokeWidth="3.8" strokeDasharray={`${hPct} ${100 - hPct}`} strokeDashoffset="0" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-sad)" strokeWidth="3.8" strokeDasharray={`${sPct} ${100 - sPct}`} strokeDashoffset={`${-hPct}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-angry)" strokeWidth="3.8" strokeDasharray={`${aPct} ${100 - aPct}`} strokeDashoffset={`${-(hPct + sPct)}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ fontSize: 42, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{moods.length}</span>
                  <span style={{ fontSize: 16, color: "var(--color-text-muted)" }}>總票數</span>
                </div>
              </div>
              <div className="flex flex-col flex-1" style={{ gap: "var(--space-md)" }}>
                {([["happy", happy, "var(--color-happy)"], ["sad", sad, "var(--color-sad)"], ["angry", angry, "var(--color-angry)"]] as const).map(([key, arr, color]) => (
                  <div key={key} className="flex items-center" style={{ gap: "var(--space-sm)", fontSize: 24 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid var(--color-border)", background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{MOOD_CFG[key].label}</span>
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>{arr.length}</span>
                    <span style={{ color: "var(--color-text-muted)", fontSize: 20, minWidth: 48, textAlign: "right" }}>{Math.round((arr.length / total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-xl)", boxShadow: "var(--shadow-sketch)" }}>
            <div className="flex items-center" style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-lg)", gap: "var(--space-sm)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              投票名單
            </div>
            {(["happy", "sad", "angry"] as MoodType[]).map((mood) => {
              const items = mood === "happy" ? happy : mood === "sad" ? sad : angry;
              return (
                <div key={mood} style={{ marginBottom: "var(--space-md)" }}>
                  <div className="flex items-center" style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)", gap: "var(--space-xs)" }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid var(--color-border)", background: MOOD_CFG[mood].cssColor }} />
                    {MOOD_CFG[mood].label} ({items.length})
                  </div>
                  <div className="flex flex-wrap" style={{ gap: "var(--space-sm)" }}>
                    {items.length === 0
                      ? <span style={{ color: "var(--color-text-muted)", fontSize: 20 }}>尚無投票</span>
                      : items.map((m) => <span key={m.id} style={{ padding: "6px 16px", borderRadius: "var(--wobble-2)", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-heading)", border: "2px solid var(--color-border)", background: MOOD_CFG[mood].lightColor }}>{m.Name}</span>)
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedMood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(45,45,45,0.35)" }}>
          <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--wobble-3)", border: "var(--border-width) solid var(--color-border)", padding: "var(--space-xl)", maxWidth: 560, width: "92%", maxHeight: "85vh", overflowY: "auto", boxShadow: "8px 8px 0 var(--color-marker-black)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-lg)" }}>
              <span style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-heading)" }}>投票：{MOOD_CFG[selectedMood].label}</span>
              <button onClick={() => setModalOpen(false)} style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "none" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex" style={{ gap: "var(--space-xs)", padding: 6, background: "var(--color-surface)", border: "2px solid var(--color-border-light)", borderRadius: "var(--wobble-1)", marginBottom: "var(--space-md)" }}>
              {groups.map((g) => (
                <button key={g} onClick={() => { setModalGroup(g); setSelectedMember(null); }} style={{ padding: "12px 24px", borderRadius: "var(--wobble-2)", fontWeight: 700, fontSize: 20, fontFamily: "var(--font-heading)", color: g === modalGroup ? "var(--color-text-primary)" : "var(--color-text-muted)", minHeight: 48, cursor: "pointer", border: g === modalGroup ? "2px solid var(--color-border)" : "none", background: g === modalGroup ? "var(--color-bg-card)" : "transparent", boxShadow: g === modalGroup ? "var(--shadow-sketch-sm)" : "none" }}>第 {g} 組</button>
              ))}
            </div>
            <div className="grid grid-cols-2" style={{ gap: "var(--space-sm)", maxHeight: 340, overflowY: "auto" }}>
              {(grouped[modalGroup] || []).map((m) => {
                const mName = getStudentName(m);
                const voted = votedNames.has(mName);
                const sel = selectedMember?.id === m.id;
                return (
                  <button key={m.id} onClick={() => !voted && setSelectedMember(m)} disabled={voted} className="flex items-center text-left" style={{ gap: "var(--space-md)", padding: "var(--space-md)", borderRadius: "var(--wobble-3)", border: sel ? "var(--border-width) solid var(--color-primary)" : "2px solid var(--color-border-light)", background: sel ? "var(--color-primary-lighter)" : "var(--color-bg-card)", boxShadow: sel ? "var(--shadow-sketch-sm)" : "none", cursor: voted ? "default" : "pointer", opacity: voted ? 0.5 : 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", border: "var(--border-width) solid var(--color-border)", background: "var(--color-postit-yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: 20, flexShrink: 0 }}>{mName[0]}</div>
                    <span style={{ fontWeight: 700, fontSize: 24, fontFamily: "var(--font-heading)", flex: 1 }}>{mName}</span>
                    {voted && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "var(--space-lg)" }}>
              <button onClick={submitVote} disabled={!selectedMember} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)", padding: "18px 36px", borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-marker-black)", fontSize: 28, fontWeight: 700, fontFamily: "var(--font-heading)", minHeight: 64, background: selectedMember ? "var(--color-primary)" : "var(--color-border-light)", color: selectedMember ? "var(--color-text-inverse)" : "var(--color-text-muted)", boxShadow: "var(--shadow-sketch-sm)", cursor: selectedMember ? "pointer" : "not-allowed" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                確認投票
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
