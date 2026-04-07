# Google Cloud 資料庫設置腳本
# 請確保已安裝 Google Cloud CLI

Write-Host "🚀 開始設置 Google Cloud 資料庫..." -ForegroundColor Green

# 檢查 gcloud 是否已安裝
try {
    $gcloudVersion = gcloud --version 2>$null
    Write-Host "✅ Google Cloud CLI 已安裝" -ForegroundColor Green
} catch {
    Write-Host "❌ 請先安裝 Google Cloud CLI" -ForegroundColor Red
    Write-Host "下載地址: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# 提示用戶輸入專案信息
$projectId = Read-Host "請輸入你的 Google Cloud 專案 ID"
$region = Read-Host "請輸入區域 (預設: asia-east1)" 
if ([string]::IsNullOrEmpty($region)) { $region = "asia-east1" }

$instanceId = Read-Host "請輸入實例名稱 (預設: intergen-db)"
if ([string]::IsNullOrEmpty($instanceId)) { $instanceId = "intergen-db" }

$dbName = Read-Host "請輸入資料庫名稱 (預設: intergen_db)"
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "intergen_db" }

$dbUser = Read-Host "請輸入資料庫用戶名 (預設: intergen_user)"
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "intergen_user" }

$dbPassword = Read-Host "請輸入資料庫密碼" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

Write-Host "`n📋 設置摘要:" -ForegroundColor Cyan
Write-Host "專案 ID: $projectId"
Write-Host "區域: $region"
Write-Host "實例名稱: $instanceId"
Write-Host "資料庫名稱: $dbName"
Write-Host "用戶名: $dbUser"

$confirm = Read-Host "`n確認開始設置? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ 設置已取消" -ForegroundColor Red
    exit 0
}

# 設置專案
Write-Host "`n🔧 設置 Google Cloud 專案..." -ForegroundColor Yellow
gcloud config set project $projectId

# 啟用必要的 API
Write-Host "`n🔌 啟用必要的 API..." -ForegroundColor Yellow
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com

# 創建 Cloud SQL 實例
Write-Host "`n🗄️ 創建 Cloud SQL 實例..." -ForegroundColor Yellow
try {
    gcloud sql instances create $instanceId `
        --database-version=POSTGRES_15 `
        --tier=db-f1-micro `
        --region=$region `
        --storage-type=SSD `
        --storage-size=10GB `
        --storage-auto-increase `
        --backup-start-time=02:00
    Write-Host "✅ Cloud SQL 實例創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 創建實例失敗: $_" -ForegroundColor Red
    exit 1
}

# 創建資料庫
Write-Host "`n📊 創建資料庫..." -ForegroundColor Yellow
try {
    gcloud sql databases create $dbName --instance=$instanceId
    Write-Host "✅ 資料庫創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 創建資料庫失敗: $_" -ForegroundColor Red
    exit 1
}

# 創建資料庫用戶
Write-Host "`n👤 創建資料庫用戶..." -ForegroundColor Yellow
try {
    gcloud sql users create $dbUser --instance=$instanceId --password=$dbPasswordPlain
    Write-Host "✅ 資料庫用戶創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 創建用戶失敗: $_" -ForegroundColor Red
    exit 1
}

# 生成環境變數文件
Write-Host "`n📝 生成環境變數文件..." -ForegroundColor Yellow
$envContent = @"
# Google Cloud 配置
GOOGLE_CLOUD_PROJECT_ID=$projectId
GOOGLE_CLOUD_REGION=$region
GOOGLE_CLOUD_INSTANCE_ID=$instanceId

# 資料庫連接
DATABASE_URL="postgresql://$dbUser`:$dbPasswordPlain@/$dbName?host=/cloudsql/$projectId`:$region`:$instanceId&sslmode=require"

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
}

# 推送資料庫 schema
Write-Host "`n📤 推送資料庫 schema..." -ForegroundColor Yellow
try {
    npx prisma db push
    Write-Host "✅ 資料庫 schema 推送成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送 schema 失敗: $_" -ForegroundColor Red
}

Write-Host "`n🎉 Google Cloud 資料庫設置完成！" -ForegroundColor Green
Write-Host "`n📋 下一步:" -ForegroundColor Cyan
Write-Host "1. 檢查 .env.local 文件中的配置"
Write-Host "2. 運行 'npm run dev' 啟動開發伺服器"
Write-Host "3. 訪問 http://localhost:3000/test-database 測試資料庫"
Write-Host "4. 訪問 http://localhost:3000/api-docs 查看 API 文檔"
Write-Host "`n🔗 有用的連結:" -ForegroundColor Cyan
Write-Host "- Google Cloud Console: https://console.cloud.google.com/sql/instances"
Write-Host "- 實例管理: gcloud sql instances describe $instanceId"
Write-Host "- 查看日誌: gcloud logging read 'resource.type=cloudsql_database'"



