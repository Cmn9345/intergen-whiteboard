# 部署到 Vercel 的 PowerShell 腳本
Write-Host "開始部署到 Vercel..." -ForegroundColor Green

# 檢查是否已安裝 Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "正在安裝 Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 構建專案
Write-Host "正在構建專案..." -ForegroundColor Yellow
npm run build

# 部署到 Vercel
Write-Host "正在部署到 Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "部署完成！" -ForegroundColor Green
Write-Host "您的應用程式現在可以在網路上訪問了。" -ForegroundColor Cyan























