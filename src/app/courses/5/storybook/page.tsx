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
          onClick={() => router.push('/courses/5')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('5')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('5')}</span>
        </button>
      </div>

      {/* 全螢幕YouTube播放器 */}
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full h-full max-w-none">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/Ib_lYcq7rds?autoplay=1&rel=0&modestbranding=1&showinfo=0"
            title="玩具太多了 - 繪本故事"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* 底部控制欄 */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">《玩具太多了》</h2>
            <p className="text-sm text-gray-300">繪本故事時間</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/courses/5')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              完成觀看
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}





