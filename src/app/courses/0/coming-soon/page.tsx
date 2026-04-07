"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">內容尚未新增</h1>
        <p className="text-gray-600 mb-6">
          此活動內容正在開發中，敬請期待！
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/courses/3')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            返回{getWeekTitle('3')}
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            返回主頁
          </button>
        </div>
      </div>
    </main>
  );
}




























