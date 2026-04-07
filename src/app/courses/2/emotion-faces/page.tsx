"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function EmotionFacesPage() {
  const router = useRouter();

  return (
    <main className="h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col overflow-hidden relative">
      {/* 左上角按鈕 - 返回主頁、返回第二週、回到尋找搭檔 */}
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title="返回主頁"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回主頁</span>
        </button>
        
        <button
          onClick={() => router.push('/courses/1')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('1')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('1')}</span>
        </button>

        <button
          onClick={() => router.push('/courses/2/find-partner')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors border border-blue-600"
          title="回到尋找搭檔"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">回到尋找搭檔</span>
        </button>
      </div>

      {/* 右上角按鈕 - 進入情緒轉盤 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => router.push('/courses/2/emotion-wheel')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors border border-green-600"
          title="進入情緒轉盤"
        >
          <span className="text-sm font-medium">進入情緒轉盤</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 主要內容區域 - 填滿高度 */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-4">
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col px-4 pb-4">
          {/* 標題 */}
          <div className="text-center mb-6 flex-shrink-0 pt-16">
            <h1 className="text-3xl font-bold text-green-800 mb-2">😊 情緒臉譜、我的心裡話</h1>
            <p className="text-green-700 text-base">認識和表達不同的情緒</p>
          </div>

          {/* 活動內容 - 填滿剩餘空間 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex-1 flex flex-col min-h-0">
            <div className="space-y-6 flex-1">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">🎯 活動目標</h3>
              <p className="text-green-700">透過情緒臉譜識別和心裡話分享，讓孩子與長者認識不同的情緒，學會表達和溝通。</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">😊 情緒臉譜</h4>
                <ul className="list-disc ml-6 text-blue-600 space-y-2">
                  <li>認識不同的情緒表情</li>
                  <li>開心、傷心、生氣、害怕、驚訝</li>
                  <li>觀察表情特徵和變化</li>
                  <li>練習情緒識別能力</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">💭 我的心裡話</h4>
                <ul className="list-disc ml-6 text-purple-600 space-y-2">
                  <li>分享內心的感受和想法</li>
                  <li>表達不同情緒的經驗</li>
                  <li>學習傾聽和理解他人</li>
                  <li>建立情感連結和信任</li>
                </ul>
              </div>
            </div>

            {/* 情緒展示區域 */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex-shrink-0">
              <h4 className="text-lg font-semibold text-yellow-800 mb-4 text-center">🎭 情緒表情展示</h4>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-5xl mb-2">😊</div>
                  <div className="text-sm font-semibold text-gray-700">開心</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-5xl mb-2">😢</div>
                  <div className="text-sm font-semibold text-gray-700">傷心</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-5xl mb-2">😠</div>
                  <div className="text-sm font-semibold text-gray-700">生氣</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-5xl mb-2">😨</div>
                  <div className="text-sm font-semibold text-gray-700">害怕</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-5xl mb-2">😲</div>
                  <div className="text-sm font-semibold text-gray-700">驚訝</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}




