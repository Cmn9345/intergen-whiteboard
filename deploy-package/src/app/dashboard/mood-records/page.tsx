"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}

interface Mood {
  id: string;
  value: number;
  note?: string;
  recordedAt: string;
  user: User;
}

export default function MoodRecordsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 載入當天心情資料
  const loadTodayMoods = async () => {
    setLoading(true);
    setMessage('');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const moodsRes = await fetch('/api/v1/moods');
      if (!moodsRes.ok) {
        throw new Error('API 請求失敗');
      }

      const moodsData = await moodsRes.json();
      console.log('所有心情資料:', moodsData.data);
      console.log('今天日期:', today);
      
      const todayMoods = (moodsData.data || []).filter((mood: Mood) => {
        if (!mood.recordedAt) return false;
        const moodDate = new Date(mood.recordedAt).toISOString().split('T')[0];
        console.log('心情記錄日期:', moodDate, '是否匹配:', moodDate === today);
        return moodDate === today;
      });

      setMoods(todayMoods);
      console.log('載入今日心情資料成功:', todayMoods.length);
    } catch (error) {
      console.error('Error loading today moods:', error);
      setMessage('載入今日心情資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 刪除所有心情記錄（清除所有心情溫度計介面的投票和統計）
  const deleteAllTodayMoods = async () => {
    try {
      console.log('開始清除所有心情記錄...');
      
      // 1. 清除資料庫中的心情記錄
      try {
        // 先嘗試批量清除API
        const clearResponse = await fetch('/api/v1/moods', {
          method: 'DELETE',
        });

        if (!clearResponse.ok) {
          // 如果沒有專門的心情清除API，則逐個刪除
          console.log('使用逐個刪除方式清除資料庫記錄');
          for (const mood of moods) {
            await fetch(`/api/v1/moods/${mood.id}`, {
              method: 'DELETE',
            });
          }
        } else {
          console.log('使用批量清除API成功');
        }
      } catch (dbError) {
        console.error('清除資料庫記錄時發生錯誤:', dbError);
      }

      // 2. 清除 localStorage 中的心情相關記錄
      localStorage.removeItem("moodThermometerVotes:v4");
      localStorage.removeItem("moodDataFromSheets");
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
      console.log(`已清除 ${keysToRemove.length} 個localStorage項目`);

      // 3. 發送清除指令到心情溫度計頁面
      try {
        window.postMessage({
          type: 'CLEAR_MOOD_DATA',
          timestamp: Date.now()
        }, '*');
        console.log('已發送清除指令到心情溫度計頁面');
      } catch (error) {
        console.log('無法發送清除指令到心情溫度計頁面');
      }

      // 4. 重新載入當前的的心情記錄
      await loadTodayMoods();
      
      setMessage('所有心情記錄已清除，心情溫度計介面的投票和統計也已重置');
      setShowDeleteConfirm(false);
      console.log('心情記錄清除完成');
    } catch (error) {
      console.error('Error deleting moods:', error);
      setMessage('清除記錄時發生錯誤');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTodayMoods();
    }
  }, [isAuthenticated]);

  // 監聽刪除鍵，清除所有心情記錄
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 檢查是否按下刪除鍵 (Delete 或 Backspace)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 防止在輸入框中觸發
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        
        console.log('按下刪除鍵，清除所有心情記錄');
        
        // 直接執行清除操作，不需要確認對話框
        deleteAllTodayMoods();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moods]); // 依賴 moods 以確保使用最新的數據

  // 如果未登入，顯示登入提示
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">需要登入</h1>
          <p className="text-gray-600 mb-6">請先登入以訪問此功能</p>
          <div className="space-y-3">
            <a 
              href="/login" 
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              前往登入
            </a>
            <br />
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              返回主頁
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">今日心情紀錄</h1>
            <p className="text-gray-600 mt-2">歡迎，{user?.account}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 返回儀表板按鈕 */}
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium text-gray-700">返回儀表板</span>
            </Link>
            
            {/* 登出按鈕 */}
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">登出</span>
            </button>
          </div>
        </div>

        {/* 訊息顯示 */}
        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-800">
            {message}
          </div>
        )}

        {/* 心情記錄列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              今日心情投票記錄 ({moods.length})
            </h2>
            <button
              onClick={loadTodayMoods}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? '載入中...' : '重新載入'}
            </button>
          </div>

          {moods.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">😊</div>
              <div className="text-xl mb-2">今日尚無心情投票記錄</div>
              <div className="text-sm">請前往心情溫度計進行投票</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moods.map((mood) => {
                const moodEmoji = mood.value === 1 ? '😢' : mood.value === 3 ? '😊' : '😡';
                const moodText = mood.value === 1 ? '難過' : mood.value === 3 ? '開心' : '生氣';
                const moodColor = mood.value === 1 ? 'bg-blue-100 text-blue-800' : 
                                 mood.value === 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
                
                return (
                  <div key={mood.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-800">{mood.user.displayName}</div>
                      <div className="text-2xl">{moodEmoji}</div>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${moodColor}`}>
                      {moodText}
                    </div>
                    {mood.note && (
                      <div className="text-sm text-gray-600 mt-2">{mood.note}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(mood.recordedAt).toLocaleString('zh-TW')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 刪除按鈕 - 右下角固定位置 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="清除所有今日心情記錄"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* 刪除確認對話框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">確認清除</h3>
              <p className="text-gray-600 mb-6">
                您確定要清除所有今日心情記錄嗎？此操作無法復原。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={deleteAllTodayMoods}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  確認清除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
