"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Check, X, MousePointer2 } from "lucide-react";
import {
  getStudents, getCheckins, checkin as apiCheckin,
  groupStudents, getStudentName,
  type Student, type CheckinRecord,
} from "@/lib/api";

const SPOTS = [
  { x: 42, y: 9 }, { x: 50, y: 6 }, { x: 57, y: 9 },
  { x: 30, y: 17 }, { x: 24, y: 25 },
  { x: 68, y: 17 }, { x: 73, y: 25 },
  { x: 19, y: 33 }, { x: 17, y: 42 }, { x: 24, y: 38 },
  { x: 79, y: 32 }, { x: 80, y: 41 }, { x: 74, y: 37 },
  { x: 36, y: 23 }, { x: 63, y: 22 }, { x: 50, y: 19 },
  { x: 21, y: 49 }, { x: 77, y: 48 },
  { x: 36, y: 53 }, { x: 63, y: 52 },
];

const COLORS = [
  "#E8734A", "#3DABB5", "#8B7EC8", "#E06B6B", "#5CB85C",
  "#F5C842", "#5B9BD5", "#D4A017", "#C85A32", "#2A8A93",
  "#E091C0", "#7BA856", "#D98A3C", "#6A8FC7", "#C75B8F",
  "#8BC34A", "#FF7043", "#26A69A", "#AB47BC", "#5C6BC0",
];

export default function CheckinTreePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Student[]>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, CheckinRecord>>({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ left: 0, top: 0 });
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

  // Load students
  useEffect(() => {
    (async () => {
      const data = await getStudents();
      if (data) {
        setStudents(data);
        setGrouped(groupStudents(data));
      }
    })();
  }, []);

  // Load checkins
  const loadCheckins = useCallback(async () => {
    const records = await getCheckins(String(currentWeek));
    const map: Record<string, CheckinRecord> = {};
    records.forEach((r) => (map[r.Name] = r));
    setCheckedMap(map);
  }, [currentWeek]);

  useEffect(() => { loadCheckins(); }, [loadCheckins]);

  const checkedNames = Object.keys(checkedMap);
  const groups = Object.keys(grouped).sort();

  function onSpotClick(idx: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (idx < checkedNames.length) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let left = rect.left + rect.width / 2 - 140;
    let top = rect.bottom + 10;
    if (left < 12) left = 12;
    if (left + 280 > window.innerWidth - 12) left = window.innerWidth - 292;
    if (top + 380 > window.innerHeight - 12) top = rect.top - 400;
    setPickerPos({ left, top });
    setPickerOpen(true);
  }

  async function doCheckin(name: string, group: string) {
    try {
      await apiCheckin(name, group, String(currentWeek));
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
    <div className="w-screen h-screen relative select-none overflow-hidden"
      style={{ background: "linear-gradient(180deg, #C9E8F5 0%, #E8F4EC 40%, #D5E8C8 70%, #A8C890 100%)" }}>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 z-[1]"
        style={{ height: "12%", background: "linear-gradient(180deg, #8CB56A, #6D9B4A)", borderRadius: "50% 50% 0 0 / 20% 20% 0 0" }} />

      {/* Top bar */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
        <div>
          <Link href="/" className="glass-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-2"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", color: "var(--text-secondary)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <ArrowLeft size={18} /> 返回
          </Link>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <Clock size={18} />
            <div>
              <div className="text-xl font-bold tabular-nums">{time}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{date}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((w) => (
            <button key={w} onClick={() => setCurrentWeek(w)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              style={{ background: w === currentWeek ? "var(--secondary)" : "transparent", color: w === currentWeek ? "white" : "var(--text-muted)", boxShadow: w === currentWeek ? "0 2px 8px rgba(61,171,181,0.35)" : "none" }}>
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Tree */}
      <div className="absolute z-[2]" style={{ bottom: "5%", left: "50%", transform: "translateX(-50%)", height: "95vh", aspectRatio: "16/9" }}>
        <Image src="/tree-nobg.png" alt="簽到樹" fill className="object-contain pointer-events-none" style={{ filter: "drop-shadow(0 8px 24px rgba(60,40,20,0.15))" }} priority />

        {/* Spots */}
        {SPOTS.map((pos, i) => {
          const occupied = i < checkedNames.length;
          return !occupied ? (
            <div key={i} onClick={(e) => onSpotClick(i, e)}
              className="absolute cursor-pointer rounded-full"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 72, height: 72, marginLeft: -36, marginTop: -36, zIndex: 5, background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 60%, transparent 75%)", border: "2.5px dashed rgba(255,255,255,0.45)", animation: "spot-pulse 2.5s ease-in-out infinite" }}
              onMouseEnter={(e) => { Object.assign(e.currentTarget.style, { background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 60%, transparent 75%)", borderColor: "white", transform: "scale(1.18)", animation: "none", boxShadow: "0 0 16px rgba(255,255,255,0.4)" }); }}
              onMouseLeave={(e) => { Object.assign(e.currentTarget.style, { background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 60%, transparent 75%)", borderColor: "rgba(255,255,255,0.45)", transform: "scale(1)", animation: "spot-pulse 2.5s ease-in-out infinite", boxShadow: "none" }); }}
            />
          ) : null;
        })}

        {/* Stamps */}
        {checkedNames.map((name, i) => {
          if (i >= SPOTS.length) return null;
          const pos = SPOTS[i];
          return (
            <div key={name} className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, marginLeft: -26, marginTop: -26, zIndex: 6, animation: `stamp-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${i * 60}ms` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg"
                style={{ background: COLORS[i % COLORS.length], border: "3px solid white", boxShadow: "0 3px 10px rgba(0,0,0,0.2)" }}>
                {name[0]}
              </div>
              <div className="mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", color: "var(--text-primary)" }}>
                {name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Picker */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0" onClick={() => setPickerOpen(false)} />
          <div className="absolute w-[280px] max-h-[420px] flex flex-col overflow-hidden"
            style={{ left: pickerPos.left, top: pickerPos.top, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderRadius: 20, boxShadow: "var(--shadow-xl), 0 0 0 1px rgba(0,0,0,0.05)", animation: "scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <span className="font-bold">選擇成員簽到</span>
              <button onClick={() => setPickerOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: "var(--text-muted)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-0.5 px-4 pt-2 overflow-x-auto">
              {groups.map((g) => (
                <button key={g} onClick={() => setPickerGroup(g)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                  style={{ background: g === pickerGroup ? "var(--primary)" : "transparent", color: g === pickerGroup ? "white" : "var(--text-muted)" }}>
                  第{g}組
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {(grouped[pickerGroup] || []).map((m) => {
                const name = getStudentName(m);
                const isChecked = !!checkedMap[name];
                return (
                  <div key={m.id || name} onClick={() => !isChecked && doCheckin(name, m.group || pickerGroup)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all border-2 border-transparent ${isChecked ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--primary-lighter)] hover:border-[var(--primary-light)]"}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: "var(--primary-lighter)", color: "var(--primary)" }}>
                      {name[0]}
                    </div>
                    <span className="font-semibold flex-1">{name}</span>
                    {isChecked && <Check size={18} style={{ color: "var(--success)" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Success flash */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="text-center px-10 py-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", boxShadow: "var(--shadow-xl)", animation: "celebrate 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--success-light)", color: "var(--success)" }}>
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold">{successName} 簽到成功！</h3>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>已掛上簽到樹</p>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-6 py-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--success)" }} /> 已簽到 <strong>{checkedNames.length}</strong> 人
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--border)" }} /> 共 <strong>{students.length}</strong> 人
        </span>
        <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          <MousePointer2 size={14} /> 點擊樹枝簽到
        </span>
      </div>
    </div>
  );
}
