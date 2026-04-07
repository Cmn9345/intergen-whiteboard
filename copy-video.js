const fs = require('fs');
const path = require('path');

const sourceFile = 'C:\\Users\\lianz\\Downloads\\動物大趴踢.mov';
const destDir = path.join(__dirname, 'public', 'videos');
const destFile = path.join(destDir, '動物大趴踢.mov');

// 確保目標目錄存在
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 檢查來源檔案是否存在
if (!fs.existsSync(sourceFile)) {
  console.log('來源檔案不存在:', sourceFile);
  console.log('請確認檔案路徑是否正確');
  process.exit(1);
}

// 複製檔案
try {
  fs.copyFileSync(sourceFile, destFile);
  console.log('影片已成功複製到:', destFile);
  console.log('檔案大小:', (fs.statSync(destFile).size / 1024 / 1024).toFixed(2), 'MB');
} catch (error) {
  console.error('複製失敗:', error.message);
  process.exit(1);
}


