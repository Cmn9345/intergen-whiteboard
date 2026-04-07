import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/external/moods - 供外部 app 使用的心情記錄 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 構建查詢條件
    const where: any = {};
    
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;
    
    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }

    const moods = await prisma.mood.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true,
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
      orderBy: {
        recordedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 獲取總數
    const total = await prisma.mood.count({ where });

    return NextResponse.json({
      success: true,
      data: moods,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching external moods:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch mood records',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST /api/external/moods - 供外部 app 創建心情記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      value, 
      note, 
      userId, 
      courseId, 
      sessionId, 
      deviceInfo, 
      location 
    } = body;

    // 驗證必要欄位
    if (!value || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: value and userId are required',
      }, { status: 400 });
    }

    // 驗證心情數值範圍
    if (value < 1 || value > 10) {
      return NextResponse.json({
        success: false,
        error: 'Mood value must be between 1 and 10',
      }, { status: 400 });
    }

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // 如果提供了 courseId，檢查課程是否存在
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json({
          success: false,
          error: 'Course not found',
        }, { status: 404 });
      }
    }

    const newMood = await prisma.mood.create({
      data: {
        value,
        note,
        userId,
        courseId: courseId || null,
        sessionId,
        deviceInfo,
        location,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true,
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

    return NextResponse.json({
      success: true,
      data: newMood,
      message: 'Mood record created successfully',
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating external mood:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create mood record',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}




























