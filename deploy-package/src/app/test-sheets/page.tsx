"use client";
import React, { useState, useEffect } from 'react';

export default function TestSheetsPage() {
  const [status, setStatus] = useState<string>('檢查中...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testGoogleSheets = async () => {
      try {
        setStatus('正在測試Google Sheets連接...');
        
        // 直接測試Google Sheets API
        const SHEET_ID = '1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY';
        const API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
        const RANGE = 'A1:E100';
        
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
        
        if (result.values && result.values.length > 0) {
          setStatus(`✅ 成功連接！找到 ${result.values.length} 行數據`);
        } else {
          setStatus('⚠️ 連接成功但沒有數據');
        }
        
      } catch (err: any) {
        setError(err.message);
        setStatus('❌ 連接失敗');
      }
    };

    testGoogleSheets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Google Sheets 連接測試</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">連接狀態</h2>
          <div className="text-lg">{status}</div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800 font-medium">錯誤詳情：</div>
              <div className="text-red-600 mt-2">{error}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">API 設置</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Sheet ID:</strong> 1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY</div>
            <div><strong>API Key:</strong> AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ</div>
            <div><strong>Range:</strong> A1:E100</div>
          </div>
        </div>

        {data && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">原始數據</h2>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto">
              <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Google Sheets 設置檢查清單</h3>
          <ul className="text-blue-700 space-y-1">
            <li>✅ 確認Sheet ID正確</li>
            <li>✅ 確認API Key有效</li>
            <li>🔍 檢查Google Sheets是否為公開（任何人都可以查看）</li>
            <li>🔍 檢查A1:E100範圍內是否有數據</li>
            <li>🔍 檢查第一行是否為標題行</li>
            <li>🔍 檢查數據格式：姓名, 組別, 顏色, 頭像URL, 組別圖標URL</li>
          </ul>
        </div>

        <div className="mt-6">
          <a 
            href="/checkin-tree" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            返回簽到樹
          </a>
        </div>
      </div>
    </div>
  );
}
