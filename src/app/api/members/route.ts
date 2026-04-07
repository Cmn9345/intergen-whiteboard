import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
const SHEET_ID = '1MT_0qYmcovjwiu2nmodFVZgM71iJ6FxcfRJkGGZ2f1I';
const RANGE = 'A1:D100'; // 組別, 姓名, 圖片, 組別圖標URL

// 檢查儲存格內容是否為圖片URL
function isImageUrl(value: string): boolean {
  if (!value) return false;
  
  // 檢查是否為有效的圖片URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const isHttpUrl = value.startsWith('http://') || value.startsWith('https://');
  const hasImageExtension = imageExtensions.some(ext => value.toLowerCase().includes(ext));
  const isDataUrl = value.startsWith('data:image/');
  
  return isHttpUrl && (hasImageExtension || isDataUrl);
}

export async function GET() {
  try {
    // 從Google Sheets獲取數據
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const data = await response.json();
    const values = data.values || [];

    // 假設第一行是標題行，數據從第二行開始
    // 實際的列結構：組別, 姓名, 圖片, 組別圖標URL
    const members = values.slice(1)
      .filter((row: any[]) => row && row.length > 0 && row[1]) // 過濾空行，檢查姓名列
      .map((row: any[], index: number) => {
        const group = parseInt(row[0]) || (index + 1);
        const name = row[1]?.trim();
        
        // 檢查第3列（索引2）是否為有效的圖片URL
        const imageUrl = row[2]?.trim();
        const validImageUrl = isImageUrl(imageUrl) ? imageUrl : undefined;
        
        // 檢查第4列（索引3）是否為有效的組別圖片URL
        const groupImageUrl = row[3]?.trim();
        const validGroupImageUrl = isImageUrl(groupImageUrl) ? groupImageUrl : undefined;
        
        // 根據組別分配顏色
        const colors = ['#e11d48', '#ea580c', '#059669', '#7c3aed', '#dc2626'];
        const color = colors[(group - 1) % colors.length];
        
        return {
          group,
          name,
          color,
          imageUrl: validImageUrl,
          groupImageUrl: validGroupImageUrl,
        };
      })
      .filter((member: any) => member.name); // 移除沒有姓名的數據

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members from Google Sheets:', error);
    
    // 如果API調用失敗，返回空數組
    return NextResponse.json([]);
  }
}
