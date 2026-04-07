"use client";
import React, { useState } from 'react';

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '概覽' },
    { id: 'authentication', label: '認證' },
    { id: 'endpoints', label: 'API 端點' },
    { id: 'examples', label: '使用範例' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">API 文檔</h1>
        
        {/* 返回主頁按鈕 */}
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 mb-6"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回主頁</span>
        </a>

        {/* 標籤導航 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 內容區域 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">API 概覽</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">基礎 URL</h3>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    https://your-app-url/api/v1
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">支援的格式</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>JSON (application/json)</li>
                    <li>UTF-8 編碼</li>
                    <li>RESTful API 設計</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">速率限制</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>每分鐘 100 次請求</li>
                    <li>每小時 1000 次請求</li>
                    <li>超過限制將返回 429 狀態碼</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'authentication' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">認證方式</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">API Key 認證</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">在請求標頭中添加 API Key:</p>
                    <div className="font-mono text-sm">
                      X-API-Key: your-api-key-here
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Bearer Token 認證</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">在 Authorization 標頭中添加 Bearer Token:</p>
                    <div className="font-mono text-sm">
                      Authorization: Bearer your-token-here
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ 安全提醒</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 請妥善保管您的 API Key 和 Token</li>
                    <li>• 不要在客戶端代碼中暴露認證信息</li>
                    <li>• 定期更換 API Key 和 Token</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">API 端點</h2>
              <div className="space-y-8">
                {/* 健康檢查 */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">GET</span>
                    <code className="text-lg font-mono">/api/health</code>
                  </div>
                  <p className="text-gray-600 mb-3">系統健康檢查，無需認證</p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>回應範例:</strong>
                    <pre className="mt-2 text-xs">{`{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": { "status": "healthy" },
    "api": { "status": "healthy" }
  }
}`}</pre>
                  </div>
                </div>

                {/* 用戶 API */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                    <code className="text-lg font-mono">/api/v1/users</code>
                  </div>
                  <p className="text-gray-600 mb-3">獲取用戶列表，需要認證</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>查詢參數:</strong></div>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      <li>page: 頁碼 (預設: 1)</li>
                      <li>limit: 每頁數量 (預設: 10)</li>
                      <li>role: 用戶角色篩選</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
                    <code className="text-lg font-mono">/api/v1/users</code>
                  </div>
                  <p className="text-gray-600 mb-3">創建新用戶，需要認證</p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>請求體範例:</strong>
                    <pre className="mt-2 text-xs">{`{
  "email": "user@example.com",
  "passwordHash": "hashed-password",
  "displayName": "用戶名稱",
  "role": "STUDENT"
}`}</pre>
                  </div>
                </div>

                {/* 課程 API */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                    <code className="text-lg font-mono">/api/v1/courses</code>
                  </div>
                  <p className="text-gray-600 mb-3">獲取課程列表，需要認證</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>查詢參數:</strong></div>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      <li>page: 頁碼 (預設: 1)</li>
                      <li>limit: 每頁數量 (預設: 10)</li>
                      <li>active: 只顯示活躍課程 (true/false)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">使用範例</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">JavaScript/Node.js</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`// 使用 fetch API
const response = await fetch('https://your-app-url/api/v1/users', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Python</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`import requests

headers = {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://your-app-url/api/v1/users',
    headers=headers
)

data = response.json()
print(data)`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">cURL</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`# 獲取用戶列表
curl -X GET "https://your-app-url/api/v1/users" \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json"

# 創建新用戶
curl -X POST "https://your-app-url/api/v1/users" \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "passwordHash": "hashed-password",
    "displayName": "用戶名稱",
    "role": "STUDENT"
  }'`}</pre>
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



