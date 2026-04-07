import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
const SHEET_ID = '1MT_0qYmcovjwiu2nmodFVZgM71iJ6FxcfRJkGGZ2f1I';

export async function GET() {
  try {
    // 測試寫入到現有工作表
    const testSheetName = '測試工作表';
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${testSheetName}!A1:C1?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [['測試時間', '測試組別', '測試姓名']],
        }),
      }
    );
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: '成功寫入測試數據',
        status: response.status 
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ 
        success: false, 
        error: `寫入失敗: ${response.status}`,
        details: errorText
      });
    }
  } catch (error) {
    console.error('Error testing sheets write:', error);
    return NextResponse.json({ 
      success: false, 
      error: '測試失敗',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
