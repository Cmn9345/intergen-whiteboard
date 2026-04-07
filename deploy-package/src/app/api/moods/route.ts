import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/moods - 獲取所有心情記錄
export async function GET() {
  try {
    const moods = await prisma.mood.findMany({
      include: {
        user: true,
        course: true
      },
      orderBy: {
        recordedAt: 'desc'
      }
    })
    
    return NextResponse.json(moods)
  } catch (error) {
    console.error('Error fetching moods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    )
  }
}

// POST /api/moods - 創建新心情記錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { value, note, userId, courseId } = body

    if (!value || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: value, userId' },
        { status: 400 }
      )
    }

    // 驗證心情值範圍 (1-5)
    if (value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Mood value must be between 1 and 5' },
        { status: 400 }
      )
    }

    const mood = await prisma.mood.create({
      data: {
        value,
        note,
        userId,
        courseId: courseId || null
      },
      include: {
        user: true,
        course: true
      }
    })

    return NextResponse.json(mood, { status: 201 })
  } catch (error) {
    console.error('Error creating mood:', error)
    return NextResponse.json(
      { error: 'Failed to create mood' },
      { status: 500 }
    )
  }
}



