"use client";
import StorybookPage from "@/app/courses/_components/StorybookPage";
import FloatingNav from "@/app/courses/_components/FloatingNav";
export default function Page() {
  return (
    <>
      <StorybookPage weekNum={6} backLink="/courses/5" />
      <FloatingNav prev={{ href: "/courses/5/toy-sharing", label: "玩具分享" }} next={{ href: "/courses/5", label: "回課程" }} />
    </>
  );
}
