"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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

interface Checkin {
  id: string;
  date: string;
  user: User;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'mood' | 'checkin'>('mood');

  // 載入當天資料
  const loadTodayData = async () => {
    setLoading(true);
    setMessage(''); // 清除之前的錯誤訊息
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const [moodsRes, checkinsRes] = await Promise.all([
        fetch('/api/v1/moods'),
        fetch('/api/v1/checkins')
      ]);

      if (!moodsRes.ok || !checkinsRes.ok) {
        throw new Error('API 請求失敗');
      }

      const [moodsData, checkinsData] = await Promise.all([
        moodsRes.json(),
        checkinsRes.json()
      ]);

      // 篩選當天的資料
      const todayMoods = (moodsData.data || []).filter((mood: Mood) => {
        if (!mood.recordedAt) return false;
        const moodDate = new Date(mood.recordedAt).toISOString().split('T')[0];
        console.log('篩選心情:', moodDate, 'vs', today, '=', moodDate === today);
        return moodDate === today;
      });
      
      const todayCheckins = (checkinsData.data || []).filter((checkin: Checkin) => {
        if (!checkin.date) return false;
        const checkinDate = new Date(checkin.date).toISOString().split('T')[0];
        console.log('篩選簽到:', checkinDate, 'vs', today, '=', checkinDate === today);
        return checkinDate === today;
      });

      setMoods(todayMoods);
      setCheckins(todayCheckins);
      console.log('載入今日資料成功:', { todayMoods: todayMoods.length, todayCheckins: todayCheckins.length });
    } catch (error) {
      console.error('Error loading today data:', error);
      setMessage('載入今日資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTodayData();
    }
  }, [isAuthenticated]);

  // 如果未登入，顯示登入提示
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">需要登入</h1>
          <p className="text-gray-600 mb-6">請先登入以訪問管理功能</p>
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
            <h1 className="text-3xl font-bold text-gray-800">管理儀表板</h1>
            <p className="text-gray-600 mt-2">歡迎，{user?.account}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 返回主頁按鈕 */}
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium text-gray-700">返回主頁</span>
            </a>
            
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

        {/* 今日資料統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 心情紀錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">😊 心情紀錄</h2>
              <span className="text-2xl font-bold text-blue-600">{moods.length}</span>
            </div>
            <p className="text-gray-600 mb-4">今日心情投票記錄</p>
            <Link
              href="/dashboard/mood-records"
              className="w-full inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
            >
              查看今日心情紀錄
            </Link>
          </div>

          {/* 簽到紀錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">🌳 簽到紀錄</h2>
              <span className="text-2xl font-bold text-green-600">{checkins.length}</span>
            </div>
            <p className="text-gray-600 mb-4">今日簽到記錄</p>
            <Link
              href="/dashboard/checkin-records"
              className="w-full inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
            >
              查看今日簽到紀錄
            </Link>
          </div>
        </div>

        {/* 訊息顯示 */}
        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-800">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}