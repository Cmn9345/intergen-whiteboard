import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/health - 系統健康檢查
export async function GET() {
  try {
    // 測試資料庫連接
    await prisma.$queryRaw`SELECT 1`
    
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'healthy',
          message: 'Database connection successful'
        },
        api: {
          status: 'healthy',
          message: 'API service is running'
        }
      },
      version: '1.0.0'
    }
    
    return NextResponse.json(healthStatus, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}

