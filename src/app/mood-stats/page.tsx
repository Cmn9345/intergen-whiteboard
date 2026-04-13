"use client";
import React, { useState, useEffect } from 'react';

type MoodData = {
  happy: string[];
  sad: string[];
  angry: string[];
};

export default function MoodStatsPage() {
  const [moodData, setMoodData] = useState<MoodData>({ happy: [], sad: [], angry: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // 移除時間剩餘計算功能

  // 移除24小時自動清除功能，數據永久保留

  useEffect(() => {
    const loadMoodData = () => {
      try {
        setLoading(true);
        
        // 移除過期檢查，數據永久保留
        
        const moodDataKey = 'moodDataFromSheets';
        const existingData = localStorage.getItem(moodDataKey);
        
        if (existingData) {
          const data = JSON.parse(existingData);
          setMoodData(data);
        } else {
          setMoodData({ happy: [], sad: [], angry: [] });
        }
        setError(null);
      } catch (err) {
        console.error('Error loading mood data:', err);
        setError('無法載入心情數據');
      } finally {
        setLoading(false);
      }
    };

    loadMoodData();
  }, []);

  // 定期檢查過期數據和更新剩餘時間
  // 移除定期更新功能

  // 監聽來自管理儀表板的清除指令
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CLEAR_MOOD_DATA') {
        console.log('收到清除心情數據指令');
        setMoodData({ happy: [], sad: [], angry: [] });
        setTimeRemaining('');
        
        // 清除所有相關的 localStorage 項目
        localStorage.removeItem("moodDataFromSheets");
        localStorage.removeItem("moodThermometerVotes:v4");
        localStorage.removeItem("moodThermometerVotes:startTime");
        localStorage.removeItem("moodThermometerVotes:timestamp");
        
        // 清除所有可能的心情相關數據
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('mood') || key.includes('thermometer'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('心情統計數據已清除，包括所有統計和圖表');
        console.log(`已清除 ${keysToRemove.length} 個localStorage項目`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入心情數據中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
          <div className="text-red-600 text-xl mb-2">載入失敗</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = moodData.happy.length + moodData.sad.length + moodData.angry.length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* 返回儀表板按鈕 */}
      <a 
        href="/dashboard" 
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
        title="返回儀表板"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium text-gray-700">返回儀表板</span>
      </a>

      <div className="max-w-6xl mx-auto pt-16">
        {/* 標題和統計 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">心情溫度計數據統計</h1>
            {timeRemaining && (
              <div className="text-blue-600 font-medium text-sm">
                統計剩餘: {timeRemaining}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{moodData.happy.length}</div>
              <div className="text-sm text-yellow-800">開心</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{moodData.sad.length}</div>
              <div className="text-sm text-blue-800">難過</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{moodData.angry.length}</div>
              <div className="text-sm text-red-800">生氣</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{totalVotes}</div>
              <div className="text-sm text-gray-800">總投票數</div>
            </div>
          </div>
        </div>

        {/* 各心情區間詳細數據 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 開心區間 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-yellow-500"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">開心</h2>
                <div className="text-sm text-gray-500">{moodData.happy.length} 人</div>
              </div>
            </div>
            
            {moodData.happy.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-gray-400 mb-2"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></div>
                <div>尚無投票</div>
              </div>
            ) : (
              <div className="space-y-2">
                {moodData.happy.map((name, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="font-medium text-gray-800">{name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 難過區間 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-blue-500"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">難過</h2>
                <div className="text-sm text-gray-500">{moodData.sad.length} 人</div>
              </div>
            </div>
            
            {moodData.sad.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-gray-400 mb-2"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></div>
                <div>尚無投票</div>
              </div>
            ) : (
              <div className="space-y-2">
                {moodData.sad.map((name, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="font-medium text-gray-800">{name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 生氣區間 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-red-500"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><path d="M7.5 8 10 9"/><path d="M16.5 8 14 9"/></svg></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">生氣</h2>
                <div className="text-sm text-gray-500">{moodData.angry.length} 人</div>
              </div>
            </div>
            
            {moodData.angry.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-gray-400 mb-2"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></div>
                <div>尚無投票</div>
              </div>
            ) : (
              <div className="space-y-2">
                {moodData.angry.map((name, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="font-medium text-gray-800">{name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="mt-8 flex justify-center gap-4">
          <a 
            href="/mood" 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            前往心情溫度計
          </a>
          <button 
            onClick={() => {
              if (window.confirm('確定要清除所有心情統計數據嗎？')) {
                localStorage.removeItem('moodDataFromSheets');
                localStorage.removeItem('moodThermometerVotes:v4');
                localStorage.removeItem('moodThermometerVotes:startTime');
                window.location.reload();
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            清除所有統計
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            重新整理
          </button>
        </div>
      </div>
    </div>
  );
}
