import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/v1/moods/[id] - 刪除特定心情記錄
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 檢查記錄是否存在
    const existingMood = await prisma.mood.findUnique({
      where: { id },
    });

    if (!existingMood) {
      return NextResponse.json({ error: '心情記錄不存在' }, { status: 404 });
    }

    // 刪除記錄
    await prisma.mood.delete({
      where: { id },
    });

    return NextResponse.json({ message: '心情記錄已刪除' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting mood:', error);
    return NextResponse.json({ error: '刪除心情記錄失敗' }, { status: 500 });
  }
}


