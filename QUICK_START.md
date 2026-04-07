# 🚀 Google Cloud 資料庫快速開始指南

## 📋 前置要求

1. **Google Cloud 帳戶** - 如果沒有，請到 [Google Cloud Console](https://console.cloud.google.com) 註冊
2. **Google Cloud CLI** - 下載並安裝 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
3. **Node.js 18+** - 確保已安裝 Node.js

## ⚡ 快速設置 (5 分鐘)

### 1. 登入 Google Cloud
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. 運行自動設置腳本
```powershell
# Windows PowerShell
.\setup-cloud-db.ps1
```

### 3. 測試設置
```powershell
# 測試所有配置
.\test-cloud-setup.ps1
```

### 4. 啟動開發伺服器
```bash
npm run dev
```

### 5. 訪問應用程式
- 主頁: http://localhost:3000
- API 文檔: http://localhost:3000/api-docs
- 資料庫測試: http://localhost:3000/test-database

## 🌐 部署到雲端

### 快速部署
```powershell
# 部署到 Google Cloud
.\deploy-to-cloud.ps1
```

### 手動部署 (Cloud Run)
```bash
gcloud run deploy intergen-app \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

## 🔑 API 使用

### 獲取 API Key
API Key 會在 `.env.local` 文件中自動生成。

### 測試 API
```bash
# 健康檢查
curl https://your-app-url/api/health

# 獲取用戶列表
curl -H "X-API-Key: your-api-key" https://your-app-url/api/v1/users
```

## 📊 資料庫操作

### 基本 CRUD 操作
```javascript
// 創建用戶
const response = await fetch('/api/v1/users', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    displayName: '用戶名稱',
    role: 'STUDENT'
  })
});
```

### 查詢資料
```javascript
// 獲取課程列表
const courses = await fetch('/api/v1/courses?page=1&limit=10', {
  headers: {
    'X-API-Key': 'your-api-key'
  }
});
```

## 🛠️ 開發工具

### Prisma Studio
```bash
# 啟動 Prisma Studio (資料庫管理界面)
npx prisma studio
```

### 資料庫遷移
```bash
# 推送 schema 變更
npx prisma db push

# 生成 Prisma 客戶端
npx prisma generate
```

## 🔒 安全設置

### 環境變數
確保 `.env.local` 文件包含：
- 安全的 API Key
- 強密碼
- 正確的資料庫連接字符串

### 防火牆規則
```bash
# 限制資料庫訪問
gcloud sql instances patch intergen-db \
  --authorized-networks=YOUR_IP_ADDRESS/32
```

## 📈 監控和維護

### 查看日誌
```bash
# Cloud Run 日誌
gcloud run logs tail intergen-app --region=asia-east1

# 資料庫日誌
gcloud logging read "resource.type=cloudsql_database"
```

### 備份
```bash
# 手動備份
gcloud sql backups create --instance=intergen-db
```

## 🆘 故障排除

### 常見問題

1. **連接被拒絕**
   - 檢查防火牆規則
   - 確認 IP 地址在授權網路中

2. **認證失敗**
   - 檢查 API Key 是否正確
   - 確認環境變數設置

3. **部署失敗**
   - 檢查 Google Cloud 權限
   - 確認專案 ID 正確

### 獲取幫助
- 查看詳細設置指南: `SETUP_GUIDE.md`
- 檢查 API 文檔: `/api-docs`
- 測試資料庫連接: `/test-database`

## 🎯 下一步

1. **自定義 API** - 根據需求修改 API 端點
2. **添加認證** - 實現用戶登入系統
3. **數據分析** - 添加統計和報表功能
4. **擴展功能** - 添加更多業務邏輯

## 📞 支援

如果遇到問題：
1. 檢查日誌文件
2. 運行測試腳本
3. 查看 Google Cloud Console
4. 參考官方文檔

---

🎉 **恭喜！** 你現在有一個完全雲端化的資料庫系統，其他專案可以安全地調用和共享資料！



