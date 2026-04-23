"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type CareerId = "doctor" | "chef" | "firefighter" | "farmer" | "teacher";

type Career = {
  id: CareerId;
  name: string;
  itemLabel: string;
  itemImg: string;
  characterImg: string;
  color: string;
  bgColor: string;
  quote: string;
};

const CAREERS: Career[] = [
  {
    id: "doctor",
    name: "醫生",
    itemLabel: "聽診器",
    itemImg: "/images/career-maze/items/stethoscope.png",
    characterImg: "/images/career-maze/characters/doctor.png",
    color: "#2196F3",
    bgColor: "#E3F2FD",
    quote: "謝謝你把聽診器送來！我可以聽聽病人的心跳了。",
  },
  {
    id: "chef",
    name: "廚師",
    itemLabel: "廚師帽",
    itemImg: "/images/career-maze/items/chef-hat.png",
    characterImg: "/images/career-maze/characters/chef.png",
    color: "#EF5350",
    bgColor: "#FFEBEE",
    quote: "有了廚師帽，我就可以煮好吃的飯飯給大家吃！",
  },
  {
    id: "firefighter",
    name: "消防員",
    itemLabel: "滅火器",
    itemImg: "/images/career-maze/items/fire-extinguisher.png",
    characterImg: "/images/career-maze/characters/firefighter.png",
    color: "#FF9800",
    bgColor: "#FFF3E0",
    quote: "滅火器可以幫我救火、保護大家！",
  },
  {
    id: "farmer",
    name: "農夫",
    itemLabel: "麥穗",
    itemImg: "/images/career-maze/items/wheat.png",
    characterImg: "/images/career-maze/characters/farmer.png",
    color: "#8BC34A",
    bgColor: "#F1F8E9",
    quote: "我用心種的麥穗終於到了！謝謝你。",
  },
  {
    id: "teacher",
    name: "老師",
    itemLabel: "書本",
    itemImg: "/images/career-maze/items/book.png",
    characterImg: "/images/career-maze/characters/teacher.png",
    color: "#AB47BC",
    bgColor: "#F3E5F5",
    quote: "有了書本我就可以教大家好多好多知識！",
  },
];

// ---------------------------------------------------------------
// 11×11 迷宮設計
// 0 = 可走路徑  1 = 牆壁
// 入口與出口分佈四邊，5 組配對
// ---------------------------------------------------------------
const GRID_SIZE = 11;

// 1 = wall, 0 = walkable
const WALLS: number[][] = [
  // c: 0  1  2  3  4  5  6  7  8  9  10
  /*0*/ [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  /*1*/ [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  /*2*/ [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
  /*3*/ [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  /*4*/ [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
  /*5*/ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*6*/ [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
  /*7*/ [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  /*8*/ [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
  /*9*/ [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  /*10*/[0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
];

type Terminal = {
  careerId: CareerId;
  row: number;
  col: number;
  side: "top" | "bottom" | "left" | "right";
};

// 入口位置（方格內靠邊的位置，對應物品顯示在方格外側）
const ENTRANCES: Terminal[] = [
  { careerId: "doctor",      row: 0,  col: 2,  side: "top" },      // 聽診器：上方
  { careerId: "chef",        row: 3,  col: 0,  side: "left" },     // 廚師帽：左邊
  { careerId: "firefighter", row: 0,  col: 8,  side: "top" },      // 滅火器：上方
  { careerId: "farmer",      row: 3,  col: 10, side: "right" },    // 麥穗：右邊
  { careerId: "teacher",     row: 10, col: 2,  side: "bottom" },   // 書本：下方
];

// 出口位置（對應方格內靠邊的位置）
const EXITS: Terminal[] = [
  { careerId: "doctor",      row: 10, col: 8,  side: "bottom" },   // 醫生：下方（對角）
  { careerId: "chef",        row: 7,  col: 10, side: "right" },    // 廚師：右邊（對角）
  { careerId: "firefighter", row: 7,  col: 0,  side: "left" },     // 消防員：左邊
  { careerId: "farmer",      row: 10, col: 5,  side: "bottom" },   // 農夫：下方
  { careerId: "teacher",     row: 0,  col: 5,  side: "top" },      // 老師：上方
];

const CELL_SIZE = 56; // px
const GAP = 2;

function careerById(id: CareerId): Career {
  return CAREERS.find((c) => c.id === id)!;
}

function key(r: number, c: number) {
  return `${r},${c}`;
}

export default function CareerMazePage() {
  // 當前選中的入口（由玩家點擊物品開始）
  const [activeCareer, setActiveCareer] = useState<CareerId | null>(null);
  // 玩家走過的路徑（相對於當前這一輪）
  const [path, setPath] = useState<Array<{ row: number; col: number }>>([]);
  // 已完成配對的職業
  const [completed, setCompleted] = useState<Set<CareerId>>(new Set());
  // 結果提示訊息
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; text: string } | null>(null);
  // 最新成功配對（用於顯示慶祝）
  const [lastSuccess, setLastSuccess] = useState<CareerId | null>(null);

  const audioRef = useRef<AudioContext | null>(null);
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    audioRef.current.resume();
    return audioRef.current;
  }, []);

  const playTone = useCallback((type: "step" | "correct" | "wrong" | "win") => {
    try {
      const ctx = getAudio();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === "step") {
        o.frequency.value = 520; g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        o.start(now); o.stop(now + 0.1);
      } else if (type === "correct") {
        o.frequency.setValueAtTime(660, now);
        o.frequency.linearRampToValueAtTime(990, now + 0.15);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        o.start(now); o.stop(now + 0.4);
      } else if (type === "wrong") {
        o.frequency.setValueAtTime(280, now);
        o.frequency.linearRampToValueAtTime(150, now + 0.2);
        g.gain.setValueAtTime(0.12, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        o.start(now); o.stop(now + 0.3);
      } else if (type === "win") {
        [523, 659, 784, 1047].forEach((f, i) => {
          const oo = ctx.createOscillator();
          const gg = ctx.createGain();
          oo.connect(gg); gg.connect(ctx.destination);
          oo.frequency.value = f;
          const s = now + i * 0.15;
          gg.gain.setValueAtTime(0.15, s);
          gg.gain.exponentialRampToValueAtTime(0.01, s + 0.3);
          oo.start(s); oo.stop(s + 0.3);
        });
      }
    } catch {}
  }, [getAudio]);

  const pathSet = useMemo(() => new Set(path.map((p) => key(p.row, p.col))), [path]);
  const headCell = path[path.length - 1];

  const entranceByCareer = useCallback((id: CareerId) => ENTRANCES.find((e) => e.careerId === id)!, []);
  const exitByCareer = useCallback((id: CareerId) => EXITS.find((e) => e.careerId === id)!, []);

  const cellKindAt = useCallback((r: number, c: number): "entrance" | "exit" | "wall" | "path" | null => {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return null;
    if (ENTRANCES.some((e) => e.row === r && e.col === c)) return "entrance";
    if (EXITS.some((e) => e.row === r && e.col === c)) return "exit";
    if (WALLS[r][c] === 1) return "wall";
    return "path";
  }, []);

  const pickEntrance = useCallback((id: CareerId) => {
    if (completed.has(id)) return;
    const ent = entranceByCareer(id);
    setActiveCareer(id);
    setPath([{ row: ent.row, col: ent.col }]);
    setFeedback({ type: null, text: `請把「${careerById(id).itemLabel}」送到對應的職業手上！` });
  }, [completed, entranceByCareer]);

  const resetRound = useCallback(() => {
    setActiveCareer(null);
    setPath([]);
    setFeedback(null);
  }, []);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (activeCareer === null || !headCell) return;
    if (completed.has(activeCareer)) return;

    const kind = cellKindAt(r, c);
    if (kind === "wall" || kind === null) {
      playTone("wrong");
      return;
    }

    // 是否相鄰？（上下左右）
    const dr = Math.abs(r - headCell.row);
    const dc = Math.abs(c - headCell.col);
    const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    const isSame = dr === 0 && dc === 0;
    if (!isAdjacent && !isSame) {
      playTone("wrong");
      return;
    }

    // 回溯：點擊路徑中倒數第二格 → 回退
    if (path.length >= 2) {
      const prev = path[path.length - 2];
      if (prev.row === r && prev.col === c) {
        setPath(path.slice(0, -1));
        playTone("step");
        return;
      }
    }

    // 已走過的格子不能重複
    if (pathSet.has(key(r, c)) && !isSame) {
      playTone("wrong");
      return;
    }

    // 檢查是否為出口（必須是正確的職業出口）
    if (kind === "exit") {
      const ex = EXITS.find((e) => e.row === r && e.col === c)!;
      if (ex.careerId === activeCareer) {
        // 配對成功
        playTone("correct");
        const next = new Set(completed);
        next.add(activeCareer);
        setCompleted(next);
        setLastSuccess(activeCareer);
        setFeedback({ type: "success", text: careerById(activeCareer).quote });
        setPath([...path, { row: r, col: c }]);
        // 若全部完成
        setTimeout(() => {
          if (next.size === CAREERS.length) {
            playTone("win");
          }
        }, 600);
        setTimeout(() => {
          setLastSuccess(null);
          resetRound();
        }, 2500);
        return;
      } else {
        // 走到錯誤出口
        playTone("wrong");
        setFeedback({ type: "error", text: "這不是他的主人喔，再想想看！" });
        return;
      }
    }

    // 一般路徑：前進一格
    setPath([...path, { row: r, col: c }]);
    playTone("step");
  }, [activeCareer, headCell, completed, cellKindAt, path, pathSet, playTone, resetRound]);

  const allDone = completed.size === CAREERS.length;

  // ---------------------------------------------------------------
  // 渲染每一格
  // ---------------------------------------------------------------
  const renderCell = (r: number, c: number) => {
    const kind = cellKindAt(r, c);
    const inPath = pathSet.has(key(r, c));
    const isHead = headCell && headCell.row === r && headCell.col === c;

    const entrance = ENTRANCES.find((e) => e.row === r && e.col === c);
    const exit = EXITS.find((e) => e.row === r && e.col === c);
    const career = entrance ? careerById(entrance.careerId) : exit ? careerById(exit.careerId) : null;

    let bg = "#FAFAF5"; // 一般路徑
    let border = "2px solid #D4CFC4";
    const cursorStyle: React.CSSProperties = { cursor: kind === "wall" ? "default" : "pointer" };

    if (kind === "wall") {
      bg = "#4A4A4A";
      border = "2px solid #2E2E2E";
    } else if (entrance) {
      bg = completed.has(entrance.careerId) ? "#E0E0E0" : career!.bgColor;
      border = `3px solid ${career!.color}`;
    } else if (exit) {
      bg = completed.has(exit.careerId) ? "#E0E0E0" : career!.bgColor;
      border = `3px solid ${career!.color}`;
    } else if (inPath) {
      const activeColor = activeCareer ? careerById(activeCareer).color : "#4CAF50";
      bg = isHead ? activeColor : `${activeColor}55`;
      border = `2px solid ${activeColor}`;
    }

    return (
      <button
        key={`${r}-${c}`}
        onClick={() => handleCellClick(r, c)}
        disabled={kind === "wall"}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          background: bg,
          border,
          borderRadius: 8,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "background 0.18s ease, transform 0.15s ease",
          boxShadow: isHead ? `0 0 0 4px ${careerById(activeCareer!).color}55` : kind === "wall" ? "inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.25)" : "none",
          ...cursorStyle,
        }}
      >
        {entrance && career && (
          <>
            <Image
              src={career.itemImg}
              alt={career.itemLabel}
              width={CELL_SIZE - 12}
              height={CELL_SIZE - 12}
              style={{ opacity: completed.has(entrance.careerId) ? 0.35 : 1, objectFit: "contain" }}
            />
            {/* 閃爍提示：尚未選中、尚未完成 */}
            {!activeCareer && !completed.has(entrance.careerId) && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: career.color,
                  boxShadow: `0 0 0 3px ${career.bgColor}`,
                  animation: "cm-pulse 1.6s ease-in-out infinite",
                }}
              />
            )}
            {/* 完成打勾 */}
            {completed.has(entrance.careerId) && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#4CAF50",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 14,
                  fontWeight: 900,
                  border: "2px solid white",
                }}
              >
                ✓
              </span>
            )}
          </>
        )}
        {exit && career && (
          <Image
            src={career.characterImg}
            alt={career.name}
            width={CELL_SIZE - 10}
            height={CELL_SIZE - 10}
            style={{ opacity: completed.has(exit.careerId) ? 0.5 : 1, objectFit: "contain" }}
          />
        )}
        {isHead && activeCareer && !entrance && !exit && (
          <Image
            src={careerById(activeCareer).itemImg}
            alt={careerById(activeCareer).itemLabel}
            width={CELL_SIZE - 14}
            height={CELL_SIZE - 14}
            style={{ objectFit: "contain" }}
          />
        )}
      </button>
    );
  };

  // ---------------------------------------------------------------
  // 版面
  // ---------------------------------------------------------------
  const gridPixel = CELL_SIZE * GRID_SIZE + GAP * (GRID_SIZE - 1);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
      <style>{`
        @keyframes cm-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.65; }
        }
        @keyframes cm-fly {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0; }
        }
        @keyframes cm-celebrate {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ flex: 1, overflow: "auto", maxWidth: 1100, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
        {/* 返回按鈕 */}
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <Link
            href="/courses/2"
            style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
              padding: "12px 24px", borderRadius: "var(--wobble-4, 12px)",
              background: "var(--color-bg-card)", border: "2px solid var(--color-border)",
              color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)",
              boxShadow: "var(--shadow-sketch-sm)", fontSize: "var(--font-size-base, 18px)",
              textDecoration: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            回到第 3 週
          </Link>
        </div>

        {/* 標題區 */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)" }}>🧭 職業迷宮</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>
            點擊入口的「物品」，再一格一格走到對應的職業身邊
          </p>
        </div>

        {/* 進度列 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)", marginBottom: "var(--space-lg)", flexWrap: "wrap" }}>
          {CAREERS.map((c) => {
            const done = completed.has(c.id);
            const active = activeCareer === c.id;
            return (
              <div
                key={c.id}
                onClick={() => !done && pickEntrance(c.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 999,
                  border: `2px solid ${active ? c.color : "var(--color-border)"}`,
                  background: done ? "#E8F5E9" : active ? c.bgColor : "var(--color-bg-card)",
                  cursor: done ? "default" : "pointer",
                  opacity: done ? 0.75 : 1,
                  boxShadow: active ? `0 0 0 3px ${c.color}33` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Image src={c.itemImg} alt={c.itemLabel} width={24} height={24} style={{ objectFit: "contain" }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--font-size-base)" }}>
                  {c.name}
                </span>
                {done && <span style={{ color: "#4CAF50", fontWeight: 900 }}>✓</span>}
              </div>
            );
          })}
        </div>

        {/* 提示區 */}
        <div style={{
          textAlign: "center",
          minHeight: 48,
          marginBottom: "var(--space-md)",
          padding: "10px 20px",
          borderRadius: 12,
          background: feedback?.type === "success" ? "#E8F5E9" : feedback?.type === "error" ? "#FFEBEE" : "var(--color-bg-card)",
          border: `2px solid ${feedback?.type === "success" ? "#4CAF50" : feedback?.type === "error" ? "#EF5350" : "var(--color-border)"}`,
          fontSize: "var(--font-size-lg)",
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}>
          {feedback?.text || (activeCareer ? `目前正在帶「${careerById(activeCareer).itemLabel}」走路` : "點擊一個職業物品開始！")}
        </div>

        {/* 迷宮網格 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gap: GAP,
              padding: 16,
              background: "var(--color-bg-card)",
              borderRadius: 20,
              border: "2px solid var(--color-border)",
              boxShadow: "var(--shadow-sketch)",
              width: gridPixel + 32,
            }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, r) =>
              Array.from({ length: GRID_SIZE }).map((_, c) => renderCell(r, c))
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", marginTop: "var(--space-lg)", flexWrap: "wrap" }}>
          {activeCareer && !completed.has(activeCareer) && (
            <button
              onClick={resetRound}
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 700,
                padding: "12px 24px", borderRadius: 12, cursor: "pointer",
                background: "var(--color-bg-card)", border: "2px solid var(--color-border)",
                color: "var(--color-text-secondary)", fontSize: "var(--font-size-base, 18px)",
                boxShadow: "var(--shadow-sketch-sm)",
              }}
            >
              🔄 取消這個任務
            </button>
          )}
          {completed.size > 0 && (
            <button
              onClick={() => { setCompleted(new Set()); resetRound(); }}
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 700,
                padding: "12px 24px", borderRadius: 12, cursor: "pointer",
                background: "var(--color-bg-card)", border: "2px solid var(--color-border)",
                color: "var(--color-text-secondary)", fontSize: "var(--font-size-base, 18px)",
                boxShadow: "var(--shadow-sketch-sm)",
              }}
            >
              🎮 重玩全部
            </button>
          )}
        </div>

        {/* 成功配對彈窗 */}
        {lastSuccess && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.35)",
              zIndex: 60,
              animation: "cm-celebrate 0.35s ease-out",
            }}
          >
            <div style={{
              background: careerById(lastSuccess).bgColor,
              border: `4px solid ${careerById(lastSuccess).color}`,
              borderRadius: 24,
              padding: "32px 48px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              maxWidth: 420,
            }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
                <Image src={careerById(lastSuccess).itemImg} alt="" width={72} height={72} />
                <div style={{ fontSize: 40, alignSelf: "center" }}>→</div>
                <Image src={careerById(lastSuccess).characterImg} alt="" width={72} height={72} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: careerById(lastSuccess).color, fontFamily: "var(--font-heading)" }}>
                配對成功！
              </h2>
              <p style={{ fontSize: 18, marginTop: 8, color: "#333" }}>
                {careerById(lastSuccess).quote}
              </p>
            </div>
          </div>
        )}

        {/* 全部通關 */}
        {allDone && !lastSuccess && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.5)",
              zIndex: 70,
            }}
          >
            <div style={{
              background: "white",
              borderRadius: 28,
              padding: "40px 56px",
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
              maxWidth: 560,
              animation: "cm-celebrate 0.5s ease-out",
            }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉🎊🥳</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, fontFamily: "var(--font-heading)", color: "#FF6F00" }}>
                你認識了 5 種職業！
              </h2>
              <p style={{ fontSize: 20, marginTop: 12, color: "#555" }}>
                太棒了！你把每個物品都送到正確的職業手上囉！
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                {CAREERS.map((c) => (
                  <div key={c.id} style={{ textAlign: "center" }}>
                    <Image src={c.characterImg} alt={c.name} width={64} height={64} />
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: c.color }}>
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setCompleted(new Set()); resetRound(); }}
                style={{
                  marginTop: 24, fontFamily: "var(--font-heading)", fontWeight: 700,
                  padding: "14px 32px", borderRadius: 14, cursor: "pointer",
                  background: "var(--color-primary, #E8874A)", color: "white",
                  border: "2px solid var(--color-primary-dark, #C86A2E)",
                  fontSize: "var(--font-size-lg, 20px)",
                  boxShadow: "0 4px 12px rgba(232,135,74,0.35)",
                }}
              >
                🎮 再玩一次
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
