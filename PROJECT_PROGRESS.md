# 專案進度記錄

## 最後更新：2025-11-27

---

## 今日完成功能 (2025-11-27)

### 1. 簽到樹功能 (Checkin Tree)
- **路徑**: `/checkin-tree`
- **功能說明**:
  - 週次選擇 (1-9週)
  - 從 PocketBase `student` collection 抓取學生資料
  - 顯示組別選擇和成員列表（含 Name 和 Photo）
  - 防止同一週重複簽到
  - 簽到後頭像顯示在樹枝上（由左至右、由下至上）
  - 右上角顯示所有成員列表，已簽到者顯示勾勾
  - 資料寫入 PocketBase `signintree` collection
  - **欄位**: group, Name, weekend, checkinstatus='Yes'
- **週次選擇邏輯**:
  - 若該週已有資料 → 檢視模式（不可再簽到）
  - 若該週無資料 → 簽到模式

### 2. 心情溫度計功能 (Mood Thermometer)
- **路徑**: `/mood`
- **功能說明**:
  - 從 PocketBase `student` collection 抓取學生資料
  - 不需選擇週次（自動使用當前週次，存於 localStorage）
  - 組別選擇和成員選擇
  - 三個投票選項：難過、開心、生氣
  - 資料寫入 PocketBase `emotion_temperature` collection
  - **欄位**: Name, group, weekend (自動), emotional

### 3. Dashboard 記錄頁面更新
- **簽到記錄頁面**: `/dashboard/checkin-records`
  - 從 PocketBase `signintree` collection 抓取資料
  - 顯示：組別(group)、名字(Name)、簽到狀態(checkinstatus)、週次(weekend)
  - 按組別分組顯示
  - 「清除畫面顯示」按鈕只清除畫面，資料保留在 PocketBase

- **心情記錄頁面**: `/dashboard/mood-records`
  - 從 PocketBase `emotion_temperature` collection 抓取資料
  - 顯示：組別(group)、名字(Name)、情緒(emotional)
  - 按組別分組顯示
  - 「清除畫面顯示」按鈕只清除畫面，資料保留在 PocketBase

- **主 Dashboard 頁面**: `/dashboard`
  - 移除數字統計顯示
  - 簡化為功能入口卡片

### 4. 新增 API 端點
- `/api/signinitree` - 簽到樹資料 CRUD (signintree collection)
- `/api/emotion-temperature` - 心情溫度計資料 CRUD (emotion_temperature collection)
- `/api/students` - 學生資料 (student collection)

---

## PocketBase Collections 使用說明

| Collection 名稱 | 用途 | 欄位 |
|----------------|------|------|
| `student` | 學生資料 | Name, group, Photo |
| `signintree` | 簽到記錄 | Name, group, weekend, checkinstatus |
| `emotion_temperature` | 心情投票 | Name, group, weekend, emotional |

**PocketBase URL**: `http://127.0.0.1:8090`

---

## 已知問題與修復記錄

1. **Collection 名稱問題**:
   - 修正 `students` → `student`
   - 修正 `signinitree` → `signintree` (API 路徑保持 signinitree)

2. **Weekend 欄位類型問題**:
   - PocketBase 儲存為字串 "1"，非數字 1
   - 查詢時需使用字串比較：`weekend = "${weekend}"`

3. **樹枝定位問題**:
   - 調整 SVG 路徑座標讓頭像正確顯示在樹枝上

---

## 待辦事項

- [ ] (可選) 新增 `emotion_weather` collection 支援
- [ ] (可選) 優化簽到樹視覺效果

---

## 專案啟動步驟

1. 啟動 PocketBase:
   ```bash
   cd pocketbase
   ./pocketbase.exe serve
   ```

2. 啟動 Next.js:
   ```bash
   npm run dev
   ```

3. 開啟瀏覽器: `http://localhost:3000`
