import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/external/checkins - 供外部 app 使用的簽到記錄 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const checkinType = searchParams.get('checkinType');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 構建查詢條件
    const where: any = {};
    
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;
    if (checkinType) where.checkinType = checkinType;
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const checkins = await prisma.checkin.findMany({
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
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 獲取總數
    const total = await prisma.checkin.count({ where });

    return NextResponse.json({
      success: true,
      data: checkins,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching external checkins:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch checkin records',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST /api/external/checkins - 供外部 app 創建簽到記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      courseId, 
      date,
      sessionId, 
      deviceInfo, 
      location,
      checkinType = 'MANUAL',
      status = 'PRESENT',
      notes
    } = body;

    // 驗證必要欄位
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: userId is required',
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
      return NextResponse.json({
        success: false,
        error: 'User has already checked in today',
        data: existingCheckin,
      }, { status: 409 });
    }

    const newCheckin = await prisma.checkin.create({
      data: {
        userId,
        courseId: courseId || null,
        date: checkinDate,
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
      data: newCheckin,
      message: 'Checkin record created successfully',
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating external checkin:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create checkin record',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}




























