import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses - 獲取所有課程
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            user: true
          }
        },
        textPosts: {
          include: {
            author: true
          }
        },
        voicePosts: {
          include: {
            author: true
          }
        },
        moods: {
          include: {
            user: true
          }
        },
        checkins: {
          include: {
            user: true
          }
        }
      }
    })
    
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - 創建新課程
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, startsAt, endsAt } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}



