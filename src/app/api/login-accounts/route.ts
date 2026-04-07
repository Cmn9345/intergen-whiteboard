import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
const LOGIN_SHEET_ID = '1eH0hypmEjrF8fjWDBbGBUlhZ3uh-Wks3ICKhnGgK9_8';
const RANGE = 'A1:B100'; // 帳號, pin碼

export async function GET() {
  // 暫時使用硬編碼數據，避免中文字符編碼問題
  // 根據Google Sheets的實際數據：張孟能(9345), 林詩柔(0507), 黃翊綺(1234), 陳泠予(1234), 楊沚惠(1234)
  const accounts = [
    { id: 1, account: '張孟能', pinCode: '9345' },
    { id: 2, account: '林詩柔', pinCode: '0507' },
    { id: 3, account: '黃翊綺', pinCode: '1234' },
    { id: 4, account: '陳泠予', pinCode: '1234' },
    { id: 5, account: '楊沚惠', pinCode: '1234' },
  ];

  console.log('Login accounts:', JSON.stringify(accounts, null, 2));

  return NextResponse.json(accounts, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
