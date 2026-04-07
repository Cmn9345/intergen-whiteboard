"use client";
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Mood {
  id: string;
  value: number;
  note?: string;
  recordedAt: string;
  user: User;
}

interface Checkin {
  id: string;
  date: string;
  user: User;
}

export default function TestDatabasePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 載入所有資料
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, coursesRes, moodsRes, checkinsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
        fetch('/api/moods'),
        fetch('/api/checkins')
      ]);

      const [usersData, coursesData, moodsData, checkinsData] = await Promise.all([
        usersRes.json(),
        coursesRes.json(),
        moodsRes.json(),
        checkinsRes.json()
      ]);

      setUsers(usersData);
      setCourses(coursesData);
      setMoods(moodsData);
      setCheckins(checkinsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('載入資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // 創建測試用戶
  const createTestUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          passwordHash: 'hashed_password_here',
          displayName: `測試用戶${Date.now()}`,
          role: 'STUDENT'
        }),
      });

      if (response.ok) {
        setMessage('測試用戶創建成功！');
        loadData();
      } else {
        setMessage('創建測試用戶失敗');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('創建測試用戶時發生錯誤');
    }
  };

  // 創建測試課程
  const createTestCourse = async () => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `測試課程${Date.now()}`,
          description: '這是一個測試課程的描述',
          startsAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }),
      });

      if (response.ok) {
        setMessage('測試課程創建成功！');
        loadData();
      } else {
        setMessage('創建測試課程失敗');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('創建測試課程時發生錯誤');
    }
  };

  // 創建測試心情記錄
  const createTestMood = async () => {
    if (users.length === 0) {
      setMessage('請先創建用戶');
      return;
    }

    try {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: Math.floor(Math.random() * 5) + 1,
          note: '測試心情記錄',
          userId: users[0].id
        }),
      });

      if (response.ok) {
        setMessage('測試心情記錄創建成功！');
        loadData();
      } else {
        setMessage('創建測試心情記錄失敗');
      }
    } catch (error) {
      console.error('Error creating mood:', error);
      setMessage('創建測試心情記錄時發生錯誤');
    }
  };

  // 創建測試簽到記錄
  const createTestCheckin = async () => {
    if (users.length === 0) {
      setMessage('請先創建用戶');
      return;
    }

    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: users[0].id,
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setMessage('測試簽到記錄創建成功！');
        loadData();
      } else {
        setMessage('創建測試簽到記錄失敗');
      }
    } catch (error) {
      console.error('Error creating checkin:', error);
      setMessage('創建測試簽到記錄時發生錯誤');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">資料庫測試頁面</h1>
        
        {/* 返回主頁按鈕 */}
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 mb-6"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回主頁</span>
        </a>

        {/* 操作按鈕 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '載入中...' : '重新載入資料'}
          </button>
          <button
            onClick={createTestUser}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            創建測試用戶
          </button>
          <button
            onClick={createTestCourse}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            創建測試課程
          </button>
          <button
            onClick={createTestMood}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            創建測試心情
          </button>
          <button
            onClick={createTestCheckin}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            創建測試簽到
          </button>
        </div>

        {/* 訊息顯示 */}
        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-800">
            {message}
          </div>
        )}

        {/* 資料顯示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 用戶資料 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">用戶 ({users.length})</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">{user.displayName}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500">角色: {user.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 課程資料 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">課程 ({courses.length})</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {courses.map((course) => (
                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">{course.title}</div>
                  <div className="text-sm text-gray-600">{course.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 心情記錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">心情記錄 ({moods.length})</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {moods.map((mood) => (
                <div key={mood.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-800">{mood.user.displayName}</div>
                    <div className="text-lg">{"😊".repeat(Math.max(0, mood.value))}</div>
                  </div>
                  {mood.note && <div className="text-sm text-gray-600">{mood.note}</div>}
                  <div className="text-xs text-gray-500">
                    {new Date(mood.recordedAt).toLocaleString('zh-TW')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 簽到記錄 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">簽到記錄 ({checkins.length})</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {checkins.map((checkin) => (
                <div key={checkin.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">{checkin.user.displayName}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(checkin.date).toLocaleString('zh-TW')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



