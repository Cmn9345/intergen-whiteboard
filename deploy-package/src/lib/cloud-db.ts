import { PrismaClient } from '@prisma/client';
import { validateGoogleCloudConfig } from './google-cloud';

// 雲端資料庫連接配置
const createCloudPrismaClient = () => {
  // 驗證 Google Cloud 配置
  if (!validateGoogleCloudConfig()) {
    throw new Error('Google Cloud configuration is incomplete');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// 全域 Prisma 客戶端實例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createCloudPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 資料庫健康檢查
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: any;
}> {
  try {
    // 測試資料庫連接
    await prisma.$queryRaw`SELECT 1`;
    
    // 檢查基本表是否存在
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    return {
      status: 'healthy',
      message: 'Database connection successful',
      details: { tableCount }
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      message: 'Database connection failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

// 優雅關閉資料庫連接
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}



