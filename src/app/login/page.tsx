"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

type LoginAccount = {
  id: number;
  account: string;
  pinCode: string;
};

type LoginState = 'select' | 'pin' | 'success' | 'error';

export default function Page() {
  const { login } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<LoginAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<LoginAccount | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('select');
  const [errorMessage, setErrorMessage] = useState('');

  // 載入登入帳號數據
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/login-accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load login accounts:', error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // 選擇帳號
  const handleAccountSelect = (account: LoginAccount) => {
    setSelectedAccount(account);
    setPinCode('');
    setLoginState('pin');
  };

  // 自動聚焦到PIN碼輸入區域
  useEffect(() => {
    if (loginState === 'pin') {
      // 延遲一點時間確保DOM已更新
      setTimeout(() => {
        const pinContainer = document.querySelector('[tabindex="0"]') as HTMLElement;
        if (pinContainer) {
          pinContainer.focus();
        }
      }, 100);
    }
  }, [loginState]);

  // 輸入PIN碼
  const handlePinInput = (digit: string) => {
    if (pinCode.length < 4) {
      setPinCode(prev => prev + digit);
    }
  };

  // 鍵盤輸入處理
  const handleKeyPress = (event: React.KeyboardEvent) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
      handlePinInput(key);
    } else if (key === 'Backspace') {
      handlePinDelete();
    } else if (key === 'Enter') {
      handlePinSubmit();
    }
  };

  // 刪除PIN碼
  const handlePinDelete = () => {
    setPinCode(prev => prev.slice(0, -1));
  };

  // 驗證PIN碼
  const handlePinSubmit = () => {
    if (pinCode.length === 4 && selectedAccount) {
      if (pinCode === selectedAccount.pinCode) {
        setLoginState('success');
        // 登入成功，保存用戶信息
        login(selectedAccount);
        // 2秒後自動跳轉到管理儀表板
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setLoginState('error');
        setErrorMessage('PIN碼錯誤，請重新輸入');
      }
    }
  };

  // 重置登入狀態
  const handleReset = () => {
    setSelectedAccount(null);
    setPinCode('');
    setLoginState('select');
    setErrorMessage('');
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center relative">
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">載入登入資料中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
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

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">人員登入</h1>

          {loginState === 'select' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">請選擇您的帳號</h2>
              <div className="grid grid-cols-2 gap-4">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountSelect(account)}
                    className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {account.account.charAt(0)}
                      </span>
                    </div>
                    <span className="text-lg font-medium text-gray-700">{account.account}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loginState === 'pin' && selectedAccount && (
            <div onKeyDown={handleKeyPress} tabIndex={0} className="focus:outline-none">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {selectedAccount.account.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-700">{selectedAccount.account}</h2>
                <p className="text-gray-500 mt-2">輸入PIN碼</p>
              </div>

              {/* PIN碼顯示 */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold"
                    >
                      {pinCode[index] ? '●' : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作提示 */}
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-4">
                  使用鍵盤輸入數字，按 Enter 確認，按 Backspace 刪除
                </p>
                <button
                  onClick={handlePinSubmit}
                  disabled={pinCode.length !== 4}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  確認登入
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full mt-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                返回選擇帳號
              </button>
            </div>
          )}

          {loginState === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">登入成功！</h2>
              <p className="text-gray-600 mb-6">歡迎，{selectedAccount?.account}</p>
              <p className="text-sm text-gray-500 mb-6">正在跳轉到管理儀表板...</p>
              
              <div className="space-y-3">
                <a
                  href="/"
                  className="w-full inline-block py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  返回主頁
                </a>
                <button
                  onClick={handleReset}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  重新登入
                </button>
              </div>
            </div>
          )}

          {loginState === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">登入失敗</h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                重新嘗試
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}