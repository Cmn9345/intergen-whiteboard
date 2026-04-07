# 代間共學互動平台 - 部署指南

## 快速部署到 Vercel

### 方法一：使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署到生產環境**
   ```bash
   vercel --prod
   ```

### 方法二：使用 GitHub + Vercel（自動部署）

1. **將專案推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用戶名/intergen-whiteboard.git
   git push -u origin main
   ```

2. **在 Vercel 網站部署**
   - 訪問 [vercel.com](https://vercel.com)
   - 點擊 "New Project"
   - 選擇你的 GitHub 倉庫
   - 點擊 "Deploy"

### 方法三：使用 Netlify

1. **構建專案**
   ```bash
   npm run build
   ```

2. **部署到 Netlify**
   - 訪問 [netlify.com](https://netlify.com)
   - 拖拽 `.next` 資料夾到部署區域
   - 或使用 Netlify CLI

## 環境變數設置

在部署平台設置以下環境變數：

```
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

## 功能說明

部署後，您的應用程式將包含以下功能：

- 🌳 **簽到樹** - 互動式簽到系統
- 😊 **心情溫度計** - 心情記錄和統計
- 📚 **課程內容** - 課程管理和展示
- 🔐 **人員登入** - 用戶認證系統

## 訪問連結

部署完成後，您將獲得一個公開的 URL，例如：
- `https://your-app-name.vercel.app`
- `https://your-app-name.netlify.app`

其他電腦可以通過這個連結直接訪問您的應用程式。

## 注意事項

1. 首次部署可能需要幾分鐘時間
2. 確保所有依賴都已正確安裝
3. 檢查環境變數是否正確設置
4. 建議使用 HTTPS 連結以確保安全性

## 故障排除

如果遇到問題：

1. 檢查構建日誌
2. 確認環境變數設置
3. 查看 Vercel/Netlify 的部署日誌
4. 確保所有 API 路由正常工作

## 支援

如需協助，請檢查：
- 部署平台的文檔
- Next.js 官方文檔
- 專案的 README 文件























