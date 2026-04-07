"use client";
import React, { useState, useEffect } from 'react';

type CheckinRecord = {
  timestamp: string;
  group: number;
  name: string;
  status: string;
};

export default function CheckinRecordsPage() {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = () => {
      try {
        setLoading(true);
        
        // 直接從localStorage讀取簽到樹數據
        const checkinDataKey = 'checkinDataFromSheets';
        const existingData = localStorage.getItem(checkinDataKey);
        
        if (existingData) {
          const data = JSON.parse(existingData);
          setRecords(data);
          setError(null);
        } else {
          setRecords([]);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading checkin records:', err);
        setError('無法載入簽到記錄');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  // 按組別分組記錄
  const recordsByGroup = React.useMemo(() => {
    return records.reduce((acc, record) => {
      if (!acc[record.group]) {
        acc[record.group] = [];
      }
      acc[record.group].push(record);
      return acc;
    }, {} as Record<number, CheckinRecord[]>);
  }, [records]);

  // 統計信息
  const totalCheckins = records.length;
  const uniqueMembers = React.useMemo(() => {
    return new Set(records.map(r => r.name)).size;
  }, [records]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入簽到記錄中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-600 text-xl mb-2">載入失敗</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      {/* 返回儀表板按鈕 */}
      <a 
        href="/dashboard" 
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
        title="返回儀表板"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium text-gray-700">返回儀表板</span>
      </a>
      <div className="max-w-6xl mx-auto">
        {/* 標題和統計 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">今日簽到記錄</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCheckins}</div>
              <div className="text-sm text-blue-800">總簽到次數</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{uniqueMembers}</div>
              <div className="text-sm text-green-800">已簽到人數</div>
            </div>
          </div>
        </div>

        {/* 按組別顯示記錄 */}
        {Object.keys(recordsByGroup).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <div className="text-gray-600 text-xl mb-2">尚無簽到記錄</div>
            <div className="text-gray-500">請前往簽到樹進行簽到</div>
            <a 
              href="/checkin-tree" 
              className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              前往簽到樹
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(recordsByGroup)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([group, groupRecords]) => (
                <div key={group} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">組別 {group}</h2>
                    <div className="text-sm text-gray-500">
                      {groupRecords.length} 人已簽到
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {groupRecords
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((record, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">✓</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{record.name}</div>
                              <div className="text-sm text-gray-500">{record.timestamp}</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {record.status}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="mt-8 flex justify-center gap-4">
          <a 
            href="/checkin-tree" 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            前往簽到樹
          </a>
          <button 
            onClick={async () => {
              if (window.confirm('確定要清除所有簽到記錄嗎？此操作將清除簽到樹上的所有圖標和資料庫記錄，且無法復原。')) {
                try {
                  // 1. 清除資料庫中的簽到記錄
                  const response = await fetch('/api/v1/checkins');
                  if (response.ok) {
                    const data = await response.json();
                    const checkins = data.data || [];
                    
                    // 刪除所有簽到記錄
                    for (const checkin of checkins) {
                      await fetch(`/api/v1/checkins/${checkin.id}`, {
                        method: 'DELETE',
                      });
                    }
                    console.log(`已清除 ${checkins.length} 筆資料庫簽到記錄`);
                  }
                } catch (dbError) {
                  console.error('清除資料庫記錄時發生錯誤:', dbError);
                }

                // 2. 清除 localStorage 中的簽到相關記錄
                localStorage.removeItem('checkinDataFromSheets');
                localStorage.removeItem('checkinTreeStamps:v2');
                localStorage.removeItem('checkinTreeStamps');
                localStorage.removeItem('checkinTreeStamps:startTime');
                localStorage.removeItem('checkinTreeStamps:timestamp');
                
                // 清除所有可能的簽到相關數據
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && (key.includes('checkin') || key.includes('stamp'))) {
                    keysToRemove.push(key);
                  }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));

                // 3. 發送清除指令到簽到樹頁面
                try {
                  window.postMessage({
                    type: 'CLEAR_CHECKIN_DATA',
                    timestamp: Date.now()
                  }, '*');
                  console.log('已發送清除指令到簽到樹頁面');
                } catch (error) {
                  console.log('無法發送清除指令到簽到樹頁面');
                }

                // 4. 顯示成功訊息並重新載入頁面
                alert('所有簽到記錄已清除，簽到樹畫面也已重置！');
                window.location.reload();
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            清除所有記錄
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            重新整理
          </button>
        </div>
      </div>
    </div>
  );
}
