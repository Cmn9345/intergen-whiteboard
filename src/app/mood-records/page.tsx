"use client";
import React, { useState, useEffect } from 'react';

type MoodRecord = {
  id: string;
  group: string | number;
  Name: string;
  emotional: string;
  weekend: string | number;
  created: string;
};

export default function MoodRecordsPage() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入 emotion_weather collection 的資料
  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emotion-weather');
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
        setError(null);
        console.log('載入心情記錄:', data.data?.length || 0, '筆');
      } else {
        throw new Error('API 請求失敗');
      }
    } catch (err) {
      console.error('Error loading mood records:', err);
      setError('無法載入心情記錄');
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
    }, {} as Record<string, MoodRecord[]>);
  }, [records]);

  // 統計信息
  const totalVotes = records.length;
  const uniqueMembers = React.useMemo(() => {
    return new Set(records.map(r => r.Name)).size;
  }, [records]);

  // 情緒統計
  const emotionStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    records.forEach(r => {
      const emotion = r.emotional || '未知';
      stats[emotion] = (stats[emotion] || 0) + 1;
    });
    return stats;
  }, [records]);

  // 清除畫面顯示（不刪除 PocketBase 資料）
  const clearDisplay = () => {
    if (window.confirm('確定要清除畫面上的心情記錄顯示嗎？\n（注意：資料仍保留在資料庫中）')) {
      setRecords([]);
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
  function EmotionIcon({ emotion, size = 20 }: { emotion: string; size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        {emotion === '開心' && <><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
        {emotion === '難過' && <><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
        {emotion === '生氣' && <><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><path d="M7.5 8 10 9"/><path d="M16.5 8 14 9"/></>}
        {!['開心', '難過', '生氣'].includes(emotion) && <><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
      </svg>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入心情記錄中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">心情記錄</h1>
          <p className="text-sm text-gray-500 mb-4">資料來源：PocketBase emotion_weather collection</p>

          {/* 總計統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
              <div className="text-sm text-blue-800">總投票次數</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{uniqueMembers}</div>
              <div className="text-sm text-green-800">已投票人數</div>
            </div>
          </div>

          {/* 情緒分布統計 */}
          {Object.keys(emotionStats).length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">情緒分布</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(emotionStats).map(([emotion, count]) => (
                  <div
                    key={emotion}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${getEmotionColor(emotion)}`}
                  >
                    <EmotionIcon emotion={emotion} size={24} />
                    <span className="font-medium">{emotion}</span>
                    <span className="font-bold">({count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 按組別顯示記錄 */}
        {Object.keys(recordsByGroup).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg></div>
            <div className="text-gray-600 text-xl mb-2">尚無心情記錄</div>
            <div className="text-gray-500">請前往心情溫度計進行投票</div>
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
                <div key={group} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">組別 {group}</h2>
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
                                <EmotionIcon emotion={record.emotional} size={18} />
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
