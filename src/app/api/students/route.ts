import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/students`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const records = await res.json();

    // 轉換為簽到樹需要的格式
    const colors = ['#e11d48', '#ea580c', '#059669', '#7c3aed', '#dc2626', '#0891b2', '#4f46e5', '#be185d', '#15803d', '#b45309'];

    const members = records.map((record: any, index: number) => {
      const group = record.group || record.Group || 1;
      const name = record.Name || record.name || `學生${index + 1}`;
      const color = colors[(parseInt(group) - 1) % colors.length];

      // 照片 URL：透過 Render 的 files proxy
      let imageUrl: string | undefined = undefined;
      if (record.photo) {
        imageUrl = `${API_BASE}/api/files/${record.collectionId}/${record.id}/${record.photo}`;
      }

      return {
        group: typeof group === 'number' ? group : parseInt(group) || 1,
        name,
        color,
        imageUrl,
      };
    });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  }
}
