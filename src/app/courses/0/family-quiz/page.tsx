"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 家庭成員角色定義
interface FamilyMember {
  id: string;
  name: string;
  emoji: string;
  image: string;
  color: string;
  description: string;
  characteristics: {
    hair: string;
    wrinkles: string;
    glasses: string;
    clothing: string;
    accessories: string;
  };
}

const familyMembers: FamilyMember[] = [
  {
    id: "mom",
    name: "媽媽",
    emoji: "👩",
    image: "/images/family/媽媽.png",
    color: "bg-pink-100 border-pink-300",
    description: "年輕成年女性",
    characteristics: {
      hair: "深色頭髮（黑/棕），髮型較為現代",
      wrinkles: "臉部光滑，年輕",
      glasses: "可能戴著時尚眼鏡",
      clothing: "居家服或上班套裝",
      accessories: "可能戴著項鍊或手錶"
    }
  },
  {
    id: "dad",
    name: "爸爸",
    emoji: "👨",
    image: "/images/family/爸爸.png",
    color: "bg-blue-100 border-blue-300",
    description: "成年男性",
    characteristics: {
      hair: "短髮，整齊",
      wrinkles: "臉部線條較為剛毅",
      glasses: "可能戴著眼鏡",
      clothing: "襯衫或T恤",
      accessories: "可能戴著手錶"
    }
  },
  {
    id: "grandma",
    name: "奶奶/外婆",
    emoji: "👵",
    image: "/images/family/奶奶.png",
    color: "bg-purple-100 border-purple-300",
    description: "年長女性",
    characteristics: {
      hair: "銀灰色或白色頭髮，可能有捲髮或髮髻",
      wrinkles: "臉部有溫和的皺紋",
      glasses: "常戴著老花眼鏡",
      clothing: "溫暖的針織衫或帶有圍裙",
      accessories: "可能戴著項鍊或手鐲"
    }
  },
  {
    id: "grandpa",
    name: "爺爺/外公",
    emoji: "👴",
    image: "/images/family/爺爺.png",
    color: "bg-gray-100 border-gray-300",
    description: "年長男性",
    characteristics: {
      hair: "花白或稀疏頭髮",
      wrinkles: "臉部皺紋較多",
      glasses: "可能戴著老花眼鏡",
      clothing: "襯衫或毛衣",
      accessories: "可能拿著茶杯、報紙或拐杖"
    }
  },
  {
    id: "brother",
    name: "哥哥",
    emoji: "👦",
    image: "/images/family/brother.avif",
    color: "bg-green-100 border-green-300",
    description: "青少年男性",
    characteristics: {
      hair: "現代髮型",
      wrinkles: "年輕的臉龐",
      glasses: "可能戴著眼鏡",
      clothing: "休閒服或校服",
      accessories: "可能背著書包"
    }
  },
  {
    id: "sister",
    name: "姊姊",
    emoji: "👧",
    image: "/images/family/姐姐.png",
    color: "bg-yellow-100 border-yellow-300",
    description: "青少年女性",
    characteristics: {
      hair: "現代髮型",
      wrinkles: "年輕的臉龐",
      glasses: "可能戴著眼鏡",
      clothing: "休閒服或校服",
      accessories: "可能背著書包"
    }
  },
  {
    id: "younger_brother",
    name: "弟弟",
    emoji: "👶",
    image: "/images/family/弟弟.png",
    color: "bg-cyan-100 border-cyan-300",
    description: "兒童男性",
    characteristics: {
      hair: "可愛的髮型",
      wrinkles: "稚嫩的臉龐",
      glasses: "可能戴著可愛的眼鏡",
      clothing: "可愛的童裝",
      accessories: "可能拿著玩具"
    }
  },
  {
    id: "younger_sister",
    name: "妹妹",
    emoji: "👧",
    image: "/images/family/妹妹.png",
    color: "bg-rose-100 border-rose-300",
    description: "兒童女性",
    characteristics: {
      hair: "可愛的髮型，可能有髮飾",
      wrinkles: "稚嫩的臉龐",
      glasses: "可能戴著可愛的眼鏡",
      clothing: "可愛的童裝",
      accessories: "可能拿著玩具或娃娃"
    }
  }
];

// 干擾選項生成邏輯
const getDistractors = (correctAnswer: FamilyMember): FamilyMember[] => {
  const allMembers = familyMembers.filter(member => member.id !== correctAnswer.id);
  
  // 優先選擇性別相同或輩份相近的
  const sameGender = allMembers.filter(member => {
    const correctGender = correctAnswer.id.includes('mom') || correctAnswer.id.includes('grandma') || correctAnswer.id.includes('sister') ? 'female' : 'male';
    const memberGender = member.id.includes('mom') || member.id.includes('grandma') || member.id.includes('sister') ? 'female' : 'male';
    return correctGender === memberGender;
  });
  
  // 如果同性的選項不夠，再從其他選項中選擇
  const distractors = sameGender.length >= 2 ? sameGender.slice(0, 2) : [
    ...sameGender,
    ...allMembers.filter(member => !sameGender.includes(member)).slice(0, 2 - sameGender.length)
  ];
  
  return distractors.slice(0, 2);
};

export default function FamilyQuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<FamilyMember | null>(null);
  const [options, setOptions] = useState<FamilyMember[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [currentReadingOption, setCurrentReadingOption] = useState<string | null>(null);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  // 生成新題目
  const generateNewQuestion = () => {
    const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
    const distractors = getDistractors(randomMember);
    const allOptions = [randomMember, ...distractors];
    
    // 隨機打亂選項順序
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion(randomMember);
    setOptions(shuffledOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowNextButton(false);
    setIsAnimating(false);
  };

  // 檢查語音合成支援
  useEffect(() => {
    console.log('檢查語音合成支援...');
    if ('speechSynthesis' in window) {
      console.log('✅ 瀏覽器支援語音合成');
      console.log('可用語音:', speechSynthesis.getVoices().length);
    } else {
      console.log('❌ 瀏覽器不支援語音合成');
    }
  }, []);

  // 初始化
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // 處理答案選擇
  const handleAnswerSelect = (memberId: string) => {
    if (showResult) return;
    
    setSelectedAnswer(memberId);
    setIsAnimating(true);
    
    const correct = memberId === currentQuestion?.id;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setQuestionCount(prev => prev + 1);
    
    // 延遲顯示下一題按鈕
    setTimeout(() => {
      setShowNextButton(true);
      setIsAnimating(false);
    }, 1500);
  };

  // 文字轉語音功能
  const speakText = (text: string) => {
    // 清理文字，移除特殊符號，讓語音更自然
    const cleanText = text.replace(/[/]/g, '').replace(/[()（）]/g, '').replace(/[、，,]/g, '');
    console.log('嘗試朗讀:', text, '-> 清理後:', cleanText);
    
    if ('speechSynthesis' in window) {
      // 停止之前的朗讀
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'zh-TW'; // 設定為繁體中文
      utterance.rate = 1.2; // 更快一點，像真人講話的節奏
      utterance.pitch = 1.4; // 音調更高，更有表情
      utterance.volume = 1.0; // 最大音量，更清晰
      
      utterance.onstart = () => {
        console.log('開始朗讀:', cleanText);
        setIsReading(true);
      };
      
      utterance.onend = () => {
        console.log('朗讀結束:', cleanText);
        setIsReading(false);
      };
      
      utterance.onerror = (event) => {
        console.error('朗讀錯誤:', event);
        setIsReading(false);
      };
      
      // 嘗試朗讀
      try {
        speechSynthesis.speak(utterance);
        console.log('已發送朗讀請求');
      } catch (error) {
        console.error('朗讀失敗:', error);
        setIsReading(false);
      }
    } else {
      console.log('瀏覽器不支援語音合成');
      setIsReading(false);
    }
  };

  // 游標停留在選項上時朗讀（1秒延遲）
  const handleOptionHover = (optionId: string) => {
    // 清除之前的計時器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    
    const option = options.find(o => o.id === optionId);
    if (option) {
      console.log('游標停留在:', option.name, '開始1秒計時...');
      
      // 設置1秒延遲
      const timer = setTimeout(() => {
        console.log('1秒計時結束，開始朗讀:', option.name);
        setCurrentReadingOption(option.id);
        speakText(option.name);
        setHoverTimer(null);
      }, 1000);
      
      setHoverTimer(timer);
    }
  };

  // 游標離開選項時取消朗讀
  const handleOptionLeave = () => {
    if (hoverTimer) {
      console.log('游標離開，取消朗讀計時');
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setCurrentReadingOption(null);
  };

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

  // 處理音效播放
  useEffect(() => {
    if (showResult) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
  }, [showResult, isCorrect]);

  // 下一題
  const handleNextQuestion = () => {
    // 清除懸停計時器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    generateNewQuestion();
  };

  // 重新開始
  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    // 清除懸停計時器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    generateNewQuestion();
  };

  // 組件卸載時清理計時器
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative">
      {/* 返回按鈕 */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title="返回主頁"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs font-medium text-gray-700">返回主頁</span>
        </button>
        
        <button
          onClick={() => router.push('/courses/3')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('3')}課程`}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs font-medium text-gray-700">返回{getWeekTitle('3')}</span>
        </button>
      </div>

      <div className="w-full h-screen flex flex-col">
        {/* 標題和分數 */}
        <div className="text-center pt-10 pb-3 px-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-blue-800 mb-1">🎯 這是誰？</h1>
          <p className="text-blue-700 text-sm mb-2">家庭成員指認問答遊戲</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-blue-700 font-semibold text-sm">分數：{score}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-blue-700 font-semibold text-sm">題數：{questionCount}</span>
            </div>
          </div>
        </div>

        {/* 遊戲區域 - 填滿剩餘空間 */}
        <div className="flex-1 bg-white rounded-t-3xl shadow-xl p-4 md:p-6 overflow-y-auto flex flex-col">
          {currentQuestion && (
            <div className="flex flex-col min-h-full">
              {/* 角色圖片區域 */}
              <div className="text-center mb-6 flex-shrink-0 flex flex-col justify-center">
                <div className={`inline-block p-10 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg transition-all duration-500 ${
                  isAnimating ? (isCorrect ? 'scale-110 animate-bounce' : 'animate-pulse') : ''
                }`}>
                  <div className="flex items-center justify-center">
                    <img 
                      src={currentQuestion.image} 
                      alt={currentQuestion.name}
                      className="object-contain"
                      style={{ width: '240px', height: '240px' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="text-8xl hidden">{currentQuestion.emoji}</div>
                  </div>
                </div>
                
                {/* 朗讀狀態指示和測試按鈕 */}
                <div className="mt-4 space-y-2">
                  {isReading && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                      <div className="animate-pulse">🔊</div>
                      正在朗讀選項...
                    </div>
                  )}
                  
                  {/* 測試語音按鈕 */}
                  <div>
                    <button
                      onClick={() => {
                        console.log('手動測試語音');
                        speakText('測試語音功能');
                      }}
                      className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      🎤 測試語音
                    </button>
                  </div>
                </div>
              </div>

              {/* 選項卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 flex-shrink-0">
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrectAnswer = option.id === currentQuestion.id;
                  const isWrongSelected = isSelected && !isCorrectAnswer;
                  const isCurrentlyReading = currentReadingOption === option.id;
                  
                  let cardClass = `p-6 rounded-2xl border-4 text-center transition-all duration-300 transform hover:scale-105 shadow-lg ${option.color} `;
                  
                  if (showResult) {
                    if (isCorrectAnswer) {
                      cardClass += "border-green-400 shadow-lg ring-4 ring-green-200 animate-pulse";
                    } else if (isWrongSelected) {
                      cardClass += "border-red-400 shadow-lg ring-4 ring-red-200 animate-bounce";
                    } else {
                      cardClass += "border-gray-300 opacity-50";
                    }
                  } else if (isCurrentlyReading) {
                    // 朗讀時的高亮效果
                    cardClass += "border-blue-400 shadow-lg ring-4 ring-blue-200 animate-pulse scale-105";
                  } else {
                    cardClass += "hover:shadow-md";
                  }
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      onMouseEnter={() => handleOptionHover(option.id)}
                      onMouseLeave={handleOptionLeave}
                      className={cardClass}
                      disabled={showResult}
                    >
                      <div className="mx-auto mb-4 flex items-center justify-center">
                        <img 
                          src={option.image} 
                          alt={option.name}
                          className="object-contain"
                          style={{ width: '140px', height: '140px' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-5xl hidden">{option.emoji}</div>
                      </div>
                      <div className="font-bold text-gray-800 text-xl">{option.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* 結果回饋 */}
              {showResult && (
                <div className="text-center mb-6 flex-shrink-0">
                  <div className={`text-2xl font-bold mb-2 ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCorrect ? '🎉 答對了！' : '❌ 答錯了'}
                  </div>
                  <p className="text-gray-600 text-base">
                    {isCorrect 
                      ? `這是${currentQuestion.name}！` 
                      : `正確答案是：${currentQuestion.name}`
                    }
                  </p>
                </div>
              )}

              {/* 下一題按鈕 */}
              {showNextButton && (
                <div className="text-center mb-6 flex-shrink-0">
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    ➡️ 下一題
                  </button>
                </div>
              )}

              {/* 重新開始按鈕 */}
              <div className="text-center mb-8 flex-shrink-0">
                <button
                  onClick={handleRestart}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors"
                >
                  🔄 重新開始
                </button>
              </div>

              {/* 遊戲說明 - 放在滾動區域底部，需要滾動才能看到 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 mt-12 mb-8 shadow-lg flex-shrink-0">
                <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">🎮 遊戲說明</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                      <p className="text-blue-700 text-sm">觀察圖片中的角色特徵</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                      <p className="text-blue-700 text-sm">將游標停留在選項上1秒會自動朗讀</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">3</div>
                      <p className="text-blue-700 text-sm">點擊你認為正確的稱謂</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">4</div>
                      <p className="text-blue-700 text-sm">答對會聽到成功音效</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">5</div>
                      <p className="text-blue-700 text-sm">游標離開選項會停止朗讀</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0 mt-0.5">6</div>
                      <p className="text-blue-700 text-sm">點擊「下一題」繼續遊戲</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
