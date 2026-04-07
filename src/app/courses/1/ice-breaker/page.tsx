"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

export default function IceBreakerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "自我介紹時間",
      description: "讓孩子和長者互相認識",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4">👋 自我介紹活動</h3>
            <div className="space-y-3">
              <p className="text-blue-700">請每個人輪流介紹自己：</p>
              <ul className="list-disc ml-6 text-blue-600 space-y-2">
                <li>我的名字是...</li>
                <li>我最喜歡的顏色是...</li>
                <li>我最喜歡的食物是...</li>
                <li>我最喜歡的活動是...</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">🎯 活動目標</h3>
            <p className="text-green-700">透過簡單的自我介紹，讓孩子與長者建立初步的認識和信任。</p>
          </div>
        </div>
      )
    },
    {
      title: "配對遊戲",
      description: "透過遊戲建立默契",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">🎮 配對遊戲</h3>
            <div className="space-y-3">
              <p className="text-purple-700">遊戲規則：</p>
              <ul className="list-disc ml-6 text-purple-600 space-y-2">
                <li>每組由一個孩子和一個長者組成</li>
                <li>一起完成簡單的任務</li>
                <li>互相幫助，建立默契</li>
                <li>分享完成任務的喜悅</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">💡 任務範例</h3>
            <ul className="list-disc ml-6 text-yellow-600 space-y-2">
              <li>一起畫一幅畫</li>
              <li>一起完成拼圖</li>
              <li>一起唱一首歌</li>
              <li>一起做簡單的手工</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "信任建立",
      description: "透過互動建立信任關係",
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">🤝 信任建立活動</h3>
            <div className="space-y-3">
              <p className="text-orange-700">活動內容：</p>
              <ul className="list-disc ml-6 text-orange-600 space-y-2">
                <li>互相分享一個小秘密</li>
                <li>一起完成需要合作的任務</li>
                <li>互相鼓勵和支持</li>
                <li>建立友誼的基礎</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
            <h3 className="text-xl font-bold text-pink-800 mb-4">✨ 活動總結</h3>
            <p className="text-pink-700">透過這些活動，我們已經建立了初步的默契和信任關係。現在可以進入下一個活動了！</p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 relative">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
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
          onClick={() => router.push('/courses/0')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('0')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('0')}</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto pt-16">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🤝 建立小默契</h1>
          <p className="text-blue-700 text-lg">透過互動遊戲建立初步的默契和信任關係</p>
        </div>

        {/* 進度指示器 */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              步驟 {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {steps[currentStep].content}
          </div>
        </div>

        {/* 導航按鈕 */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            ← 上一步
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
            >
              下一步 →
            </button>
          ) : (
            <button
              onClick={() => router.push('/courses/1/together')}
              className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
            >
              進入下一個活動 →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}






