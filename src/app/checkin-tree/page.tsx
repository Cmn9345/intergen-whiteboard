"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import pb from "@/lib/pocketbase";
import {
  getStudents, getCheckins, checkin as apiCheckin,
  groupStudents, getStudentName, getPbFileUrl,
  type Student, type CheckinRecord,
} from "@/lib/api";

function getStudentPhotoUrl(s: Student | undefined): string | null {
  if (!s?.photo || !s.collectionId) return null;
  return getPbFileUrl(s.collectionId, s.id, s.photo);
}

const SPOTS = [
  // 頂部 (3)
  { x: 42, y: 9 }, { x: 50, y: 6 }, { x: 57, y: 9 },
  // 上層左右 (4)
  { x: 30, y: 17 }, { x: 24, y: 25 },
  { x: 68, y: 17 }, { x: 73, y: 25 },
  // 中層左右 (6)
  { x: 19, y: 33 }, { x: 17, y: 42 }, { x: 24, y: 38 },
  { x: 79, y: 32 }, { x: 80, y: 41 }, { x: 74, y: 37 },
  // 中間 (3)
  { x: 36, y: 23 }, { x: 63, y: 22 }, { x: 50, y: 19 },
  // 下層左右 (4)
  { x: 21, y: 49 }, { x: 77, y: 48 },
  { x: 36, y: 53 }, { x: 63, y: 52 },
  // 額外位置 (10)
  { x: 44, y: 30 }, { x: 56, y: 30 },
  { x: 33, y: 38 }, { x: 67, y: 38 },
  { x: 28, y: 47 }, { x: 72, y: 47 },
  { x: 50, y: 42 }, { x: 40, y: 46 },
  { x: 60, y: 46 }, { x: 50, y: 52 },
];

const COLORS = [
  "#E8874A", "#2D5DA1", "#7B5EA7", "#E06B6B", "#3A8F4B",
  "#F5C842", "#5B9BD5", "#C86A2E", "#3A8F4B", "#2D5DA1",
  "#E091C0", "#7BA856", "#D98A3C", "#6A8FC7", "#C75B8F",
  "#8BC34A", "#FF7043", "#26A69A", "#AB47BC", "#5C6BC0",
  "#E8874A", "#2D5DA1", "#7B5EA7", "#E06B6B", "#3A8F4B",
  "#F5C842", "#5B9BD5", "#C86A2E", "#E091C0", "#7BA856",
];

export default function CheckinTreePage() {
  const [members, setMembers] = useState<Student[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Student[]>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, CheckinRecord>>({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerGroup, setPickerGroup] = useState("1");
  const [successName, setSuccessName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Clock
  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "short" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const loadStudents = useCallback(async () => {
    const data = await getStudents();
    setMembers(data);
    setGrouped(groupStudents(data));
  }, []);

  const loadCheckins = useCallback(async () => {
    const records = await getCheckins(String(currentWeek));
    const map: Record<string, CheckinRecord> = {};
    records.forEach((r) => (map[r.Name] = r));
    setCheckedMap(map);
  }, [currentWeek]);

  useEffect(() => { loadStudents(); }, [loadStudents]);
  useEffect(() => { loadCheckins(); }, [loadCheckins]);

  // Realtime: refetch immediately whenever PocketBase data changes
  useEffect(() => {
    let cancelStudents: (() => void) | undefined;
    let cancelCheckins: (() => void) | undefined;
    (async () => {
      try {
        const unsubStudents = await pb.collection("student").subscribe("*", () => loadStudents());
        cancelStudents = () => { void unsubStudents(); };
        const unsubCheckins = await pb.collection("signintree").subscribe("*", () => loadCheckins());
        cancelCheckins = () => { void unsubCheckins(); };
      } catch (err) {
        console.error("[checkin-tree] realtime subscribe failed:", err);
      }
    })();
    // Polling fallback in case realtime is blocked (every 20s)
    const poll = setInterval(() => { loadStudents(); loadCheckins(); }, 20000);
    // Refetch when tab regains focus
    const onFocus = () => { loadStudents(); loadCheckins(); };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelStudents?.();
      cancelCheckins?.();
      clearInterval(poll);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadStudents, loadCheckins]);

  const checkedNames = Object.keys(checkedMap);
  const groups = Object.keys(grouped).sort();
  const memberByName = useMemo(() => {
    const map: Record<string, Student> = {};
    members.forEach((m) => { map[getStudentName(m)] = m; });
    return map;
  }, [members]);

  async function doCheckin(member: Student) {
    try {
      const name = getStudentName(member);
      await apiCheckin(name, member.group, String(currentWeek));
      setPickerOpen(false);
      setSuccessName(name);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      await loadCheckins();
    } catch (err: unknown) {
      setPickerOpen(false);
      alert(err instanceof Error && err.message === "DUPLICATE" ? `${name} 本週已簽到過了` : "簽到失敗，請重試");
    }
  }

  return (
    <div className="w-screen min-h-screen relative select-none"
      style={{ background: "linear-gradient(180deg, #C9E8F5 0%, #E8F4EC 40%, #D5E8C8 70%, #A8C890 100%)" }}>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 z-[1]"
        style={{ height: "12%", background: "linear-gradient(180deg, #8CB56A, #6D9B4A)" }}>
        <div className="absolute -top-5 -left-[5%] -right-[5%] h-10 rounded-[50%]" style={{ background: "#8CB56A" }} />
      </div>

      {/* Top bar */}
      <div className="checkin-topbar absolute z-20" style={{ top: "var(--space-lg)", left: "var(--space-lg)", right: "var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-2"
            style={{ padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            返回
          </Link>
          <div className="flex items-center gap-2"
            style={{ padding: "var(--space-sm) var(--space-md)", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "var(--radius-lg)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{time}</div>
              <div style={{ fontSize: 16, color: "var(--color-text-muted)" }}>{date}</div>
            </div>
          </div>
        </div>
        {/* Week bar */}
        <div className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((w) => (
            <button key={w} onClick={() => setCurrentWeek(w)} className="flex items-center justify-center"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, background: w === currentWeek ? "var(--color-secondary)" : "transparent", color: w === currentWeek ? "white" : "var(--color-text-muted)", boxShadow: w === currentWeek ? "0 2px 8px rgba(45,93,161,0.35)" : "none", transition: "all 150ms ease" }}>
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Tree - click anywhere to open picker */}
      <div className="absolute z-[2] cursor-pointer" onClick={() => setPickerOpen(true)} style={{ bottom: "5%", left: "50%", transform: "translateX(-50%)", width: "min(96vw, calc(88vh * 16 / 9))", aspectRatio: "16/9", containerType: "inline-size" }}>
        <Image src="/tree-nobg.png" alt="簽到樹" fill className="object-contain" style={{ filter: "drop-shadow(0 8px 24px rgba(60,40,20,0.15))" }} priority />
        {checkedNames.map((name, i) => {
          if (i >= SPOTS.length) return null;
          const pos = SPOTS[i];
          const photoUrl = getStudentPhotoUrl(memberByName[name]);
          return (
            <div key={name} className="absolute flex flex-col items-center pointer-events-none" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)", zIndex: 6, animation: `stamp-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-center text-white overflow-hidden" style={{ width: "clamp(40px, 8cqw, 100px)", height: "clamp(40px, 8cqw, 100px)", borderRadius: "50%", fontWeight: 800, fontSize: "clamp(18px, 3.5cqw, 40px)", background: photoUrl ? "white" : COLORS[i % COLORS.length], border: "clamp(2px, 0.5cqw, 5px) solid white", boxShadow: "0 0.4cqw 1.6cqw rgba(0,0,0,0.25)" }}>
                {photoUrl ? (
                   
                  <img src={photoUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : name[0]}
              </div>
              <div style={{ marginTop: "clamp(2px, 0.4cqw, 6px)", padding: "clamp(2px, 0.4cqw, 5px) clamp(8px, 1.6cqw, 18px)", background: "rgba(255,255,255,0.95)", borderRadius: "clamp(8px, 1.4cqw, 16px)", fontSize: "clamp(11px, 1.8cqw, 22px)", fontWeight: 700, color: "var(--color-text-primary)", boxShadow: "0 0.2cqw 0.6cqw rgba(0,0,0,0.12)", whiteSpace: "nowrap" }}>{name}</div>
            </div>
          );
        })}
      </div>

      {/* Picker */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0" onClick={() => setPickerOpen(false)} />
          <div className="absolute flex flex-col overflow-hidden" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(720px, 94vw)", height: "min(760px, 90vh)", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl), 0 0 0 1px rgba(0,0,0,0.05)", animation: "scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="flex items-center justify-between shrink-0" style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--color-border-light)" }}>
              <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "clamp(18px, 2.6vmin, 28px)" }}>選擇成員簽到</span>
              <button onClick={() => setPickerOpen(false)} style={{ width: "clamp(32px, 4.5vmin, 44px)", height: "clamp(32px, 4.5vmin, 44px)", borderRadius: "50%", border: "none", cursor: "pointer", background: "none", color: "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex gap-1 overflow-x-auto shrink-0" style={{ padding: "var(--space-md) var(--space-lg)" }}>
              {groups.map((g) => (
                <button key={g} onClick={() => setPickerGroup(g)} style={{ padding: "clamp(8px, 1.4vmin, 14px) clamp(14px, 2.6vmin, 26px)", borderRadius: "var(--radius-full)", fontSize: "clamp(15px, 2vmin, 22px)", fontWeight: 700, whiteSpace: "nowrap", border: "none", cursor: "pointer", background: g === pickerGroup ? "var(--color-primary)" : "transparent", color: g === pickerGroup ? "white" : "var(--color-text-muted)" }}>第 {g} 組</button>
              ))}
            </div>
            <div style={{ flex: "1 1 0", minHeight: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
              <div style={{ padding: "var(--space-sm)", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--space-xs)" }}>
                {(grouped[pickerGroup] || []).map((m) => {
                  const mName = getStudentName(m);
                  const isChecked = !!checkedMap[mName];
                  const photoUrl = getStudentPhotoUrl(m);
                  return (
                    <div key={m.id} onClick={() => !isChecked && doCheckin(m)} className="flex items-center gap-3" style={{ padding: "clamp(8px, 1.4vmin, 14px) clamp(10px, 1.8vmin, 16px)", borderRadius: "var(--radius-md)", cursor: isChecked ? "not-allowed" : "pointer", border: "2px solid transparent", opacity: isChecked ? 0.4 : 1, transition: "all 150ms ease" }}
                      onMouseEnter={(e) => { if (!isChecked) { e.currentTarget.style.background = "var(--color-primary-lighter)"; e.currentTarget.style.borderColor = "var(--color-primary-light)"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.borderColor = "transparent"; }}>
                      <div className="flex items-center justify-center shrink-0 overflow-hidden" style={{ width: "clamp(36px, 5vmin, 52px)", height: "clamp(36px, 5vmin, 52px)", borderRadius: "50%", background: photoUrl ? "white" : "var(--color-postit-yellow)", border: "var(--border-width) solid var(--color-border)", fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "clamp(16px, 2.4vmin, 24px)" }}>
                        {photoUrl ? (
                          <img src={photoUrl} alt={mName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : mName[0]}
                      </div>
                      <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)", flex: 1, fontSize: "clamp(15px, 2.2vmin, 22px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mName}</span>
                      {isChecked && <svg width="clamp(16px, 2vmin, 22px)" height="clamp(16px, 2vmin, 22px)" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success flash */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="text-center" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: "var(--radius-xl)", padding: "var(--space-xl) var(--space-2xl)", boxShadow: "var(--shadow-xl)", animation: "celebrate 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="flex items-center justify-center mx-auto mb-4" style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-success-light)", color: "var(--color-success)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{successName} 簽到成功！</h3>
            <p style={{ color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>已掛上簽到樹</p>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="checkin-bottom absolute z-20 flex items-center" style={{ bottom: "var(--space-lg)", left: "50%", transform: "translateX(-50%)", gap: "var(--space-lg)", padding: "var(--space-sm) var(--space-lg)", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <span className="flex items-center gap-1.5" style={{ fontSize: 16, color: "var(--color-text-secondary)", fontWeight: 500 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />已簽到 <strong>{checkedNames.length}</strong> 人
        </span>
        <span className="flex items-center gap-1.5" style={{ fontSize: 16, color: "var(--color-text-secondary)", fontWeight: 500 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border)", display: "inline-block" }} />共 <strong>{members.length}</strong> 人
        </span>
        <span className="flex items-center gap-1.5" style={{ fontSize: 16, color: "var(--color-text-muted)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-2 5L9 9l11 4-5 2z"/></svg>
          點擊大樹簽到
        </span>
      </div>
    </div>
  );
}
