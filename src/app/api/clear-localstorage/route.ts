import { NextRequest, NextResponse } from 'next/server';

// POST /api/clear-localstorage - 清除瀏覽器 localStorage 中的簽到數據
export async function POST(request: NextRequest) {
  try {
    // 這個 API 主要是為了觸發前端清除 localStorage
    // 實際的清除操作會在前端執行
    
    return NextResponse.json({
      message: '請重新載入頁面以清除 localStorage 數據',
      instructions: [
        '1. 重新載入簽到樹頁面',
        '2. 清除所有 localStorage 中的簽到相關數據',
        '3. 重置簽到狀態'
      ]
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return NextResponse.json({ error: '清除 localStorage 失敗' }, { status: 500 });
  }
}




