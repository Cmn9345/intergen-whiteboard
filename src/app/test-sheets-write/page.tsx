"use client";
import React, { useState } from 'react';

export default function TestSheetsWritePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testWriteToSheets = async () => {
    setLoading(true);
    setResult('');

    try {
      // 創建測試數據
      const testRecords = [
        {
          id: Date.now().toString(),
          group: 1,
          name: '測試用戶1',
          timestamp: new Date().toLocaleString('zh-TW'),
          status: '已簽到'
        },
        {
          id: (Date.now() + 1).toString(),
          group: 2,
          name: '測試用戶2',
          timestamp: new Date().toLocaleString('zh-TW'),
          status: '已簽到'
        }
      ];

      const response = await fetch('/api/checkin-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkinRecords: testRecords }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ 成功寫入Google Sheets!\n\n工作表名稱: ${data.sheetName}\n訊息: ${data.message}\n\n寫入的數據:\n${JSON.stringify(testRecords, null, 2)}`);
      } else {
        setResult(`❌ 寫入失敗!\n\n錯誤: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ 發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  const testReadFromSheets = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/checkin-sheets');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ 成功從Google Sheets讀取!\n\n讀取的數據:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ 讀取失敗!\n\n錯誤: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ 發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Google Sheets 寫入測試</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">測試功能</h2>
          
          <div className="space-y-4">
            <button
              onClick={testWriteToSheets}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '測試中...' : '測試寫入到Google Sheets'}
            </button>
            
            <button
              onClick={testReadFromSheets}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium ml-4"
            >
              {loading ? '測試中...' : '測試從Google Sheets讀取'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">測試結果</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← 返回主頁
          </a>
        </div>
      </div>
    </div>
  );
}
