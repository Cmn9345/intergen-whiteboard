"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 動物配對數據
const animalPairs = [
  { 
    young: "小海龜", 
    adult: "海龜", 
    youngImage: "/images/animals/小海龜.jpg", 
    adultImage: "/images/animals/海龜.jpg",
    sound: "🐢 海龜游泳的聲音！",
    description: "小海龜長大後變成海龜"
  },
  { 
    young: "小天鵝", 
    adult: "天鵝", 
    youngImage: "/images/animals/小天鵝.jpg", 
    adultImage: "/images/animals/天鵝.jpg",
    sound: "🦢 天鵝優雅的聲音！",
    description: "小天鵝長大後變成天鵝"
  },
  { 
    young: "小雞", 
    adult: "公雞", 
    youngImage: "/images/animals/小雞.jpg", 
    adultImage: "/images/animals/公雞.jpg",
    sound: "🐓 咕咕咕！",
    description: "小雞長大後變成公雞"
  },
  { 
    young: "毛毛蟲", 
    adult: "蝴蝶", 
    youngImage: "/images/animals/毛毛蟲.jpg", 
    adultImage: "/images/animals/蝴蝶.jpg",
    sound: "🦋 嗡嗡嗡～",
    description: "毛毛蟲變成了美麗的蝴蝶"
  },
  { 
    young: "蝌蚪", 
    adult: "青蛙", 
    youngImage: "/images/animals/蝌蚪.jpg", 
    adultImage: "/images/animals/青蛙.jpg",
    sound: "🐸 呱呱呱！",
    description: "蝌蚪長大後變成青蛙"
  },
  { 
    young: "小獅子", 
    adult: "獅子", 
    youngImage: "/images/animals/小獅子.jpg", 
    adultImage: "/images/animals/獅子.jpg",
    sound: "🦁 獅子吼叫！",
    description: "小獅子長大後變成獅子"
  },
  { 
    young: "嬰兒", 
    adult: "成人", 
    youngImage: "/images/animals/嬰兒.jpg", 
    adultImage: "/images/animals/成人.jpg",
    sound: "👶 嬰兒的笑聲！",
    description: "嬰兒長大後變成成人"
  },
  { 
    young: "小袋鼠", 
    adult: "袋鼠", 
    youngImage: "/images/animals/小袋鼠.jpg", 
    adultImage: "/images/animals/袋鼠.jpg",
    sound: "🦘 袋鼠跳躍的聲音！",
    description: "小袋鼠長大後變成袋鼠"
  },
  { 
    young: "小企鵝", 
    adult: "企鵝", 
    youngImage: "/images/animals/小企鵝.jpg", 
    adultImage: "/images/animals/企鵝.jpg",
    sound: "🐧 企鵝的叫聲！",
    description: "小企鵝長大後變成企鵝"
  },
];

export default function FindPartnerPage() {
  const router = useRouter();
  
  
  // 點擊遊戲狀態
  const [selectedYoung, setSelectedYoung] = useState<string | null>(null);
  const [selectedAdult, setSelectedAdult] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [gameFeedback, setGameFeedback] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});
  const [showEmoji, setShowEmoji] = useState<{type: 'success' | 'error' | null}>({type: null});

  // 音效播放函數
  const playSound = (soundType: 'correct' | 'wrong') => {
    try {
      const audio = new Audio();
      if (soundType === 'correct') {
        audio.src = "/sounds/correct.m4a";
      } else {
        audio.src = "/sounds/wrong.m4a";
      }
      audio.volume = 0.7; // 設置音量為70%
      audio.play().catch(error => {
        console.log('音效播放失敗:', error);
      });
    } catch (error) {
      console.log('音效載入失敗:', error);
    }
  };
  
  // 隨機打亂數組的函數
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [gameAnimals, setGameAnimals] = useState(() => {
    // 顯示所有9種動物
    return [...animalPairs];
  });

  // 分別為成年動物和幼年動物創建隨機順序
  const [adultAnimals, setAdultAnimals] = useState(() => {
    return shuffleArray([...animalPairs]);
  });

  const [youngAnimals, setYoungAnimals] = useState(() => {
    return shuffleArray([...animalPairs]);
  });

  // 音效播放函數
  const playSuccessSound = () => {
    try {
      // 創建成功音效 - 使用 Web Audio API 生成愉快的音調
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 播放上升的音調序列
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      let currentTime = audioContext.currentTime;
      
      frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(freq, currentTime);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
        
        osc.start(currentTime);
        osc.stop(currentTime + 0.3);
        
        currentTime += 0.1;
      });
    } catch (error) {
      console.log('音效播放失敗:', error);
    }
  };

  const playErrorSound = () => {
    try {
      // 創建錯誤音效 - 使用低沉的音調
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 播放下降的音調
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('音效播放失敗:', error);
    }
  };

  // 點擊處理函數
  const handleYoungClick = (youngAnimal: string) => {
    if (matchedPairs.has(youngAnimal)) return; // 已配對的不能點擊
    
    setSelectedYoung(youngAnimal);
    
    // 如果已經選擇了成年動物，進行配對檢查
    if (selectedAdult) {
      checkPair(youngAnimal, selectedAdult);
    }
  };

  const handleAdultClick = (adultAnimal: string) => {
    // 檢查這個成年動物是否已經被配對
    const isAlreadyMatched = adultAnimals.some(animal => 
      animal.adult === adultAnimal && matchedPairs.has(animal.young)
    );
    
    if (isAlreadyMatched) return; // 已配對的不能點擊
    
    setSelectedAdult(adultAnimal);
    
    // 如果已經選擇了幼年動物，進行配對檢查
    if (selectedYoung) {
      checkPair(selectedYoung, adultAnimal);
    }
  };

  const checkPair = (youngAnimal: string, adultAnimal: string) => {
    // 檢查是否配對正確
    const correctPair = gameAnimals.find(animal => 
      animal.young === youngAnimal && animal.adult === adultAnimal
    );
    
    if (correctPair) {
      // 配對成功
      setMatchedPairs(prev => new Set([...prev, correctPair.young]));
      setGameFeedback({
        type: 'success',
        message: `🎉 配對成功！${correctPair.sound} ${correctPair.description}`
      });
      
      // 播放成功音效
      playSound('correct');
      
      // 顯示成功emoji
      setShowEmoji({type: 'success'});
      
      // 2秒後清除emoji和反饋
      setTimeout(() => {
        setShowEmoji({type: null});
        setGameFeedback({type: null, message: ''});
      }, 2000);
    } else {
      // 配對失敗
      setGameFeedback({
        type: 'error',
        message: '❌ 配對錯誤，請再試一次！'
      });
      
      // 播放錯誤音效
      playSound('wrong');
      
      // 顯示錯誤emoji
      setShowEmoji({type: 'error'});
      
      // 2秒後清除emoji和反饋
      setTimeout(() => {
        setShowEmoji({type: null});
        setGameFeedback({type: null, message: ''});
      }, 2000);
    }
    
    // 清除選擇
    setSelectedYoung(null);
    setSelectedAdult(null);
  };

  const resetGame = () => {
    setMatchedPairs(new Set());
    setGameFeedback({type: null, message: ''});
    setShowEmoji({type: null});
    setSelectedYoung(null);
    setSelectedAdult(null);
    // 重新隨機化兩個數組的順序
    setGameAnimals([...animalPairs]);
    setAdultAnimals(shuffleArray([...animalPairs]));
    setYoungAnimals(shuffleArray([...animalPairs]));
  };

  return (
    <main className="h-screen bg-gray-100 flex flex-col overflow-hidden relative">
      {/* Emoji 覆蓋層 */}
      {showEmoji.type && (
        <div className="fixed inset-0 z-[10] flex items-center justify-center pointer-events-none">
          <div className={`text-[20rem] animate-bounce ${
            showEmoji.type === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {showEmoji.type === 'success' ? '⭕' : '❌'}
          </div>
        </div>
      )}

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

      {/* 標題和狀態欄 - 固定高度 */}
      <div className="flex-shrink-0 pt-16 pb-2">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-blue-600 mb-1">尋找搭檔</h1>
          <p className="text-gray-600 mb-2 text-sm">點擊幼年動物和成年動物進行配對</p>
          <div className="flex justify-center gap-3">
            <div className="bg-blue-50 px-3 py-1 rounded-lg">
              <span className="text-blue-700 font-semibold text-sm">已配對：{matchedPairs.size}/{gameAnimals.length}</span>
            </div>
            <button
              onClick={resetGame}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-gray-700 font-semibold transition-colors text-sm"
            >
              重新開始
            </button>
          </div>
        </div>

        {/* 遊戲反饋 */}
        {gameFeedback.type && (
          <div className={`p-2 rounded-lg text-center font-semibold mb-3 relative z-[20] mx-4 ${
            gameFeedback.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {gameFeedback.message}
          </div>
        )}
      </div>

      {/* 遊戲區域 - 填滿剩餘空間 */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* 成年動物區域 */}
            <div className="flex flex-col h-full">
              <h4 className="text-lg font-bold text-center text-gray-800 mb-4">成年動物</h4>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {adultAnimals.map((animal, index) => {
                  const isMatched = matchedPairs.has(animal.young);
                  const isSelected = selectedAdult === animal.adult;
                  
                  return (
                    <div
                      key={`adult-${index}`}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-between min-h-[180px] ${
                        isMatched
                          ? 'opacity-0 pointer-events-none' // 配對成功後消失
                          : isSelected
                          ? 'border-blue-500 bg-blue-100 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-105'
                      }`}
                      onClick={() => handleAdultClick(animal.adult)}
                    >
                      <div className="flex items-center justify-center mb-2" style={{ height: '100px', marginTop: '0' }}>
                        <img 
                          src={animal.adultImage} 
                          alt={animal.adult}
                          className="w-30 h-30 object-contain"
                          style={{ width: '100px', height: '100px' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-5xl hidden">{animal.adult === "海龜" ? "🐢" : animal.adult === "天鵝" ? "🦢" : animal.adult === "公雞" ? "🐓" : animal.adult === "蝴蝶" ? "🦋" : animal.adult === "青蛙" ? "🐸" : animal.adult === "獅子" ? "🦁" : animal.adult === "成人" ? "👨" : animal.adult === "袋鼠" ? "🦘" : animal.adult === "企鵝" ? "🐧" : "❓"}</div>
                      </div>
                      <div className="font-semibold text-gray-800 text-center" style={{ fontSize: '20px', lineHeight: '1.2' }}>{animal.adult}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 幼年動物區域 */}
            <div className="flex flex-col h-full">
              <h4 className="text-lg font-bold text-center text-gray-800 mb-4">幼年動物</h4>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {youngAnimals.map((animal, index) => {
                  const isMatched = matchedPairs.has(animal.young);
                  const isSelected = selectedYoung === animal.young;
                  
                  return (
                    <div
                      key={`young-${index}`}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-between min-h-[180px] ${
                        isMatched
                          ? 'opacity-0 pointer-events-none' // 配對成功後消失
                          : isSelected
                          ? 'border-blue-500 bg-blue-100 shadow-lg scale-105'
                          : 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md hover:scale-105'
                      }`}
                      onClick={() => handleYoungClick(animal.young)}
                    >
                      <div className="flex items-center justify-center mb-2" style={{ height: '100px', marginTop: '0' }}>
                        <img 
                          src={animal.youngImage} 
                          alt={animal.young}
                          className="w-30 h-30 object-contain"
                          style={{ width: '100px', height: '100px' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-5xl hidden">{animal.young === "小海龜" ? "🐢" : animal.young === "小天鵝" ? "🦢" : animal.young === "小雞" ? "🐥" : animal.young === "毛毛蟲" ? "🐛" : animal.young === "蝌蚪" ? "🐸" : animal.young === "小獅子" ? "🦁" : animal.young === "嬰兒" ? "👶" : animal.young === "小袋鼠" ? "🦘" : animal.young === "小企鵝" ? "🐧" : "❓"}</div>
                      </div>
                      <div className="font-semibold text-gray-800 text-center" style={{ fontSize: '20px', lineHeight: '1.2' }}>{animal.young}</div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      </div>

      {/* 完成慶祝 - 覆蓋層 */}
      {matchedPairs.size === gameAnimals.length && (
        <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-lg text-white text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">恭喜完成！</h3>
            <p className="text-lg">所有動物都找到自己的家人了！</p>
            <button
              onClick={resetGame}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              再玩一次
            </button>
          </div>
        </div>
      )}

      {/* 遊戲說明 - 固定顯示在右下角 */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-blue-50 p-4 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-bold text-blue-800 mb-2 text-sm">🎮 遊戲說明</h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• 先點擊幼年動物，再點擊成年動物</li>
            <li>• 配對正確會出現 ⭕ 和聲音</li>
            <li>• 配對錯誤會出現 ❌</li>
            <li>• 配對成功卡片會消失</li>
            <li>• 完成所有配對獲勝！</li>
          </ul>
        </div>
      </div>
    </main>
  );
}