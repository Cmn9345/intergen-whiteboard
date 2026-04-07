"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function StorybookPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black relative">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/6')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('6')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('6')}</span>
        </button>
      </div>

      {/* 全螢幕播放器區域 */}
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="w-full h-full max-w-none">
          <video
            width="100%"
            height="100%"
            controls
            autoPlay
            className="w-full h-full object-contain"
            src="/videos/動物大趴踢.mov"
          >
            您的瀏覽器不支援影片播放。
          </video>
        </div>
      </div>

      {/* 標題顯示在頂部（不擋播放器控制欄） */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black bg-opacity-70 text-white px-6 py-2 rounded-lg pointer-events-none">
        <h2 className="text-lg font-semibold">《數一數，有幾隻腳？》</h2>
      </div>
    </main>
  );
}





