# 簽到樹 PocketBase 設定指南

## ✅ 已完成的修改

1. 簽到樹已改為從 PocketBase 的 `users` collection 讀取學生資料
2. 簽到圖標改為顯示 `photo` 欄位的照片
3. 支援組別分組和顏色標示

## 🚀 快速設定步驟

### 1. 開啟 PocketBase Admin UI

訪問：http://127.0.0.1:8090/_/

如果是第一次開啟，建立一個 admin 帳號。

### 2. 手動更新 users collection（推薦方式）

在 PocketBase Admin UI 中：

1. 點擊左側 **Collections** → **users**
2. 點擊右上角的設定圖示 ⚙️ → **Edit collection**
3. 在 **Fields** 標籤頁中，點擊 **+ New field** 添加以下欄位：

   **欄位 1: group**
   - Type: Number
   - Required: ❌ (不勾選)
   - Min: 1
   - Max: 100

   **欄位 2: photo**
   - Type: File
   - Required: ❌ (不勾選)
   - Max Select: 1
   - Max Size: 5242880 (5MB)
   - Mime Types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`

   **欄位 3: groupImageUrl**
   - Type: URL
   - Required: ❌ (不勾選)

4. 切換到 **API Rules** 標籤頁
5. 設定 **List/Search rule** 和 **View rule** 為空（允許公開讀取）
6. 點擊 **Save changes**

### 3. 添加學生資料

在 PocketBase Admin UI 中：

1. 進入 **Collections** → **users**
2. 點擊 **+ New record** 建立學生
3. 填寫欄位：
   - **email**: 學生郵箱（例如：`student1@example.com`）
   - **password**: 設定密碼（例如：`password123`）
   - **displayName**: 顯示名稱（例如：`王小明`）⭐ 會顯示在簽到樹上
   - **role**: 選擇 **STUDENT** ⭐ 必選
   - **group**: 組別號碼（例如：`1`）
   - **photo**: 點擊上傳學生照片 ⭐ 會顯示在簽到圖標上
   - **groupImageUrl**: 組別圖片網址（選填）

4. 點擊 **Create** 儲存

重複步驟 2-4 添加更多學生。

### 4. 測試簽到樹

1. 開啟網頁：http://localhost:3001/checkin-tree
2. 你應該能看到：
   - 從 PocketBase 載入的學生名單
   - 學生的照片顯示在簽到圖標上
   - 可以選擇學生進行簽到

## 🎨 組別顏色

系統會根據 `group` 欄位自動分配顏色：

- 第 1 組: 🔴 紅色 (#e11d48)
- 第 2 組: 🟠 橙色 (#ea580c)
- 第 3 組: 🟢 綠色 (#059669)
- 第 4 組: 🟣 紫色 (#7c3aed)
- 第 5 組: 🔴 深紅 (#dc2626)

第 6 組以上會循環使用這些顏色。

## 📝 範例學生資料

```
學生 1:
- email: student1@example.com
- password: password123
- displayName: 王小明
- role: STUDENT
- group: 1
- photo: [上傳照片]

學生 2:
- email: student2@example.com
- password: password123
- displayName: 李小華
- role: STUDENT
- group: 1
- photo: [上傳照片]

學生 3:
- email: student3@example.com
- password: password123
- displayName: 陳大明
- role: STUDENT
- group: 2
- photo: [上傳照片]
```

## 🔍 驗證設定

1. **檢查 PocketBase 運行狀態**
   - 訪問 http://127.0.0.1:8090/api/health
   - 應該顯示：`{"code":200,"message":"","data":{}}`

2. **檢查學生資料 API**
   - 訪問 http://localhost:3001/api/students
   - 應該看到學生資料的 JSON 陣列

3. **開啟簽到樹**
   - 訪問 http://localhost:3001/checkin-tree
   - 應該看到學生名單和照片

## ❓ 疑難排解

### 問題：簽到樹顯示空白

**解決方案：**
1. 開啟瀏覽器 Console (F12)
2. 查看是否有錯誤訊息
3. 確認 PocketBase 正在運行
4. 確認至少有一位 role="STUDENT" 的用戶

### 問題：照片無法顯示

**解決方案：**
1. 確認學生記錄中已上傳 photo 檔案
2. 檢查檔案格式（支援 JPG, PNG, GIF, WebP, SVG）
3. 檢查檔案大小 < 5MB

### 問題：Cannot read properties of undefined

**解決方案：**
1. 確認 users collection 已添加 `group`, `photo`, `groupImageUrl` 欄位
2. 確認 API Rules 的 List/Search rule 設為空字串（允許公開讀取）

## 🎯 下一步

現在你可以：
- ✅ 在 PocketBase 中管理學生資料
- ✅ 上傳和更新學生照片
- ✅ 設定組別分組
- ✅ 在簽到樹上進行簽到
- ✅ 查看簽到記錄

---

**提示：** 所有資料都儲存在 PocketBase 資料庫中，重新啟動後不會遺失。
