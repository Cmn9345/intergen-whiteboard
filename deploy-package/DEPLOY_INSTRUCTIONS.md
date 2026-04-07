# 🚀 部署說明

## 快速部署到 Vercel

### 步驟 1：訪問 Vercel
1. 打開瀏覽器，訪問 [vercel.com](https://vercel.com)
2. 點擊右上角的 "Sign Up" 或 "Log In"
3. 使用 GitHub、GitLab 或 Email 註冊/登入

### 步驟 2：創建新專案
1. 登入後，點擊 "New Project"
2. 選擇 "Browse all templates" 或 "Import Git Repository"
3. 如果沒有 Git 倉庫，選擇 "Deploy without Git"

### 步驟 3：上傳專案
1. 如果選擇 "Deploy without Git"：
   - 將整個 `deploy-package` 資料夾拖拽到上傳區域
   - 或點擊 "Browse" 選擇資料夾

2. 如果使用 Git：
   - 先將此資料夾推送到 GitHub
   - 然後在 Vercel 中選擇該倉庫

### 步驟 4：配置環境變數
1. 在專案設置中，找到 "Environment Variables"
2. 添加以下環境變數：
   ```
   DATABASE_URL = file:./dev.db
   NODE_ENV = production
   ```

### 步驟 5：部署
1. 點擊 "Deploy" 按鈕
2. 等待部署完成（通常需要 2-5 分鐘）
3. 部署成功後，您將獲得一個 URL，例如：
   `https://your-project-name.vercel.app`

## 🌐 部署到 Netlify（替代方案）

### 步驟 1：訪問 Netlify
1. 打開瀏覽器，訪問 [netlify.com](https://netlify.com)
2. 點擊 "Sign up" 註冊帳號

### 步驟 2：部署
1. 登入後，將 `deploy-package` 資料夾拖拽到部署區域
2. 等待部署完成
3. 您將獲得一個 URL，例如：
   `https://your-project-name.netlify.app`

## ✅ 部署完成後

1. **測試功能**：
   - 訪問獲得的 URL
   - 測試簽到樹、心情溫度計等功能

2. **分享連結**：
   - 將 URL 分享給其他用戶
   - 他們可以直接在瀏覽器中訪問

3. **自定義域名**（可選）：
   - 在 Vercel/Netlify 設置中可以綁定自定義域名

## 🔧 故障排除

如果遇到問題：
1. 檢查環境變數是否正確設置
2. 查看部署日誌
3. 確保所有文件都已上傳
4. 檢查 Node.js 版本兼容性

## 📞 支援

- Vercel 文檔：https://vercel.com/docs
- Netlify 文檔：https://docs.netlify.com
- Next.js 文檔：https://nextjs.org/docs























