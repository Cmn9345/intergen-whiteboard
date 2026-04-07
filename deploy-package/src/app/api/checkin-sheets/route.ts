import { NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_KEY = 'AIzaSyCrg0gOZc7DK2ae4uDs1euGe1MaGU9kBqQ';
const CHECKIN_SHEET_ID = '1vxgvFRGkLIrXwDDAiylg4C_E9JSpGdIEPslEmv4jo0M';

// 創建新工作表的函數
async function createNewSheet(sheetName: string) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${CHECKIN_SHEET_ID}:batchUpdate?key=${GOOGLE_SHEETS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 10,
                  },
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create sheet:', errorText);
      throw new Error(`Failed to create sheet: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`Created new sheet: ${sheetName}`);
    return result;
  } catch (error) {
    console.error('Error creating new sheet:', error);
    throw error;
  }
}

// 檢查工作表是否存在的函數
async function checkSheetExists(sheetName: string) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${CHECKIN_SHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get sheet info: ${response.status}`);
    }

    const data = await response.json();
    const sheets = data.sheets || [];
    
    return sheets.some((sheet: any) => sheet.properties.title === sheetName);
  } catch (error) {
    console.error('Error checking sheet existence:', error);
    return false;
  }
}

// 寫入數據到指定工作表的函數
async function writeToSheet(sheetName: string, data: any[]) {
  try {
    const range = `${sheetName}!A1:C${data.length + 1}`;
    const values = [
      ['組別', '姓名', '簽到時間'], // 標題行
      ...data.map(record => [
        record.group,
        record.name,
        record.timestamp
      ])
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${CHECKIN_SHEET_ID}/values/${range}?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to write to sheet:', errorText);
      throw new Error(`Failed to write to sheet: ${response.status} - ${errorText}`);
    }

    console.log(`Successfully wrote ${data.length} records to sheet: ${sheetName}`);
    return await response.json();
  } catch (error) {
    console.error('Error writing to sheet:', error);
    throw error;
  }
}

// 獲取今天的工作表名稱
function getTodaySheetName() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET() {
  try {
    const todaySheetName = getTodaySheetName();
    const range = `${todaySheetName}!A1:C100`;
    
    // 從Google Sheets獲取今天的簽到數據
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${CHECKIN_SHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`
    );

    if (!response.ok) {
      // 如果工作表不存在，返回空數組
      if (response.status === 400) {
        console.log(`Sheet ${todaySheetName} does not exist yet`);
        return NextResponse.json([]);
      }
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const data = await response.json();
    const values = data.values || [];

    console.log(`Raw checkin data from Google Sheets for ${todaySheetName}:`, JSON.stringify(values, null, 2));

    // 解析數據：第一行是標題，數據從第二行開始
    const checkinRecords = values.slice(1)
      .filter((row: any[]) => row && row.length > 0 && row[0] && row[1])
      .map((row: any[], index: number) => ({
        id: index + 1,
        group: parseInt(row[0]) || 0,
        name: row[1]?.toString().trim() || '',
        timestamp: row[2] || new Date().toLocaleString('zh-TW'),
        status: '已簽到'
      }));

    console.log('Processed checkin records:', JSON.stringify(checkinRecords, null, 2));

    return NextResponse.json(checkinRecords, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching checkin data from Google Sheets:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const { checkinRecords } = await request.json();
    
    if (!checkinRecords || !Array.isArray(checkinRecords)) {
      return NextResponse.json({ error: 'Missing or invalid checkin records' }, { status: 400 });
    }

    const todaySheetName = getTodaySheetName();
    console.log(`Processing checkin records for sheet: ${todaySheetName}`);

    // 檢查今天的工作表是否存在
    const sheetExists = await checkSheetExists(todaySheetName);
    
    if (!sheetExists) {
      console.log(`Creating new sheet: ${todaySheetName}`);
      await createNewSheet(todaySheetName);
    }

    // 寫入數據到工作表
    await writeToSheet(todaySheetName, checkinRecords);
    
    return NextResponse.json({ 
      success: true, 
      message: `Checkin records written to Google Sheets (${todaySheetName})`,
      sheetName: todaySheetName
    });
  } catch (error) {
    console.error('Error writing check-in data to Google Sheets:', error);
    return NextResponse.json({ 
      error: 'Failed to write data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}