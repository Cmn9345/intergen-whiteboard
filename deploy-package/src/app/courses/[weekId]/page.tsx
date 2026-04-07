"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

// 其他週的課程數據（不需要router）
const otherWeeksData = {
  "1": {
    title: "第1周：相見歡",
    content: (
      <ul className="space-y-4 text-lg">
        <li>
          <span className="font-semibold">建立小默契</span>
        </li>
        <li>
          <span className="font-semibold">將幼老進行分組</span>
        </li>
        <li>
          <span className="font-semibold">破冰活動</span>
        </li>
        <li>
          <span className="font-semibold">繪本：</span>
          <span>《做一個機器人假裝是我》</span>
        </li>
        <li>
          <span className="font-semibold">電子互動白板使用教學</span>
        </li>
      </ul>
    ),
  },
  "2": {
    title: "第2周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "3": {
    title: "第3周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "4": {
    title: "第4周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "5": {
    title: "第5周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "6": {
    title: "第6周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "7": {
    title: "第7周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "8": {
    title: "第8周",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
};

// 第0週的課程數據（需要router）
const getWeek0Data = (router: any) => ({
  "0": {
    title: "第0周：我的家人",
    content: (
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-4">🎯 課程目標</h3>
          <p className="text-blue-700">透過動物的幼年和成年樣貌，讓孩子與長者配對，建立家庭概念和稱謂認知。</p>
        </div>
        
            <div className="space-y-4">
              <button
                onClick={() => router.push('/courses/0/find-partner')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-blue-600 group-hover:text-blue-700">活動一：尋找搭檔 (10分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">透過動物的幼年和成年樣貌，讓孩子與長者配對</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>小雞 ↔ 公雞</li>
                  <li>小貓 ↔ 貓咪</li>
                  <li>毛毛蟲 ↔ 蝴蝶</li>
                </ul>
              </button>

              <button
                onClick={() => router.push('/courses/0/coming-soon')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-purple-600 group-hover:text-purple-700">活動二：家人稱呼 (10分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">介紹家庭成員的稱謂</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>爺爺、奶奶、外公、外婆</li>
                  <li>爸爸、媽媽</li>
                  <li>哥哥、姐姐、弟弟、妹妹</li>
                </ul>
              </button>

              <button
                onClick={() => router.push('/courses/0/coming-soon')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-orange-600 group-hover:text-orange-700">活動三：你演我猜 & 家庭照分享 (20分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">家務猜謎遊戲和家庭照片分享</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>煮飯、掃地、洗衣服等家務表演</li>
                  <li>分享家庭照片，營造溫馨氛圍</li>
                </ul>
              </button>

              <button
                onClick={() => router.push('/courses/0/coming-soon')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-green-600 group-hover:text-green-700">活動四：電子白板教學 & 結束活動 (5分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">互動白板操作和家庭樹手印</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>點選今天由誰陪伴來上學</li>
                  <li>在家庭樹上蓋手印，象徵我們是一家人</li>
                </ul>
              </button>
            </div>
      </div>
    ),
  },
});

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const weekId = params.weekId as string;
  
  // 合併第0週和其他週的數據
  const courseData = {
    ...otherWeeksData,
    ...getWeek0Data(router)
  };
  const course = courseData[weekId as keyof typeof courseData];
  
  if (!course) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="w-full max-w-4xl mx-auto pt-16">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">課程不存在</h1>
            <p className="text-gray-500 mb-6">找不到指定的課程內容</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              返回課程總覽
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 relative">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title="返回主頁"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回主頁</span>
        </button>
        
        <button
          onClick={() => router.push('/courses')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title="返回課程總覽"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回課程總覽</span>
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-8">{course.title}</h1>
          <div className="prose prose-lg max-w-none">
            {course.content}
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              返回課程總覽
            </button>
            
            {/* 上一週按鈕 */}
            {parseInt(weekId) > 0 && (
              <button
                onClick={() => router.push(`/courses/${parseInt(weekId) - 1}`)}
                className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                上一週
              </button>
            )}
            
            {/* 下一週按鈕 */}
            {parseInt(weekId) < 8 && (
              <button
                onClick={() => router.push(`/courses/${parseInt(weekId) + 1}`)}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                下一週
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
