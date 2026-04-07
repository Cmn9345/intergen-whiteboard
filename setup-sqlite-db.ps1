# SQLite 資料庫快速設置腳本

Write-Host "🚀 設置 SQLite 資料庫..." -ForegroundColor Green

# 檢查 Node.js 和 npm
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 或 npm 未安裝" -ForegroundColor Red
    exit 1
}

# 更新 Prisma schema 為 SQLite
Write-Host "`n🔧 配置 Prisma 使用 SQLite..." -ForegroundColor Yellow

$schemaContent = @"
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
  TESTER
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  displayName  String
  role         Role      @default(STUDENT)
  isTester     Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  enrollments Enrollment[]
  textPosts   TextPost[]
  voicePosts  VoicePost[]
  moods       Mood[]
  checkins    Checkin[]
}

model Course {
  id          String        @id @default(cuid())
  title       String
  description String
  startsAt    DateTime?
  endsAt      DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  enrollments Enrollment[]
  textPosts   TextPost[]
  voicePosts  VoicePost[]
  moods       Mood[]
  checkins    Checkin[]
}

model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
}

model TextPost {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  courseId  String?

  author User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  course Course? @relation(fields: [courseId], references: [id])
}

model VoicePost {
  id        String   @id @default(cuid())
  title     String
  audioUrl  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  courseId  String?

  author User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  course Course? @relation(fields: [courseId], references: [id])
}

model Mood {
  id         String   @id @default(cuid())
  value      Int
  note       String?
  recordedAt DateTime @default(now())
  userId     String
  courseId   String?

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course? @relation(fields: [courseId], references: [id])
}

model Checkin {
  id        String   @id @default(cuid())
  date      DateTime
  userId    String
  courseId  String?
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course? @relation(fields: [courseId], references: [id])

  @@unique([userId, date])
}
"@

$schemaContent | Out-File -FilePath "prisma/schema.prisma" -Encoding UTF8
Write-Host "✅ Prisma schema 已更新為 SQLite" -ForegroundColor Green

# 生成環境變數文件
Write-Host "`n📝 生成環境變數文件..." -ForegroundColor Yellow
$envContent = @"
# SQLite 資料庫配置
DATABASE_URL="file:./dev.db"

# API 認證 (請更改為安全的隨機值)
API_KEY=$(New-Guid).ToString().Replace('-', '')
API_TOKEN=$(New-Guid).ToString().Replace('-', '')

# Next.js 配置
NEXTAUTH_SECRET="$(New-Guid).ToString().Replace('-', '')"
NEXTAUTH_URL="http://localhost:3000"

# 應用程式配置
NODE_ENV="development"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ 環境變數文件已創建: .env.local" -ForegroundColor Green

# 生成 Prisma 客戶端
Write-Host "`n🔧 生成 Prisma 客戶端..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma 客戶端生成成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 生成 Prisma 客戶端失敗: $_" -ForegroundColor Red
    exit 1
}

# 推送資料庫 schema
Write-Host "`n📤 推送資料庫 schema..." -ForegroundColor Yellow
try {
    npx prisma db push
    Write-Host "✅ 資料庫 schema 推送成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送 schema 失敗: $_" -ForegroundColor Red
    exit 1
}

# 創建一些測試數據
Write-Host "`n📊 創建測試數據..." -ForegroundColor Yellow
try {
    $testDataScript = @"
-- 創建測試用戶
INSERT INTO User (id, email, passwordHash, displayName, role, isTester, createdAt, updatedAt) VALUES
('user1', 'admin@example.com', 'hashed_password_1', '管理員', 'ADMIN', false, datetime('now'), datetime('now')),
('user2', 'teacher@example.com', 'hashed_password_2', '老師', 'TEACHER', false, datetime('now'), datetime('now')),
('user3', 'student@example.com', 'hashed_password_3', '學生', 'STUDENT', false, datetime('now'), datetime('now'));

-- 創建測試課程
INSERT INTO Course (id, title, description, startsAt, endsAt, createdAt, updatedAt) VALUES
('course1', '代間共學基礎課程', '學習代間共學的基本概念和方法', datetime('now'), datetime('now', '+30 days'), datetime('now'), datetime('now')),
('course2', '數位技能培訓', '提升長者的數位技能', datetime('now'), datetime('now', '+60 days'), datetime('now'), datetime('now'));

-- 創建測試心情記錄
INSERT INTO Mood (id, value, note, recordedAt, userId, courseId) VALUES
('mood1', 5, '今天學習很開心！', datetime('now'), 'user3', 'course1'),
('mood2', 4, '課程內容很有趣', datetime('now', '-1 day'), 'user3', 'course1');

-- 創建測試簽到記錄
INSERT INTO Checkin (id, date, userId, courseId, createdAt) VALUES
('checkin1', datetime('now'), 'user3', 'course1', datetime('now')),
('checkin2', datetime('now', '-1 day'), 'user3', 'course1', datetime('now'));
"@

    $testDataScript | Out-File -FilePath "test-data.sql" -Encoding UTF8
    Write-Host "✅ 測試數據腳本已創建" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 創建測試數據腳本失敗，但不影響主要功能" -ForegroundColor Yellow
}

Write-Host "`n🎉 SQLite 資料庫設置完成！" -ForegroundColor Green
Write-Host "`n📋 下一步:" -ForegroundColor Cyan
Write-Host "1. 運行 'npm run dev' 啟動開發伺服器"
Write-Host "2. 訪問 http://localhost:3000 查看主頁"
Write-Host "3. 訪問 http://localhost:3000/test-database 測試資料庫"
Write-Host "4. 訪問 http://localhost:3000/api-docs 查看 API 文檔"
Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "- SQLite 資料庫文件: ./dev.db"
Write-Host "- 可以使用 DB Browser for SQLite 查看資料庫內容"
Write-Host "- 稍後可以遷移到 PostgreSQL 或 Google Cloud SQL"
Write-Host "`n🔗 有用的命令:" -ForegroundColor Cyan
Write-Host "- 查看資料庫: npx prisma studio"
Write-Host "- 重置資料庫: npx prisma db push --force-reset"
Write-Host "- 生成客戶端: npx prisma generate"


