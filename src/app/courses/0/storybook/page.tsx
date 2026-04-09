"use client";
import StorybookPage from "@/app/courses/_components/StorybookPage";
import FloatingNav from "@/app/courses/_components/FloatingNav";
export default function Page() {
  return (
    <>
      <StorybookPage weekNum={1} backLink="/courses/0" />
      <FloatingNav prev={{ href: "/courses/0/together", label: "一起動一動" }} next={{ href: "/courses/0/whiteboard-tutorial", label: "白板教學" }} />
    </>
  );
}
