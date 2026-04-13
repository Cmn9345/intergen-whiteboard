"use client";

import React, { useState } from 'react';

export default function ExternalAPIDocs() {
  const [activeTab, setActiveTab] = useState('moods');

  const tabs = [
    { id: 'moods', label: '心情記錄 API', icon: '♡' },
    { id: 'checkins', label: '簽到記錄 API', icon: '●' },
    { id: 'analytics', label: '分析數據 API', icon: '◆' },
  ];

  const moodExamples = {
    get: `// 獲取心情記錄
GET http://localhost:3002/api/external/moods?userId=USER_ID&limit=10&offset=0

// 查詢參數:
// - userId: 用戶ID (可選)
// - courseId: 課程ID (可選)
// - startDate: 開始日期 (YYYY-MM-DD)
// - endDate: 結束日期 (YYYY-MM-DD)
// - limit: 每頁數量 (預設100)
// - offset: 偏移量 (預設0)`,

    post: `// 創建心情記錄
POST http://localhost:3002/api/external/moods
Content-Type: application/json

{
  "value": 8,
  "note": "今天心情很好！",
  "userId": "USER_ID",
  "courseId": "COURSE_ID",
  "sessionId": "SESSION_123",
  "deviceInfo": "iPhone 15 Pro",
  "location": "台北市"
}

// 必要欄位: value (1-10), userId
// 可選欄位: note, courseId, sessionId, deviceInfo, location`
  };

  const checkinExamples = {
    get: `// 獲取簽到記錄
GET http://localhost:3002/api/external/checkins?userId=USER_ID&status=PRESENT

// 查詢參數:
// - userId: 用戶ID (可選)
// - courseId: 課程ID (可選)
// - startDate: 開始日期 (YYYY-MM-DD)
// - endDate: 結束日期 (YYYY-MM-DD)
// - status: 簽到狀態 (PRESENT, LATE, ABSENT)
// - checkinType: 簽到類型 (MANUAL, AUTO, QR_CODE)
// - limit: 每頁數量 (預設100)
// - offset: 偏移量 (預設0)`,

    post: `// 創建簽到記錄
POST http://localhost:3002/api/external/checkins
Content-Type: application/json

{
  "userId": "USER_ID",
  "courseId": "COURSE_ID",
  "date": "2024-01-15T09:00:00Z",
  "sessionId": "SESSION_123",
  "deviceInfo": "iPhone 15 Pro",
  "location": "台北市",
  "checkinType": "MANUAL",
  "status": "PRESENT",
  "notes": "準時到達"
}

// 必要欄位: userId
// 可選欄位: courseId, date, sessionId, deviceInfo, location, checkinType, status, notes`
  };

  const analyticsExamples = {
    summary: `// 獲取摘要統計
GET http://localhost:3002/api/external/analytics?type=summary&userId=USER_ID

// 查詢參數:
// - type: 分析類型 (summary, trends, stats)
// - userId: 用戶ID (可選)
// - courseId: 課程ID (可選)
// - startDate: 開始日期 (YYYY-MM-DD)
// - endDate: 結束日期 (YYYY-MM-DD)`,

    trends: `// 獲取趨勢數據
GET http://localhost:3002/api/external/analytics?type=trends&startDate=2024-01-01&endDate=2024-01-31`,

    stats: `// 獲取詳細統計
GET http://localhost:3002/api/external/analytics?type=stats&courseId=COURSE_ID`
  };

  const responseExample = {
    success: `{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}`,

    error: `{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}`
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            外部 API 文檔
          </h1>
          <p className="text-gray-600 mb-8">
            供 localhost:4000 應用程式使用的 API 端點文檔
          </p>

          {/* 標籤頁 */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 內容區域 */}
          <div className="space-y-8">
            {activeTab === 'moods' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">心情記錄 API</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">GET - 獲取心情記錄</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {moodExamples.get}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">POST - 創建心情記錄</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {moodExamples.post}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checkins' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">簽到記錄 API</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">GET - 獲取簽到記錄</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {checkinExamples.get}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">POST - 創建簽到記錄</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {checkinExamples.post}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">分析數據 API</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">摘要統計 (summary)</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {analyticsExamples.summary}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">趨勢數據 (trends)</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {analyticsExamples.trends}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">詳細統計 (stats)</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {analyticsExamples.stats}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 回應格式 */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 回應格式</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-green-600 mb-3">成功回應</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {responseExample.success}
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-red-600 mb-3">錯誤回應</h4>
                  <pre className="bg-gray-900 text-red-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {responseExample.error}
                  </pre>
                </div>
              </div>
            </div>

            {/* 使用說明 */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💡 使用說明</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Base URL:</strong> http://localhost:3002/api/external/</li>
                  <li>• <strong>Content-Type:</strong> application/json</li>
                  <li>• <strong>日期格式:</strong> ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)</li>
                  <li>• <strong>分頁:</strong> 使用 limit 和 offset 參數</li>
                  <li>• <strong>過濾:</strong> 支援多種查詢參數進行數據過濾</li>
                  <li>• <strong>錯誤處理:</strong> 所有錯誤都會返回標準化的錯誤格式</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}




























