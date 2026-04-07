# Google Cloud 設置指南

## 1. 安裝 Google Cloud CLI

### Windows 安裝
1. 下載 Google Cloud CLI 安裝程式：
   - 訪問：https://cloud.google.com/sdk/docs/install
   - 下載 Windows 版本

2. 或者使用 PowerShell 安裝：
```powershell
# 下載並安裝
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& "$env:Temp\GoogleCloudSDKInstaller.exe"
```

### 驗證安裝
```bash
gcloud --version
```

## 2. 初始化 Google Cloud

### 登入 Google Cloud
```bash
gcloud auth login
```

### 設置專案
```bash
# 列出可用專案
gcloud projects list

# 設置預設專案（替換為你的專案 ID）
gcloud config set project YOUR_PROJECT_ID
```

## 3. 啟用必要的 API

```bash
# 啟用 Cloud SQL API
gcloud services enable sqladmin.googleapis.com

# 啟用 Cloud Run API（如果使用 Cloud Run 部署）
gcloud services enable run.googleapis.com

# 啟用 App Engine API（如果使用 App Engine 部署）
gcloud services enable appengine.googleapis.com
```

## 4. 創建 Cloud SQL 實例

### 創建 PostgreSQL 實例
```bash
gcloud sql instances create intergen-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-east1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --enable-bin-log
```

### 創建資料庫
```bash
gcloud sql databases create intergen_db --instance=intergen-db
```

### 創建資料庫用戶
```bash
gcloud sql users create intergen_user \
  --instance=intergen-db \
  --password=YOUR_SECURE_PASSWORD
```

## 5. 配置環境變數

創建 `.env.local` 文件：

```env
# Google Cloud 配置
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=asia-east1
GOOGLE_CLOUD_INSTANCE_ID=intergen-db

# 資料庫連接
DATABASE_URL="postgresql://intergen_user:YOUR_SECURE_PASSWORD@/intergen_db?host=/cloudsql/your-project-id:asia-east1:intergen-db&sslmode=require"

# API 認證
API_KEY=your-secure-api-key-here
API_TOKEN=your-secure-token-here

# Next.js 配置
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 應用程式配置
NODE_ENV="development"
```

## 6. 本地開發設置

### 安裝 Cloud SQL Proxy（可選）
```bash
# 下載 Cloud SQL Proxy
curl -o cloud_sql_proxy.exe https://dl.google.com/cloudsql/cloud_sql_proxy.exe

# 啟動代理（在另一個終端）
./cloud_sql_proxy.exe -instances=your-project-id:asia-east1:intergen-db=tcp:5432
```

### 使用本地連接字符串
```env
# 如果使用 Cloud SQL Proxy
DATABASE_URL="postgresql://intergen_user:YOUR_SECURE_PASSWORD@localhost:5432/intergen_db?sslmode=require"
```

## 7. 部署到 Google Cloud

### 使用 Cloud Run 部署
```bash
# 構建並部署
gcloud run deploy intergen-app \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=postgresql://intergen_user:YOUR_SECURE_PASSWORD@/intergen_db?host=/cloudsql/your-project-id:asia-east1:intergen-db&sslmode=require"
```

### 使用 App Engine 部署
```bash
# 創建 app.yaml
echo "runtime: nodejs18
env_variables:
  DATABASE_URL: postgresql://intergen_user:YOUR_SECURE_PASSWORD@/intergen_db?host=/cloudsql/your-project-id:asia-east1:intergen-db&sslmode=require" > app.yaml

# 部署
gcloud app deploy
```

## 8. 測試設置

### 測試資料庫連接
```bash
# 運行 Prisma 遷移
npx prisma db push

# 生成 Prisma 客戶端
npx prisma generate
```

### 測試 API
```bash
# 測試健康檢查
curl https://your-app-url/api/health

# 測試用戶 API
curl -H "X-API-Key: your-api-key" https://your-app-url/api/v1/users
```

## 9. 安全設置

### 設置防火牆規則
```bash
# 允許特定 IP 訪問資料庫
gcloud sql instances patch intergen-db \
  --authorized-networks=YOUR_IP_ADDRESS/32
```

### 設置 IAM 權限
```bash
# 為服務帳戶設置權限
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:your-service-account@your-project-id.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## 10. 監控和維護

### 查看實例狀態
```bash
gcloud sql instances describe intergen-db
```

### 查看日誌
```bash
gcloud logging read "resource.type=cloudsql_database"
```

### 備份管理
```bash
# 手動創建備份
gcloud sql backups create --instance=intergen-db
```

## 故障排除

### 常見問題
1. **連接被拒絕**：檢查防火牆規則和授權網路
2. **認證失敗**：確認用戶名和密碼正確
3. **SSL 錯誤**：確保使用 `sslmode=require`
4. **權限不足**：檢查 IAM 權限設置

### 獲取幫助
```bash
# 查看命令幫助
gcloud sql instances --help

# 查看實例詳細信息
gcloud sql instances describe intergen-db
```



