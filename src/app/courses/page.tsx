"use client";

import Link from "next/link";

const COURSES = [
  { week: 1, id: "0", name: "相見歡", desc: "建立小默契、分組、破冰活動" },
  { week: 2, id: "1", name: "心情溫度計", desc: "情緒探索、心情表達、情感連結" },
  { week: 3, id: "2", name: "夢想經驗大碰撞", desc: "職業探索、繪本故事、夢想分享" },
  { week: 4, id: "3", name: "我的家人", desc: "家人稱呼、你演我猜、家庭照" },
  { week: 5, id: "4", name: "功夫大比拼", desc: "才藝表演、合唱合奏、互相欣賞" },
  { week: 6, id: "5", name: "玩具時光機", desc: "古早玩具、現代玩具、傳統遊戲" },
  { week: 7, id: "6", name: "動物大趴踢", desc: "猜猜動物腳、繪本故事、動物派對" },
  { week: 8, id: "7", name: "做伙來辦桌", desc: "烹飪體驗、繪本故事、合作料理" },
  { week: 9, id: "8", name: "食而聲笑", desc: "課程回顧、成果發表、歡樂結業" },
];

const CARD_COLORS = [
  "var(--color-postit-green)",
  "#F0ECF8",
  "var(--color-postit-yellow)",
  "var(--color-postit-pink)",
  "var(--color-postit-blue)",
  "var(--color-sad-light)",
  "var(--color-secondary-lighter)",
  "var(--color-primary-lighter)",
  "#F3E5F5",
];

export default function CoursesPage() {
  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--color-bg)", backgroundImage: "radial-gradient(circle, #d5cfc5 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      {/* Header */}
      <header className="flex items-center justify-center shrink-0" style={{ padding: "var(--space-sm) var(--space-xl) 0", gap: "var(--space-md)" }}>
        <div className="flex items-center justify-center" style={{ width: 80, height: 80, borderRadius: "50%", border: "var(--border-width) solid var(--color-border)", background: "#F0ECF8", color: "#8B7EC8" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            <path d="M8 7h6"/><path d="M8 11h8"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: "var(--font-size-2xl, 34px)", fontWeight: 700, fontFamily: "var(--font-heading)", transform: "rotate(-0.5deg)" }}>課程內容</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base, 20px)" }}>9 週代間共學精彩課程</p>
        </div>
      </header>

      {/* Course grid */}
      <div className="flex-1 grid grid-cols-3 items-center" style={{ gap: "var(--space-md)", maxWidth: "100%", margin: "0 auto", padding: "var(--space-sm) var(--space-xl)", alignContent: "center" }}>
        {COURSES.map((c, i) => (
          <Link key={c.id} href={`/courses/${c.id}`}
            className="flex items-center transition-all"
            style={{
              background: CARD_COLORS[i],
              border: "var(--border-width) solid var(--color-border)",
              borderRadius: 16, padding: "var(--space-lg) var(--space-xl)",
              gap: "var(--space-lg)", cursor: "pointer",
              boxShadow: "2px 3px 0 rgba(0,0,0,0.08)",
              animation: `fade-in-up 0.4s ease both`,
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = "4px 5px 0 rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "2px 3px 0 rgba(0,0,0,0.08)"; }}>
            {/* Course icon */}
            <div style={{ width: 96, height: 96, minWidth: 96, borderRadius: "50%", overflow: "hidden", border: "var(--border-width) solid var(--color-border)", background: "var(--color-bg-card)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/course-w${c.week}.png`} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--font-size-base, 20px)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-text-muted)", marginBottom: 2 }}>第 {c.week} 週</div>
              <div style={{ fontSize: "var(--font-size-2xl, 34px)", fontWeight: 700, fontFamily: "var(--font-heading)", lineHeight: 1.3, whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ fontSize: "var(--font-size-base, 20px)", color: "var(--color-text-secondary)", marginTop: 4 }}>{c.desc}</div>
            </div>
            <div style={{ color: "var(--color-text-muted)", flexShrink: 0, transition: "all var(--transition-fast)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center shrink-0" style={{ padding: "var(--space-xs) 0 var(--space-sm)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)", fontSize: "var(--font-size-base, 20px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          返回首頁
        </Link>
      </div>
    </div>
  );
}
