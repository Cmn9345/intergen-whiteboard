import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/moods - 獲取所有心情記錄
export async function GET() {
  try {
    const moods = await prisma.mood.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });
    
    return NextResponse.json({ data: moods }, { status: 200 });
  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 });
  }
}

// POST /api/v1/moods - 創建新心情記錄
export async function POST(request: NextRequest) {
  try {
    const { 
      value, 
      note, 
      userId, 
      courseId, 
      sessionId, 
      deviceInfo, 
      location 
    } = await request.json();
    
    if (!value || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 驗證心情數值範圍
    if (value < 1 || value > 10) {
      return NextResponse.json({ 
        error: 'Mood value must be between 1 and 10' 
      }, { status: 400 });
    }

    const newMood = await prisma.mood.create({
      data: {
        value,
        note,
        userId,
        courseId,
        sessionId,
        deviceInfo,
        location,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            createdAt: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
    
    return NextResponse.json({ data: newMood }, { status: 201 });
  } catch (error) {
    console.error('Error creating mood:', error);
    return NextResponse.json({ error: 'Failed to create mood' }, { status: 500 });
  }
}


