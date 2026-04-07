#!/bin/bash
echo "Starting PocketBase..."
cd pocketbase
if [ ! -f pocketbase ]; then
    echo "PocketBase executable not found!"
    echo "Please download it first using the instructions in pocketbase/download.md"
    exit 1
fi

./pocketbase serve --http=127.0.0.1:8090
