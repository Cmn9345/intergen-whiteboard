"use client";
import React from "react";
import { getStudents, getStudentName, type Student } from "@/lib/api";

type Stamp = { 
  xRatio?: number; 
  yRatio?: number; 
  color: string; 
  timestamp?: string; 
  name?: string; 
  imageUrl?: string;
  x?: number;
  y?: number;
};

export default function SimpleCheckinTreePage() {
  const [members, setMembers] = React.useState<Student[]>([]);
  const [stamps, setStamps] = React.useState<Stamp[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedName, setSelectedName] = React.useState<string>("");
  const [showPicker, setShowPicker] = React.useState<boolean>(false);
  const [now, setNow] = React.useState<Date>(new Date());
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<boolean>(false);
  const [successMemberName, setSuccessMemberName] = React.useState<string>('');

  // 時鐘更新
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 載入 PocketBase 學生名單
  React.useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const data = await getStudents();
        setMembers(data);
        if (data.length > 0) {
          setSelectedName(getStudentName(data[0]));
        }
      } catch (error) {
        console.error('Failed to load students:', error);
        setMembers([]);
        setSelectedName("");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // 點擊樹木進行簽到
  const handleTreeClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (members.length === 0) {
      alert('請等待組員名單載入完成');
      return;
    }
    
    // 打開成員選擇器
    setShowPicker(true);
  };

  // 簽到功能
  const onSign = async () => {
    if (members.length === 0 || !selectedName) {
      alert('請等待分組名單載入完成');
      return;
    }
    
    const member = members.find((m) => getStudentName(m) === selectedName);
    if (!member) {
      alert('找不到選中的成員');
      return;
    }

    const memberName = getStudentName(member);

    // 檢查是否已經簽到過
    const hasAlreadySignedIn = stamps.some(stamp => stamp.name === memberName);
    if (hasAlreadySignedIn) {
      alert('該成員已經簽到過了！');
      return;
    }

    try {
      const ts = formatZhTimestamp(new Date());

      // 更新本地狀態
      setStamps((prev) => [...prev, {
        color: '#2D5DA1',
        name: memberName,
        timestamp: ts,
      }]);
      setShowPicker(false);

      // 顯示成功訊息
      setSuccessMemberName(memberName);
      setShowSuccessMessage(true);
      
      // 1秒後自動隱藏
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    } catch (error) {
      console.error('Error during checkin:', error);
      alert('簽到過程中發生錯誤，請重試。');
    }
  };

  const signedNames = React.useMemo(() => new Set((stamps || []).map((s) => s.name).filter(Boolean) as string[]), [stamps]);
  const GROUP_IDS = React.useMemo(() => Array.from(new Set(members.map((m) => m.group))).sort(), [members]);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* 成功提示視窗 */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-lg font-medium animate-pulse">
            ✅ {successMemberName} 簽到成功！
          </div>
        </div>
      )}

      {/* 時間顯示 */}
      <div className="fixed left-4 top-4 z-50 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
        <div>{now.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</div>
        <div className="text-gray-600">{now.toLocaleTimeString("zh-TW", { hour12: false })}</div>
        <div className="text-xs text-gray-500 mt-1">
          已簽到: {stamps.length} 人
        </div>
      </div>
      
      {/* 返回主頁按鈕 */}
      <a 
        href="/" 
        className="fixed left-4 top-28 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
        title="返回主頁"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium text-gray-700">返回主頁</span>
      </a>

      {/* 主要內容區域 */}
      <div className="h-screen flex items-center justify-center p-4">
        <div className="w-full h-full max-w-7xl">
          <div className="w-full h-full rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative bg-black">
            {/* 樹木圖片 - 可點擊 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/user-tree.svg?v=1" 
                alt="簽到樹" 
                className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity object-contain"
                onClick={handleTreeClick}
                style={{ maxWidth: '80%', maxHeight: '80%' }}
              />
            </div>

            {/* 簽到圖標顯示 */}
            {stamps.map((stamp, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${50 + (index % 3 - 1) * 10}%`,
                    top: `${40 + (index % 4) * 5}%`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg"
                      style={{ backgroundColor: stamp.color }}
                    >
                      {stamp.name?.charAt(0)}
                    </div>
                    <div className="text-xs text-white bg-black bg-opacity-50 px-1 rounded mt-1 text-center">
                      {stamp.name}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* 成員選擇器模態框 */}
      {showPicker && members.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[600px] h-[600px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg overflow-y-auto">
            <div className="text-lg font-semibold text-gray-800 mb-4">選擇簽到成員</div>
            <div className="space-y-3">
              {members.map((m) => {
                const mName = getStudentName(m);
                return (
                <label key={m.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="picker-member"
                    value={mName}
                    checked={selectedName === mName}
                    onChange={() => setSelectedName(mName)}
                    className="text-blue-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-blue-500"
                    >
                      {mName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg text-gray-900 flex items-center justify-between">
                        <span>{mName}</span>
                        <span className="text-sm text-gray-500">第 {m.group} 組</span>
                      </div>
                    </div>
                    {signedNames.has(mName) && (
                      <div className="text-green-600 text-lg">✓</div>
                    )}
                  </div>
                </label>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onSign}
                disabled={!selectedName}
                className="rounded-md border border-green-300 bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                確認簽到
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatZhTimestamp(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${month}月${day}日${hour}時${minute}分`;
}
