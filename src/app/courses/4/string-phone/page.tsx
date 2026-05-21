"use client";
import PdfStorybook from "@/app/courses/_components/PdfStorybook";

export default function Page() {
  return (
    <PdfStorybook
      emoji="📞"
      title="童玩製作 — 傳聲筒"
      desc="跟著步驟一起動手做，體驗最簡單的聲音傳遞玩具"
      imageBase="/storybook-string-phone"
      pageCount={2}
      ext="jpg"
      backLink="/courses/4"
      backLabel="回到第 5 週"
      pdfHref="/storybook-string-phone/傳聲筒.pdf"
      nav={{
        prev: { href: "/courses/4/toy-time-machine", label: "玩具時光機" },
        next: { href: "/courses/4/family-sign", label: "一家人手語" },
      }}
    />
  );
}
