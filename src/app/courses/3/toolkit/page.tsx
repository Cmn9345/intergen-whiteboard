"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 職業工具包數據
const professionTools = [
  {
    profession: "醫生",
    tools: ["聽診器", "溫度計", "注射器", "口罩"],
    description: "醫生用這些工具來檢查和治療病人"
  },
  {
    profession: "廚師",
    tools: ["鍋子", "鏟子", "刀子", "圍裙"],
    description: "廚師用這些工具來製作美味的食物"
  },
  {
    profession: "老師",
    tools: ["粉筆", "黑板", "書本", "眼鏡"],
    description: "老師用這些工具來教導學生知識"
  },
  {
    profession: "警察",
    tools: ["警徽", "手銬", "對講機", "警車"],
    description: "警察用這些工具來保護大家的安全"
  },
  {
    profession: "消防員",
    tools: ["消防車", "水管", "安全帽", "梯子"],
    description: "消防員用這些工具來滅火和救人"
  },
  {
    profession: "建築師",
    tools: ["尺子", "鉛筆", "圖紙", "計算機"],
    description: "建築師用這些工具來設計建築物"
  }
];

// 大小職業家配對數據
const professionPairs = [
  { adult: "醫生", child: "小醫生", icon: "🏥" },
  { adult: "廚師", child: "小廚師", icon: "👨‍🍳" },
  { adult: "老師", child: "小老師", icon: "👩‍🏫" },
  { adult: "警察", child: "小警察", icon: "👮‍♂️" },
  { adult: "消防員", child: "小消防員", icon: "👨‍🚒" },
  { adult: "建築師", child: "小建築師", icon: "👷‍♂️" }
];

export default function ToolkitPage() {
  const router = useRouter();
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<'tools' | 'pairs'>('tools');

  const handleToolClick = (profession: string) => {
    setSelectedProfession(profession);
  };

  const handlePairClick = (adult: string, child: string) => {
    alert(`配對成功！${adult} 和 ${child} 是一對！`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/2')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('2')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('2')}</span>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">
            工具包裏有甚麼?、大小職業家
          </h1>

          {/* 遊戲模式切換 */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGamePhase('tools')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  gamePhase === 'tools'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                工具包探索
              </button>
              <button
                onClick={() => setGamePhase('pairs')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  gamePhase === 'pairs'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                大小職業家配對
              </button>
            </div>
          </div>

          {/* 工具包探索遊戲 */}
          {gamePhase === 'tools' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">工具包裏有甚麼?</h2>
                <p className="text-gray-600">點擊不同的職業，看看他們使用什麼工具！</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {professionTools.map((prof, index) => (
                  <button
                    key={index}
                    onClick={() => handleToolClick(prof.profession)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedProfession === prof.profession
                        ? 'border-orange-400 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {prof.profession === '醫生' && '👨‍⚕️'}
                        {prof.profession === '廚師' && '👨‍🍳'}
                        {prof.profession === '老師' && '👩‍🏫'}
                        {prof.profession === '警察' && '👮‍♂️'}
                        {prof.profession === '消防員' && '👨‍🚒'}
                        {prof.profession === '建築師' && '👷‍♂️'}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">{prof.profession}</h3>
                    </div>
                  </button>
                ))}
              </div>

              {/* 顯示選中職業的工具 */}
              {selectedProfession && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">
                    {selectedProfession}的工具包
                  </h3>
                  <p className="text-orange-700 mb-4">
                    {professionTools.find(p => p.profession === selectedProfession)?.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {professionTools
                      .find(p => p.profession === selectedProfession)
                      ?.tools.map((tool, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded-lg border border-orange-200 text-center"
                        >
                          <div className="text-2xl mb-1">
                            {tool === '聽診器' && '🩺'}
                            {tool === '溫度計' && '🌡️'}
                            {tool === '注射器' && '💉'}
                            {tool === '口罩' && '😷'}
                            {tool === '鍋子' && '🍳'}
                            {tool === '鏟子' && '🥄'}
                            {tool === '刀子' && '🔪'}
                            {tool === '圍裙' && '👨‍🍳'}
                            {tool === '粉筆' && '✏️'}
                            {tool === '黑板' && '📝'}
                            {tool === '書本' && '📚'}
                            {tool === '眼鏡' && '👓'}
                            {tool === '警徽' && '🛡️'}
                            {tool === '手銬' && '🔗'}
                            {tool === '對講機' && '📻'}
                            {tool === '警車' && '🚔'}
                            {tool === '消防車' && '🚒'}
                            {tool === '水管' && '🚰'}
                            {tool === '安全帽' && '⛑️'}
                            {tool === '梯子' && '🪜'}
                            {tool === '尺子' && '📏'}
                            {tool === '鉛筆' && '✏️'}
                            {tool === '圖紙' && '📋'}
                            {tool === '計算機' && '💻'}
                          </div>
                          <p className="text-sm font-medium text-gray-700">{tool}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 大小職業家配對遊戲 */}
          {gamePhase === 'pairs' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">大小職業家配對</h2>
                <p className="text-gray-600">點擊配對的職業，看看大人和小孩的職業對應！</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionPairs.map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => handlePairClick(pair.adult, pair.child)}
                    className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{pair.icon}</div>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">大人職業</p>
                          <p className="font-semibold text-blue-800">{pair.adult}</p>
                        </div>
                        <div className="text-gray-400">↕️</div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">小孩職業</p>
                          <p className="font-semibold text-green-800">{pair.child}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-blue-800 mb-2">💡 討論時間</h3>
                <p className="text-blue-700">
                  每個職業都很重要！無論是大人還是小孩，都可以學習和體驗不同的職業。
                  你們長大後想要做什麼工作呢？
                </p>
              </div>
            </div>
          )}

          {/* 底部按鈕 */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => router.push('/courses/2')}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              返回{getWeekTitle('2')}
            </button>
            <button
              onClick={() => router.push('/courses/4')}
              className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              下一週課程
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}





