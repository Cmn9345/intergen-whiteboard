# Google Cloud 資料庫設置指南

## 1. Google Cloud SQL 設置

### 創建 PostgreSQL 實例
```bash
# 使用 gcloud CLI 創建實例
gcloud sql instances create intergen-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-east1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase
```

### 創建資料庫
```bash
# 創建資料庫
gcloud sql databases create intergen_db --instance=intergen-db
```

### 創建用戶
```bash
# 創建資料庫用戶
gcloud sql users create intergen_user \
  --instance=intergen-db \
  --password=your-secure-password
```

## 2. 環境變數配置

創建 `.env.local` 文件並添加以下配置：

```env
# Google Cloud 配置
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=asia-east1
GOOGLE_CLOUD_INSTANCE_ID=intergen-db

# 資料庫連接 (使用 Cloud SQL Proxy)
DATABASE_URL="postgresql://intergen_user:your-secure-password@/intergen_db?host=/cloudsql/your-project-id:asia-east1:intergen-db&sslmode=require"

# 或者使用公開 IP 連接
# DATABASE_URL="postgresql://intergen_user:your-secure-password@public-ip:5432/intergen_db?sslmode=require"

# Next.js 配置
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 應用程式配置
NODE_ENV="development"
```

## 3. 安裝依賴

```bash
# 安裝 Google Cloud 相關依賴
npm install google-auth-library

# 安裝 PostgreSQL 驅動
npm install pg @types/pg
```

## 4. 部署到 Google Cloud

### 使用 Cloud Run
```bash
# 構建並部署
gcloud run deploy intergen-app \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

### 使用 App Engine
```bash
# 部署到 App Engine
gcloud app deploy
```

## 5. 其他專案調用

### API 端點
- 用戶管理: `https://your-app-url/api/users`
- 課程管理: `https://your-app-url/api/courses`
- 心情記錄: `https://your-app-url/api/moods`
- 簽到記錄: `https://your-app-url/api/checkins`

### 認證方式
1. **API Key 認證** (推薦用於服務間調用)
2. **OAuth 2.0** (用於用戶認證)
3. **JWT Token** (用於應用程式認證)

## 6. 安全配置

### 防火牆規則
```bash
# 允許特定 IP 訪問資料庫
gcloud sql instances patch intergen-db \
  --authorized-networks=your-ip-address/32
```

### SSL 連接
- 所有連接都使用 SSL
- 證書自動管理
- 強制 SSL 模式

## 7. 監控和備份

### 自動備份
```bash
# 啟用自動備份
gcloud sql instances patch intergen-db \
  --backup-start-time=02:00 \
  --enable-bin-log
```

### 監控
- 使用 Google Cloud Monitoring
- 設置警報和通知
- 查看性能指標



