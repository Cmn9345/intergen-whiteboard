"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

interface Emotion {
  emoji: string;
  text: string;
  color: string;
  angle: number;
}

export default function EmotionWheelPage() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // 五種情緒定義
  const emotions: Emotion[] = [
    { emoji: "😊", text: "開心", color: "#fbbf24", angle: 0 }, // yellow-400
    { emoji: "😨", text: "害怕", color: "#f87171", angle: 72 }, // red-400
    { emoji: "😢", text: "傷心", color: "#60a5fa", angle: 144 }, // blue-400
    { emoji: "😠", text: "生氣", color: "#dc2626", angle: 216 }, // red-600
    { emoji: "😲", text: "驚訝", color: "#a78bfa", angle: 288 } // purple-400
  ];

  // 文字轉語音功能
  const speakText = (text: string, onComplete?: () => void) => {
    console.log('嘗試朗讀:', text);
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 停止之前的朗讀
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.2; // 更快一點，像真人講話的節奏
      utterance.pitch = 1.4; // 音調更高，更有表情
      utterance.volume = 1.0; // 最大音量，更清晰
      
      utterance.onstart = () => {
        console.log('開始朗讀:', text);
        setIsReading(true);
      };
      
      utterance.onend = () => {
        console.log('朗讀結束:', text);
        setIsReading(false);
        if (onComplete) {
          onComplete();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('朗讀錯誤:', event);
        setIsReading(false);
        if (onComplete) {
          onComplete();
        }
      };
      
      try {
        speechSynthesis.speak(utterance);
        console.log('已發送朗讀請求');
      } catch (error) {
        console.error('朗讀失敗:', error);
        setIsReading(false);
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      console.log('瀏覽器不支援語音合成');
      setIsReading(false);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // 按順序朗讀多個文本
  const speakTextsInSequence = (texts: string[]) => {
    if (texts.length === 0) return;
    
    // 停止之前的朗讀
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsReading(true);
    
    const speakNext = (index: number) => {
      if (index >= texts.length) {
        setIsReading(false);
        return;
      }
      
      // 創建一個臨時的 speakText 調用，但不讓它自動設置讀取狀態
      const text = texts[index];
      console.log('嘗試朗讀:', text);
      
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-TW';
        utterance.rate = 1.2;
        utterance.pitch = 1.4;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
          console.log('朗讀結束:', text);
          // 當前文本讀完後，繼續讀下一個
          if (index + 1 < texts.length) {
            setTimeout(() => speakNext(index + 1), 300); // 短暫停頓後讀下一個
          } else {
            setIsReading(false);
          }
        };
        
        utterance.onerror = (event) => {
          console.error('朗讀錯誤:', event);
          if (index + 1 < texts.length) {
            setTimeout(() => speakNext(index + 1), 300);
          } else {
            setIsReading(false);
          }
        };
        
        try {
          speechSynthesis.speak(utterance);
          console.log('已發送朗讀請求');
        } catch (error) {
          console.error('朗讀失敗:', error);
          if (index + 1 < texts.length) {
            setTimeout(() => speakNext(index + 1), 300);
          } else {
            setIsReading(false);
          }
        }
      } else {
        console.log('瀏覽器不支援語音合成');
        setIsReading(false);
      }
    };
    
    speakNext(0);
  };

  // 轉盤旋轉功能
  const spinWheel = () => {
    if (isSpinning) return;
    
    try {
      setIsSpinning(true);
      setShowResult(false);
      setCurrentEmotion(null);
      
      // 隨機選擇一個情緒
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      // 計算旋轉角度（多轉幾圈 + 隨機角度）
      const baseRotation = 1800; // 5圈
      const randomRotation = Math.random() * 360;
      const finalRotation = baseRotation + randomRotation;
      
      // 應用旋轉動畫（確保在瀏覽器環境中）
      if (typeof window !== 'undefined') {
        const wheel = document.getElementById('emotion-wheel');
        if (wheel) {
          wheel.style.transform = `rotate(${finalRotation}deg)`;
        }
      }
      
      // 3秒後顯示結果
      setTimeout(() => {
        setCurrentEmotion(randomEmotion);
        setShowResult(true);
        setIsSpinning(false);
        
        // 播放語音提示 - 先朗讀情緒，再朗讀"什麼時候"
        setTimeout(() => {
          speakTextsInSequence([randomEmotion.text, "什麼時候"]);
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('轉盤旋轉錯誤:', error);
      setIsSpinning(false);
    }
  };

  // 重新轉動
  const resetWheel = () => {
    try {
      setShowResult(false);
      setCurrentEmotion(null);
      if (typeof window !== 'undefined') {
        const wheel = document.getElementById('emotion-wheel');
        if (wheel) {
          wheel.style.transform = 'rotate(0deg)';
        }
      }
    } catch (error) {
      console.error('重新轉動錯誤:', error);
    }
  };

  return (
    <main className="h-screen bg-gradient-to-br from-orange-50 to-pink-100 flex flex-col overflow-hidden relative">
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
          onClick={() => router.push('/courses/1')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('1')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('1')}</span>
        </button>
      </div>

      {/* 主要內容區域 - 可滾動 */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="w-full flex flex-col items-center min-h-0">
          {/* 轉盤區域 */}
          <div className="flex items-center justify-center w-full">
            <div className="relative flex items-center justify-center" style={{ width: 'min(70vw, 70vh)', height: 'min(70vw, 70vh)' }}>
              {/* 轉盤 - 使用視窗尺寸計算 */}
              <div 
                id="emotion-wheel"
                className="rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out relative overflow-hidden w-full h-full"
                style={{ 
                  transform: 'rotate(0deg)'
                }}
              >
                {/* 情緒扇形區域 - 使用SVG創建完美的圓餅圖 */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {emotions.map((emotion, index) => {
                    const startAngle = emotion.angle;
                    const endAngle = emotion.angle + 72;
                    const radius = 50;
                    const centerX = 50;
                    const centerY = 50;
                    
                    // 計算扇形路徑
                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);
                    
                    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                    
                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    return (
                      <g key={index}>
                        <path
                          d={pathData}
                          fill={emotion.color}
                        />
                        {/* emoji - 放在較內側 */}
                        <text
                          x={centerX + 18 * Math.cos(((startAngle + endAngle) / 2) * Math.PI / 180)}
                          y={centerY + 18 * Math.sin(((startAngle + endAngle) / 2) * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-white font-bold"
                          style={{ fontSize: '20px' }}
                        >
                          {emotion.emoji}
                        </text>
                        {/* 文字 - 放在emoji和邊框之間，避免被圓周遮擋 */}
                        <text
                          x={centerX + 36 * Math.cos(((startAngle + endAngle) / 2) * Math.PI / 180)}
                          y={centerY + 36 * Math.sin(((startAngle + endAngle) / 2) * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-white font-bold"
                          style={{ fontSize: '11px', fontWeight: 'bold' }}
                        >
                          {emotion.text}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* 指針 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="text-center my-6 flex-shrink-0 z-20">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-200 transform ${
                isSpinning
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105'
              }`}
            >
              {isSpinning ? '轉動中...' : '🎡 轉動轉盤'}
            </button>
            
            {showResult && (
              <button
                onClick={resetWheel}
                className="ml-4 px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors"
              >
                🔄 重新轉動
              </button>
            )}
          </div>

          {/* 結果顯示區域 */}
          {showResult && currentEmotion && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-4 flex-shrink-0 w-full max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl mb-4">{currentEmotion.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                轉到了：{currentEmotion.text}
              </h2>
              
              {/* 語音提示區域 */}
              <div className="bg-yellow-50 p-4 md:p-6 rounded-lg border border-yellow-200 mb-4 md:mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-2xl md:text-3xl">🕐</div>
                  <div className="text-2xl md:text-3xl">❓</div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-yellow-800 mb-2">什麼時候</h3>
                <p className="text-yellow-700 text-sm md:text-base">
                  什麼時候會有{currentEmotion.text}的情緒呢？讓我們一起討論吧！
                </p>
                {isReading && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                    <div className="animate-pulse">🔊</div>
                    正在朗讀...
                  </div>
                )}
              </div>

              {/* 討論提示 */}
              <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
                <h4 className="text-base md:text-lg font-bold text-blue-800 mb-3">💭 討論問題</h4>
                <ul className="text-left text-blue-600 space-y-2 text-sm md:text-base">
                  <li>• 什麼時候會感到{currentEmotion.text}？</li>
                  <li>• 這種情緒是什麼感覺？</li>
                  <li>• 當你感到{currentEmotion.text}時，你會怎麼做？</li>
                  <li>• 如何幫助別人處理{currentEmotion.text}的情緒？</li>
                </ul>
              </div>
            </div>
          </div>
        )}

          {/* 活動說明 - 需要滾動才能看到 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-[100vh] mb-8 w-full max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">🎯 活動說明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                  <p className="text-orange-700 text-sm md:text-base">點擊「轉動轉盤」按鈕開始遊戲</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                  <p className="text-orange-700 text-sm md:text-base">等待轉盤停止，看看轉到哪種情緒</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                  <p className="text-orange-700 text-sm md:text-base">聽語音提示「什麼時候」</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">4</div>
                  <p className="text-orange-700 text-sm md:text-base">討論什麼時候會有這種情緒</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">5</div>
                  <p className="text-orange-700 text-sm md:text-base">分享個人經驗和感受</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-orange-800 font-bold text-sm flex-shrink-0 mt-0.5">6</div>
                  <p className="text-orange-700 text-sm md:text-base">點擊「重新轉動」繼續遊戲</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
