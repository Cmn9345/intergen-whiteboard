import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/clear-data - 清除所有心情和簽到資料
export async function DELETE(request: NextRequest) {
  try {
    // 清除所有心情記錄
    const deletedMoods = await prisma.mood.deleteMany({});
    
    // 清除所有簽到記錄
    const deletedCheckins = await prisma.checkin.deleteMany({});
    
    return NextResponse.json({
      message: '資料清除成功',
      deletedMoods: deletedMoods.count,
      deletedCheckins: deletedCheckins.count
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ error: '清除資料失敗' }, { status: 500 });
  }
}

// GET /api/clear-data - 獲取當前資料統計
export async function GET() {
  try {
    const moodCount = await prisma.mood.count();
    const checkinCount = await prisma.checkin.count();
    
    return NextResponse.json({
      moodCount,
      checkinCount,
      totalRecords: moodCount + checkinCount
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error getting data stats:', error);
    return NextResponse.json({ error: '獲取資料統計失敗' }, { status: 500 });
  }
}




