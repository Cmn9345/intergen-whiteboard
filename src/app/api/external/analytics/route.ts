import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/external/analytics - 供外部 app 使用的分析數據 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type') || 'summary'; // summary, trends, stats

    // 構建日期範圍
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // 構建用戶和課程過濾
    const userFilter = userId ? { userId } : {};
    const courseFilter = courseId ? { courseId } : {};

    if (type === 'summary') {
      // 獲取摘要統計
      const [moodStats, checkinStats, userStats, courseStats] = await Promise.all([
        // 心情統計
        prisma.mood.aggregate({
          where: {
            ...userFilter,
            ...courseFilter,
            ...(Object.keys(dateFilter).length > 0 && { recordedAt: dateFilter }),
          },
          _count: true,
          _avg: { value: true },
          _min: { value: true },
          _max: { value: true },
        }),
        
        // 簽到統計
        prisma.checkin.aggregate({
          where: {
            ...userFilter,
            ...courseFilter,
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
          },
          _count: true,
        }),
        
        // 用戶統計
        prisma.user.count(),
        
        // 課程統計
        prisma.course.count(),
      ]);

      // 獲取最近的心情趨勢（最近7天）
      const recentMoods = await prisma.mood.findMany({
        where: {
          ...userFilter,
          ...courseFilter,
          recordedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          value: true,
          recordedAt: true,
        },
        orderBy: {
          recordedAt: 'asc',
        },
      });

      // 獲取簽到狀態分佈
      const checkinStatusStats = await prisma.checkin.groupBy({
        by: ['status'],
        where: {
          ...userFilter,
          ...courseFilter,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        _count: true,
      });

      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalMoods: moodStats._count,
            averageMood: moodStats._avg.value,
            minMood: moodStats._min.value,
            maxMood: moodStats._max.value,
            totalCheckins: checkinStats._count,
            totalUsers: userStats,
            totalCourses: courseStats,
          },
          trends: {
            recentMoods: recentMoods.map((mood: any) => ({
              value: mood.value,
              date: mood.recordedAt.toISOString().split('T')[0],
            })),
          },
          checkinStatusDistribution: checkinStatusStats.map((stat: any) => ({
            status: stat.status,
            count: stat._count,
          })),
        },
        timestamp: new Date().toISOString(),
      }, { status: 200 });

    } else if (type === 'trends') {
      // 獲取趨勢數據
      const moodTrends = await prisma.mood.findMany({
        where: {
          ...userFilter,
          ...courseFilter,
          ...(Object.keys(dateFilter).length > 0 && { recordedAt: dateFilter }),
        },
        select: {
          value: true,
          recordedAt: true,
          user: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          recordedAt: 'desc',
        },
        take: 100,
      });

      const checkinTrends = await prisma.checkin.findMany({
        where: {
          ...userFilter,
          ...courseFilter,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        select: {
          date: true,
          status: true,
          checkinType: true,
          user: {
            select: {
              displayName: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: 100,
      });

      return NextResponse.json({
        success: true,
        data: {
          moodTrends,
          checkinTrends,
        },
        timestamp: new Date().toISOString(),
      }, { status: 200 });

    } else if (type === 'stats') {
      // 獲取詳細統計
      // 使用 Prisma 查詢而不是原始 SQL
      const dailyMoodStats = await prisma.mood.groupBy({
        by: ['recordedAt'],
        where: {
          ...userFilter,
          ...courseFilter,
          ...(Object.keys(dateFilter).length > 0 && { recordedAt: dateFilter }),
        },
        _count: true,
        _avg: { value: true },
        _min: { value: true },
        _max: { value: true },
        orderBy: {
          recordedAt: 'desc',
        },
        take: 30,
      });

      const dailyCheckinStats = await prisma.checkin.groupBy({
        by: ['date'],
        where: {
          ...userFilter,
          ...courseFilter,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        _count: true,
        orderBy: {
          date: 'desc',
        },
        take: 30,
      });

      return NextResponse.json({
        success: true,
        data: {
          dailyMoodStats,
          dailyCheckinStats,
        },
        timestamp: new Date().toISOString(),
      }, { status: 200 });

    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid type parameter. Must be one of: summary, trends, stats',
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error fetching external analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
