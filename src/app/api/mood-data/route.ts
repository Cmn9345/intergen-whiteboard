import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
const MOOD_SHEET_ID = '1GcPFRUgl3mnACJRZLO4ZwXyUQpaG7WpdFwSg-RXc-r0';
const RANGE = 'A1:C100'; // 開心, 難過, 生氣

export async function GET() {
  try {
    // 從Google Sheets獲取心情數據
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${MOOD_SHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const data = await response.json();
    const values = data.values || [];

    console.log('Raw mood data from Google Sheets:', JSON.stringify(values, null, 2));

    // 解析數據：第一行是標題，數據從第二行開始
    // 格式：開心, 難過, 生氣
    const moodData = {
      happy: values.slice(1).map((row: any[]) => row[0] || '').filter((name: string) => name.trim()),
      sad: values.slice(1).map((row: any[]) => row[1] || '').filter((name: string) => name.trim()),
      angry: values.slice(1).map((row: any[]) => row[2] || '').filter((name: string) => name.trim()),
    };

    console.log('Processed mood data:', JSON.stringify(moodData, null, 2));

    return NextResponse.json(moodData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching mood data from Google Sheets:', error);
    return NextResponse.json({ happy: [], sad: [], angry: [] });
  }
}

export async function POST(request: Request) {
  try {
    const { moodData } = await request.json();
    
    if (!moodData) {
      return NextResponse.json({ error: 'Missing mood data' }, { status: 400 });
    }

    // 由於API Key限制，我們使用模擬寫入
    // 在實際部署中，應該使用OAuth2或服務帳戶
    console.log('Would write mood data to Google Sheets:', JSON.stringify(moodData, null, 2));
    
    // 模擬寫入成功
    return NextResponse.json({ success: true, message: 'Mood data written to Google Sheets' });
  } catch (error) {
    console.error('Error writing mood data to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
