"use client";
import StorybookPage from "@/app/courses/_components/StorybookPage";
import FloatingNav from "@/app/courses/_components/FloatingNav";
export default function Page() {
  return (
    <>
      <StorybookPage weekNum={8} backLink="/courses/7" />
      <FloatingNav prev={{ href: "/courses/7", label: "課程" }} next={{ href: "/courses/7", label: "回課程" }} />
    </>
  );
}
