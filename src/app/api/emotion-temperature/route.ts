import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// GET: 獲取心情投票記錄
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekend = searchParams.get('weekend');

  try {
    const params = new URLSearchParams({ sort: '-created' });
    if (weekend !== null && weekend !== '') {
      params.set('filter', `weekend = "${weekend}"`);
    }

    const res = await fetch(`${API_BASE}/api/collections/emotion_temperature/records?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    return NextResponse.json({ data: result.items || [] });
  } catch (error: any) {
    console.error('Error fetching emotion_temperature records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch records', details: error.message },
      { status: 500 }
    );
  }
}

// POST: 新增心情投票記錄
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Name, group, weekend, emotional } = body;

    // 檢查是否已投票
    const checkParams = new URLSearchParams({
      filter: `Name = "${Name}" && weekend = "${weekend}"`,
    });
    const checkRes = await fetch(`${API_BASE}/api/collections/emotion_temperature/records?${checkParams}`);
    const checkResult = await checkRes.json();

    if (checkResult.items && checkResult.items.length > 0) {
      return NextResponse.json(
        { error: 'Already voted', message: '該學生已經投票過了' },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_BASE}/api/collections/emotion_temperature/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Name, group, weekend, emotional }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const record = await res.json();

    return NextResponse.json({ data: record });
  } catch (error: any) {
    console.error('Error creating emotion_temperature record:', error);
    return NextResponse.json(
      { error: 'Failed to create record', details: error.message },
      { status: 500 }
    );
  }
}
