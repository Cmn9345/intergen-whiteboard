# 本地資料庫設置腳本 (使用 PostgreSQL 本地安裝)

Write-Host "🚀 設置本地 PostgreSQL 資料庫..." -ForegroundColor Green

# 檢查是否已安裝 PostgreSQL
try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "✅ PostgreSQL 已安裝: $pgVersion" -ForegroundColor Green
    } else {
        throw "PostgreSQL not found"
    }
} catch {
    Write-Host "❌ PostgreSQL 未安裝" -ForegroundColor Red
    Write-Host "請先安裝 PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. 下載: https://www.postgresql.org/download/windows/"
    Write-Host "2. 或使用 Chocolatey: choco install postgresql"
    Write-Host "3. 或使用 winget: winget install PostgreSQL.PostgreSQL"
    exit 1
}

# 提示用戶輸入資料庫信息
$dbHost = Read-Host "請輸入資料庫主機 (預設: localhost)"
if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "請輸入資料庫端口 (預設: 5432)"
if ([string]::IsNullOrEmpty($dbPort)) { $dbPort = "5432" }

$dbName = Read-Host "請輸入資料庫名稱 (預設: intergen_db)"
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "intergen_db" }

$dbUser = Read-Host "請輸入資料庫用戶名 (預設: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "請輸入資料庫密碼" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

Write-Host "`n📋 設置摘要:" -ForegroundColor Cyan
Write-Host "主機: $dbHost"
Write-Host "端口: $dbPort"
Write-Host "資料庫: $dbName"
Write-Host "用戶: $dbUser"

$confirm = Read-Host "`n確認開始設置? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ 設置已取消" -ForegroundColor Red
    exit 0
}

# 創建資料庫
Write-Host "`n🗄️ 創建資料庫..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = $dbPasswordPlain
    createdb -h $dbHost -p $dbPort -U $dbUser $dbName
    Write-Host "✅ 資料庫創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 創建資料庫失敗: $_" -ForegroundColor Red
    Write-Host "請確保 PostgreSQL 服務正在運行且用戶有創建資料庫的權限" -ForegroundColor Yellow
    exit 1
}

# 生成環境變數文件
Write-Host "`n📝 生成環境變數文件..." -ForegroundColor Yellow
$envContent = @"
# 本地 PostgreSQL 配置
DATABASE_URL="postgresql://$dbUser`:$dbPasswordPlain@$dbHost`:$dbPort/$dbName?sslmode=prefer"

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
    Write-Host "請檢查資料庫連接設置" -ForegroundColor Yellow
}

Write-Host "`n🎉 本地資料庫設置完成！" -ForegroundColor Green
Write-Host "`n📋 下一步:" -ForegroundColor Cyan
Write-Host "1. 檢查 .env.local 文件中的配置"
Write-Host "2. 運行 'npm run dev' 啟動開發伺服器"
Write-Host "3. 訪問 http://localhost:3000/test-database 測試資料庫"
Write-Host "4. 訪問 http://localhost:3000/api-docs 查看 API 文檔"
Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "- 如果遇到連接問題，請檢查 PostgreSQL 服務是否正在運行"
Write-Host "- 可以使用 pgAdmin 或 DBeaver 等工具管理資料庫"
Write-Host "- 稍後可以遷移到 Google Cloud SQL"


