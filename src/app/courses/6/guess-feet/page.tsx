"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 動物數據（依照檔名排序）
const animals = [
  { name: "斑馬", image: "/images/animal-feet/斑馬.png", feet: 4 },
  { name: "長頸鹿", image: "/images/animal-feet/長頸鹿.png", feet: 4 },
  { name: "兔子", image: "/images/animal-feet/兔子.png", feet: 4 },
  { name: "雞", image: "/images/animal-feet/雞.png", feet: 2 },
  { name: "鴨", image: "/images/animal-feet/鴨.png", feet: 2 },
  { name: "豬", image: "/images/animal-feet/豬.png", feet: 4 },
  { name: "台灣黑熊", image: "/images/animal-feet/熊.png", feet: 4 }, // 檔案名是熊.png
  { name: "大象", image: "/images/animal-feet/大象.png", feet: 4 },
  { name: "貓", image: "/images/animal-feet/貓.png", feet: 4 },
  { name: "狗", image: "/images/animal-feet/狗.png", feet: 4 },
];

const GAME_TIME = 30; // 30秒倒計時

export default function GuessFeetPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [selectedFeet, setSelectedFeet] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // 語音朗讀功能
  const speakText = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, []);

  // 開始遊戲
  const startGame = () => {
    setGameStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameEnded(false);
    setSelectedFeet(null);
    setShowResult(false);
    setImageError({});
  };

  // 倒計時
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setGameEnded(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameEnded]);

  // 選擇答案
  const handleSelect = (feet: number) => {
    if (gameEnded || showResult || !gameStarted || timeLeft <= 0) return;

    setSelectedFeet(feet);
    const currentAnimal = animals[currentIndex];
    const correct = feet === currentAnimal.feet;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    // 顯示結果後，1.5秒後進入下一題（循環題目）
    setTimeout(() => {
      if (timeLeft <= 0) {
        setGameEnded(true);
      } else {
        // 循環顯示題目，當達到最後一題時，回到第一題
        setCurrentIndex((prev) => (prev + 1) % animals.length);
        setSelectedFeet(null);
        setShowResult(false);
      }
    }, 1500);
  };

  // 滑鼠移到卡片上時朗讀
  const handleCardHover = (feet: number) => {
    speakText(`${feet}隻腳`);
  };

  const currentAnimal = animals[currentIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col relative">
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
          onClick={() => router.push('/courses/6')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('6')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('6')}</span>
        </button>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24">
        {!gameStarted ? (
          // 開始畫面
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl font-bold text-green-800 mb-6">🐾 猜猜我是誰</h1>
            <p className="text-xl text-gray-700 mb-8">
              看看動物的圖片，猜猜牠有幾隻腳！
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">遊戲說明</h2>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>看動物圖片，選擇牠有幾隻腳（2隻或4隻）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>答對一題得1分</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>滑鼠移到卡片上會朗讀腳的數量</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>限時30秒，盡可能答更多的題目（題目會循環顯示）</span>
                </li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🎮 開始遊戲
            </button>
          </div>
        ) : gameEnded ? (
          // 結束畫面
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl font-bold text-green-800 mb-6">🎉 遊戲結束！</h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">你的得分</h2>
              <div className="text-6xl font-bold text-green-600 mb-4">{score} 題</div>
              <p className="text-xl text-gray-600">
                在30秒內答對了 {score} 題！
              </p>
              <p className="text-lg text-gray-500 mt-2">
                {score >= 10 ? "太棒了！表現優異！" : score >= 5 ? "表現不錯！" : "繼續加油！"}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-200"
              >
                🔄 再玩一次
              </button>
              <button
                onClick={() => router.push('/courses/6')}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-200"
              >
                返回課程
              </button>
            </div>
          </div>
        ) : (
          // 遊戲進行中
          <div className="w-full max-w-4xl">
            {/* 計分和倒計時 */}
            <div className="flex justify-between items-center mb-8">
              <div className="bg-white rounded-xl shadow-lg px-6 py-3">
                <div className="text-sm text-gray-600">得分</div>
                <div className="text-3xl font-bold text-green-600">{score}</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-6 py-3">
                <div className="text-sm text-gray-600">剩餘時間</div>
                <div className="text-3xl font-bold text-blue-600">{timeLeft} 秒</div>
              </div>
            </div>

            {/* 動物圖片 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">猜猜這隻動物有幾隻腳？</h2>
              <div className="flex justify-center items-center min-h-[300px]">
                {currentAnimal && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {!imageError[currentIndex] ? (
                      <img
                        src={currentAnimal.image}
                        alt={currentAnimal.name}
                        className="max-w-full max-h-[400px] object-contain z-10 relative"
                        onError={() => {
                          // 如果圖片載入失敗，記錄錯誤狀態
                          setImageError((prev) => ({ ...prev, [currentIndex]: true }));
                        }}
                      />
                    ) : (
                      // 如果圖片載入失敗，顯示動物名稱
                      <div className="text-6xl font-bold text-gray-600 px-8 py-4 bg-gray-100 rounded-xl">
                        {currentAnimal.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 答案卡片 */}
            <div className="flex justify-center gap-6">
              {[2, 4].map((feet) => (
                <button
                  key={feet}
                  onClick={() => handleSelect(feet)}
                  onMouseEnter={() => handleCardHover(feet)}
                  disabled={showResult || gameEnded}
                  className={`
                    relative bg-white rounded-2xl shadow-xl p-8 flex-1 max-w-[300px] 
                    transition-all duration-200 transform
                    ${showResult
                      ? feet === currentAnimal.feet
                        ? 'ring-4 ring-green-500 bg-green-50 scale-105'
                        : selectedFeet === feet
                        ? 'ring-4 ring-red-500 bg-red-50 scale-105'
                        : ''
                      : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
                    }
                    ${showResult ? 'cursor-default' : ''}
                  `}
                >
                  <div className="text-6xl mb-4">🦶</div>
                  <div className="text-4xl font-bold text-gray-800">{feet} 隻腳</div>
                  {showResult && (
                    <>
                      {feet === currentAnimal.feet && (
                        <div className="absolute top-4 right-4 text-4xl">✅</div>
                      )}
                      {selectedFeet === feet && feet !== currentAnimal.feet && (
                        <div className="absolute top-4 right-4 text-4xl">❌</div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* 結果提示 */}
            {showResult && (
              <div className={`mt-6 text-center text-2xl font-bold ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect ? '🎉 答對了！' : '❌ 答錯了！'}
                <div className="text-xl text-gray-600 mt-2">
                  {currentAnimal.name}有 {currentAnimal.feet} 隻腳
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

