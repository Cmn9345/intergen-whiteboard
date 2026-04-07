"use client";
import React, { useState } from 'react';

export default function SheetsDiagnosisPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('正在測試連接...\n');
    
    try {
      // 測試1: 檢查API Key是否有效
      setTestResult(prev => prev + '1. 測試API Key...\n');
      const testResponse = await fetch('/api/members');
      const testData = await testResponse.json();
      
      if (testData.length === 0) {
        setTestResult(prev => prev + '❌ API返回空數據\n');
        setTestResult(prev => prev + '\n可能的原因：\n');
        setTestResult(prev => prev + '• Google Sheets未設為公開\n');
        setTestResult(prev => prev + '• Sheet ID不正確\n');
        setTestResult(prev => prev + '• API Key無效或過期\n');
        setTestResult(prev => prev + '• 數據範圍內沒有內容\n');
      } else {
        setTestResult(prev => prev + `✅ 成功載入 ${testData.length} 個成員\n`);
        setTestResult(prev => prev + JSON.stringify(testData, null, 2));
      }
    } catch (error: any) {
      setTestResult(prev => prev + `❌ 錯誤: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Google Sheets 診斷工具</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">當前設置</h2>
          <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
            <div><strong>Sheet ID:</strong> 1jjuy69SzQq2DNPw5YfDVQR8lxVhUEsoyk0dEXW9qGoY</div>
            <div><strong>API Key:</strong> AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ</div>
            <div><strong>Range:</strong> A1:E100</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">測試連接</h2>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '測試中...' : '開始測試'}
          </button>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">解決方案</h3>
          <div className="text-yellow-700 space-y-2">
            <div><strong>1. 檢查Google Sheets權限：</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• 打開您的Google Sheets</li>
              <li>• 點擊右上角的「共用」按鈕</li>
              <li>• 將權限設為「知道連結的任何人都可以檢視」</li>
              <li>• 複製連結確認Sheet ID正確</li>
            </ul>
            
            <div className="mt-4"><strong>2. 檢查數據格式：</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• A列：姓名</li>
              <li>• B列：組別（數字）</li>
              <li>• C列：顏色代碼（如 #e11d48）</li>
              <li>• D列：頭像URL</li>
              <li>• E列：組別圖標URL</li>
            </ul>
            
            <div className="mt-4"><strong>3. 範例數據：</strong></div>
            <div className="ml-4 bg-white p-2 rounded text-xs font-mono">
              林詩柔 | 1 | #e11d48 | /avatars/lin.jpg | /group-icons/group1.png<br/>
              張孟能 | 2 | #ea580c | /avatars/zhang.jpg | /group-icons/group2.png
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">測試頁面</h3>
          <div className="text-green-700">
            <p>您也可以訪問 <a href="/test-sheets" className="text-blue-600 underline">測試頁面</a> 來查看詳細的API響應。</p>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href="/checkin-tree" 
            className="inline-block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            返回簽到樹
          </a>
        </div>
      </div>
    </div>
  );
}
