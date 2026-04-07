"use client";
import React, { useState, useEffect } from 'react';

type Member = {
  group: number;
  name: string;
  color: string;
  imageUrl?: string;
  groupImageUrl?: string;
};

export default function DebugImagesPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 獲取原始數據
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data);
        
        // 獲取原始Google Sheets數據
        const rawResponse = await fetch(
          'https://sheets.googleapis.com/v4/spreadsheets/1MT_0qYmcovjwiu2nmodFVZgM71iJ6FxcfRJkGGZ2f1I/values/A1:D10?key=AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ'
        );
        const rawData = await rawResponse.json();
        setRawData(rawData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入中...</div>
        </div>
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">圖片調試頁面</h1>
        
        {/* 原始Google Sheets數據 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">原始Google Sheets數據</h2>
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </div>

        {/* 處理後的成員數據 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">處理後的成員數據</h2>
          <div className="grid gap-4">
            {members.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-medium text-gray-600">個人圖片</div>
                    {member.imageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={member.imageUrl} 
                          alt={member.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-xs text-green-600">✓ 有效圖片URL</div>
                        <div className="text-xs text-gray-500 max-w-32 truncate">{member.imageUrl}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div className="text-xs text-red-600">○ 無圖片URL</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-sm font-medium text-gray-600">組別圖片</div>
                    {member.groupImageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        <img 
                          src={member.groupImageUrl} 
                          alt={`組別 ${member.group}`}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-xs text-green-600">✓ 有效圖片URL</div>
                        <div className="text-xs text-gray-500 max-w-32 truncate">{member.groupImageUrl}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: member.color + '80' }}
                        >
                          {member.group}
                        </div>
                        <div className="text-xs text-red-600">○ 無組別圖片URL</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">組別 {member.group}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      顏色: {member.color}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用說明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">如何設置圖片</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>方法1：直接插入圖片URL</strong></p>
            <p>在Google Sheets的C列（個人圖片）和D列（組別圖片）中直接輸入圖片URL，例如：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>https://example.com/image.jpg</li>
              <li>https://example.com/image.png</li>
              <li>data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...</li>
            </ul>
            
            <p className="mt-4"><strong>方法2：使用Google Drive圖片</strong></p>
            <p>1. 將圖片上傳到Google Drive</p>
            <p>2. 右鍵點擊圖片 → "取得連結"</p>
            <p>3. 將連結中的ID替換為直接圖片URL：</p>
            <p className="font-mono text-xs bg-blue-100 p-2 rounded">
              https://drive.google.com/uc?export=view&id=YOUR_IMAGE_ID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
