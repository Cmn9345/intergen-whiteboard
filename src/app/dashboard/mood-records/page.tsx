"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

type MoodRecord = {
  id: string;
  group: string | number;
  Name: string;
  emotional: string;
  weekend: string | number;
  created: string;
};

export default function MoodRecordsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 載入 emotion_temperature collection 的資料
  const loadRecords = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/emotion-temperature');
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
        console.log('載入心情記錄:', data.data?.length || 0, '筆');
      } else {
        throw new Error('API 請求失敗');
      }
    } catch (error) {
      console.error('Error loading mood records:', error);
      setMessage('載入心情記錄時發生錯誤');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRecords();
    }
  }, [isAuthenticated]);

  // 按組別分組記錄
  const recordsByGroup = React.useMemo(() => {
    return records.reduce((acc, record) => {
      const group = record.group?.toString() || '0';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(record);
      return acc;
    }, {} as Record<string, MoodRecord[]>);
  }, [records]);

  // 清除畫面顯示（不刪除 PocketBase 資料）
  const clearDisplay = () => {
    if (window.confirm('確定要清除畫面上的心情記錄顯示嗎？\n（注意：資料仍保留在資料庫中）')) {
      setRecords([]);
      setMessage('畫面已清除（資料仍保留在資料庫中）');
    }
  };

  // 情緒顏色映射
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case '開心':
        return 'bg-yellow-100 text-yellow-800';
      case '難過':
        return 'bg-blue-100 text-blue-800';
      case '生氣':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 情緒圖標
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case '開心':
        return '😊';
      case '難過':
        return '😢';
      case '生氣':
        return '😠';
      default:
        return '😐';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">心情記錄</h1>
            <p className="text-gray-600 mt-2">歡迎，{user?.account}</p>
            <p className="text-sm text-gray-500 mt-1">資料來源：PocketBase emotion_temperature collection</p>
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
              心情投票記錄 ({records.length})
            </h2>
            <button
              onClick={loadRecords}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? '載入中...' : '重新載入'}
            </button>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🌡️</div>
              <div className="text-xl mb-2">尚無心情記錄</div>
              <div className="text-sm">請前往心情溫度計進行投票</div>
              <a
                href="/mood"
                className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                前往心情溫度計
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(recordsByGroup)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([group, groupRecords]) => (
                  <div key={group} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">組別 {group}</h3>
                      <div className="text-sm text-gray-500">
                        {groupRecords.length} 人已投票
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">組別</th>
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">名字</th>
                            <th className="text-left py-2 px-3 text-gray-600 font-medium">情緒</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupRecords.map((record) => (
                            <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-3 text-gray-800">{record.group}</td>
                              <td className="py-3 px-3 text-gray-800 font-medium">{record.Name}</td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(record.emotional)}`}>
                                  <span>{getEmotionIcon(record.emotional)}</span>
                                  <span>{record.emotional}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}
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
            onClick={clearDisplay}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            清除畫面顯示
          </button>
        </div>
      </div>
    </main>
  );
}
