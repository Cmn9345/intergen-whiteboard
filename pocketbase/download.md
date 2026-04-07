# PocketBase 下载和设置指南

## 1. 下载 PocketBase

### Windows
访问 https://pocketbase.io/docs/ 或直接下载：
```bash
# 下载 Windows 版本
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.23.8/pocketbase_0.23.8_windows_amd64.zip -o pocketbase.zip

# 解压到 pocketbase 目录
tar -xf pocketbase.zip -C pocketbase
```

### 或者使用 PowerShell
```powershell
# 下载
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.23.8/pocketbase_0.23.8_windows_amd64.zip" -OutFile "pocketbase.zip"

# 解压
Expand-Archive -Path "pocketbase.zip" -DestinationPath "pocketbase"

# 清理
Remove-Item "pocketbase.zip"
```

## 2. 本地开发运行

在项目根目录运行：
```bash
cd pocketbase
.\pocketbase.exe serve
```

PocketBase 会在 http://127.0.0.1:8090 启动

首次访问 http://127.0.0.1:8090/_/ 会要求创建管理员账号。

## 3. 快速启动脚本

使用提供的 `start-pocketbase.bat` 或 `start-pocketbase.sh` 脚本来快速启动。
