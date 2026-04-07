"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function StorybookPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/0')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('0')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('0')}</span>
        </button>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 書emoji */}
        <div className="text-center mb-8">
          <div className="text-[20rem] animate-pulse">📚</div>
        </div>

        {/* 紙本內容 */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">做一個機器人假裝是我</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-xl">
                這是一個關於自我探索和想像力的故事。讓我們一起閱讀這個有趣的繪本，探索如何用機器人來代表自己。
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">📖 故事內容</h2>
                <p className="text-lg text-yellow-900 mb-4">
                  如果我要做一個機器人來假裝是我，這個機器人需要什麼呢？
                </p>
                <ul className="list-disc ml-6 space-y-2 text-yellow-900">
                  <li>它需要有我的眼睛，因為我喜歡看書</li>
                  <li>它需要有我的手，因為我喜歡畫畫</li>
                  <li>它需要有我的腳，因為我喜歡跑步</li>
                  <li>它需要有我的心，因為我喜歡分享</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">💭 思考問題</h2>
                <ul className="list-disc ml-6 space-y-2 text-blue-900">
                  <li>如果要做一個機器人代表你，你會給它什麼特徵？</li>
                  <li>你最喜歡自己哪些特點？</li>
                  <li>你最想和別人分享什麼？</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h2 className="text-2xl font-bold text-green-800 mb-4">🎯 活動建議</h2>
                <ul className="list-disc ml-6 space-y-2 text-green-900">
                  <li>一起討論故事中的內容</li>
                  <li>分享每個人最喜歡的部分</li>
                  <li>思考如何用簡單的方式表達自己</li>
                  <li>可以畫出自己心目中的機器人</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



