# 創建測試數據腳本
Write-Host "創建測試數據..." -ForegroundColor Green

# 創建測試用戶
Write-Host "創建測試用戶..." -ForegroundColor Yellow
try {
    $userBody = @{
        email = "testuser@example.com"
        passwordHash = "testpassword"
        displayName = "測試用戶"
        role = "STUDENT"
    } | ConvertTo-Json

    $userResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users" -Method POST -Body $userBody -ContentType "application/json"
    $userData = $userResponse.Content | ConvertFrom-Json
    $userId = $userData.data.id
    Write-Host "✅ 用戶創建成功: $($userData.data.displayName)" -ForegroundColor Green
} catch {
    Write-Host "❌ 用戶創建失敗: $_" -ForegroundColor Red
    exit 1
}

# 創建今天的心情記錄
Write-Host "創建今天的心情記錄..." -ForegroundColor Yellow
try {
    $moodBody = @{
        value = 3
        note = "今天心情很好"
        userId = $userId
    } | ConvertTo-Json

    $moodResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/moods" -Method POST -Body $moodBody -ContentType "application/json"
    $moodData = $moodResponse.Content | ConvertFrom-Json
    Write-Host "✅ 心情記錄創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 心情記錄創建失敗: $_" -ForegroundColor Red
}

# 創建今天的簽到記錄
Write-Host "創建今天的簽到記錄..." -ForegroundColor Yellow
try {
    $checkinBody = @{
        date = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        userId = $userId
    } | ConvertTo-Json

    $checkinResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/checkins" -Method POST -Body $checkinBody -ContentType "application/json"
    $checkinData = $checkinResponse.Content | ConvertFrom-Json
    Write-Host "✅ 簽到記錄創建成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 簽到記錄創建失敗: $_" -ForegroundColor Red
}

Write-Host "測試數據創建完成！" -ForegroundColor Green


