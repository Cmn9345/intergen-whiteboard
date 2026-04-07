"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 不同年代的玩具數據
const toyCategories = [
  {
    era: "傳統玩具",
    icon: "🏮",
    toys: [
      { name: "陀螺", description: "用繩子抽轉的木製玩具", emoji: "🪀" },
      { name: "毽子", description: "用羽毛和銅錢製作的踢毽遊戲", emoji: "🪶" },
      { name: "竹蜻蜓", description: "用手搓動會飛起來的玩具", emoji: "🪁" },
      { name: "彈珠", description: "彩色玻璃球，可以玩彈珠遊戲", emoji: "🔵" },
      { name: "跳房子", description: "在地上畫格子跳躍的遊戲", emoji: "🏠" },
      { name: "翻花繩", description: "用繩子編織各種圖案的遊戲", emoji: "🪢" }
    ]
  },
  {
    era: "現代玩具",
    icon: "🎮",
    toys: [
      { name: "樂高積木", description: "可以拼裝各種造型的積木", emoji: "🧱" },
      { name: "芭比娃娃", description: "可以換衣服的時尚娃娃", emoji: "👸" },
      { name: "遙控車", description: "用遙控器控制的玩具車", emoji: "🚗" },
      { name: "電子遊戲", description: "在螢幕上玩的互動遊戲", emoji: "🎯" },
      { name: "拼圖", description: "將碎片拼成完整圖片的遊戲", emoji: "🧩" },
      { name: "魔術方塊", description: "可以轉動的彩色方塊", emoji: "🎲" }
    ]
  }
];

// 傳統遊戲數據
const traditionalGames = [
  {
    name: "石頭剪刀布",
    description: "用手勢猜拳的遊戲",
    emoji: "✂️",
    rules: "石頭贏剪刀，剪刀贏布，布贏石頭"
  },
  {
    name: "捉迷藏",
    description: "一個人找，其他人躲的遊戲",
    emoji: "👁️",
    rules: "找的人要數到10，其他人要躲起來"
  },
  {
    name: "老鷹捉小雞",
    description: "老鷹要抓小雞，母雞要保護小雞",
    emoji: "🐔",
    rules: "排成一列，最後一個是小雞，要躲開老鷹"
  },
  {
    name: "跳繩",
    description: "用繩子跳躍的遊戲",
    emoji: "🪢",
    rules: "兩個人搖繩，其他人輪流跳"
  }
];

export default function ToySharingPage() {
  const router = useRouter();
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<number | null>(null);
  const [showGameRules, setShowGameRules] = useState(false);

  const handleEraClick = (era: string) => {
    setSelectedEra(era);
  };

  const handleGameClick = (gameIndex: number) => {
    setCurrentGame(gameIndex);
    setShowGameRules(true);
  };

  const handleStartGame = () => {
    setShowGameRules(false);
    // 這裡可以添加遊戲開始的邏輯
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
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

      <div className="w-full max-w-6xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
            遊戲、玩具分享
          </h1>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">
              讓我們一起分享不同年代的玩具和遊戲，感受時光的變遷！
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-purple-800 mb-2">🎯 活動目標</h3>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• 了解不同年代的玩具特色</li>
                <li>• 分享玩具背後的故事</li>
                <li>• 體驗傳統遊戲的樂趣</li>
                <li>• 增進代際間的交流</li>
              </ul>
            </div>
          </div>

          {/* 玩具分享區域 */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🪀 玩具時光機</h2>
            
            {!selectedEra && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {toyCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleEraClick(category.era)}
                    className="p-6 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-center group"
                  >
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.era}</h3>
                    <p className="text-gray-600">點擊探索這個年代的玩具</p>
                  </button>
                ))}
              </div>
            )}

            {selectedEra && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {toyCategories.find(c => c.era === selectedEra)?.icon} {selectedEra}
                  </h3>
                  <button
                    onClick={() => setSelectedEra(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    返回選擇
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {toyCategories
                    .find(c => c.era === selectedEra)
                    ?.toys.map((toy, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{toy.emoji}</div>
                          <h4 className="font-semibold text-gray-800 mb-1">{toy.name}</h4>
                          <p className="text-sm text-gray-600">{toy.description}</p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-blue-800 mb-2">💬 分享時間</h4>
                  <p className="text-blue-700">
                    請分享您對這些{selectedEra}的經驗和回憶！您玩過哪些？最喜歡哪一個？有什麼有趣的故事嗎？
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 傳統遊戲區域 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🎮 傳統遊戲體驗</h2>
            
            {!showGameRules && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {traditionalGames.map((game, index) => (
                  <button
                    key={index}
                    onClick={() => handleGameClick(index)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all duration-200 text-center group"
                  >
                    <div className="text-3xl mb-2">{game.emoji}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{game.name}</h3>
                    <p className="text-sm text-gray-600">{game.description}</p>
                  </button>
                ))}
              </div>
            )}

            {showGameRules && currentGame !== null && (
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-8 rounded-lg text-white text-center">
                <div className="text-6xl mb-4">{traditionalGames[currentGame].emoji}</div>
                <h3 className="text-3xl font-bold mb-4">{traditionalGames[currentGame].name}</h3>
                <p className="text-xl mb-4">{traditionalGames[currentGame].description}</p>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-bold mb-2">遊戲規則</h4>
                  <p className="text-sm">{traditionalGames[currentGame].rules}</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleStartGame}
                    className="px-6 py-3 bg-white text-pink-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    開始遊戲
                  </button>
                  <button
                    onClick={() => setShowGameRules(false)}
                    className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg font-bold hover:bg-opacity-30 transition-colors"
                  >
                    返回選擇
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 底部按鈕 */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => router.push('/courses/5')}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              返回{getWeekTitle('5')}
            </button>
            <button
              onClick={() => router.push('/courses/6')}
              className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold"
            >
              下一週課程
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}





