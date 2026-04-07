"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 才藝類型數據
const talentCategories = [
  {
    id: "singing",
    name: "唱歌",
    icon: "🎤",
    description: "展示美妙的歌聲",
    examples: ["兒歌", "老歌", "流行歌曲", "民謠"]
  },
  {
    id: "dancing",
    name: "跳舞",
    icon: "💃",
    description: "展現優美的舞姿",
    examples: ["民族舞", "現代舞", "廣場舞", "兒童舞"]
  },
  {
    id: "storytelling",
    name: "說故事",
    icon: "📚",
    description: "分享精彩的故事",
    examples: ["童話故事", "民間故事", "生活趣事", "歷史故事"]
  },
  {
    id: "art",
    name: "繪畫/手工",
    icon: "🎨",
    description: "展現藝術天分",
    examples: ["畫畫", "摺紙", "剪紙", "書法"]
  },
  {
    id: "sports",
    name: "運動技能",
    icon: "⚽",
    description: "展示運動才能",
    examples: ["太極拳", "體操", "球類運動", "武術"]
  },
  {
    id: "music",
    name: "樂器演奏",
    icon: "🎵",
    description: "演奏樂器",
    examples: ["鋼琴", "吉他", "口琴", "打擊樂器"]
  }
];

export default function TalentShowPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPerformer, setCurrentPerformer] = useState<'child' | 'elder' | null>(null);
  const [showTime, setShowTime] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleStartPerformance = (performer: 'child' | 'elder') => {
    setCurrentPerformer(performer);
    setShowTime(true);
  };

  const handleEndPerformance = () => {
    setCurrentPerformer(null);
    setShowTime(false);
  };

  const selectedTalent = talentCategories.find(t => t.id === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/4')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('4')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('4')}</span>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
            我們的拿手好戲
          </h1>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">
              讓我們一起展示各自的才藝，互相學習和欣賞！
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-red-800 mb-2">🎭 表演規則</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• 選擇一種才藝類型進行表演</li>
                <li>• 孩子和長者輪流展示</li>
                <li>• 表演時間約2-3分鐘</li>
                <li>• 互相鼓勵和讚美</li>
              </ul>
            </div>
          </div>

          {/* 才藝類型選擇 */}
          {!selectedCategory && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">選擇才藝類型</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {talentCategories.map((talent) => (
                  <button
                    key={talent.id}
                    onClick={() => handleCategoryClick(talent.id)}
                    className="p-6 rounded-lg border-2 border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 text-center group"
                  >
                    <div className="text-4xl mb-3">{talent.icon}</div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{talent.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{talent.description}</p>
                    <div className="text-xs text-gray-500">
                      {talent.examples.slice(0, 2).join('、')}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 選中才藝的詳細頁面 */}
          {selectedCategory && !currentPerformer && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedTalent?.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTalent?.name}</h2>
                <p className="text-gray-600 mb-6">{selectedTalent?.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">💡 表演建議</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTalent?.examples.map((example, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-700">{example}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800">誰先開始表演？</h3>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleStartPerformance('child')}
                    className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors"
                  >
                    👶 孩子先表演
                  </button>
                  <button
                    onClick={() => handleStartPerformance('elder')}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition-colors"
                  >
                    👴 長者先表演
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  重新選擇才藝類型
                </button>
              </div>
            </div>
          )}

          {/* 表演時間 */}
          {showTime && currentPerformer && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-lg text-white">
                <div className="text-6xl mb-4">
                  {currentPerformer === 'child' ? '👶' : '👴'}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {currentPerformer === 'child' ? '孩子' : '長者'}的表演時間！
                </h2>
                <p className="text-xl mb-4">才藝類型：{selectedTalent?.name}</p>
                <div className="text-2xl font-bold mb-6">🎭 請開始表演 🎭</div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold mb-2">表演提示</h3>
                  <p className="text-sm">
                    {currentPerformer === 'child' 
                      ? '小朋友，請展示你的拿手好戲！不用緊張，大家都會為你加油！' 
                      : '長者，請分享您的才藝！您的經驗和技能是寶貴的財富！'
                    }
                  </p>
                </div>

                <button
                  onClick={handleEndPerformance}
                  className="px-8 py-3 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  表演結束
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-800 mb-2">👏 觀眾互動</h3>
                <p className="text-blue-700">
                  請其他參與者為表演者鼓掌和讚美！可以說「太棒了！」、「好厲害！」等鼓勵的話語。
                </p>
              </div>
            </div>
          )}

          {/* 底部按鈕 */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => router.push('/courses/4')}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              返回{getWeekTitle('4')}
            </button>
            <button
              onClick={() => router.push('/courses/4/ensemble')}
              className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              下一個活動：合奏
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}





