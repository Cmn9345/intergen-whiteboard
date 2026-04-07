"use client";
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();

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

        {/* 功能入口 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 心情紀錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">😊 心情紀錄</h2>
            <p className="text-gray-600 mb-4">查看心情投票記錄</p>
            <Link
              href="/dashboard/mood-records"
              className="w-full inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
            >
              查看心情紀錄
            </Link>
          </div>

          {/* 簽到紀錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🌳 簽到紀錄</h2>
            <p className="text-gray-600 mb-4">查看簽到記錄</p>
            <Link
              href="/dashboard/checkin-records"
              className="w-full inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
            >
              查看簽到紀錄
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}