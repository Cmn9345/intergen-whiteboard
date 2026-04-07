# Google Cloud 設置測試腳本

Write-Host "🧪 測試 Google Cloud 資料庫設置..." -ForegroundColor Green

# 檢查環境變數文件
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local 文件存在" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local 文件不存在" -ForegroundColor Red
    Write-Host "請先運行 setup-cloud-db.ps1" -ForegroundColor Yellow
    exit 1
}

# 檢查 Prisma schema
if (Test-Path "prisma/schema.prisma") {
    Write-Host "✅ Prisma schema 文件存在" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma schema 文件不存在" -ForegroundColor Red
    exit 1
}

# 測試 Prisma 連接
Write-Host "`n🔌 測試資料庫連接..." -ForegroundColor Yellow
try {
    $result = npx prisma db pull --force 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 資料庫連接成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 資料庫連接失敗" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 測試資料庫連接時發生錯誤: $_" -ForegroundColor Red
}

# 測試 API 健康檢查
Write-Host "`n🏥 測試 API 健康檢查..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API 健康檢查成功" -ForegroundColor Green
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "狀態: $($healthData.status)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ API 健康檢查失敗 (狀態碼: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API 健康檢查失敗: $_" -ForegroundColor Red
    Write-Host "請確保開發伺服器正在運行 (npm run dev)" -ForegroundColor Yellow
}

# 測試用戶 API
Write-Host "`n👥 測試用戶 API..." -ForegroundColor Yellow
try {
    # 讀取 API Key
    $envContent = Get-Content ".env.local" -Raw
    $apiKeyMatch = [regex]::Match($envContent, 'API_KEY=([^\r\n]+)')
    if ($apiKeyMatch.Success) {
        $apiKey = $apiKeyMatch.Groups[1].Value
        $headers = @{
            'X-API-Key' = $apiKey
            'Content-Type' = 'application/json'
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users" -Method GET -Headers $headers -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ 用戶 API 測試成功" -ForegroundColor Green
            $userData = $response.Content | ConvertFrom-Json
            Write-Host "用戶數量: $($userData.data.Count)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 用戶 API 測試失敗 (狀態碼: $($response.StatusCode))" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ 無法找到 API Key" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 用戶 API 測試失敗: $_" -ForegroundColor Red
}

# 檢查 Google Cloud 實例狀態
Write-Host "`n☁️ 檢查 Google Cloud 實例狀態..." -ForegroundColor Yellow
try {
    $envContent = Get-Content ".env.local" -Raw
    $projectMatch = [regex]::Match($envContent, 'GOOGLE_CLOUD_PROJECT_ID=([^\r\n]+)')
    $instanceMatch = [regex]::Match($envContent, 'GOOGLE_CLOUD_INSTANCE_ID=([^\r\n]+)')
    
    if ($projectMatch.Success -and $instanceMatch.Success) {
        $projectId = $projectMatch.Groups[1].Value
        $instanceId = $instanceMatch.Groups[1].Value
        
        $result = gcloud sql instances describe $instanceId --project=$projectId 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Google Cloud 實例狀態正常" -ForegroundColor Green
            $stateMatch = [regex]::Match($result, 'state:\s+(\w+)')
            if ($stateMatch.Success) {
                Write-Host "實例狀態: $($stateMatch.Groups[1].Value)" -ForegroundColor Cyan
            }
        } else {
            Write-Host "❌ 無法獲取實例狀態" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
        }
    } else {
        Write-Host "❌ 無法找到專案 ID 或實例 ID" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 檢查實例狀態時發生錯誤: $_" -ForegroundColor Red
}

Write-Host "`n📊 測試完成！" -ForegroundColor Green
Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "- 如果 API 測試失敗，請確保開發伺服器正在運行"
Write-Host "- 如果資料庫連接失敗，請檢查 .env.local 中的 DATABASE_URL"
Write-Host "- 如果 Google Cloud 實例狀態異常，請檢查 gcloud 認證和權限"



