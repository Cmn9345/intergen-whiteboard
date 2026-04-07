"use client";
import React from "react";

type Stamp = { xRatio?: number; yRatio?: number; color: string; timestamp?: string; name?: string; imageUrl?: string };

type Member = {
  group: number;
  name: string;
  color: string;
  imageUrl?: string;
  groupImageUrl?: string;
};

// 默認成員數據，僅在Google Sheets載入失敗時使用
const DEFAULT_MEMBERS: Member[] = [];

export default function Page() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [selectedName, setSelectedName] = React.useState<string>("");
  const [stamps, setStamps] = React.useState<Stamp[]>([]);
  const [now, setNow] = React.useState<Date>(new Date());
  const [members, setMembers] = React.useState<Member[]>(DEFAULT_MEMBERS);
  const [loading, setLoading] = React.useState<boolean>(true);
  const GROUP_IDS = React.useMemo(() => Array.from(new Set(members.map((m) => m.group))).sort((a,b)=>a-b), [members]);
  const [groupIdx, setGroupIdx] = React.useState<number>(0);
  const [showPicker, setShowPicker] = React.useState<boolean>(false);
  const signedNames = React.useMemo(() => new Set((stamps || []).map((s) => s.name).filter(Boolean) as string[]), [stamps]);
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<boolean>(false);
  const [successMemberName, setSuccessMemberName] = React.useState<string>('');
  const [isCleared, setIsCleared] = React.useState<boolean>(false);
  const [showLargeX, setShowLargeX] = React.useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<boolean>(false);

  // 移除時間剩餘計算功能

  // 移除24小時自動清除功能，數據永久保留

  // clock
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 移除定期檢查過期數據功能

  // Load members from Google Sheets
  React.useEffect(() => {
    const loadMembersFromSheets = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          // 設置第一個成員為預設選擇
          if (data.length > 0) {
            setSelectedName(data[0].name);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load members from Google Sheets:', error);
        // 如果API調用失敗，使用空數組
        setMembers(DEFAULT_MEMBERS);
        setSelectedName("");
      } finally {
        setLoading(false);
      }
    };

    loadMembersFromSheets();
  }, []);

  // 從資料庫載入簽到數據
  const loadCheckinsFromDatabase = React.useCallback(async () => {
    try {
      const response = await fetch('/api/v1/checkins');
      if (response.ok) {
        const data = await response.json();
        const checkins = data.data || [];
        
        // 將資料庫中的簽到記錄轉換為 stamps 格式
        const databaseStamps: Stamp[] = checkins.map((checkin: any) => {
          const member = members.find(m => m.name === checkin.user?.displayName);
          return {
            color: member?.color || '#e11d48',
            name: checkin.user?.displayName || '未知用戶',
            timestamp: new Date(checkin.date).toLocaleString('zh-TW'),
            imageUrl: member?.imageUrl
          };
        });
        
        // 如果資料庫中有數據，使用資料庫數據
        if (databaseStamps.length > 0) {
          setStamps(databaseStamps);
          console.log('從資料庫載入簽到數據:', databaseStamps.length, '筆');
        } else {
          // 如果資料庫沒有數據，確保 stamps 為空
          setStamps([]);
          console.log('資料庫中沒有簽到數據');
        }
      }
    } catch (error) {
      console.error('載入資料庫簽到數據失敗:', error);
      // 發生錯誤時，不改變現有的 stamps 狀態
    }
  }, [members]);

  // 當成員載入完成後，載入資料庫中的簽到數據
  React.useEffect(() => {
    if (members.length > 0 && !isCleared) {
      loadCheckinsFromDatabase();
    }
  }, [members.length, isCleared]); // 移除 loadCheckinsFromDatabase 依賴項

  // load persisted data (僅在沒有資料庫數據時使用)
  React.useEffect(() => {
    // 如果已經有 stamps 數據（來自資料庫），就不載入 localStorage
    if (stamps.length > 0) return;
    
    // 如果已經被清除，不要載入 localStorage 數據
    if (isCleared) return;
    
    try {
      const rawV2 = localStorage.getItem("checkinTreeStamps:v2");
      const rawV1 = localStorage.getItem("checkinTreeStamps");
      const raw = rawV2 ?? rawV1;
      if (!raw) return;
      
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        // 檢查是否有開始時間戳記（第一次簽到的時間）
        let startTime = localStorage.getItem("checkinTreeStamps:startTime");
        
        // 如果沒有開始時間，使用第一個簽到記錄的時間
        if (!startTime && data.length > 0) {
          // 從第一個簽到記錄中提取時間
          const firstStamp = data[0];
          if (firstStamp.timestamp) {
            // 將中文時間格式轉換為Date對象
            const timeStr = firstStamp.timestamp;
            const match = timeStr.match(/(\d{2})月(\d{2})日(\d{2})時(\d{2})分/);
            if (match) {
              const [, month, day, hour, minute] = match;
              const currentYear = new Date().getFullYear();
              const startDate = new Date(currentYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
              startTime = startDate.toISOString();
              localStorage.setItem("checkinTreeStamps:startTime", startTime);
            }
          }
        }
        
        // 移除24小時過期檢查，數據永久保留
        
        setStamps(data);
      }
    } catch (error) {
      console.error('Error loading persisted stamps:', error);
    }
  }, [stamps.length]);

  // 監聽來自管理儀表板的清除指令
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CLEAR_CHECKIN_DATA') {
        console.log('收到清除簽到數據指令');
        setStamps([]);
        setTimeRemaining('');
        setIsCleared(true); // 設置清除狀態，保持清除狀態
        localStorage.removeItem("checkinTreeStamps:v2");
        localStorage.removeItem("checkinTreeStamps");
        localStorage.removeItem("checkinTreeStamps:startTime");
        localStorage.removeItem("checkinTreeStamps:timestamp");
        localStorage.removeItem("checkinDataFromSheets");
        console.log('簽到樹數據已清除，所有簽到狀態已重置');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 強制清除所有數據的函數
  const forceClearAllData = React.useCallback(() => {
    console.log('強制清除所有簽到數據');
    setStamps([]);
    setTimeRemaining('');
    setIsCleared(true);
    
    // 清除所有相關的 localStorage 項目
    localStorage.removeItem("checkinTreeStamps:v2");
    localStorage.removeItem("checkinTreeStamps");
    localStorage.removeItem("checkinTreeStamps:startTime");
    localStorage.removeItem("checkinTreeStamps:timestamp");
    localStorage.removeItem("checkinDataFromSheets");
    
    // 清除所有可能的簽到相關數據
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('checkin') || key.includes('stamp'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('所有簽到數據已強制清除');
  }, []);

  // 清除所有簽到數據（包括資料庫記錄）
  const clearAllCheckinData = React.useCallback(async () => {
    try {
      console.log('開始清除所有簽到數據...');
      
      // 1. 清除本地狀態
      setStamps([]);
      setTimeRemaining('');
      setIsCleared(true);
      
      // 2. 清除 localStorage
      localStorage.removeItem("checkinTreeStamps:v2");
      localStorage.removeItem("checkinTreeStamps");
      localStorage.removeItem("checkinTreeStamps:startTime");
      localStorage.removeItem("checkinTreeStamps:timestamp");
      localStorage.removeItem("checkinDataFromSheets");
      
      // 清除所有可能的簽到相關數據
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('checkin') || key.includes('stamp'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // 3. 清除資料庫中的簽到記錄
      try {
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
      
      // 4. 發送清除指令給其他頁面
      try {
        window.postMessage({
          type: 'CLEAR_CHECKIN_DATA',
          timestamp: Date.now()
        }, '*');
      } catch (error) {
        console.log('無法發送清除指令到其他頁面');
      }
      
      console.log('所有簽到數據清除完成');
    } catch (error) {
      console.error('清除簽到數據時發生錯誤:', error);
    }
  }, []);

  // 檢查 URL 參數，如果有 clear=true，則強制清除
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear') === 'true') {
      forceClearAllData();
      // 清除 URL 參數
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [forceClearAllData]);

  // 監聽刪除鍵，清除所有簽到圖標
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 檢查是否按下刪除鍵 (Delete 或 Backspace)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 防止在輸入框中觸發
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        
        console.log('按下刪除鍵，清除所有簽到圖標和記錄');
        
        // 清除所有簽到數據
        clearAllCheckinData();
        
        // 顯示清除成功提示
        setShowSuccessMessage(true);
        setSuccessMemberName('所有簽到圖標和記錄已清除');
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // persist with timestamp
  React.useEffect(() => {
    try {
      localStorage.setItem("checkinTreeStamps:v2", JSON.stringify(stamps));
      localStorage.setItem("checkinTreeStamps:timestamp", new Date().toISOString());
      
      // 移除開始時間設置，數據永久保留
    } catch (error) {
      console.error('Error saving stamps:', error);
    }
  }, [stamps]);

  // draw stamps (tree moved to SVG background)
  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // handle high DPI
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // transparent background; only clear for redraw
    ctx.clearRect(0, 0, width, height);

    // slot rows bottom->top, left->right
    // Read branch paths from SVG to compute exact points along curves
    const svg = document.querySelector('svg[data-checkin-tree]');
    const branches = svg ? Array.from(svg.querySelectorAll('path[data-branch]')) as SVGPathElement[] : [];
    const slots: Array<{ x: number; y: number }> = [];
    const perBranch = [10, 10, 8, 8, 7, 7];
    branches.forEach((path, idx) => {
      const totalLength = path.getTotalLength();
      const steps = perBranch[idx] ?? 8;
      for (let i = 0; i < steps; i += 1) {
        const t = steps === 1 ? 0.5 : i / (steps - 1);
        const pt = path.getPointAtLength(totalLength * t);
        // SVG viewBox is 1600x900; convert to current canvas size
        const x = (pt.x / 1600) * width;
        const y = (pt.y / 900) * height;
        slots.push({ x, y });
      }
    });

    stamps.forEach((s, idx) => {
      let x: number;
      let y: number;
      if (typeof s.xRatio === "number" && typeof s.yRatio === "number") {
        // legacy manual position
        x = s.xRatio * width;
        y = s.yRatio * height;
      } else {
        const pos = slots[Math.min(idx, slots.length - 1)] || { x: width * 0.5, y: height * 0.8 };
        x = pos.x;
        y = pos.y;
      }
      
      // 使用分組圖片繪製簽到圖標
      const member = members.find(m => m.name === s.name);
      if (member?.groupImageUrl) {
        drawGroupStampImage(ctx, x, y, member.groupImageUrl, s.name || "", member.color);
      } else if (s.imageUrl) {
        drawStampImage(ctx, x, y, s.imageUrl, s.name || "");
      } else {
        // 回退到原來的繪製方式
        drawStamp(ctx, x, y, s.color);
        const label = s.name ?? "";
        if (label) {
          ctx.save();
          ctx.font = "12px system-ui, -apple-system, Segoe UI, Noto Sans, Arial";
          ctx.fillStyle = "#111827";
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 3;
          ctx.textBaseline = "middle";
          // 放在圖案右側略高位置，避免重疊
          ctx.strokeText(label, x + 12, y - 12);
          ctx.fillText(label, x + 12, y - 12);
          ctx.restore();
        }
      }
    });
  }, [stamps, members]);

  React.useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const onSign = async () => {
    if (members.length === 0 || !selectedName) {
      alert('請等待分組名單載入完成');
      return;
    }
    
    const member = members.find((m) => m.name === selectedName);
    if (!member) {
      alert('找不到選中的成員');
      return;
    }
    
    // 檢查是否已經簽到過
    const hasAlreadySignedIn = stamps.some(stamp => stamp.name === member.name);
    if (hasAlreadySignedIn) {
      setShowLargeX(true);
      // 3秒後自動隱藏大叉叉
      setTimeout(() => {
        setShowLargeX(false);
      }, 3000);
      return;
    }
    
    // 重置清除狀態，允許新的簽到操作
    setIsCleared(false);
    
    try {
      const ts = formatZhTimestamp(new Date());
      
      // 寫入到資料庫
      try {
        // 先創建或找到用戶
        let userId = null;
        try {
          // 嘗試找到現有用戶
          const userResponse = await fetch('/api/v1/users');
          const usersData = await userResponse.json();
          const existingUser = usersData.data.find((user: any) => user.displayName === member.name);
          
          if (existingUser) {
            userId = existingUser.id;
          } else {
            // 創建新用戶
            const createUserResponse = await fetch('/api/v1/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: `${member.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                passwordHash: 'checkin_user_password',
                displayName: member.name,
                role: 'STUDENT'
              }),
            });
            
            if (createUserResponse.ok) {
              const newUser = await createUserResponse.json();
              userId = newUser.data.id;
              console.log('Created new user for checkin:', newUser.data);
            }
          }
        } catch (userError) {
          console.error('Error handling user:', userError);
        }

        // 寫入簽到記錄到資料庫
        if (userId) {
          const checkinResponse = await fetch('/api/v1/checkins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              date: new Date().toISOString()
            }),
          });

          if (checkinResponse.ok) {
            const checkinData = await checkinResponse.json();
            console.log('Successfully wrote checkin to database:', checkinData);
          } else {
            console.error('Failed to write checkin to database:', await checkinResponse.text());
          }
        }
      } catch (dbError) {
        console.error('Error writing to database:', dbError);
      }

      // 更新本地狀態
      setStamps((prev) => [...prev, { 
        color: member.color, 
        name: member.name, 
        timestamp: ts, 
        imageUrl: member.imageUrl 
      }]);
      setShowPicker(false);

      // 同時保持 localStorage 備份
      try {
        const checkinDataKey = 'checkinDataFromSheets';
        const existingData = localStorage.getItem(checkinDataKey);
        const checkinRecords = existingData ? JSON.parse(existingData) : [];
        
        const newRecord = {
          id: Date.now().toString(),
          group: member.group,
          name: member.name,
          timestamp: ts,
          status: '已簽到'
        };
        
        checkinRecords.push(newRecord);
        localStorage.setItem(checkinDataKey, JSON.stringify(checkinRecords));
        console.log(`Successfully wrote checkin record: Group ${member.group}, Name ${member.name}`);
      } catch (localError) {
        console.error('Error writing to localStorage:', localError);
      }
      
      // 顯示成功訊息
      setSuccessMemberName(member.name);
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

  // 移除clearAll函數，清除功能移到管理頁面

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
      
      {/* 大叉叉圖案覆蓋層 */}
      {showLargeX && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
          <div className="text-red-500 text-[20rem] font-bold animate-pulse drop-shadow-2xl">
            ❌
          </div>
        </div>
      )}
      {/* time card */}
      <div className="fixed left-4 top-4 z-[9999] rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
        <div>{now.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}</div>
        <div className="text-gray-600">{now.toLocaleTimeString("zh-TW", { hour12: false })}</div>
        {timeRemaining && (
          <div className="text-blue-600 font-medium mt-1">
            簽到圖標剩餘: {timeRemaining}
          </div>
        )}
        {/* 刪除鍵提示 */}
        <div className="text-xs text-gray-500 mt-2 border-t pt-2">
          💡 按 Delete 鍵清除所有簽到
        </div>
      </div>
      
      {/* 返回主頁按鈕 - 放在時間區塊下面，增加間距 */}
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

      {/* roster sidebar */}
      <div className="fixed right-4 top-4 z-40 w-72 max-h-[60vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-base font-semibold text-gray-800">各組名單</div>
        {loading ? (
          <div className="mt-3 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            正在從Google Sheets載入分組名單...
          </div>
        ) : members.length === 0 ? (
          <div className="mt-3 text-center text-gray-500">
            <div className="text-red-500 mb-2">⚠️</div>
            無法載入分組名單，請檢查Google Sheets設置
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {GROUP_IDS.map((gid) => {
              const groupMembers = members.filter((m) => m.group === gid);
              const groupImageUrl = groupMembers[0]?.groupImageUrl;
              return (
                <div key={gid}>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    {groupImageUrl && (
                      <img 
                        src={groupImageUrl} 
                        alt={`組 ${gid}`}
                        className="h-6 w-6 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>組 {gid}</span>
                  </div>
                  <ul className="space-y-2">
                    {groupMembers.map((m) => {
                      const checked = signedNames.has(m.name);
                      return (
                        <li key={m.name} className="flex items-center gap-2 text-sm text-gray-800">
                          {m.imageUrl ? (
                            <img 
                              src={m.imageUrl} 
                              alt={m.name}
                              className="h-6 w-6 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span 
                            className={`inline-block h-2.5 w-2.5 rounded-sm ${m.imageUrl ? 'hidden' : ''}`} 
                            style={{ backgroundColor: m.color }} 
                          />
                          <span className="flex-1 truncate">{m.name}</span>
                          {checked ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-300">○</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 清除按鈕已移到管理頁面 */}

      {/* canvas */}
      <div className="h-screen flex items-center justify-center p-4">
        <div className="w-full h-full max-w-7xl">
          <div
            className="w-full h-full rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative bg-gray-100"
            style={{
              backgroundImage: "url('/tree.svg')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {/* SVG tree background */}
            <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full select-none" aria-hidden data-checkin-tree>
              <g fill="#5b3a29" stroke="#5b3a29" strokeLinecap="round">
                <path d="M800 880 C 760 620, 780 520, 800 460 C 820 520, 840 620, 800 880 Z" />
                <path d="M800 480 Q 620 420 480 560" strokeWidth="16" fill="none" data-branch />
                <path d="M800 500 Q 980 420 1140 560" strokeWidth="16" fill="none" data-branch />
                <path d="M800 460 Q 700 360 560 340" strokeWidth="12" fill="none" data-branch />
                <path d="M800 460 Q 900 360 1040 330" strokeWidth="12" fill="none" data-branch />
                <path d="M790 520 Q 640 520 520 640" strokeWidth="10" fill="none" data-branch />
                <path d="M810 520 Q 960 500 1080 640" strokeWidth="10" fill="none" data-branch />
              </g>
              {/* white highlights */}
              <g stroke="rgba(255,255,255,0.7)" strokeLinecap="round" fill="none">
                <path d="M700 400 Q 660 380 560 360" strokeWidth="6" />
                <path d="M900 400 Q 940 370 1040 350" strokeWidth="6" />
                <path d="M740 520 Q 680 520 600 600" strokeWidth="5" />
                <path d="M860 520 Q 920 510 980 600" strokeWidth="5" />
              </g>
            </svg>
            {/* Canvas for stamps - click to open picker */}
            <canvas
              ref={canvasRef}
              onClick={() => {
                // open picker at current group; default to first member of that group
                const gid = GROUP_IDS[groupIdx];
                const vis = members.filter((m) => m.group === gid);
                if (vis.length > 0) setSelectedName(vis[0].name);
                setShowPicker(true);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* modal group/member picker */}
      {showPicker && members.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[800px] h-[800px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setGroupIdx((i) => (i - 1 + GROUP_IDS.length) % GROUP_IDS.length)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-700 shadow-sm hover:bg-gray-50"
              >
                ←
              </button>
              <div className="text-lg font-semibold text-gray-800">組別：{GROUP_IDS[groupIdx]}</div>
              <button
                type="button"
                onClick={() => setGroupIdx((i) => (i + 1) % GROUP_IDS.length)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-700 shadow-sm hover:bg-gray-50"
              >
                →
              </button>
            </div>
            <div className="mt-8 space-y-6">
              {members.filter((m) => m.group === GROUP_IDS[groupIdx]).map((m) => (
                <label key={m.name} className="flex items-center gap-6 p-12 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer h-[200px]">
                  <input
                    type="radio"
                    name="picker-member"
                    value={m.name}
                    checked={selectedName === m.name}
                    onChange={() => setSelectedName(m.name)}
                    className="text-blue-600"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    {m.imageUrl ? (
                      <img 
                        src={m.imageUrl} 
                        alt={m.name}
                        className="h-[140px] w-[140px] rounded-full object-cover border-4 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div 
                      className={`h-[140px] w-[140px] rounded-full flex items-center justify-center text-white font-bold text-[60px] ${m.imageUrl ? 'hidden' : ''}`} 
                      style={{ backgroundColor: m.color }} 
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[30px] text-gray-900 flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="text-[50px]">{m.group === 1 ? '1️⃣' : m.group === 2 ? '2️⃣' : m.group === 3 ? '3️⃣' : m.group === 4 ? '4️⃣' : m.group === 5 ? '5️⃣' : m.group === 6 ? '6️⃣' : m.group === 7 ? '7️⃣' : m.group === 8 ? '8️⃣' : m.group === 9 ? '9️⃣' : '🔟'}</span>
                      </div>
                    </div>
                    {signedNames.has(m.name) && (
                      <div className="text-green-600 text-lg">✓</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {/* 選中成員信息 */}
            {selectedName && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-[30px] font-medium text-blue-800 mb-3 text-center">嗨，{selectedName}，早安</div>
                {(() => {
                  const member = members.find(m => m.name === selectedName);
                  if (!member) return null;
                  return (
                    <div className="flex items-center gap-4">
                      {/* 個人頭像 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-xs text-blue-700 font-medium">個人頭像</div>
                        {member.imageUrl ? (
                          <img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="h-[100px] w-[100px] rounded-full object-cover border-3 border-blue-300 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div 
                          className={`h-[100px] w-[100px] rounded-full flex items-center justify-center text-white font-bold text-[40px] shadow-sm ${member.imageUrl ? 'hidden' : ''}`} 
                          style={{ backgroundColor: member.color }} 
                        >
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      
                      
                      {/* 成員信息 */}
                      <div className="flex-1">
                        <div className="font-bold text-[30px] text-blue-900 flex items-center justify-between">
                          <span>{member.name}</span>
                          <span className="text-[50px]">{member.group === 1 ? '1️⃣' : member.group === 2 ? '2️⃣' : member.group === 3 ? '3️⃣' : member.group === 4 ? '4️⃣' : member.group === 5 ? '5️⃣' : member.group === 6 ? '6️⃣' : member.group === 7 ? '7️⃣' : member.group === 8 ? '8️⃣' : member.group === 9 ? '9️⃣' : '🔟'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
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

function drawStamp(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const r = 14;
  // circle
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // simple hand glyph lines
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 4);
  ctx.lineTo(x - 4, y - 4);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x, y - 6);
  ctx.moveTo(x + 4, y + 4);
  ctx.lineTo(x + 4, y - 4);
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + 6, y);
  ctx.stroke();
}

function drawStampImage(ctx: CanvasRenderingContext2D, x: number, y: number, imageUrl: string, name: string) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    const size = 28; // 圖片大小
    const halfSize = size / 2;
    
    // 繪製圓形背景
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, halfSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.clip();
    
    // 繪製圖片
    ctx.drawImage(img, x - halfSize, y - halfSize, size, size);
    ctx.restore();
    
    // 繪製名字
    if (name) {
      ctx.save();
      ctx.font = "12px system-ui, -apple-system, Segoe UI, Noto Sans, Arial";
      ctx.fillStyle = "#111827";
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.strokeText(name, x, y + halfSize + 15);
      ctx.fillText(name, x, y + halfSize + 15);
      ctx.restore();
    }
  };
  
  img.onerror = () => {
    // 如果圖片載入失敗，回退到原來的繪製方式
    drawStamp(ctx, x, y, '#e11d48');
    if (name) {
      ctx.save();
      ctx.font = "12px system-ui, -apple-system, Segoe UI, Noto Sans, Arial";
      ctx.fillStyle = "#111827";
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.textBaseline = "middle";
      ctx.strokeText(name, x + 12, y - 12);
      ctx.fillText(name, x + 12, y - 12);
      ctx.restore();
    }
  };
  
  img.src = imageUrl;
}

function drawGroupStampImage(ctx: CanvasRenderingContext2D, x: number, y: number, groupImageUrl: string, name: string, color: string) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    const size = 32; // 組別圖片稍大一些
    const halfSize = size / 2;
    
    // 繪製圓形背景，使用組別顏色
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, halfSize, 0, Math.PI * 2);
    ctx.fillStyle = color + '40'; // 添加透明度
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();
    
    // 繪製組別圖片
    ctx.drawImage(img, x - halfSize, y - halfSize, size, size);
    ctx.restore();
    
    // 繪製名字，使用組別顏色
    if (name) {
      ctx.save();
      ctx.font = "bold 12px system-ui, -apple-system, Segoe UI, Noto Sans, Arial";
      ctx.fillStyle = color;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.strokeText(name, x, y + halfSize + 18);
      ctx.fillText(name, x, y + halfSize + 18);
      ctx.restore();
    }
  };
  
  img.onerror = () => {
    // 如果組別圖片載入失敗，使用組別顏色的圓形圖標
    drawStamp(ctx, x, y, color);
    if (name) {
      ctx.save();
      ctx.font = "bold 12px system-ui, -apple-system, Segoe UI, Noto Sans, Arial";
      ctx.fillStyle = color;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.strokeText(name, x, y + 20);
      ctx.fillText(name, x, y + 20);
      ctx.restore();
    }
  };
  
  img.src = groupImageUrl;
}

function formatZhTimestamp(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${month}月${day}日${hour}時${minute}分`;
}
