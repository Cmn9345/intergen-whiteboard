import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/checkins - 獲取所有簽到記錄
export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
      include: {
        user: true,
        course: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(checkins)
  } catch (error) {
    console.error('Error fetching checkins:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checkins' },
      { status: 500 }
    )
  }
}

// POST /api/checkins - 創建新簽到記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, date } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      )
    }

    const checkinDate = date ? new Date(date) : new Date()

    // 檢查是否已經簽到過（同一天）
    const existingCheckin = await prisma.checkin.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate()),
          lt: new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate() + 1)
        }
      }
    })

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'User has already checked in today' },
        { status: 409 }
      )
    }

    const checkin = await prisma.checkin.create({
      data: {
        userId,
        courseId: courseId || null,
        date: checkinDate
      },
      include: {
        user: true,
        course: true
      }
    })

    return NextResponse.json(checkin, { status: 201 })
  } catch (error) {
    console.error('Error creating checkin:', error)
    return NextResponse.json(
      { error: 'Failed to create checkin' },
      { status: 500 }
    )
  }
}



