"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 動物配對數據
const animalPairs = [
  { 
    young: "小雞", 
    adult: "公雞", 
    youngImage: "🐥", 
    adultImage: "🐓",
    sound: "🐓 咕咕咕！",
    description: "小雞長大後變成公雞"
  },
  { 
    young: "小貓", 
    adult: "貓咪", 
    youngImage: "🐱", 
    adultImage: "🐈",
    sound: "🐱 喵～",
    description: "小貓長大後變成貓咪"
  },
  { 
    young: "毛毛蟲", 
    adult: "蝴蝶", 
    youngImage: "🐛", 
    adultImage: "🦋",
    sound: "🦋 嗡嗡嗡～",
    description: "毛毛蟲變成了美麗的蝴蝶"
  },
  { 
    young: "小鴨", 
    adult: "鴨子", 
    youngImage: "🐤", 
    adultImage: "🦆",
    sound: "🦆 嘎嘎嘎！",
    description: "小鴨長大後變成鴨子"
  },
  { 
    young: "小狗", 
    adult: "大狗", 
    youngImage: "🐶", 
    adultImage: "🐕",
    sound: "🐕 汪汪汪！",
    description: "小狗長大後變成大狗"
  },
  { 
    young: "小豬", 
    adult: "大豬", 
    youngImage: "🐷", 
    adultImage: "🐖",
    sound: "🐖 哼哼哼！",
    description: "小豬長大後變成大豬"
  },
  { 
    young: "小羊", 
    adult: "綿羊", 
    youngImage: "🐑", 
    adultImage: "🐏",
    sound: "🐏 咩咩咩！",
    description: "小羊長大後變成綿羊"
  },
  { 
    young: "小牛", 
    adult: "大牛", 
    youngImage: "🐄", 
    adultImage: "🐂",
    sound: "🐂 哞哞哞！",
    description: "小牛長大後變成大牛"
  },
  { 
    young: "小馬", 
    adult: "大馬", 
    youngImage: "🐴", 
    adultImage: "🐎",
    sound: "🐎 嘶嘶嘶！",
    description: "小馬長大後變成大馬"
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
      playSuccessSound();
      
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
      playErrorSound();
      
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
    <main className="min-h-screen bg-gray-100 p-8 relative">
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
          onClick={() => router.push('/courses/0')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title="返回課程詳情"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回課程</span>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">尋找搭檔</h1>
            <p className="text-gray-600 mb-4">點擊幼年動物和成年動物進行配對</p>
            <div className="flex justify-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-700 font-semibold">已配對：{matchedPairs.size}/{gameAnimals.length}</span>
              </div>
              <button
                onClick={resetGame}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700 font-semibold transition-colors"
              >
                重新開始
              </button>
            </div>
          </div>

          {/* 遊戲反饋 */}
          {gameFeedback.type && (
            <div className={`p-4 rounded-lg text-center font-semibold mb-6 relative z-[20] ${
              gameFeedback.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {gameFeedback.message}
            </div>
          )}

          {/* 遊戲區域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 成年動物區域 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-center text-gray-700">成年動物</h4>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {adultAnimals.map((animal, index) => {
                  const isMatched = matchedPairs.has(animal.young);
                  const isSelected = selectedAdult === animal.adult;
                  
                  return (
                    <div
                      key={`adult-${index}`}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isMatched
                          ? 'opacity-0 pointer-events-none' // 配對成功後消失
                          : isSelected
                          ? 'border-blue-500 bg-blue-100 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => handleAdultClick(animal.adult)}
                    >
                      <div className="text-5xl mb-2">{animal.adultImage}</div>
                      <div className="font-semibold text-gray-800 text-sm">{animal.adult}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 幼年動物區域 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-center text-gray-700">幼年動物</h4>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {youngAnimals.map((animal, index) => {
                  const isMatched = matchedPairs.has(animal.young);
                  const isSelected = selectedYoung === animal.young;
                  
                  return (
                    <div
                      key={`young-${index}`}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isMatched
                          ? 'opacity-0 pointer-events-none' // 配對成功後消失
                          : isSelected
                          ? 'border-blue-500 bg-blue-100 shadow-lg'
                          : 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md'
                      }`}
                      onClick={() => handleYoungClick(animal.young)}
                    >
                      <div className="text-5xl mb-2">{animal.youngImage}</div>
                      <div className="font-semibold text-gray-800 text-sm">{animal.young}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 遊戲說明 */}
          <div className="bg-blue-50 p-4 rounded-lg mt-8">
            <h4 className="font-semibold text-blue-800 mb-2">🎮 遊戲說明</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 先點擊一個幼年動物，再點擊對應的成年動物</li>
              <li>• 配對正確時會出現大大的圓圈 ⭕ 和動物叫聲</li>
              <li>• 配對錯誤時會出現大大的叉叉 ❌</li>
              <li>• 配對成功的卡片會消失</li>
              <li>• 完成所有配對即可獲勝！</li>
            </ul>
          </div>

          {/* 完成慶祝 */}
          {matchedPairs.size === gameAnimals.length && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white text-center mt-8">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">恭喜完成！</h3>
              <p>所有動物都找到自己的家人了！</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
