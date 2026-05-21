"use client";
import StorybookPage from "@/app/courses/_components/StorybookPage";
import FloatingNav from "@/app/courses/_components/FloatingNav";
export default function Page() {
  return (
    <>
      <StorybookPage weekNum={5} backLink="/courses/4" />
      <FloatingNav prev={{ href: "/courses/4/toy-sharing", label: "玩具分享" }} next={{ href: "/courses/4", label: "回課程" }} />
    </>
  );
}
