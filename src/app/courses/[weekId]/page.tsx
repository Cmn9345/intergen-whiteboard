"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Activity = {
  title: string;
  theme: string;
  duration: string;
  items: string[];
  link: string | null;
};

type CourseInfo = {
  name: string;
  desc: string;
  hero: string;
  activities: Activity[];
};

const courseData: Record<number, CourseInfo> = {
  1: {
    name: "相見歡", desc: "建立小默契、分組、破冰活動", hero: "hero-green",
    activities: [
      { title: "破冰遊戲", theme: "theme-green", duration: "20 分鐘", items: ["自我介紹時間：名字、最喜歡的顏色、食物、活動", "配對小遊戲，建立默契", "信任互動與鼓勵練習"], link: "ice-breaker" },
      { title: "一起動一動", theme: "theme-purple", duration: "15 分鐘", items: ["團體帶動唱：當我們同在一起", "簡單肢體律動", "祖孫一起跳"], link: "together" },
      { title: "繪本故事", theme: "theme-orange", duration: "15 分鐘", items: ["共讀繪本：做一個機器人假裝是我", "故事討論與心得分享", "延伸思考問題"], link: "storybook" },
      { title: "白板教學", theme: "theme-blue", duration: "10 分鐘", items: ["認識互動白板操作方式", "練習觸控點擊與滑動", "熟悉簽到與投票功能"], link: "whiteboard-tutorial" },
    ],
  },
  2: {
    name: "心情溫度計", desc: "情緒探索、心情表達、情感連結", hero: "hero-red",
    activities: [
      { title: "找夥伴", theme: "theme-green", duration: "15 分鐘", items: ["動物配對遊戲：找出動物的幼年與成年配對", "烏龜、天鵝、雞、毛毛蟲等 9 種動物", "配對成功有音效回饋"], link: "find-partner" },
      { title: "如果開心你就跟我拍拍手", theme: "theme-orange", duration: "10 分鐘", items: ["跟著影片一起唱跳", "用拍手、跺腳、握拳表達情緒", "祖孫一起做動作"], link: "clap-along" },
      { title: "情緒表情", theme: "theme-purple", duration: "15 分鐘", items: ["認識 5 種情緒：開心、難過、生氣、害怕、驚訝", "用表情表達情緒", "猜猜對方的心情"], link: "emotion-faces" },
      { title: "情緒輪盤", theme: "theme-red", duration: "20 分鐘", items: ["互動轉盤遊戲，隨機選出情緒", "語音播報情緒名稱", "分享情緒經驗與討論"], link: "emotion-wheel" },
    ],
  },
  3: {
    name: "夢想經驗大碰撞", desc: "職業探索、繪本故事、夢想分享", hero: "hero-purple",
    activities: [
      { title: "如果開心你就跟我拍拍手", theme: "theme-orange", duration: "10 分鐘", items: ["跟著影片一起唱跳", "用拍手、跺腳、握拳表達情緒", "祖孫一起做動作"], link: "clap-along" },
      { title: "一起動一動", theme: "theme-purple", duration: "15 分鐘", items: ["團體帶動唱：當我們同在一起", "簡單肢體律動", "祖孫一起跳"], link: "together" },
      { title: "繪本故事", theme: "theme-purple", duration: "15 分鐘", items: ["共讀職業相關繪本", "討論長大後想做什麼", "阿公阿嬤分享工作經驗"], link: "storybook" },
      { title: "職業工具箱", theme: "theme-orange", duration: "20 分鐘", items: ["認識 6 種職業：醫生、廚師、老師、警察、消防員、建築師", "配對職業與工具", "大人職業 vs 小小職業配對遊戲"], link: "toolkit" },
      { title: "職業迷宮", theme: "theme-blue", duration: "15 分鐘", items: ["方格式迷宮，5 個入口、5 個出口分散四邊", "點擊相鄰方格前進，把職業物品送到對的主人手上", "認識 5 種職業：醫生、廚師、消防員、農夫、老師"], link: "career-maze" },
      { title: "打勾勾", theme: "theme-red", duration: "10 分鐘", items: ["跟著影片一起唱「打勾勾」", "祖孫勾小指頭，說出想一起完成的夢想", "分享過去有印象的小約定"], link: "pinky-promise" },
    ],
  },
  4: {
    name: "我的家人", desc: "家人稱呼、你演我猜、家庭照", hero: "hero-orange",
    activities: [
      { title: "找夥伴", theme: "theme-green", duration: "15 分鐘", items: ["認識 8 種家人稱呼：爸爸、媽媽、阿公、阿嬤等", "看描述猜家人角色", "計分挑戰與音效回饋"], link: "find-partner" },
      { title: "家庭小測驗", theme: "theme-purple", duration: "15 分鐘", items: ["回答家庭趣味問題", "了解彼此的家庭故事", "分享家庭照片"], link: "family-quiz" },
      { title: "比手畫腳", theme: "theme-orange", duration: "15 分鐘", items: ["用肢體語言表達家人角色", "祖孫合作猜題", "觀察力與想像力訓練"], link: "charades" },
    ],
  },
  5: {
    name: "功夫大比拼", desc: "才藝表演、合唱合奏、互相欣賞", hero: "hero-red",
    activities: [
      { title: "才藝表演", theme: "theme-red", duration: "25 分鐘", items: ["6 種才藝類別：唱歌、跳舞、說故事、繪畫手工、運動技能、樂器演奏", "小朋友 vs 長輩表演", "2-3 分鐘表演時間，觀眾互動"], link: "talent-show" },
      { title: "合唱合奏", theme: "theme-blue", duration: "20 分鐘", items: ["河馬歌、A Ram Sam Sam 等 6 首歌曲", "搭配 YouTube 影片一起唱", "擁抱世界擁抱你、人人做環保、捏泥巴、丟丟銅仔"], link: "ensemble" },
    ],
  },
  6: {
    name: "玩具時光機", desc: "古早玩具、現代玩具、傳統遊戲", hero: "hero-teal",
    activities: [
      { title: "玩具分享", theme: "theme-teal", duration: "20 分鐘", items: ["古早玩具：陀螺、毽子、竹蜻蜓、彈珠、跳房子、翻花繩", "現代玩具：樂高、芭比娃娃、遙控車、電子遊戲、拼圖、魔術方塊", "祖孫互相介紹自己時代的玩具"], link: "toy-sharing" },
      { title: "繪本故事", theme: "theme-purple", duration: "15 分鐘", items: ["共讀玩具相關繪本", "討論最喜歡的玩具與回憶", "分享玩具背後的故事"], link: "storybook" },
    ],
  },
  7: {
    name: "動物大趴踢", desc: "猜猜動物腳、繪本故事、動物派對", hero: "hero-green",
    activities: [
      { title: "猜猜動物腳", theme: "theme-green", duration: "20 分鐘", items: ["10 種動物：斑馬、長頸鹿、兔子、雞、鴨、豬、熊、大象、貓、狗", "猜猜是 2 隻腳還是 4 隻腳", "30 秒計時挑戰，語音播報答案"], link: "guess-feet" },
      { title: "繪本故事", theme: "theme-orange", duration: "15 分鐘", items: ["共讀動物相關繪本", "認識不同動物的特徵", "最喜歡的動物分享"], link: "storybook" },
    ],
  },
  8: {
    name: "做伙來辦桌", desc: "烹飪體驗、繪本故事、合作料理", hero: "hero-orange",
    activities: [
      { title: "繪本故事", theme: "theme-orange", duration: "15 分鐘", items: ["共讀料理相關繪本", "阿公阿嬤的拿手菜分享", "討論家裡過年過節的菜色"], link: "storybook" },
      { title: "合作料理", theme: "theme-green", duration: "25 分鐘", items: ["祖孫一起準備簡單料理", "認識食材與烹飪步驟", "擺盤與分享美食"], link: null },
    ],
  },
  9: {
    name: "食而聲笑", desc: "課程回顧、成果發表、歡樂結業", hero: "hero-purple",
    activities: [
      { title: "課程回顧", theme: "theme-purple", duration: "15 分鐘", items: ["回顧 9 週精彩活動照片", "最喜歡的課程票選", "分享學到最多的事情"], link: null },
      { title: "成果發表", theme: "theme-green", duration: "20 分鐘", items: ["各組上台分享收穫", "祖孫一起表演或展示作品", "頒發結業證書"], link: null },
      { title: "歡樂時光", theme: "theme-orange", duration: "15 分鐘", items: ["大家一起享用點心", "互相祝福與合照留念", "期待下次再見"], link: null },
    ],
  },
};

// weekId in URL is 0-based, course data is 1-based
// URL /courses/0 = week 1, /courses/1 = week 2 ...
// activity sub-routes live under /courses/{weekId-1}/{link}
const activityRouteMap: Record<string, string> = {
  "ice-breaker": "ice-breaker",
  "together": "together",
  "storybook": "storybook",
  "whiteboard-tutorial": "whiteboard-tutorial",
  "find-partner": "find-partner",
  "clap-along": "clap-along",
  "emotion-faces": "emotion-faces",
  "emotion-wheel": "emotion-wheel",
  "toolkit": "toolkit",
  "family-quiz": "family-quiz",
  "charades": "charades",
  "talent-show": "talent-show",
  "ensemble": "ensemble",
  "toy-sharing": "toy-sharing",
  "guess-feet": "guess-feet",
  "career-maze": "career-maze",
  "pinky-promise": "pinky-promise",
};

const HERO_BG: Record<string, string> = {
  "hero-green": "linear-gradient(135deg, #4CAF50, #81C784)",
  "hero-purple": "linear-gradient(135deg, #7E57C2, #B39DDB)",
  "hero-orange": "linear-gradient(135deg, #FF9800, #FFB74D)",
  "hero-red": "linear-gradient(135deg, #EF5350, #EF9A9A)",
  "hero-teal": "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))",
};

const THEME_COLORS: Record<string, { indicator: string; iconBg: string; iconColor: string; linkBg: string }> = {
  "theme-green": { indicator: "var(--color-marker-green)", iconBg: "var(--color-postit-green)", iconColor: "var(--color-marker-green)", linkBg: "var(--color-postit-green)" },
  "theme-purple": { indicator: "var(--color-marker-purple)", iconBg: "#F0ECF8", iconColor: "var(--color-marker-purple)", linkBg: "#F0ECF8" },
  "theme-orange": { indicator: "var(--color-marker-orange)", iconBg: "var(--color-postit-yellow)", iconColor: "var(--color-marker-orange)", linkBg: "var(--color-postit-yellow)" },
  "theme-red": { indicator: "var(--color-marker-red)", iconBg: "var(--color-postit-pink)", iconColor: "var(--color-marker-red)", linkBg: "var(--color-postit-pink)" },
  "theme-blue": { indicator: "var(--color-marker-blue)", iconBg: "var(--color-postit-blue)", iconColor: "var(--color-marker-blue)", linkBg: "var(--color-postit-blue)" },
  "theme-teal": { indicator: "var(--color-secondary)", iconBg: "var(--color-secondary-lighter)", iconColor: "var(--color-secondary-dark)", linkBg: "var(--color-secondary-lighter)" },
};

const WOBBLES = ["var(--wobble-1)", "var(--wobble-2)", "var(--wobble-3)"];

export default function CourseDetailPage() {
  const params = useParams();
  const weekIdParam = params.weekId as string;
  const weekNum = parseInt(weekIdParam) + 1; // URL 0-based → display 1-based
  const course = courseData[weekNum];
  const [openIndex, setOpenIndex] = useState(0);

  // Route prefix for sub-activities: /courses/{weekIdParam}/...
  // But activities live under the weekIdParam-1 directory in some cases
  // Actually the static dirs are 0-7 matching weekIdParam directly
  const routePrefix = `/courses/${weekIdParam}`;

  const getActivityHref = useMemo(() => (link: string | null): string | null => {
    if (!link) return null;
    const route = activityRouteMap[link];
    if (!route) return null;
    return `${routePrefix}/${route}`;
  }, [routePrefix]);

  if (!course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>課程不存在</h1>
        <Link href="/courses" style={{ padding: "12px 24px", borderRadius: "var(--wobble-2)", border: "2px solid var(--color-border)", fontWeight: 700, fontFamily: "var(--font-heading)", background: "var(--color-bg-card)", boxShadow: "var(--shadow-sketch-sm)" }}>
          回到課程列表
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-bg)", backgroundImage: "radial-gradient(circle, #d5cfc5 1px, transparent 1px)", backgroundSize: "32px 32px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "auto" }}>
      {/* Header */}
      <div style={{ padding: "var(--space-xl)" }}>
        <Link href="/courses" className="back-btn" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)", fontSize: "var(--font-size-base, 20px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          所有課程
        </Link>
      </div>

      {/* Hero */}
      <div style={{ padding: "0 var(--space-xl) var(--space-xl)", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-border)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)", background: HERO_BG[course.hero] }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", padding: "8px 16px", borderRadius: "var(--wobble-2)", background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.4)", color: "white", fontWeight: 700, fontSize: "var(--font-size-base)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-md)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            第 {weekNum} 週
          </div>
          <h1 style={{ fontSize: "var(--font-size-4xl, 48px)", fontWeight: 700, fontFamily: "var(--font-heading)", color: "white", marginBottom: "var(--space-xs)", transform: "rotate(-0.5deg)" }}>{course.name}</h1>
          <p style={{ fontSize: "var(--font-size-xl, 24px)", color: "rgba(255,255,255,0.85)" }}>{course.desc}</p>
        </div>
      </div>

      {/* Activities */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 var(--space-xl) var(--space-2xl)", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
        {course.activities.map((act, i) => {
          const isOpen = openIndex === i;
          const colors = THEME_COLORS[act.theme] || THEME_COLORS["theme-green"];
          const href = getActivityHref(act.link);

          return (
            <div key={i} style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: WOBBLES[i % 3], overflow: "hidden", boxShadow: "var(--shadow-sketch)" }}>
              <div
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                style={{ padding: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)", cursor: "pointer", transition: "background 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                <div style={{ width: 6, height: 36, borderRadius: 3, flexShrink: 0, background: colors.indicator }} />
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: colors.iconBg, color: colors.iconColor }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div style={{ flex: 1, fontSize: "var(--font-size-xl, 24px)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{act.title}</div>
                <div style={{ fontSize: "var(--font-size-base, 20px)", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-heading)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {act.duration}
                </div>
                <div style={{ color: "var(--color-text-muted)", transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              <div style={{ maxHeight: isOpen ? 600 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                <div style={{ padding: "0 var(--space-lg) var(--space-lg)", paddingLeft: `calc(var(--space-lg) + 6px + var(--space-md) + 48px + var(--space-md))` }}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0, margin: 0 }}>
                    {act.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-sm)", fontSize: "var(--font-size-lg, 22px)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid var(--color-border)", flexShrink: 0, marginTop: 10 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {href && (
                    <Link href={href} onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", marginTop: "var(--space-md)", padding: "10px 20px", borderRadius: "var(--wobble-2)", border: "2px solid var(--color-border)", fontWeight: 700, fontSize: "var(--font-size-base, 20px)", fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)", background: colors.linkBg, color: "inherit", textDecoration: "none" }}>
                      前往活動
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "0 0 var(--space-2xl)" }}>
        <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)", fontSize: "var(--font-size-base, 20px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          回到課程列表
        </Link>
      </div>
      </div>
    </div>
  );
}
