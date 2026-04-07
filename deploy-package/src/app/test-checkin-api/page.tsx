"use client";
import React, { useState } from 'react';

export default function TestCheckinApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPost = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group: 1,
          name: '測試用戶',
          status: '已簽到',
        }),
      });
      
      const data = await response.json();
      setResult({ method: 'POST', status: response.status, data });
    } catch (error) {
      setResult({ method: 'POST', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testGet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin-records');
      const data = await response.json();
      setResult({ method: 'GET', status: response.status, data });
    } catch (error) {
      setResult({ method: 'GET', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">簽到API測試頁面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API測試</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={testPost}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '測試中...' : '測試POST請求'}
            </button>
            <button
              onClick={testGet}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '測試中...' : '測試GET請求'}
            </button>
          </div>
          
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">結果：</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">說明</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• <strong>POST請求</strong>：測試寫入簽到記錄</p>
            <p>• <strong>GET請求</strong>：測試讀取簽到記錄</p>
            <p>• 目前使用本地存儲模擬Google Sheets功能</p>
            <p>• 在實際部署時可以替換為真實的數據庫或Google Sheets API</p>
          </div>
        </div>
      </div>
    </div>
  );
}
