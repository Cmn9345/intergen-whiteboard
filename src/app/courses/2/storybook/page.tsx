"use client";
import StorybookPage from "@/app/courses/_components/StorybookPage";
import FloatingNav from "@/app/courses/_components/FloatingNav";
export default function Page() {
  return (
    <>
      <StorybookPage weekNum={3} backLink="/courses/2" />
      <FloatingNav prev={{ href: "/courses/2/together", label: "一起動一動" }} next={{ href: "/courses/2/toolkit", label: "職業工具箱" }} />
    </>
  );
}
