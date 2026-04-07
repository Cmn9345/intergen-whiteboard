# Google Cloud 部署腳本

Write-Host "🚀 開始部署到 Google Cloud..." -ForegroundColor Green

# 檢查必要文件
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local 文件不存在" -ForegroundColor Red
    Write-Host "請先運行 setup-cloud-db.ps1" -ForegroundColor Yellow
    exit 1
}

# 讀取環境變數
$envContent = Get-Content ".env.local" -Raw
$projectMatch = [regex]::Match($envContent, 'GOOGLE_CLOUD_PROJECT_ID=([^\r\n]+)')
$regionMatch = [regex]::Match($envContent, 'GOOGLE_CLOUD_REGION=([^\r\n]+)')
$dbUrlMatch = [regex]::Match($envContent, 'DATABASE_URL="([^"]+)"')

if (-not $projectMatch.Success -or -not $regionMatch.Success -or -not $dbUrlMatch.Success) {
    Write-Host "❌ 環境變數配置不完整" -ForegroundColor Red
    exit 1
}

$projectId = $projectMatch.Groups[1].Value
$region = $regionMatch.Groups[1].Value
$databaseUrl = $dbUrlMatch.Groups[1].Value

Write-Host "📋 部署配置:" -ForegroundColor Cyan
Write-Host "專案 ID: $projectId"
Write-Host "區域: $region"

# 選擇部署方式
Write-Host "`n🎯 選擇部署方式:" -ForegroundColor Yellow
Write-Host "1. Cloud Run (推薦)"
Write-Host "2. App Engine"
$choice = Read-Host "請選擇 (1 或 2)"

if ($choice -eq "1") {
    # Cloud Run 部署
    Write-Host "`n☁️ 部署到 Cloud Run..." -ForegroundColor Yellow
    
    # 創建 Dockerfile
    $dockerfileContent = @"
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
"@

    $dockerfileContent | Out-File -FilePath "Dockerfile" -Encoding UTF8
    Write-Host "✅ Dockerfile 已創建" -ForegroundColor Green

    # 更新 next.config.ts 以支援 standalone 輸出
    $nextConfigContent = @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
};

export default nextConfig;
"@

    $nextConfigContent | Out-File -FilePath "next.config.ts" -Encoding UTF8
    Write-Host "✅ Next.js 配置已更新" -ForegroundColor Green

    # 部署到 Cloud Run
    try {
        gcloud run deploy intergen-app `
            --source . `
            --platform managed `
            --region $region `
            --allow-unauthenticated `
            --set-env-vars="DATABASE_URL=$databaseUrl,NODE_ENV=production" `
            --memory=1Gi `
            --cpu=1 `
            --max-instances=10
        
        Write-Host "✅ 部署到 Cloud Run 成功" -ForegroundColor Green
        
        # 獲取服務 URL
        $serviceUrl = gcloud run services describe intergen-app --region=$region --format="value(status.url)"
        Write-Host "🌐 服務 URL: $serviceUrl" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ 部署到 Cloud Run 失敗: $_" -ForegroundColor Red
        exit 1
    }

} elseif ($choice -eq "2") {
    # App Engine 部署
    Write-Host "`n🚀 部署到 App Engine..." -ForegroundColor Yellow
    
    # 創建 app.yaml
    $appYamlContent = @"
runtime: nodejs18
env: standard

env_variables:
  DATABASE_URL: "$databaseUrl"
  NODE_ENV: "production"

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

resources:
  cpu: 1
  memory_gb: 1
  disk_size_gb: 10
"@

    $appYamlContent | Out-File -FilePath "app.yaml" -Encoding UTF8
    Write-Host "✅ app.yaml 已創建" -ForegroundColor Green

    # 部署到 App Engine
    try {
        gcloud app deploy --quiet
        Write-Host "✅ 部署到 App Engine 成功" -ForegroundColor Green
        
        # 獲取服務 URL
        $serviceUrl = gcloud app browse --no-launch-browser
        Write-Host "🌐 服務 URL: $serviceUrl" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ 部署到 App Engine 失敗: $_" -ForegroundColor Red
        exit 1
    }

} else {
    Write-Host "❌ 無效的選擇" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 部署完成！" -ForegroundColor Green
Write-Host "`n📋 部署後步驟:" -ForegroundColor Cyan
Write-Host "1. 測試 API 健康檢查: $serviceUrl/api/health"
Write-Host "2. 查看 API 文檔: $serviceUrl/api-docs"
Write-Host "3. 測試資料庫功能: $serviceUrl/test-database"
Write-Host "`n🔧 管理命令:" -ForegroundColor Cyan
if ($choice -eq "1") {
    Write-Host "- 查看日誌: gcloud run logs tail intergen-app --region=$region"
    Write-Host "- 更新服務: gcloud run deploy intergen-app --source . --region=$region"
} else {
    Write-Host "- 查看日誌: gcloud app logs tail"
    Write-Host "- 更新服務: gcloud app deploy"
}
Write-Host "- 查看實例: gcloud sql instances list"



