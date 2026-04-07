const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\lianz\\Downloads\\動物腳';
const destDir = path.join(__dirname, 'public', 'images', 'animal-feet');

// 確保目標目錄存在
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 檢查來源目錄是否存在
if (!fs.existsSync(sourceDir)) {
  console.log('來源目錄不存在:', sourceDir);
  process.exit(1);
}

// 複製所有PNG檔案
try {
  const files = fs.readdirSync(sourceDir);
  let copiedCount = 0;
  
  files.forEach(file => {
    if (file.toLowerCase().endsWith('.png')) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log('已複製:', file);
      copiedCount++;
    }
  });
  
  console.log(`\n完成！共複製 ${copiedCount} 個檔案`);
} catch (error) {
  console.error('複製失敗:', error.message);
}


