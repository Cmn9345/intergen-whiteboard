import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/checkins - 獲取所有簽到記錄
export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
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
        date: 'desc',
      },
    });
    
    return NextResponse.json({ data: checkins }, { status: 200 });
  } catch (error) {
    console.error('Error fetching checkins:', error);
    return NextResponse.json({ error: 'Failed to fetch checkins' }, { status: 500 });
  }
}

// POST /api/v1/checkins - 創建新簽到記錄
export async function POST(request: NextRequest) {
  try {
    const { 
      date, 
      userId, 
      courseId, 
      sessionId, 
      deviceInfo, 
      location,
      checkinType = 'MANUAL',
      status = 'PRESENT',
      notes
    } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing required field: userId' }, { status: 400 });
    }

    const checkinDate = date ? new Date(date) : new Date();

    // 檢查是否已經簽到過（同一天）
    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate()),
          lt: new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate() + 1)
        }
      }
    });

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'User has already checked in today' },
        { status: 409 }
      );
    }

    const newCheckin = await prisma.checkin.create({
      data: {
        date: checkinDate,
        userId,
        courseId: courseId || null,
        sessionId,
        deviceInfo,
        location,
        checkinType,
        status,
        notes,
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
    
    return NextResponse.json({ data: newCheckin }, { status: 201 });
  } catch (error) {
    console.error('Error creating checkin:', error);
    return NextResponse.json({ error: 'Failed to create checkin' }, { status: 500 });
  }
}


