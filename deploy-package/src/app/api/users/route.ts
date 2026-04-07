import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users - 獲取所有用戶
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        moods: true,
        checkins: true
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - 創建新用戶
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, passwordHash, displayName, role = 'STUDENT', isTester = false } = body

    if (!email || !passwordHash || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, passwordHash, displayName' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        role,
        isTester
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}



