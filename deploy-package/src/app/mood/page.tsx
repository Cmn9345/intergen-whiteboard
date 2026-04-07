"use client";

import React from "react";

type RangeKey = "難過" | "開心" | "生氣";

type Vote = {
  id: string;
  range: RangeKey;
  memberName: string;
  memberImageUrl?: string;
  memberGroup: number;
  memberColor: string;
  timestamp: string;
};

type Buckets = Record<RangeKey, Vote[]>;

const INITIAL_BUCKETS: Buckets = { "難過": [], "開心": [], "生氣": [] };

const RANGE_DESC: Record<RangeKey, string> = {
  "難過": "我今天心情非常不好",
  "開心": "我今天心情還不錯", 
  "生氣": "我今天心情超好",
};

const RANGE_COLORS: Record<RangeKey, { base: string; hover: string; selected: string }> = {
  "難過": { base: "", hover: "hover:bg-blue-200", selected: "bg-blue-300" },
  "開心": { base: "", hover: "hover:bg-yellow-200", selected: "bg-yellow-300" },
  "生氣": { base: "", hover: "hover:bg-red-200", selected: "bg-red-400" },
};

type Member = {
  group: number;
  name: string;
  color: string;
  imageUrl?: string;
  groupImageUrl?: string;
};

export default function Page() {
  const [buckets, setBuckets] = React.useState<Buckets>(INITIAL_BUCKETS);
  const [lastSelect, setLastSelect] = React.useState<RangeKey | null>(null);
  const [hasVotes, setHasVotes] = React.useState<boolean>(false);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showMemberPicker, setShowMemberPicker] = React.useState<boolean>(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [selectedRange, setSelectedRange] = React.useState<RangeKey | null>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');
  const [showLargeX, setShowLargeX] = React.useState<boolean>(false);
  const [isCleared, setIsCleared] = React.useState<boolean>(true); // 預設為已清除狀態

  // 移除時間剩餘計算功能

  // 移除24小時自動清除功能，數據永久保留

  // 頁面載入時強制清除所有數據
  React.useEffect(() => {
    console.log('頁面載入，強制清除所有心情溫度計數據');
    
    // 1. 清除所有投票數據和各區間統計
    setBuckets(INITIAL_BUCKETS);
    setHasVotes(false);
    setTimeRemaining('');
    setLastSelect(null);
    setSelectedMember(null);
    setSelectedRange(null);
    setIsCleared(true);
    
    // 2. 清除所有相關的 localStorage 項目
    localStorage.removeItem("moodThermometerVotes:v4");
    localStorage.removeItem("moodDataFromSheets");
    localStorage.removeItem("moodThermometerVotes:startTime");
    localStorage.removeItem("moodThermometerVotes:timestamp");
    
    // 3. 清除所有可能的心情相關數據
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('mood') || key.includes('thermometer'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('頁面載入時已清除所有心情溫度計數據，包括各區間統計');
    console.log(`已清除 ${keysToRemove.length} 個localStorage項目`);
  }, []); // 只在頁面載入時執行一次

  // 監聽來自管理儀表板的清除指令
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CLEAR_MOOD_DATA') {
        console.log('收到清除心情數據指令');
        
        // 1. 清除所有投票數據和各區間統計
        setBuckets(INITIAL_BUCKETS);
        setHasVotes(false);
        setTimeRemaining('');
        setLastSelect(null);
        setSelectedMember(null);
        setSelectedRange(null);
        setIsCleared(true); // 設置清除狀態
        
        // 2. 清除所有相關的 localStorage 項目
        localStorage.removeItem("moodThermometerVotes:v4");
        localStorage.removeItem("moodDataFromSheets");
        localStorage.removeItem("moodThermometerVotes:startTime");
        localStorage.removeItem("moodThermometerVotes:timestamp");
        
        // 3. 清除所有可能的心情相關數據
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('mood') || key.includes('thermometer'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('心情溫度計數據已清除，包括所有投票和各區間統計');
        console.log(`已清除 ${keysToRemove.length} 個localStorage項目`);
        
        // 4. 不要重新載入資料庫數據，因為我們就是要清除所有數據
        // 資料庫數據應該已經被管理頁面清除了
        console.log('心情溫度計介面已完全清除，不重新載入資料庫數據');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []); // 移除 loadMoodsFromDatabase 依賴項

  // 強制清除所有心情數據的函數
  const forceClearAllMoodData = React.useCallback(() => {
    console.log('強制清除所有心情數據');
    setBuckets(INITIAL_BUCKETS);
    setHasVotes(false);
    setTimeRemaining('');
    setLastSelect(null);
    
    // 清除所有相關的 localStorage 項目
    localStorage.removeItem("moodThermometerVotes:v4");
    localStorage.removeItem("moodDataFromSheets");
    
    // 清除所有可能的心情相關數據
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('mood') || key.includes('thermometer'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('所有心情數據已強制清除');
  }, []);

  // 檢查 URL 參數，如果有 clear=true，則強制清除
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear') === 'true') {
      forceClearAllMoodData();
      // 清除 URL 參數
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [forceClearAllMoodData]);

  // Load members from Google Sheets
  React.useEffect(() => {
    const loadMembersFromSheets = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          if (data.length > 0) {
            setSelectedMember(data[0]);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load members from Google Sheets:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadMembersFromSheets();
  }, []);

  // 從資料庫載入心情數據
  const loadMoodsFromDatabase = React.useCallback(async () => {
    try {
      const response = await fetch('/api/v1/moods');
      if (response.ok) {
        const data = await response.json();
        const moods = data.data || [];
        
        if (moods.length > 0) {
          // 將資料庫中的心情記錄轉換為 buckets 格式
          const databaseBuckets: Buckets = {
            "難過": [],
            "開心": [],
            "生氣": []
          };
          
          moods.forEach((mood: any) => {
            const range: RangeKey = mood.value === 1 ? "難過" : mood.value === 3 ? "開心" : "生氣";
            const vote: Vote = {
              id: mood.id,
              range: range,
              memberName: mood.user?.displayName || '未知用戶',
              memberImageUrl: undefined,
              memberGroup: 0,
              memberColor: '#e11d48',
              timestamp: new Date(mood.recordedAt).toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
            databaseBuckets[range].push(vote);
          });
          
          setBuckets(databaseBuckets);
          setHasVotes(true);
          console.log('從資料庫載入心情數據:', moods.length, '筆');
        }
      }
    } catch (error) {
      console.error('載入資料庫心情數據失敗:', error);
    }
  }, []);

  // 移除自動載入資料庫數據功能，確保不會載入任何歷史數據
  // React.useEffect(() => {
  //   if (members.length > 0 && !isCleared) {
  //     loadMoodsFromDatabase();
  //   }
  // }, [members.length, isCleared]);

  // 移除自動載入 localStorage 數據功能，確保不會載入任何歷史數據
  // React.useEffect(() => {
  //   // 如果已經有投票數據，就不載入 localStorage
  //   if (hasVotes) return;
  //   
  //   // 如果已經被清除，就不載入 localStorage
  //   if (isCleared) return;
  //   
  //   try {
  //     const raw = localStorage.getItem("moodThermometerVotes:v4");
  //     if (raw) {
  //       const parsed = JSON.parse(raw);
  //       if (parsed && typeof parsed === "object") {
  //         const keys: RangeKey[] = ["難過", "開心", "生氣"];
  //         if (keys.every((k) => Array.isArray(parsed[k]))) {
  //           setBuckets(parsed);
  //           // 檢查是否有任何投票
  //           const hasAnyVotes = keys.some((k) => parsed[k].length > 0);
  //           setHasVotes(hasAnyVotes);
  //         }
  //       }
  //     }
  //   } catch {}
  // }, []); // 移除 hasVotes 依賴項，避免無限循環

  // persist to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("moodThermometerVotes:v4", JSON.stringify(buckets));
    } catch {}
  }, [buckets]);

  const vote = async (bucket: RangeKey) => {
    if (!selectedMember) {
      alert('請先選擇成員');
      return;
    }
    
    // 重置清除狀態，允許新的投票操作
    setIsCleared(false);
    setHasVotes(false); // 確保可以開始新的投票
    
    // 檢查是否已經投票過
    const hasAlreadyVoted = Object.values(buckets).some(votes => 
      votes.some(vote => vote.memberName === selectedMember.name)
    );
    
    if (hasAlreadyVoted) {
      setShowLargeX(true);
      // 3秒後自動隱藏大叉叉
      setTimeout(() => {
        setShowLargeX(false);
      }, 3000);
      setShowMemberPicker(false);
      return;
    }
    
    const newVote: Vote = {
      id: Date.now().toString(),
      range: bucket,
      memberName: selectedMember.name,
      memberImageUrl: selectedMember.imageUrl,
      memberGroup: selectedMember.group,
      memberColor: selectedMember.color,
      timestamp: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
    
    setBuckets((prev) => ({ 
      ...prev, 
      [bucket]: [...prev[bucket], newVote] 
    }));
    setLastSelect(bucket);
    setHasVotes(true);
    setShowMemberPicker(false);

    // 移除開始時間設置，數據永久保留

    // 寫入到資料庫
    try {
      // 將心情類型轉換為數值
      const moodValue = bucket === '難過' ? 1 : bucket === '開心' ? 3 : 5;
      
      // 先創建或找到用戶
      let userId = null;
      try {
        // 嘗試找到現有用戶
        const userResponse = await fetch('/api/v1/users');
        const usersData = await userResponse.json();
        const existingUser = usersData.data.find((user: any) => user.displayName === selectedMember.name);
        
        if (existingUser) {
          userId = existingUser.id;
        } else {
          // 創建新用戶
          const createUserResponse = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: `${selectedMember.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
              passwordHash: 'mood_user_password',
              displayName: selectedMember.name,
              role: 'STUDENT'
            }),
          });
          
          if (createUserResponse.ok) {
            const newUser = await createUserResponse.json();
            userId = newUser.data.id;
            console.log('Created new user for mood voting:', newUser.data);
          }
        }
      } catch (userError) {
        console.error('Error handling user:', userError);
      }

      // 寫入心情記錄到資料庫
      if (userId) {
        const moodResponse = await fetch('/api/v1/moods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: moodValue,
            note: `心情投票: ${bucket}`,
            userId: userId
          }),
        });

        if (moodResponse.ok) {
          const moodData = await moodResponse.json();
          console.log('Successfully wrote mood to database:', moodData);
        } else {
          console.error('Failed to write mood to database:', await moodResponse.text());
        }
      }

      // 同時保持 localStorage 備份
      const moodDataKey = 'moodDataFromSheets';
      const existingData = localStorage.getItem(moodDataKey);
      const moodData = existingData ? JSON.parse(existingData) : { happy: [], sad: [], angry: [] };
      
      if (bucket === '開心') {
        moodData.happy.push(selectedMember.name);
      } else if (bucket === '難過') {
        moodData.sad.push(selectedMember.name);
      } else if (bucket === '生氣') {
        moodData.angry.push(selectedMember.name);
      }
      
      localStorage.setItem(moodDataKey, JSON.stringify(moodData));
      console.log(`Successfully wrote ${selectedMember.name} to ${bucket} column`);
      
    } catch (error) {
      console.error('Error writing mood data:', error);
    }
  };

  const handleRangeClick = (bucket: RangeKey) => {
    setSelectedRange(bucket);
    setShowMemberPicker(true);
  };

  // 移除reset函數，清除功能移到管理頁面

  return (
    <main className="min-h-screen bg-gray-100 grid place-items-center p-6 sm:p-10 relative">
      {/* 大叉叉圖案覆蓋層 */}
      {showLargeX && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
          <div className="text-red-500 text-[20rem] font-bold animate-pulse drop-shadow-2xl">
            ❌
          </div>
        </div>
      )}
      
      {/* 返回主頁按鈕 */}
      <a
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
        title="返回主頁"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium text-gray-700">返回主頁</span>
      </a>

      <div className="w-full max-w-none grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Thermometer */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">心情溫度計</h1>
              <p className="mt-1 text-sm text-gray-600">點擊溫度區間來回報今天的心情</p>
            </div>
            {timeRemaining && (
              <div className="text-blue-600 font-medium text-sm">
                統計剩餘: {timeRemaining}
              </div>
            )}
          </div>
          {/* legend inside thermometer - 3 columns layout (top of card) */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-lg text-gray-600">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😢</span>
              <span className="inline-block h-3 w-20 rounded-sm bg-blue-400" />
              <span className="text-xl font-medium">難過</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😊</span>
              <span className="inline-block h-3 w-20 rounded-sm bg-yellow-400" />
              <span className="text-xl font-medium">開心</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😡</span>
              <span className="inline-block h-3 w-20 rounded-sm bg-red-400" />
              <span className="text-xl font-medium">生氣</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative h-[28rem] w-28">
              {/* Bulb */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full border-2 border-gray-300 bg-red-500 shadow-sm" />
              {/* Tube */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[calc(100%-4rem)] w-8 rounded-full border-2 border-gray-300 overflow-hidden">
                {/* 生氣 (Red) */}
                <button
                  onClick={() => handleRangeClick("生氣")}
                  className={`group block h-1/3 w-full transition-all duration-200 focus:outline-none bg-red-400 hover:bg-red-500 ${
                    lastSelect === "生氣" ? "ring-2 ring-red-600 ring-offset-2" : ""
                  }`}
                  title={`生氣 = ${RANGE_DESC["生氣"]}`}
                >
                  <span className="sr-only">生氣</span>
                </button>
                {/* 開心 (Yellow) */}
                <button
                  onClick={() => handleRangeClick("開心")}
                  className={`group block h-1/3 w-full transition-all duration-200 focus:outline-none bg-yellow-400 hover:bg-yellow-500 ${
                    lastSelect === "開心" ? "ring-2 ring-yellow-600 ring-offset-2" : ""
                  }`}
                  title={`開心 = ${RANGE_DESC["開心"]}`}
                >
                  <span className="sr-only">開心</span>
                </button>
                {/* 難過 (Blue) */}
                <button
                  onClick={() => handleRangeClick("難過")}
                  className={`group block h-1/3 w-full transition-all duration-200 focus:outline-none bg-blue-400 hover:bg-blue-500 ${
                    lastSelect === "難過" ? "ring-2 ring-blue-600 ring-offset-2" : ""
                  }`}
                  title={`難過 = ${RANGE_DESC["難過"]}`}
                >
                  <span className="sr-only">難過</span>
                </button>
              </div>
              {/* scale labels (3 ticks) */}
              <div className="absolute inset-y-0 left-28 flex flex-col justify-between text-3xl">
                <div>😡</div>
                <div>😊</div>
                <div>😢</div>
              </div>
            </div>
          </div>

          

          {/* 清除按鈕已移到管理頁面 */}
        </div>

        {/* Stats - Vertical Bar Chart */
        }
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">各區間人數統計</h2>
          {/* legend inside stats - 3 columns layout with color bars (top of card) */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-[1.3125rem] text-gray-600">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😢</span>
              <span className="inline-block h-3 w-24 rounded-sm bg-blue-400" />
              <span className="text-xl font-medium">難過</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😊</span>
              <span className="inline-block h-3 w-24 rounded-sm bg-yellow-400" />
              <span className="text-xl font-medium">開心</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">😡</span>
              <span className="inline-block h-3 w-24 rounded-sm bg-red-400" />
              <span className="text-xl font-medium">生氣</span>
            </div>
          </div>
          {hasVotes ? (
            (() => {
              const order: RangeKey[] = ["難過", "開心", "生氣"];
              const total = order.reduce((sum, k) => sum + buckets[k].length, 0);
              
              // 只顯示有點擊的區間
              const clickedRanges = order.filter(k => buckets[k].length > 0);
              
              // 計算圓餅圖數據
              const pieData = clickedRanges.map((k, index) => {
                const count = buckets[k].length;
                const percentage = (count / total) * 100;
                const color = k === "難過" ? "#60a5fa" : 
                             k === "開心" ? "#facc15" : "#f87171";
                return {
                  key: k,
                  count,
                  percentage,
                  color,
                  startAngle: clickedRanges.slice(0, index).reduce((sum, prevK) => sum + (buckets[prevK].length / total) * 360, 0),
                  endAngle: clickedRanges.slice(0, index + 1).reduce((sum, prevK) => sum + (buckets[prevK].length / total) * 360, 0)
                };
              });
              
              return (
                <div className="mt-6">
                  <div className="flex items-center justify-center h-[28rem] border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-8">
                      {/* 圓餅圖 */}
                      <div className="relative" style={{ width: '450px', height: '450px' }}>
                        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                          {pieData.map((segment, index) => {
                            const radius = 80;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -clickedRanges.slice(0, index).reduce((sum, prevK) => sum + (buckets[prevK].length / total) * circumference, 0);
                            
                            return (
                              <circle
                                key={segment.key}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="40"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500 ease-in-out"
                              />
                            );
                          })}
                        </svg>
                        {/* 中心文字 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">{total}</div>
                            <div className="text-base text-gray-600">總投票數</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 圖例 */}
                      <div className="space-y-3">
                        {pieData.map((segment) => {
                          const emoji = segment.key === "難過" ? "😢" : 
                                       segment.key === "開心" ? "😊" : "😡";
                          const votes = buckets[segment.key];
                          return (
                            <div key={segment.key} className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{emoji}</span>
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: segment.color }}
                                />
                                <div className="text-lg text-gray-700">
                                  <span className="font-medium">{segment.key}</span>
                                  <span className="ml-2">
                                    {segment.count}票 ({segment.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                              {/* 顯示投票者信息 */}
                              <div className="ml-8 space-y-2">
                                {votes.map((vote) => (
                                  <div key={vote.id} className="flex items-center gap-2 text-sm">
                                    {vote.memberImageUrl ? (
                                      <img 
                                        src={vote.memberImageUrl} 
                                        alt={vote.memberName}
                                        className="h-6 w-6 rounded-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                    ) : null}
                                    <div 
                                      className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${vote.memberImageUrl ? 'hidden' : ''}`} 
                                      style={{ backgroundColor: vote.memberColor }} 
                                    >
                                      {vote.memberName.charAt(0)}
                                    </div>
                                    <span className="text-gray-600">{vote.memberName}</span>
                                    <span className="text-gray-400 text-xs">({vote.timestamp})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="mt-6 flex items-center justify-center h-[28rem] border-b border-gray-200 pb-6">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-lg font-medium">等待投票中...</div>
                <div className="text-sm">請在左側溫度計點擊來開始統計</div>
              </div>
            </div>
          )}
        </div>
        {/* (shared legend removed; legends live in each block) */}
      </div>

      {/* 成員選擇器模態框 */}
      {showMemberPicker && members.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">選擇投票成員</h3>
              <p className="text-sm text-gray-600">心情區間：{selectedRange}</p>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {members.map((member) => (
                <label key={member.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="member-picker"
                    value={member.name}
                    checked={selectedMember?.name === member.name}
                    onChange={() => setSelectedMember(member)}
                    className="text-blue-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div 
                      className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${member.imageUrl ? 'hidden' : ''}`} 
                      style={{ backgroundColor: member.color }} 
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">組別 {member.group}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMemberPicker(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => selectedRange && vote(selectedRange)}
                disabled={!selectedMember}
                className="rounded-md border border-green-300 bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                確認投票
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
