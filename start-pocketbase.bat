@echo off
echo Starting PocketBase...
cd pocketbase
if not exist pocketbase.exe (
    echo PocketBase executable not found!
    echo Please download it first using the instructions in pocketbase/download.md
    pause
    exit /b 1
)

pocketbase.exe serve --http=127.0.0.1:8090
