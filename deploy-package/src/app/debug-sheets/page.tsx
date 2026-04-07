"use client";
import React, { useState } from 'react';

export default function DebugSheetsPage() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runDebug = async () => {
    setIsLoading(true);
    setDebugInfo('開始診斷...\n\n');
    
    try {
      // 測試1: 檢查Sheet ID格式
      setDebugInfo(prev => prev + '1. 檢查Sheet ID格式...\n');
      const sheetId = '1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY';
      if (sheetId.length === 44) {
        setDebugInfo(prev => prev + '✅ Sheet ID格式正確 (44個字符)\n');
      } else {
        setDebugInfo(prev => prev + `❌ Sheet ID格式錯誤 (${sheetId.length}個字符)\n`);
      }

      // 測試2: 檢查API Key格式
      setDebugInfo(prev => prev + '\n2. 檢查API Key格式...\n');
      const apiKey = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
      if (apiKey.startsWith('AIza') && apiKey.length === 39) {
        setDebugInfo(prev => prev + '✅ API Key格式正確\n');
      } else {
        setDebugInfo(prev => prev + `❌ API Key格式錯誤 (${apiKey.length}個字符)\n`);
      }

      // 測試3: 嘗試不同的API端點
      setDebugInfo(prev => prev + '\n3. 測試API端點...\n');
      
      const endpoints = [
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`,
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:E10?key=${apiKey}`,
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:E10?key=${apiKey}`
      ];

      for (let i = 0; i < endpoints.length; i++) {
        try {
          setDebugInfo(prev => prev + `測試端點 ${i + 1}...\n`);
          const response = await fetch(endpoints[i]);
          setDebugInfo(prev => prev + `狀態碼: ${response.status}\n`);
          
          if (response.ok) {
            const data = await response.json();
            setDebugInfo(prev => prev + `✅ 成功! 數據: ${JSON.stringify(data).substring(0, 200)}...\n`);
            break;
          } else {
            const errorText = await response.text();
            setDebugInfo(prev => prev + `❌ 失敗: ${errorText.substring(0, 100)}...\n`);
          }
        } catch (error: any) {
          setDebugInfo(prev => prev + `❌ 錯誤: ${error.message}\n`);
        }
      }

      // 測試4: 檢查Google Sheets URL
      setDebugInfo(prev => prev + '\n4. 檢查Google Sheets URL...\n');
      const expectedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
      setDebugInfo(prev => prev + `預期URL: ${expectedUrl}\n`);
      setDebugInfo(prev => prev + '請確認這個URL可以正常訪問\n');

    } catch (error: any) {
      setDebugInfo(prev => prev + `❌ 診斷過程出錯: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Google Sheets 詳細診斷</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">當前設置</h2>
          <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
            <div><strong>Sheet ID:</strong> 1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY</div>
            <div><strong>API Key:</strong> AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ</div>
            <div><strong>預期URL:</strong> <a href="https://docs.google.com/spreadsheets/d/1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY/edit" target="_blank" className="text-blue-600 underline">https://docs.google.com/spreadsheets/d/1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY/edit</a></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">運行診斷</h2>
          <button
            onClick={runDebug}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '診斷中...' : '開始診斷'}
          </button>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">403錯誤解決步驟</h3>
          <div className="text-red-700 space-y-2">
            <div><strong>步驟1: 確認Google Sheets存在</strong></div>
            <ul className="ml-4 space-y-1 text-sm">
              <li>• 點擊上面的連結確認可以訪問Google Sheets</li>
              <li>• 如果無法訪問，請檢查Sheet ID是否正確</li>
            </ul>
            
            <div className="mt-4"><strong>步驟2: 設置權限</strong></div>
            <ul className="ml-4 space-y-1 text-sm">
              <li>• 在Google Sheets中點擊右上角「共用」</li>
              <li>• 將權限設為「知道連結的任何人都可以檢視」</li>
              <li>• 或者設為「知道連結的任何人都可以編輯」</li>
              <li>• 確保「不限制」選項被選中</li>
            </ul>
            
            <div className="mt-4"><strong>步驟3: 檢查API Key</strong></div>
            <ul className="ml-4 space-y-1 text-sm">
              <li>• 確認API Key是從Google Cloud Console獲取的</li>
              <li>• 確認API Key已啟用Google Sheets API</li>
              <li>• 檢查API Key是否有使用限制</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">替代方案</h3>
          <div className="text-green-700">
            <p>如果Google Sheets API持續有問題，我們可以：</p>
            <ul className="ml-4 space-y-1 text-sm mt-2">
              <li>• 使用CSV文件上傳功能</li>
              <li>• 創建手動輸入界面</li>
              <li>• 使用其他數據源</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 space-x-4">
          <a 
            href="/checkin-tree" 
            className="inline-block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            返回簽到樹
          </a>
          <a 
            href="/sheets-diagnosis" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            基本診斷
          </a>
        </div>
      </div>
    </div>
  );
}
