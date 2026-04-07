import { NextResponse } from 'next/server';

// 使用本地存儲模擬Google Sheets功能
// 在實際部署時，可以替換為真實的Google Sheets API或數據庫

// 獲取今天的日期作為工作表名稱
function getTodaySheetName(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `簽到紀錄_${year}${month}${day}`;
}

// 模擬數據存儲（在實際應用中應該使用數據庫）
let checkinRecords: any[] = [];

// 寫入簽到記錄
async function writeCheckinRecord(group: number, name: string, status: string = '已簽到'): Promise<boolean> {
  try {
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    
    // 添加到模擬數據
    checkinRecords.push({
      timestamp,
      group,
      name,
      status,
    });
    
    console.log('Checkin record added:', { timestamp, group, name, status });
    return true;
  } catch (error) {
    console.error('Error writing checkin record:', error);
    return false;
  }
}

// 讀取今天的簽到記錄
async function getTodayCheckinRecords(): Promise<any[]> {
  try {
    // 返回模擬數據
    return checkinRecords;
  } catch (error) {
    console.error('Error reading checkin records:', error);
    return [];
  }
}

// GET: 讀取今天的簽到記錄
export async function GET() {
  try {
    const records = await getTodayCheckinRecords();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching checkin records:', error);
    return NextResponse.json([]);
  }
}

// POST: 寫入簽到記錄
export async function POST(request: Request) {
  try {
    const { group, name, status = '已簽到' } = await request.json();
    
    if (!group || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const success = await writeCheckinRecord(group, name, status);
    
    if (success) {
      return NextResponse.json({ success: true, message: '簽到記錄已保存' });
    } else {
      return NextResponse.json({ error: 'Failed to save checkin record' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing checkin record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
