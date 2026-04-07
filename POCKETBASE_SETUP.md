# PocketBase 簽到樹設定指南

## 概述

簽到樹現已改為從 PocketBase 載入學生資料，照片也從 PocketBase 的 `photo` 欄位抓取。

## 設定步驟

### 1. 啟動 PocketBase

PocketBase 應該已經在運行中。如果沒有，請執行：

```bash
cd pocketbase
./pocketbase.exe serve
```

PocketBase 會在 http://127.0.0.1:8090 上運行。

### 2. 建立 Admin 帳號

首次啟動 PocketBase 時，請訪問：
http://127.0.0.1:8090/_/

建立一個 admin 帳號。

### 3. 更新 Collections Schema

執行以下命令來更新 collections schema（包含新的 group 和 photo 欄位）：

```bash
cd pocketbase
set ADMIN_EMAIL=你的admin郵箱
set ADMIN_PASSWORD=你的admin密碼
node setup-collections.js
```

或者手動在 PocketBase Admin UI 中更新 `users` collection，添加以下欄位：

- **group** (Number, 選填)
  - Min: 1
  - Max: 100

- **photo** (File, 選填)
  - Max files: 1
  - Max size: 5MB
  - 允許的類型: image/jpeg, image/png, image/gif, image/webp, image/svg+xml

- **groupImageUrl** (URL, 選填)

### 4. 添加學生資料

在 PocketBase Admin UI (http://127.0.0.1:8090/_/) 中：

1. 進入 **Collections** → **users**
2. 點擊 **New record** 建立新學生
3. 填寫以下欄位：
   - **email**: 學生郵箱（必填，用於登入）
   - **password**: 設定密碼（必填）
   - **displayName**: 顯示名稱（必填，會顯示在簽到樹上）
   - **role**: 選擇 **STUDENT**（必填）
   - **group**: 組別號碼（選填，例如：1, 2, 3...）
   - **photo**: 上傳學生照片（選填，會顯示在簽到樹的圖標上）
   - **groupImageUrl**: 組別圖片 URL（選填）

4. 點擊 **Create** 儲存

### 5. 匯入大量資料（選用）

如果需要匯入多位學生，可以使用 PocketBase 的 API 或直接匯入 JSON 檔案。

範例：使用 API 批次建立學生

```javascript
// 需要先在 PocketBase Admin UI 中登入取得 token
const students = [
  { email: 'student1@example.com', password: 'password123', displayName: '王小明', role: 'STUDENT', group: 1 },
  { email: 'student2@example.com', password: 'password123', displayName: '李小華', role: 'STUDENT', group: 1 },
  // ... 更多學生
];

// 使用 PocketBase JavaScript SDK
for (const student of students) {
  await pb.collection('users').create(student);
}
```

## 資料格式

簽到樹會從 PocketBase 讀取以下資料：

```javascript
{
  group: 1,              // 組別（用於分配顏色和分組顯示）
  name: "王小明",         // displayName
  color: "#e11d48",      // 根據組別自動分配
  imageUrl: "http://...", // 從 photo 欄位生成的 URL
  groupImageUrl: "..."   // 組別圖片 URL（選填）
}
```

## 顏色分配

系統會根據組別自動分配以下顏色：

- 第 1 組: #e11d48 (紅色)
- 第 2 組: #ea580c (橙色)
- 第 3 組: #059669 (綠色)
- 第 4 組: #7c3aed (紫色)
- 第 5 組: #dc2626 (深紅)

組別 6+ 會循環使用這些顏色。

## 驗證設定

1. 確認 PocketBase 運行中：訪問 http://127.0.0.1:8090/api/health
2. 確認學生資料：訪問 http://localhost:3001/api/students
3. 開啟簽到樹：訪問 http://localhost:3001/checkin-tree

如果一切正常，你應該能在簽到樹上看到學生名單和他們的照片！

## 疑難排解

### 問題：簽到樹顯示空白或沒有學生

**解決方案：**
1. 檢查 PocketBase 是否運行：http://127.0.0.1:8090
2. 檢查是否有學生資料且 role = "STUDENT"
3. 查看瀏覽器 Console 是否有錯誤訊息
4. 確認 .env.local 中的 NEXT_PUBLIC_POCKETBASE_URL 設定正確

### 問題：照片無法顯示

**解決方案：**
1. 確認學生記錄中有上傳 photo 檔案
2. 檢查檔案類型是否支援（JPEG, PNG, GIF, WebP, SVG）
3. 檢查檔案大小是否 < 5MB
4. 查看瀏覽器 Network tab，確認圖片 URL 是否正確

### 問題：無法連接到 PocketBase

**解決方案：**
1. 確認 PocketBase 正在運行
2. 確認防火牆沒有阻擋 port 8090
3. 嘗試訪問 http://127.0.0.1:8090/_/ 確認可連接

## API 端點

- **GET /api/students** - 取得所有學生資料（用於簽到樹）
- **GET /api/v1/checkins** - 取得簽到記錄
- **POST /api/v1/checkins** - 建立簽到記錄

## 資料流程

```
PocketBase (users collection, role=STUDENT)
  ↓
GET /api/students
  ↓
簽到樹組件 (checkin-tree/page.tsx)
  ↓
顯示學生名單和照片
```

## 下一步

現在你可以：
1. 在 PocketBase 中管理學生資料
2. 上傳學生照片
3. 設定組別分組
4. 在簽到樹上進行簽到
5. 查看簽到記錄

祝使用愉快！
