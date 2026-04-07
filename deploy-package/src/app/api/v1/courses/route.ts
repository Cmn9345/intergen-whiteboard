import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/cloud-db'

// API 認證中間件
function authenticateRequest(request: NextRequest): { isValid: boolean; error?: string } {
  const apiKey = request.headers.get('x-api-key')
  const authHeader = request.headers.get('authorization')
  
  if (apiKey && apiKey === process.env.API_KEY) {
    return { isValid: true }
  }
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (token === process.env.API_TOKEN) {
      return { isValid: true }
    }
  }
  
  return { isValid: false, error: 'Invalid or missing authentication' }
}

// GET /api/v1/courses - 獲取所有課程 (公開 API)
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.isValid) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const active = searchParams.get('active')
    
    const skip = (page - 1) * limit
    
    const where = active === 'true' ? {
      OR: [
        { startsAt: { lte: new Date() }, endsAt: { gte: new Date() } },
        { startsAt: { lte: new Date() }, endsAt: null }
      ]
    } : {}
    
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              enrollments: true,
              textPosts: true,
              voicePosts: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ])
    
    return NextResponse.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/v1/courses - 創建新課程 (公開 API)
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.isValid) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      )
    }

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
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            textPosts: true,
            voicePosts: true
          }
        }
      }
    })

    return NextResponse.json({
      data: course,
      message: 'Course created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}



