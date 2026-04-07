"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 家事活動數據
const householdActivities = [
  {
    id: "cooking",
    name: "煮飯",
    emoji: "🍳",
    description: "準備美味的餐點"
  },
  {
    id: "sweeping",
    name: "掃地",
    emoji: "🧹",
    description: "保持家裡整潔"
  },
  {
    id: "washing_dishes",
    name: "洗碗",
    emoji: "🍽️",
    description: "清洗餐具"
  },
  {
    id: "watering_plants",
    name: "澆花",
    emoji: "🌱",
    description: "照顧植物"
  },
  {
    id: "hanging_clothes",
    name: "曬衣服",
    emoji: "👕",
    description: "晾曬衣物"
  },
  {
    id: "storytelling",
    name: "講故事",
    emoji: "📚",
    description: "分享有趣的故事"
  },
  {
    id: "walking_dog",
    name: "遛狗",
    emoji: "🐕",
    description: "帶狗狗散步"
  },
  {
    id: "fixing_things",
    name: "修理東西",
    emoji: "🔧",
    description: "修復家中的物品"
  }
];

// 家庭成員數據
const familyMembers = [
  { id: "dad", name: "爸爸", image: "/images/family/爸爸.png", emoji: "👨", color: "bg-blue-100 border-blue-300" },
  { id: "mom", name: "媽媽", image: "/images/family/媽媽.png", emoji: "👩", color: "bg-pink-100 border-pink-300" },
  { id: "grandpa", name: "爺爺", image: "/images/family/爺爺.png", emoji: "👴", color: "bg-gray-100 border-gray-300" },
  { id: "grandma", name: "奶奶", image: "/images/family/奶奶.png", emoji: "👵", color: "bg-purple-100 border-purple-300" },
  { id: "brother", name: "哥哥", image: "/images/family/brother.avif", emoji: "👦", color: "bg-green-100 border-green-300" },
  { id: "sister", name: "姊姊", image: "/images/family/姐姐.png", emoji: "👧", color: "bg-yellow-100 border-yellow-300" },
  { id: "younger_brother", name: "弟弟", image: "/images/family/弟弟.png", emoji: "👶", color: "bg-cyan-100 border-cyan-300" },
  { id: "younger_sister", name: "妹妹", image: "/images/family/妹妹.png", emoji: "👧", color: "bg-rose-100 border-rose-300" },
  { id: "me", name: "我", image: "/images/family/弟弟.png", emoji: "👶", color: "bg-orange-100 border-orange-300" }
];

export default function CharadesPage() {
  const router = useRouter();
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [isReading, setIsReading] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  // 檢查語音合成支援
  React.useEffect(() => {
    console.log('=== 檢查語音合成支援 ===');
    if ('speechSynthesis' in window) {
      console.log('✅ 瀏覽器支援語音合成');
      
      // 等待語音載入
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        console.log('可用語音數量:', voices.length);
        
        if (voices.length === 0) {
          console.log('語音尚未載入，等待中...');
          setTimeout(checkVoices, 100);
        } else {
          voices.forEach((voice, index) => {
            console.log(`語音 ${index}: ${voice.name} (${voice.lang})`);
          });
          
          // 測試語音功能
          console.log('🎤 測試語音功能...');
          const testUtterance = new SpeechSynthesisUtterance('測試');
          testUtterance.volume = 0.1; // 小音量測試
          testUtterance.onend = () => {
            console.log('✅ 語音測試成功');
          };
          testUtterance.onerror = (event) => {
            console.error('❌ 語音測試失敗:', event);
          };
          speechSynthesis.speak(testUtterance);
        }
      };
      
      checkVoices();
    } else {
      console.log('❌ 瀏覽器不支援語音合成');
    }
  }, []);

  // 文字轉語音功能
  const speakText = (text: string) => {
    console.log('=== 開始語音朗讀 ===');
    console.log('要朗讀的文字:', text);
    console.log('瀏覽器支援語音合成:', 'speechSynthesis' in window);
    
    if (!('speechSynthesis' in window)) {
      console.error('❌ 瀏覽器不支援語音合成');
      setIsReading(false);
      return;
    }

    // 停止之前的朗讀
    speechSynthesis.cancel();
    
    // 等待一小段時間確保之前的朗讀完全停止
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 設定語音參數
      utterance.lang = 'zh-TW';
      utterance.rate = 1.2; // 更快一點，像真人講話的節奏
      utterance.pitch = 1.4; // 音調更高，更有表情
      utterance.volume = 1.0; // 最大音量，更清晰
      
      // 嘗試選擇中文語音
      const voices = speechSynthesis.getVoices();
      console.log('可用語音數量:', voices.length);
      
      const chineseVoice = voices.find(voice => 
        voice.lang.includes('zh') || 
        voice.lang.includes('TW') || 
        voice.lang.includes('CN')
      );
      
      if (chineseVoice) {
        utterance.voice = chineseVoice;
        console.log('使用中文語音:', chineseVoice.name, chineseVoice.lang);
      } else {
        console.log('未找到中文語音，使用預設語音');
        voices.forEach((voice, index) => {
          console.log(`語音 ${index}:`, voice.name, voice.lang);
        });
      }
      
      // 事件處理
      utterance.onstart = () => {
        console.log('✅ 開始朗讀:', text);
        setIsReading(true);
      };
      
      utterance.onend = () => {
        console.log('✅ 朗讀結束:', text);
        setIsReading(false);
      };
      
      utterance.onerror = (event) => {
        console.error('❌ 朗讀錯誤:', event.error, event);
        setIsReading(false);
      };
      
      utterance.onpause = () => {
        console.log('⏸️ 朗讀暫停');
      };
      
      utterance.onresume = () => {
        console.log('▶️ 朗讀恢復');
      };
      
      // 嘗試朗讀
      try {
        console.log('🎤 發送朗讀請求...');
        speechSynthesis.speak(utterance);
        console.log('✅ 朗讀請求已發送');
      } catch (error) {
        console.error('❌ 朗讀請求失敗:', error);
        setIsReading(false);
      }
    }, 100);
  };

  // 強制語音測試
  const forceTestVoice = () => {
    console.log('🔊 強制語音測試');
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('強制測試語音功能');
      utterance.volume = 1.0;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => console.log('✅ 強制測試開始');
      utterance.onend = () => console.log('✅ 強制測試結束');
      utterance.onerror = (event) => console.error('❌ 強制測試失敗:', event);
      speechSynthesis.speak(utterance);
    }
  };

  // 抽題卡
  const drawCard = () => {
    const randomActivity = householdActivities[Math.floor(Math.random() * householdActivities.length)];
    console.log('🎯 抽到的活動:', randomActivity);
    setCurrentActivity(randomActivity);
    setShowCard(true);
    setShowDiscussion(false);
    setSelectedMembers(new Set());
    
    // 延遲3秒後朗讀卡片動作，讓用戶先看到卡片
    setTimeout(() => {
      console.log('🎤 準備朗讀活動名稱:', randomActivity.name);
      speakText(randomActivity.name);
    }, 3000);
  };

  // 換下一組
  const nextGroup = () => {
    setShowCard(false);
    setCurrentActivity(null);
    setShowDiscussion(false);
    setSelectedMembers(new Set());
  };

  // 開始討論
  const startDiscussion = () => {
    setShowDiscussion(true);
  };

  // 選擇家庭成員
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
    
    // 朗讀選擇的成員名稱
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      speakText(member.name);
    }
  };

  // 游標停留在成員上時朗讀（1秒延遲）
  const handleMemberHover = (memberId: string) => {
    // 清除之前的計時器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      console.log('游標停留在:', member.name, '開始1秒計時...');
      
      // 設置1秒延遲
      const timer = setTimeout(() => {
        console.log('1秒計時結束，開始朗讀:', member.name);
        speakText(member.name);
        setHoverTimer(null);
      }, 1000);
      
      setHoverTimer(timer);
    }
  };

  // 游標離開成員時取消朗讀
  const handleMemberLeave = () => {
    if (hoverTimer) {
      console.log('游標離開，取消朗讀計時');
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  // 重新開始
  const restart = () => {
    setCurrentActivity(null);
    setShowCard(false);
    setShowDiscussion(false);
    setSelectedMembers(new Set());
    // 清除懸停計時器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  // 組件卸載時清理計時器
  React.useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 relative">
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
          onClick={() => router.push('/courses/3')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('3')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('3')}</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto pt-16">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🎭 你演我猜</h1>
          <p className="text-green-700 text-lg">兩階段互動遊戲：表演家事 + 討論分工</p>
        </div>

        {/* 遊戲區域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!showCard && !showDiscussion && (
            /* 第一階段：抽題卡介面 */
            <div className="text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">🎪</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">準備開始表演遊戲！</h2>
                <p className="text-gray-600 mb-6">抽一張家事卡，然後表演給大家猜</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={drawCard}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  🎯 抽一張家事卡！
                </button>
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => speakText('測試語音功能')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    🎤 測試語音
                  </button>
                  <button
                    onClick={forceTestVoice}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    ⚡ 強制測試
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCard && !showDiscussion && (
            /* 第一階段：顯示題卡 */
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg border-4 border-yellow-300">
                  <div className="text-8xl mb-4">{currentActivity.emoji}</div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentActivity.name}</h2>
                  <p className="text-lg text-gray-600">{currentActivity.description}</p>
                </div>
                
                {/* 朗讀狀態指示和手動朗讀按鈕 */}
                <div className="mt-4">
                  {isReading ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                      <div className="animate-pulse">🔊</div>
                      正在朗讀動作...
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => speakText(currentActivity.name)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        🔊 重新朗讀動作
                      </button>
                      <button
                        onClick={() => speakText('測試語音功能')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        🎤 測試語音
                      </button>
                      <button
                        onClick={forceTestVoice}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        ⚡ 強制測試
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={startDiscussion}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  💬 開始討論
                </button>
                
                <button
                  onClick={nextGroup}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  ➡️ 換下一組
                </button>
              </div>
            </div>
          )}

          {showDiscussion && (
            /* 第二階段：互動討論畫面 */
            <div>
              {/* 中央主題 */}
              <div className="text-center mb-8">
                <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg border-4 border-blue-300">
                  <div className="text-6xl mb-3">{currentActivity.emoji}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentActivity.name}</h2>
                  <p className="text-lg text-gray-600">{currentActivity.description}</p>
                </div>
              </div>

              {/* 討論提示 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-yellow-800 mb-3 text-center">💭 討論問題</h3>
                <p className="text-yellow-700 text-center text-lg">
                  「在你們家，通常是誰會做這件事呢？」
                </p>
                <p className="text-yellow-600 text-center mt-2">
                  請點擊所有會做這件事的家庭成員
                </p>
              </div>

              {/* 家庭成員選擇 */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {familyMembers.map((member) => {
                  const isSelected = selectedMembers.has(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => toggleMember(member.id)}
                      onMouseEnter={() => handleMemberHover(member.id)}
                      onMouseLeave={handleMemberLeave}
                      className={`p-6 rounded-2xl border-4 transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? `${member.color} border-yellow-400 shadow-lg ring-4 ring-yellow-200`
                          : `${member.color} hover:shadow-md`
                      }`}
                    >
                      <div className="mx-auto mb-2 flex items-center justify-center">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="object-contain"
                          style={{ width: '75px', height: '75px' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-5xl hidden">{member.emoji}</div>
                      </div>
                      <div className="font-bold text-gray-800">{member.name}</div>
                      {isSelected && (
                        <div className="mt-2 text-yellow-600 font-bold">✓ 已選擇</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 結果展示 */}
              {selectedMembers.size > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-green-800 mb-3 text-center">👨‍👩‍👧‍👦 家庭分工結果</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from(selectedMembers).map((memberId) => {
                      const member = familyMembers.find(m => m.id === memberId);
                      return (
                        <span
                          key={memberId}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold"
                        >
                          <img 
                            src={member?.image} 
                            alt={member?.name}
                            className="object-contain"
                            style={{ width: '50px', height: '50px' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="hidden">{member?.emoji}</span>
                          <span>{member?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 控制按鈕 */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={restart}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  🎯 重新開始
                </button>
                
                <button
                  onClick={nextGroup}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  ➡️ 換下一組
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 遊戲說明 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mt-6 shadow-lg">
          <h3 className="text-xl font-bold text-green-800 mb-4 text-center">🎮 遊戲說明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                <p className="text-green-700">點擊「抽一張家事卡！」開始遊戲</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                <p className="text-green-700">表演抽到的家事，讓大家猜</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                <p className="text-green-700">點擊「開始討論」進入分工討論</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">4</div>
                <p className="text-green-700">選擇家中會做這件事的成員</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">5</div>
                <p className="text-green-700">討論家庭分工和互助觀念</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-green-800 font-bold text-sm flex-shrink-0 mt-0.5">6</div>
                <p className="text-green-700">點擊「換下一組」繼續遊戲</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}