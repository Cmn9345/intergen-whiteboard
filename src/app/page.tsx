"use client";
import Link from "next/link";
import {
  TreePine,
  Thermometer,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  LayoutDashboard,
  Users,
  Lock,
} from "lucide-react";

const features = [
  {
    href: "/checkin-tree",
    title: "簽到樹",
    desc: "點擊樹枝完成簽到",
    icon: TreePine,
    color: "bg-[var(--secondary-lighter)] text-[var(--secondary)]",
    accent: "bg-[var(--secondary)]",
  },
  {
    href: "/mood",
    title: "心情溫度計",
    desc: "今天心情如何呢",
    icon: Thermometer,
    color: "bg-[var(--happy-light)] text-[#D4A017]",
    accent: "bg-[var(--happy)]",
  },
  {
    href: "/courses",
    title: "課程內容",
    desc: "每週精彩活動與遊戲",
    icon: BookOpen,
    color: "bg-[#F0ECF8] text-[#8B7EC8]",
    accent: "bg-[#8B7EC8]",
  },
  {
    href: "/message-board",
    title: "留言板",
    desc: "文字與語音留言互動",
    icon: MessageSquare,
    color: "bg-[var(--primary-lighter)] text-[var(--primary)]",
    accent: "bg-[var(--primary)]",
  },
  {
    href: "/photo-wall",
    title: "相片牆",
    desc: "活動照片分享回憶",
    icon: ImageIcon,
    color: "bg-[var(--success-light)] text-[var(--success)]",
    accent: "bg-[var(--success)]",
  },
  {
    href: "/dashboard",
    title: "數據儀表板",
    desc: "管理員統計資料",
    icon: LayoutDashboard,
    color: "bg-[var(--sad-light)] text-[var(--sad)]",
    accent: "bg-[var(--sad)]",
  },
];

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
          >
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              代間共學互動平台
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              讓祖孫一起學習、一起歡笑
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-md"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            color: "var(--text-secondary)",
          }}
        >
          <Lock size={16} />
          登入
        </Link>
      </header>

      {/* Feature Grid - 3x2 for 1920x1080 */}
      <div className="flex-1 flex items-center justify-center px-10 pb-8">
        <div className="grid grid-cols-3 gap-6 w-full max-w-[1400px]">
          {features.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              className="group relative rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                animation: `fade-in-up 0.4s ease both`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Top accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${f.accent} transition-all group-hover:h-1.5`}
              />

              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${f.color}`}>
                <f.icon size={38} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {f.desc}
              </p>

              {/* Arrow */}
              <div
                className="mt-4 text-sm font-medium flex items-center gap-1 transition-all group-hover:translate-x-1"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="group-hover:text-[var(--primary)]">進入</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:text-[var(--primary)]"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-3 text-xs flex-shrink-0"
        style={{ color: "var(--text-muted)" }}
      >
        代間共學互動平台 &copy; 2026
      </footer>
    </main>
  );
}
