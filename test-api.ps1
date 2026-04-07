# 測試 API
Write-Host "🧪 測試 API 連接..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ API 健康檢查成功" -ForegroundColor Green
    Write-Host "狀態碼: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "回應內容: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API 測試失敗: $_" -ForegroundColor Red
}

try {
    $headers = @{
        'X-API-Key' = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
        'Content-Type' = 'application/json'
    }
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users" -Method GET -Headers $headers -TimeoutSec 10
    Write-Host "✅ 用戶 API 測試成功" -ForegroundColor Green
    Write-Host "狀態碼: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "回應內容: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ 用戶 API 測試失敗: $_" -ForegroundColor Red
}


