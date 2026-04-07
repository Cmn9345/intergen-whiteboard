import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// API 認證中間件 (暫時簡化)
function authenticateRequest(request: NextRequest): { isValid: boolean; error?: string } {
  // 暫時允許所有請求，稍後可以添加認證
  return { isValid: true }
}

// GET /api/v1/users - 獲取所有用戶 (公開 API)
export async function GET(request: NextRequest) {
  try {
    // 認證檢查
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
    const role = searchParams.get('role')
    
    const skip = (page - 1) * limit
    
    const where = role ? { role: role.toUpperCase() as any } : {}
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          createdAt: true,
          // 不返回敏感信息如 passwordHash
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])
    
    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/v1/users - 創建新用戶 (公開 API)
export async function POST(request: NextRequest) {
  try {
    // 認證檢查
    const auth = authenticateRequest(request)
    if (!auth.isValid) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, passwordHash, displayName, role = 'STUDENT' } = body

    if (!email || !passwordHash || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, passwordHash, displayName' },
        { status: 400 }
      )
    }

    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        role: role.toUpperCase() as any
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      data: user,
      message: 'User created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

