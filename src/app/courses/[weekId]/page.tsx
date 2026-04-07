"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

// 其他週的課程數據（不需要router）
const otherWeeksData = {
  "2": {
    title: "第3週",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
  "8": {
    title: "第9週：食而聲笑",
    content: <div className="text-gray-400 text-center">（尚未填寫內容）</div>,
  },
};

// 第1週的課程數據（需要router）- 相見歡
const getWeek1Data = (router: any) => ({
  "0": {
    title: "第1週：相見歡",
    content: (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">🎯 課程目標</h3>
          <p className="text-green-700">透過破冰活動和互動遊戲，讓孩子與長者建立初步的默契和信任關係。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/1/ice-breaker')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-blue-600 group-hover:text-blue-700">活動一：建立小默契 (10分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過簡單的互動遊戲建立初步默契</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>自我介紹和互相認識</li>
              <li>簡單的配對遊戲</li>
              <li>建立信任關係</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/1/together')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-purple-600 group-hover:text-purple-700">活動二：當我們同在一起 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過音樂和互動，讓孩子與長者一起享受美好的時光</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>一起欣賞音樂影片</li>
              <li>跟著音樂節拍律動</li>
              <li>分享對音樂的感受</li>
              <li>一起哼唱熟悉的旋律</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/1/ice-breaking')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-orange-600 group-hover:text-orange-700">活動三：破冰活動 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">有趣的互動遊戲打破陌生感</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>名字接龍遊戲</li>
              <li>興趣分享時間</li>
              <li>共同話題討論</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/1/storybook')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-green-600 group-hover:text-green-700">活動四：繪本時間 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">《做一個機器人假裝是我》</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>共同閱讀繪本</li>
              <li>討論故事內容</li>
              <li>分享個人想法</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/1/whiteboard-tutorial')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-indigo-600 group-hover:text-indigo-700">活動五：電子互動白板使用教學 (10分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">學習使用電子互動白板</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>基本操作教學</li>
              <li>互動功能介紹</li>
              <li>實際操作練習</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第2週的課程數據（需要router）- 心情溫度計
const getWeek2Data = (router: any) => ({
  "1": {
    title: "第2週：心情溫度計",
    content: (
      <div className="space-y-6">
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-4">🎯 課程目標</h3>
          <p className="text-purple-700">透過互動遊戲和情緒探索，讓孩子與長者認識和表達不同的情緒，建立情感連結。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/2/find-partner')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-blue-600 group-hover:text-blue-700">活動一：尋找搭檔、口香糖黏哪裡 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過配對遊戲建立默契和互動</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>尋找搭檔配對活動</li>
              <li>口香糖黏哪裡互動遊戲</li>
              <li>建立團隊合作精神</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/2/emotion-faces')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-green-600 group-hover:text-green-700">活動二：情緒臉譜、我的心裡話 (20分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">認識和表達不同的情緒</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>情緒臉譜識別遊戲</li>
              <li>我的心裡話分享時間</li>
              <li>情緒表達和溝通練習</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/2/emotion-wheel')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-orange-600 group-hover:text-orange-700">活動三：情緒轉盤 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">互動式情緒轉盤遊戲</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>轉盤上有五種情緒表情</li>
              <li>轉完後會出現語音提示</li>
              <li>討論什麼時候會有這種情緒</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第3週的課程數據（需要router）- 夢想經驗大碰撞
const getWeek3Data = (router: any) => ({
  "2": {
    title: "第3週：夢想經驗大碰撞",
    content: (
      <div className="space-y-6">
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-xl font-bold text-orange-800 mb-4">🎯 課程目標</h3>
          <p className="text-orange-700">透過繪本故事和職業探索活動，讓孩子與長者一起認識不同的職業，分享彼此的夢想和經驗。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/3/storybook')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-blue-600 group-hover:text-blue-700">活動一：繪本：長大後你想做什麼工作? (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過YouTube影片欣賞繪本故事</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>觀看《長大後你想做什麼工作?》繪本影片</li>
              <li>討論故事中的不同職業</li>
              <li>分享彼此的職業夢想</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/3/toolkit')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-green-600 group-hover:text-green-700">活動二：工具包裏有甚麼?、大小職業家 (20分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">探索不同職業的工具和特色</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>認識各種職業使用的工具</li>
              <li>大小職業家配對遊戲</li>
              <li>討論職業的重要性和價值</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第5週的課程數據（需要router）
const getWeek4Data = (router: any) => ({
  "4": {
    title: "第5週：功夫大比拼",
    content: (
      <div className="space-y-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-4">🎯 課程目標</h3>
          <p className="text-red-700">透過才藝展示和音樂合奏，讓孩子與長者互相學習，展現各自的拿手好戲，增進彼此的了解與欣賞。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/4/talent-show')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-red-600 group-hover:text-red-700">活動一：我們的拿手好戲 (20分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">展示各自的才藝和技能</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>孩子和長者輪流展示拿手好戲</li>
              <li>唱歌、跳舞、說故事等才藝表演</li>
              <li>互相學習和欣賞彼此的技能</li>
              <li>建立自信和互相尊重的氛圍</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/4/ensemble')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-orange-600 group-hover:text-orange-700">活動二：合奏 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">一起演奏音樂，創造和諧的旋律</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>使用簡單樂器進行合奏</li>
              <li>學習節拍和旋律的配合</li>
              <li>體驗音樂帶來的快樂</li>
              <li>培養團隊合作精神</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第6週的課程數據（需要router）
const getWeek5Data = (router: any) => ({
  "5": {
    title: "第6週：玩具時光機",
    content: (
      <div className="space-y-6">
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-4">🎯 課程目標</h3>
          <p className="text-purple-700">透過玩具的故事和分享，讓孩子與長者了解不同年代的玩具，感受時光的變遷，增進代際間的交流與理解。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/5/storybook')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-purple-600 group-hover:text-purple-700">活動一：繪本-玩具太多了 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過YouTube影片欣賞繪本故事</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>觀看《玩具太多了》繪本影片</li>
              <li>討論故事中關於玩具的內容</li>
              <li>分享對玩具的看法和感受</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/5/toy-sharing')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-pink-600 group-hover:text-pink-700">活動二：遊戲、玩具分享 (20分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">分享不同年代的玩具和遊戲</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>展示自己喜歡的玩具</li>
              <li>分享玩具背後的故事</li>
              <li>比較不同年代的玩具差異</li>
              <li>一起玩簡單的傳統遊戲</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第7週的課程數據（需要router）
const getWeek6Data = (router: any) => ({
  "6": {
    title: "第7週：動物大趴踢",
    content: (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4">🎯 課程目標</h3>
          <p className="text-green-700">透過動物主題的繪本和活動，讓孩子與長者一起探索動物的世界，學習數數和認識不同的動物特徵。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/6/storybook')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-green-600 group-hover:text-green-700">活動一：繪本：數一數，有幾隻腳？ (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過YouTube影片欣賞繪本故事</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>觀看《數一數，有幾隻腳？》繪本影片</li>
              <li>學習數數和認識動物</li>
              <li>討論不同動物的腳的數量</li>
            </ul>
          </button>

          <button
            onClick={() => router.push('/courses/6/guess-feet')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-blue-600 group-hover:text-blue-700">活動二：猜猜我是誰 (20分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">動物腳配對遊戲</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>看動物圖片，猜猜牠有幾隻腳</li>
              <li>選擇2隻腳或4隻腳</li>
              <li>答對得1分，限時30秒</li>
              <li>滑鼠移到卡片上會朗讀</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第8週的課程數據（需要router）
const getWeek7Data = (router: any) => ({
  "7": {
    title: "第8週：做伙來辦桌",
    content: (
      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🎯 課程目標</h3>
          <p className="text-yellow-700">透過繪本故事和辦桌活動，讓孩子與長者一起體驗台灣傳統文化，學習分享和合作，感受家庭的溫暖與團聚的喜悅。</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/courses/7/storybook')}
            className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-lg text-yellow-600 group-hover:text-yellow-700">活動一：繪本-我的阿公阿嬤同學 (15分鐘)</h4>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-700 mb-2">透過YouTube影片欣賞繪本故事</p>
            <ul className="list-disc ml-6 text-gray-600 mb-2">
              <li>觀看《我的阿公阿嬤同學》繪本影片</li>
              <li>了解代際間的學習與交流</li>
              <li>討論家庭和長輩的重要性</li>
            </ul>
          </button>
        </div>
      </div>
    ),
  },
});

// 第4週的課程數據（需要router）- 我的家人
const getWeek0Data = (router: any) => ({
  "3": {
    title: "第4週：我的家人",
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
                  <li>小海龜 ↔ 海龜</li>
                  <li>小天鵝 ↔ 天鵝</li>
                  <li>小雞 ↔ 公雞</li>
                  <li>毛毛蟲 ↔ 蝴蝶</li>
                  <li>蝌蚪 ↔ 青蛙</li>
                  <li>小獅子 ↔ 獅子</li>
                  <li>嬰兒 ↔ 成人</li>
                  <li>小袋鼠 ↔ 袋鼠</li>
                  <li>小企鵝 ↔ 企鵝</li>
                </ul>
              </button>

              <button
                onClick={() => router.push('/courses/0/family-quiz')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-purple-600 group-hover:text-purple-700">活動二：家人稱呼 (10分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">家庭成員指認問答遊戲</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>觀察角色特徵，選擇正確稱謂</li>
                  <li>單選題模式，節奏明快</li>
                  <li>音效回饋和動畫效果</li>
                </ul>
              </button>

              <button
                onClick={() => router.push('/courses/0/charades')}
                className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-orange-600 group-hover:text-orange-700">活動三：你演我猜 (20分鐘)</h4>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-2">兩階段互動遊戲：表演家事 + 討論分工</p>
                <ul className="list-disc ml-6 text-gray-600 mb-2">
                  <li>抽家事卡進行表演遊戲</li>
                  <li>討論家庭分工和互助觀念</li>
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
  
  // 合併第1週、第2週、第3週、第4週、第5週、第6週、第7週、第8週和其他週的數據
  const courseData = {
    ...otherWeeksData,
    ...getWeek1Data(router), // id "0" - 第1週：相見歡
    ...getWeek2Data(router), // id "1" - 第2週：心情溫度計
    ...getWeek3Data(router), // id "2" - 第3週：夢想經驗大碰撞
    ...getWeek0Data(router), // id "3" - 第4週：我的家人
    ...getWeek4Data(router), // id "4" - 第5週：功夫大比拼
    ...getWeek5Data(router), // id "5" - 第6週：玩具時光機
    ...getWeek6Data(router), // id "6" - 第7週：動物大趴踢
    ...getWeek7Data(router)  // id "7" - 第8週：做伙來辦桌
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
