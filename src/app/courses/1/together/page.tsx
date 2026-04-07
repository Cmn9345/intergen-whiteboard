"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function TogetherPage() {
  const router = useRouter();

  // YouTube 影片 ID (從 URL https://www.youtube.com/watch?v=aP6sr9Kp7FY 提取)
  const youtubeVideoId = "aP6sr9Kp7FY";

  return (
    <main className="min-h-screen bg-black relative">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/0')}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors border border-gray-200"
          title={`返回${getWeekTitle('0')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('0')}</span>
        </button>
      </div>

      {/* 滿版 YouTube 播放器 */}
      <div className="w-full h-screen">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3&autohide=0`}
          title="當我們同在一起"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </main>
  );
}
