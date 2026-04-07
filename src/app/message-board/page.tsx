"use client";
import React, { useState, useEffect } from 'react';

type Message = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  group?: number;
};

export default function MessageBoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // 載入留言數據
    const loadMessages = () => {
      try {
        const savedMessages = localStorage.getItem('messageBoard');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authorName.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: authorName.trim(),
      content: newMessage.trim(),
      timestamp: new Date().toLocaleString('zh-TW'),
    };

    const updatedMessages = [message, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem('messageBoard', JSON.stringify(updatedMessages));
    setNewMessage('');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入留言中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
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

      <div className="max-w-4xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">留言板</h1>
          
          {/* 發送留言表單 */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="請輸入您的姓名..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
                required
              />
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="輸入您的留言..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
                required
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !authorName.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                發送
              </button>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {newMessage.length}/200 字
            </div>
          </form>

          {/* 留言列表 */}
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <div className="text-gray-600 text-xl mb-2">尚無留言</div>
                <div className="text-gray-500">成為第一個留言的人吧！</div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {message.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{message.author}</div>
                        <div className="text-sm text-gray-500">{message.timestamp}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
