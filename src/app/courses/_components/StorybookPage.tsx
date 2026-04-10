"use client";
import Link from "next/link";

type StorybookData = { title: string; desc: string; type: "youtube" | "local" | "static"; videoId?: string; startTime?: number; videoSrc?: string; discussion: string[] };

const storybookData: Record<number, StorybookData> = {
  1: { title: "做一個機器人假裝是我", desc: "如果有一個機器人可以代替你，你想讓它做什麼？", type: "static", discussion: ["如果有機器人代替你，你想讓它做什麼事？", "你覺得機器人能代替「真正的你」嗎？", "什麼事情是只有你自己才能做的？", "你最喜歡故事的哪個部分？"] },
  3: { title: "長大後想做什麼", desc: "一起來探索不同的職業夢想", type: "youtube", videoId: "EVFPL_qXChU", discussion: ["你長大後想做什麼職業？", "阿公阿嬤以前做什麼工作？", "你覺得哪個職業最有趣？", "如果可以嘗試任何工作一天，你想試什麼？"] },
  5: { title: "太多玩具了", desc: "當玩具太多的時候，該怎麼辦呢？", type: "youtube", videoId: "Ib_lYcq7rds", discussion: ["你有最喜歡的玩具嗎？是什麼？", "如果玩具太多，你會怎麼做？", "分享玩具給別人，你願意嗎？", "阿公阿嬤小時候玩什麼玩具？"] },
  6: { title: "數腳腳", desc: "一起來認識動物的腳", type: "local", videoSrc: "https://github.com/Cmn9345/intergen-whiteboard/releases/download/v1.0-assets/default.mov", discussion: ["你認識哪些動物的腳？", "為什麼有些動物是 2 隻腳，有些是 4 隻腳？", "你有看過什麼特別的動物嗎？", "如果你是一種動物，你想當什麼？"] },
  7: { title: "我的阿公阿嬤是同學", desc: "阿公阿嬤也是你的同學喔！", type: "youtube", videoId: "JLawbDGrn_Y", startTime: 141, discussion: ["和阿公阿嬤一起上課感覺如何？", "你最喜歡和阿公阿嬤做什麼事？", "阿公阿嬤教了你什麼？", "你有什麼想教阿公阿嬤的？"] },
};

export default function StorybookPage({ weekNum, backLink }: { weekNum: number; backLink: string }) {
  const data = storybookData[weekNum];
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 1000, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href={backLink} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          回到第 {weekNum} 週
        </Link>
      </div>
      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", transform: "rotate(-0.5deg)" }}>{data ? `📖 ${data.title}` : "📖 繪本故事"}</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>{data?.desc || "一起來聽故事吧"}</p>
      </div>
      {!data ? (
        <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
          <div style={{ fontSize: 80, marginBottom: "var(--space-lg)" }}>📖</div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xl)" }}>此週的繪本故事尚未設定</p>
        </div>
      ) : (
        <>
          {data.type === "youtube" && (
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-sketch)", background: "#000" }}>
              <iframe src={`https://www.youtube.com/embed/${data.videoId}?feature=oembed${data.startTime ? `&start=${data.startTime}` : ""}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title="繪本故事" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
            </div>
          )}
          {data.type === "local" && (
            <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "var(--wobble-1)", border: "var(--border-width) solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-sketch)", background: "#000" }}>
              <video controls autoPlay src={data.videoSrc} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>您的瀏覽器不支援影片播放</video>
            </div>
          )}
          {data.type === "static" && (
            <div style={{ background: "var(--color-bg-card)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-2)", padding: "var(--space-2xl)", boxShadow: "var(--shadow-sketch)", textAlign: "center" }}>
              <div style={{ fontSize: 80, marginBottom: "var(--space-lg)" }}>📚</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-lg)" }}>📖 {data.title}</h2>
              <p style={{ fontSize: "var(--font-size-xl)", color: "var(--color-text-secondary)" }}>{data.desc}</p>
              <div style={{ marginTop: "var(--space-lg)", padding: "var(--space-lg)", background: "var(--color-postit-yellow)", borderRadius: "var(--wobble-2)", border: "2px solid var(--color-border)" }}>
                <p style={{ fontSize: "var(--font-size-xl)" }}>🎯 請老師帶領大家一起閱讀繪本</p>
                <p style={{ color: "var(--color-text-muted)", marginTop: "var(--space-sm)" }}>閱讀完後，一起進行下方的討論活動</p>
              </div>
            </div>
          )}
          {data.discussion.length > 0 && (
            <div style={{ marginTop: "var(--space-xl)", background: "var(--color-postit-green)", border: "var(--border-width) solid var(--color-border)", borderRadius: "var(--wobble-3)", padding: "var(--space-lg)", boxShadow: "var(--shadow-sketch-sm)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)", marginBottom: "var(--space-md)" }}>💬 討論時間</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-sm)", padding: 0 }}>
                {data.discussion.map((q, i) => <li key={i} style={{ fontSize: "var(--font-size-lg)", color: "var(--color-text-secondary)" }}>💭 {q}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
      <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
        <Link href={backLink} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", padding: "12px 24px", borderRadius: "var(--wobble-4)", background: "var(--color-bg-card)", border: "2px solid var(--color-border)", color: "var(--color-text-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", boxShadow: "var(--shadow-sketch-sm)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          回到課程列表
        </Link>
      </div>
      </div>
    </div>
  );
}
