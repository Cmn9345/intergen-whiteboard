"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const totalSlides = 7;

export default function WhiteboardTutorialPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goSlide = useCallback((i: number) => {
    if (i < 0 || i >= totalSlides) return;
    setCurrentSlide(i);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      }
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  const MockupFrame = ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: "100%", maxWidth: 480, borderRadius: "var(--wobble-2)", border: "var(--border-width) solid var(--color-border)", boxShadow: "var(--shadow-sketch)", overflow: "hidden", background: "white" }}>
      <div style={{ height: 28, background: "var(--color-surface)", borderBottom: "2px solid var(--color-border-lighter)", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6B6B" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5C842" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF50" }} />
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );

  const SlideNumber = ({ n }: { n: number }) => (
    <div style={{ position: "absolute", bottom: 8, right: 16, fontFamily: "var(--font-heading)", fontSize: 13, color: "var(--color-text-muted)" }}>{n} / {totalSlides}</div>
  );

  const slideBase: React.CSSProperties = {
    width: "100%", maxWidth: 1100, borderRadius: "var(--wobble-1)",
    border: "var(--border-width) solid var(--color-border)", boxShadow: "var(--shadow-sketch)",
    padding: "var(--space-xl) var(--space-2xl)", position: "relative",
    animation: "slideIn 0.4s ease both", overflow: "hidden",
  };

  const splitStyle: React.CSSProperties = { ...slideBase, display: "flex", flexDirection: "row", alignItems: "stretch", gap: "var(--space-xl)" };

  const stepItemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 14, fontSize: "var(--font-size-xl)",
    color: "var(--color-text-secondary)", background: "rgba(255,255,255,0.6)",
    border: "2px solid var(--color-border-lighter)", borderRadius: 14, padding: "12px 18px", lineHeight: 1.4,
  };

  const numStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: "50%", background: "var(--color-primary)", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
    fontFamily: "var(--font-heading)", flexShrink: 0, fontSize: 16,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px var(--space-xl)", flexShrink: 0 }}>
        <Link href="/courses/0" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 1 週
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", fontWeight: 700, color: "var(--color-text-muted)" }}>
          <span>{currentSlide + 1} / {totalSlides}</span>
          <div style={{ width: 200, height: 8, background: "var(--color-border-lighter)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--color-primary)", borderRadius: 4, transition: "width 0.4s ease", width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Slide Area */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", justifyContent: "center", padding: "0 var(--space-xl)", minHeight: 0 }}>

        {/* 0: Cover */}
        {currentSlide === 0 && (
          <div style={{ ...slideBase, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ fontSize: 96, marginBottom: "var(--space-lg)" }}>📺</div>
            <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-sm)", color: "white" }}>系統使用教學</h2>
            <p style={{ fontSize: "var(--font-size-2xl)", opacity: 0.85, color: "white" }}>認識「代間共學互動平台」的四大功能</p>
            <SlideNumber n={1} />
          </div>
        )}

        {/* 1: Homepage */}
        {currentSlide === 1 && (
          <div style={{ ...splitStyle, background: "var(--color-postit-yellow)" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 16, fontSize: "var(--font-size-base)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", border: "2px solid var(--color-secondary)", width: "fit-content", background: "var(--color-postit-blue)" }}>🏠 首頁</div>
              <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>平台首頁</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.5 }}>打開平台後會看到四個功能按鈕：</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, justifyContent: "center", padding: 0 }}>
                {["🌳 簽到樹 — 上課簽到", "😊 心情溫度計 — 記錄心情", "📚 課程內容 — 每週活動", "🔐 人員登入 — 老師管理"].map((t, i) => (
                  <li key={i} style={stepItemStyle}><span style={numStyle}>{t.slice(0, 2)}</span>{t.slice(3)}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
              <MockupFrame>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 14 }}>🌳 代間共學互動平台</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { bg: "var(--color-postit-blue)", label: "簽到樹", emoji: "🌳" },
                    { bg: "var(--color-postit-yellow)", label: "心情溫度計", emoji: "🌡️" },
                    { bg: "var(--color-postit-green)", label: "課程內容", emoji: "📚" },
                    { bg: "var(--color-postit-pink)", label: "人員登入", emoji: "🔐" },
                  ].map((c, i) => (
                    <div key={i} style={{ borderRadius: 10, border: "2px solid var(--color-border-light)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 8px", fontSize: 14, fontFamily: "var(--font-heading)", fontWeight: 700, gap: 6, background: c.bg }}>
                      <span style={{ fontSize: 48 }}>{c.emoji}</span>{c.label}
                    </div>
                  ))}
                </div>
              </MockupFrame>
            </div>
            <SlideNumber n={2} />
          </div>
        )}

        {/* 2: Check-in Tree */}
        {currentSlide === 2 && (
          <div style={{ ...splitStyle, background: "var(--color-postit-green)" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 16, fontSize: "var(--font-size-base)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", border: "2px solid var(--color-success)", width: "fit-content", background: "var(--color-success-light)", color: "var(--color-success)" }}>🌳 簽到樹</div>
              <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>簽到樹怎麼用？</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.5 }}>上課時，點大樹上閃爍的圓圈來簽到：</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, justifyContent: "center", padding: 0 }}>
                <li style={stepItemStyle}><span style={numStyle}>1</span>點擊樹上<b>閃爍的圓圈</b></li>
                <li style={stepItemStyle}><span style={numStyle}>2</span>從名單中找到自己的名字</li>
                <li style={stepItemStyle}><span style={numStyle}>3</span>點名字，完成簽到！</li>
              </ul>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
              <MockupFrame>
                <div style={{ height: 240, background: "linear-gradient(180deg, #C9E8F5 0%, #D5E8C8 70%, #8CB56A 100%)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, position: "relative" }}>
                  🌳
                  {[{ top: "12%", left: "28%" }, { top: "18%", right: "22%" }, { top: "32%", right: "12%" }].map((pos, i) => (
                    <div key={i} style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", border: "2.5px dashed white", background: "rgba(255,255,255,0.45)", animation: "spotPulse 2s ease-in-out infinite", ...pos } as React.CSSProperties} />
                  ))}
                  <div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", border: "2.5px dashed rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.15)", top: "38%", left: "12%" }} />
                  <div style={{ position: "absolute", width: 30, height: 30, borderRadius: "50%", border: "2.5px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", top: "38%", left: "15%", background: "#E8734A" }}>王</div>
                  <div style={{ position: "absolute", width: 30, height: 30, borderRadius: "50%", border: "2.5px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", top: "18%", left: "48%", background: "#3DABB5" }}>林</div>
                </div>
                <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 10 }}>👆 點閃爍圓圈 → 選名字 → 簽到完成</div>
              </MockupFrame>
            </div>
            <SlideNumber n={3} />
          </div>
        )}

        {/* 3: Mood */}
        {currentSlide === 3 && (
          <div style={{ ...splitStyle, background: "var(--color-postit-pink)" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 16, fontSize: "var(--font-size-base)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", border: "2px solid var(--color-happy)", width: "fit-content", background: "var(--color-happy-light)", color: "#B8860B" }}>😊 心情溫度計</div>
              <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>心情溫度計怎麼用？</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.5 }}>告訴大家你今天的心情：</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, justifyContent: "center", padding: 0 }}>
                <li style={stepItemStyle}><span style={numStyle}>1</span>溫度計上有<b>三種心情</b></li>
                <li style={stepItemStyle}><span style={numStyle}>2</span>點你的心情（開心/難過/生氣）</li>
                <li style={stepItemStyle}><span style={numStyle}>3</span>選名字，投票完成！</li>
              </ul>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
              <MockupFrame>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 14 }}>心情溫度計</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "14px 0" }}>
                  <div style={{ width: 44, height: 170, borderRadius: 22, border: "2.5px solid var(--color-border)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "var(--color-happy)", outline: "3px solid var(--color-marker-black)", outlineOffset: -3 }}>😄</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "var(--color-sad)" }}>😢</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "var(--color-angry)" }}>😠</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { emoji: "😄", name: "開心", desc: "今天心情很好", color: "var(--color-happy)" },
                      { emoji: "😢", name: "難過", desc: "今天有點低落", color: "var(--color-sad)" },
                      { emoji: "😠", name: "生氣", desc: "今天不太開心", color: "var(--color-angry)" },
                    ].map((m, i) => (
                      <div key={i} style={{ fontSize: 14, fontFamily: "var(--font-heading)", fontWeight: 700, padding: "8px 14px", borderRadius: 8, border: "2px solid var(--color-border-light)", borderLeft: `4px solid ${m.color}` }}>{m.emoji} {m.name} — {m.desc}</div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 10 }}>👆 點心情 → 選名字 → 投票完成</div>
              </MockupFrame>
            </div>
            <SlideNumber n={4} />
          </div>
        )}

        {/* 4: Courses */}
        {currentSlide === 4 && (
          <div style={{ ...splitStyle, background: "var(--color-postit-blue)" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 16, fontSize: "var(--font-size-base)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", border: "2px solid var(--color-marker-purple)", width: "fit-content", background: "#F0ECF8", color: "var(--color-marker-purple)" }}>📚 課程內容</div>
              <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>課程內容怎麼用？</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.5 }}>每週有不同活動，點進去就開始：</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, justifyContent: "center", padding: 0 }}>
                <li style={stepItemStyle}><span style={numStyle}>1</span>在首頁點「課程內容」</li>
                <li style={stepItemStyle}><span style={numStyle}>2</span>看到 <b>9 週</b> 的課程卡片</li>
                <li style={stepItemStyle}><span style={numStyle}>3</span>點這週的課程看活動清單</li>
              </ul>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
              <MockupFrame>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 14 }}>📚 課程內容</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { emoji: "🤝", name: "相見歡", bg: "var(--color-postit-green)", hl: true },
                    { emoji: "😊", name: "心情溫度計", bg: "#F0ECF8", hl: false },
                    { emoji: "💡", name: "夢想經驗", bg: "var(--color-postit-yellow)", hl: false },
                    { emoji: "👨‍👩‍👧", name: "我的家人", bg: "var(--color-postit-pink)", hl: false },
                    { emoji: "🥋", name: "功夫大比拼", bg: "var(--color-postit-blue)", hl: false },
                    { emoji: "🎠", name: "玩具時光機", bg: "var(--color-sad-light)", hl: false },
                    { emoji: "🐾", name: "動物大趴踢", bg: "var(--color-secondary-lighter)", hl: false },
                    { emoji: "🍳", name: "做伙來辦桌", bg: "var(--color-primary-lighter)", hl: false },
                    { emoji: "🎉", name: "食而聲笑", bg: "#F3E5F5", hl: false },
                  ].map((c, i) => (
                    <div key={i} style={{ borderRadius: 8, padding: "10px 6px", textAlign: "center", fontSize: 12, fontFamily: "var(--font-heading)", fontWeight: 700, border: c.hl ? "3px solid var(--color-primary)" : "2px solid var(--color-border-light)", background: c.bg }}>
                      <span style={{ fontSize: 24, display: "block", marginBottom: 3 }}>{c.emoji}</span>{c.name}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 10 }}>👆 選課程 → 看活動 → 開始玩</div>
              </MockupFrame>
            </div>
            <SlideNumber n={5} />
          </div>
        )}

        {/* 5: Activities */}
        {currentSlide === 5 && (
          <div style={{ ...splitStyle, background: "var(--color-bg-card)" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 16, fontSize: "var(--font-size-base)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", border: "2px solid var(--color-primary)", width: "fit-content", background: "var(--color-primary-lighter)", color: "var(--color-primary)" }}>🎮 課程活動</div>
              <h2 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>活動有哪些類型？</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.5 }}>課程裡有不同類型的活動：</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, justifyContent: "center", padding: 0 }}>
                {[
                  { icon: "🎬", label: "影片", desc: "YouTube 影片" },
                  { icon: "📖", label: "繪本故事", desc: "聽故事、討論" },
                  { icon: "🎮", label: "互動遊戲", desc: "配對、轉盤" },
                  { icon: "🎤", label: "表演", desc: "才藝、合唱" },
                ].map((item, i) => (
                  <li key={i} style={stepItemStyle}><span style={numStyle}>{item.icon}</span><b>{item.label}</b> — {item.desc}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
              <MockupFrame>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 14 }}>第 1 週：相見歡</div>
                {[
                  { color: "var(--color-marker-green)", name: "🤝 破冰遊戲", time: "20 分鐘", btnBg: "var(--color-postit-green)" },
                  { color: "var(--color-marker-purple)", name: "🎶 一起動一動", time: "15 分鐘", btnBg: "#F0ECF8" },
                  { color: "var(--color-marker-orange)", name: "📖 繪本故事", time: "15 分鐘", btnBg: "var(--color-postit-yellow)" },
                  { color: "var(--color-marker-blue)", name: "📺 系統教學", time: "10 分鐘", btnBg: "var(--color-postit-blue)" },
                ].map((act, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2px solid var(--color-border-light)", borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 34, borderRadius: 3, flexShrink: 0, background: act.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: 14 }}>{act.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{act.time}</div>
                    </div>
                    <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, border: "1.5px solid var(--color-border-light)", fontWeight: 700, flexShrink: 0, background: act.btnBg }}>前往 →</span>
                  </div>
                ))}
                <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-muted)", marginTop: 10 }}>👆 點「前往」進入活動</div>
              </MockupFrame>
            </div>
            <SlideNumber n={6} />
          </div>
        )}

        {/* 6: End */}
        {currentSlide === 6 && (
          <div style={{ ...slideBase, background: "linear-gradient(135deg, #4CAF50, #81C784)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <div style={{ fontSize: 80, marginBottom: "var(--space-md)" }}>🎉</div>
            <h2 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)", color: "white" }}>你學會了！</h2>
            <p style={{ fontSize: "var(--font-size-xl)", opacity: 0.9, lineHeight: 2, color: "white" }}>
              🌳 簽到樹 — 點樹枝 → 選名字 → 完成簽到<br />
              😊 心情溫度計 — 選心情 → 選名字 → 投票<br />
              📚 課程內容 — 選課程 → 選活動 → 開始<br /><br />
              就這麼簡單！現在回到首頁開始使用吧 🙌
            </p>
            <SlideNumber n={7} />
          </div>
        )}
      </div>

      {/* Dots indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)", padding: "10px 0", flexShrink: 0 }}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <div key={i} onClick={() => goSlide(i)} style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${i === currentSlide ? "var(--color-primary)" : "var(--color-border)"}`, background: i === currentSlide ? "var(--color-primary)" : "var(--color-bg-card)", cursor: "pointer", transition: "all 0.2s ease", transform: i === currentSlide ? "scale(1.2)" : "scale(1)" }} />
        ))}
      </div>

      <FloatingNav
        onPrev={currentSlide > 0
          ? { onClick: () => goSlide(currentSlide - 1), label: `${currentSlide}/${totalSlides}` }
          : undefined}
        prev={currentSlide === 0 ? { href: "/courses/0/storybook", label: "繪本故事" } : undefined}
        onNext={currentSlide < totalSlides - 1
          ? { onClick: () => goSlide(currentSlide + 1), label: `${currentSlide + 2}/${totalSlides}` }
          : undefined}
        next={currentSlide === totalSlides - 1 ? { href: "/courses/0", label: "回課程" } : undefined}
      />

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spotPulse { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
      `}</style>
    </div>
  );
}
