import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/v1/checkins/[id] - 刪除特定簽到記錄
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 檢查記錄是否存在
    const existingCheckin = await prisma.checkin.findUnique({
      where: { id },
    });

    if (!existingCheckin) {
      return NextResponse.json({ error: '簽到記錄不存在' }, { status: 404 });
    }

    // 刪除記錄
    await prisma.checkin.delete({
      where: { id },
    });

    return NextResponse.json({ message: '簽到記錄已刪除' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting checkin:', error);
    return NextResponse.json({ error: '刪除簽到記錄失敗' }, { status: 500 });
  }
}


