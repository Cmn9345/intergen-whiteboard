# 設置環境變數
$env:DATABASE_URL="file:./dev.db"
$env:API_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
$env:API_TOKEN="z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4"
$env:NEXTAUTH_SECRET="my-secret-key-for-nextauth"
$env:NEXTAUTH_URL="http://localhost:3000"
$env:NODE_ENV="development"

Write-Host "✅ 環境變數已設置" -ForegroundColor Green
Write-Host "DATABASE_URL: $env:DATABASE_URL" -ForegroundColor Cyan
Write-Host "API_KEY: $env:API_KEY" -ForegroundColor Cyan


