@echo off
echo ========================================
echo   代間共學互動平台 - 快速部署
echo ========================================
echo.
echo 正在打開 Vercel 部署頁面...
start https://vercel.com/new
echo.
echo 正在打開 Netlify 部署頁面...
start https://app.netlify.com/drop
echo.
echo 部署說明：
echo 1. 將此資料夾拖拽到 Vercel 或 Netlify 的部署區域
echo 2. 設置環境變數：DATABASE_URL=file:./dev.db
echo 3. 等待部署完成
echo 4. 獲得公開的 URL 連結
echo.
echo 按任意鍵關閉...
pause >nul























