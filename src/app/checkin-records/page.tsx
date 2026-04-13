"use client";
import React, { useState, useEffect } from 'react';

type CheckinRecord = {
  id: string;
  group: string | number;
  Name: string;
  checkinstatus: string;
  weekend: string | number;
  created: string;
};

export default function CheckinRecordsPage() {
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入 signintree collection 的資料
  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/signinitree');
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
        setError(null);
        console.log('載入簽到記錄:', data.data?.length || 0, '筆');
      } else {
        throw new Error('API 請求失敗');
      }
    } catch (err) {
      console.error('Error loading checkin records:', err);
      setError('無法載入簽到記錄');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // 按組別分組記錄
  const recordsByGroup = React.useMemo(() => {
    return records.reduce((acc, record) => {
      const group = record.group?.toString() || '0';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(record);
      return acc;
    }, {} as Record<string, CheckinRecord[]>);
  }, [records]);

  // 統計信息
  const totalCheckins = records.length;
  const uniqueMembers = React.useMemo(() => {
    return new Set(records.map(r => r.Name)).size;
  }, [records]);

  // 清除畫面顯示（不刪除 PocketBase 資料）
  const clearDisplay = () => {
    if (window.confirm('確定要清除畫面上的簽到記錄顯示嗎？\n（注意：資料仍保留在資料庫中）')) {
      setRecords([]);
    }
  };

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
            onClick={loadRecords}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">簽到記錄</h1>
          <p className="text-sm text-gray-500 mb-4">資料來源：PocketBase signintree collection</p>
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
            <div className="text-gray-400 mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg></div>
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

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">組別</th>
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">名字</th>
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">簽到狀態</th>
                          <th className="text-left py-2 px-3 text-gray-600 font-medium">週次</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupRecords.map((record) => (
                          <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-3 text-gray-800">{record.group}</td>
                            <td className="py-3 px-3 text-gray-800 font-medium">{record.Name}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                record.checkinstatus === 'Yes'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {record.checkinstatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-600">第 {record.weekend} 週</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            onClick={clearDisplay}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            清除畫面顯示
          </button>
          <button
            onClick={loadRecords}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            重新載入
          </button>
        </div>
      </div>
    </div>
  );
}
