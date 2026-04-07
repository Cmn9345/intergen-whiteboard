# 複製動物腳圖片到 public/images/animal-feet 目錄
$sourceDir = "C:\Users\lianz\Downloads\動物腳"
$destDir = "public\images\animal-feet"

# 確保目標目錄存在
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# 複製所有 PNG 檔案
if (Test-Path $sourceDir) {
    $files = Get-ChildItem -Path $sourceDir -Filter "*.png"
    foreach ($file in $files) {
        Copy-Item -Path $file.FullName -Destination "$destDir\$($file.Name)" -Force
        Write-Host "已複製: $($file.Name)"
    }
    Write-Host "`n所有圖片已複製完成！"
} else {
    Write-Host "錯誤：找不到來源資料夾 $sourceDir"
}


