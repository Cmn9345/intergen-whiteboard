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

interface Checkin {
  id: string;
  date: string;
  user: User;
}

export default function CheckinRecordsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 載入當天簽到資料
  const loadTodayCheckins = async () => {
    setLoading(true);
    setMessage('');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const checkinsRes = await fetch('/api/v1/checkins');
      if (!checkinsRes.ok) {
        throw new Error('API 請求失敗');
      }

      const checkinsData = await checkinsRes.json();
      console.log('所有簽到資料:', checkinsData.data);
      console.log('今天日期:', today);
      
      const todayCheckins = (checkinsData.data || []).filter((checkin: Checkin) => {
        if (!checkin.date) return false;
        const checkinDate = new Date(checkin.date).toISOString().split('T')[0];
        console.log('簽到記錄日期:', checkinDate, '是否匹配:', checkinDate === today);
        return checkinDate === today;
      });

      setCheckins(todayCheckins);
      console.log('載入今日簽到資料成功:', todayCheckins.length);
    } catch (error) {
      console.error('Error loading today checkins:', error);
      setMessage('載入今日簽到資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 刪除所有簽到記錄（只清除簽到樹資料和圖標）
  const deleteAllTodayCheckins = async () => {
    try {
      // 只刪除簽到記錄，不刪除心情記錄
      for (const checkin of checkins) {
        await fetch(`/api/v1/checkins/${checkin.id}`, {
          method: 'DELETE',
        });
      }

      // 清除 localStorage 中的簽到相關記錄
      localStorage.removeItem("checkinDataFromSheets");
      localStorage.removeItem("checkinTreeStamps:v2");
      localStorage.removeItem("checkinTreeStamps");
      localStorage.removeItem("checkinTreeStamps:startTime");
      localStorage.removeItem("checkinTreeStamps:timestamp");

      // 清除所有可能的簽到相關數據
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('checkin') || key.includes('stamp'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // 清除簽到樹畫面的數據
      try {
        // 發送清除指令到簽到樹頁面
        window.postMessage({
          type: 'CLEAR_CHECKIN_DATA',
          timestamp: Date.now()
        }, '*');
      } catch (error) {
        console.log('無法發送清除指令到簽到樹頁面');
      }

      // 重新載入當前的簽到記錄
      await loadTodayCheckins();
      
      setMessage('所有簽到記錄已清除，簽到樹畫面也已重置');
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting checkins:', error);
      setMessage('清除記錄時發生錯誤');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTodayCheckins();
    }
  }, [isAuthenticated]);

  // 監聽刪除鍵，清除所有簽到記錄
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 檢查是否按下刪除鍵 (Delete 或 Backspace)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 防止在輸入框中觸發
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        
        console.log('按下刪除鍵，清除所有簽到記錄');
        
        // 直接執行清除操作，不需要確認對話框
        deleteAllTodayCheckins();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkins]); // 依賴 checkins 以確保使用最新的數據

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
            <h1 className="text-3xl font-bold text-gray-800">今日簽到紀錄</h1>
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

        {/* 簽到記錄列表 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              今日簽到記錄 ({checkins.length})
            </h2>
            <button
              onClick={loadTodayCheckins}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? '載入中...' : '重新載入'}
            </button>
          </div>

          {checkins.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🌳</div>
              <div className="text-xl mb-2">今日尚無簽到記錄</div>
              <div className="text-sm">請前往簽到樹進行簽到</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checkins.map((checkin) => (
                <div key={checkin.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{checkin.user.displayName}</div>
                    <div className="text-2xl">🌳</div>
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已簽到
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(checkin.date).toLocaleString('zh-TW')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 刪除按鈕 - 右下角固定位置 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="清除所有今日簽到記錄"
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
                您確定要清除所有今日簽到記錄嗎？此操作無法復原。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={deleteAllTodayCheckins}
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
