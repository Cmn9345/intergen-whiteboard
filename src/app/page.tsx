"use client";

import Link from "next/link";

const FEATURES = [
  { href: "/checkin-tree", title: "簽到樹", desc: "點擊大樹完成簽到", img: "/icon-tree.png", bg: "var(--color-postit-blue)" },
  { href: "/mood", title: "心情溫度計", desc: "今天心情如何呢", img: "/icon-thermometer.png", bg: "var(--color-postit-yellow)" },
  { href: "/courses", title: "課程內容", desc: "每週精彩活動", img: "/icon-book.png", bg: "var(--color-postit-green)" },
  { href: "/login", title: "人員登入", desc: "管理員與教師入口", img: "/icon-lock.png", bg: "var(--color-postit-pink)" },
];

const WOBBLES = ["var(--wobble-1)", "var(--wobble-2)", "var(--wobble-3)", "var(--wobble-4)"];
const ROTATIONS = ["-1deg", "0.8deg", "0.5deg", "-0.6deg"];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div className="text-center" style={{ padding: "var(--space-lg) var(--space-xl) var(--space-sm)", flexShrink: 0 }}>
        {/* Hero icon */}
        <div className="mx-auto" style={{
          width: 100, height: 100, marginBottom: "var(--space-sm)",
          borderRadius: "var(--wobble-2)", overflow: "hidden",
          border: "var(--border-width) solid var(--color-border)",
          boxShadow: "var(--shadow-sketch)", transform: "rotate(-2deg)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-hero.png" alt="代間共學" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Title with marker underline */}
        <h1 style={{ fontSize: "var(--font-size-5xl, 64px)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-text-primary)", transform: "rotate(-0.5deg)", marginBottom: "var(--space-sm)" }}>
          <span className="relative inline-block">
            代間共學互動平台
            <span className="absolute -bottom-0.5 -left-1.5 -right-1.5 h-2.5 -z-10" style={{ background: "var(--color-happy)", opacity: 0.4, borderRadius: 4, transform: "rotate(-0.5deg)" }} />
          </span>
        </h1>
        <p style={{ fontSize: "var(--font-size-xl, 28px)", color: "var(--color-text-secondary)", fontFamily: "var(--font-heading)" }}>
          讓祖孫一起學習、一起歡笑
        </p>
      </div>

      {/* Feature grid - 2x2 */}
      <div className="grid grid-cols-2 home-grid" style={{ gap: "var(--space-lg)", maxWidth: 800, margin: "0 auto", padding: "var(--space-md) var(--space-xl)", flex: 1, alignContent: "center" }}>
        {FEATURES.map((f, i) => (
          <Link key={f.href} href={f.href}
            className="group relative flex flex-col items-center text-center transition-all"
            style={{
              background: f.bg,
              border: "var(--border-width) solid var(--color-border)",
              borderRadius: WOBBLES[i],
              padding: "var(--space-lg) var(--space-lg) var(--space-md)",
              boxShadow: "var(--shadow-sketch)",
              transform: `rotate(${ROTATIONS[i]})`,
              cursor: "pointer",
              animation: `fade-in-up 0.4s ease both`,
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-3px, -3px) rotate(0deg)"; e.currentTarget.style.boxShadow = "var(--shadow-sketch-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${ROTATIONS[i]})`; e.currentTarget.style.boxShadow = "var(--shadow-sketch)"; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translate(2px, 2px) rotate(0deg)"; e.currentTarget.style.boxShadow = "var(--shadow-sketch-pressed)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "translate(-3px, -3px) rotate(0deg)"; e.currentTarget.style.boxShadow = "var(--shadow-sketch-hover)"; }}
          >
            {/* Tape decoration on cards 1 and 3 */}
            {i === 0 && <span className="absolute -top-2.5 left-6 w-14 h-5.5 z-[2]" style={{ background: "rgba(255,249,196,0.75)", border: "1px solid rgba(200,180,120,0.4)", transform: "rotate(-5deg)" }} />}
            {i === 2 && <span className="absolute -top-2.5 right-6 w-14 h-5.5 z-[2]" style={{ background: "rgba(216,236,255,0.75)", border: "1px solid rgba(120,160,200,0.4)", transform: "rotate(4deg)" }} />}

            {/* Icon */}
            <div className="flex items-center justify-center overflow-hidden feature-icon" style={{
              width: 140, height: 140, borderRadius: "var(--wobble-2)",
              border: "var(--border-width) solid var(--color-border)",
              background: "var(--color-bg-card)", boxShadow: "var(--shadow-sketch-sm)",
              marginBottom: "var(--space-sm)", flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>

            {/* Text */}
            <div style={{ marginTop: "auto" }}>
              <h3 style={{ fontSize: "var(--font-size-2xl, 34px)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 2 }}>{f.title}</h3>
              <p style={{ fontSize: "var(--font-size-lg, 24px)", color: "var(--color-text-secondary)", marginBottom: 0 }}>{f.desc}</p>
              <div className="transition-all group-hover:translate-x-1.5" style={{ marginTop: "var(--space-xs)", color: "var(--color-text-muted)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center" style={{ padding: "var(--space-sm)", color: "var(--color-text-muted)", fontFamily: "var(--font-heading)", fontSize: "var(--font-size-sm, 16px)", flexShrink: 0 }}>
        代間共學互動平台 &copy; 2026
      </div>
    </div>
  );
}
