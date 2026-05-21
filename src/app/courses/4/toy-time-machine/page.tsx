"use client";
import PdfStorybook from "@/app/courses/_components/PdfStorybook";

export default function Page() {
  return (
    <PdfStorybook
      emoji="🎠"
      title="玩具時光機"
      desc="一頁一頁翻，跟著自編繪本走進祖孫共玩的時光"
      imageBase="/storybook-toy-time-machine"
      pageCount={9}
      backLink="/courses/4"
      backLabel="回到第 5 週"
      pdfHref="/storybook-toy-time-machine/玩具時光機-繪本.pdf"
      nav={{
        prev: { href: "/courses/4/toy-sharing", label: "玩具分享" },
        next: { href: "/courses/4/string-phone", label: "傳聲筒" },
      }}
    />
  );
}
