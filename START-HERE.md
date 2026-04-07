# 如何启动 PocketBase

PocketBase 已经下载好了，现在你需要手动启动它。

## 方法 1：双击启动脚本（最简单）

1. 在项目根目录找到 `start-pocketbase.bat` 文件
2. 双击运行它
3. 会弹出一个命令行窗口显示 PocketBase 正在运行
4. 保持这个窗口开着（不要关闭）

## 方法 2：使用命令行

打开命令提示符（CMD）或 PowerShell，然后运行：

```batch
cd C:\Users\lianz\Downloads\intergen-whiteboard
start-pocketbase.bat
```

或者：

```batch
cd C:\Users\lianz\Downloads\intergen-whiteboard\pocketbase
pocketbase.exe serve
```

## 启动成功的标志

你应该会看到类似这样的输出：

```
Server started at http://127.0.0.1:8090
├─ REST API: http://127.0.0.1:8090/api/
└─ Admin UI: http://127.0.0.1:8090/_/
```

## 下一步

1. **访问 Admin UI**
   打开浏览器，访问：http://127.0.0.1:8090/_/

2. **创建管理员账号**
   首次访问会要求你创建管理员账号
   - 输入邮箱和密码
   - 点击 "Create and Login"

3. **设置数据表（Collections）**

   有两种方式设置数据表：

   **方式 A：使用自动化脚本（推荐）**

   创建管理员后，在新的命令行窗口运行：
   ```batch
   cd pocketbase
   set ADMIN_EMAIL=你刚创建的管理员邮箱
   set ADMIN_PASSWORD=你的密码
   node setup-collections.js
   ```

   **方式 B：手动创建（更简单但需要手动操作）**

   1. 登录 Admin UI: http://127.0.0.1:8090/_/
   2. 点击左侧的 "Collections"
   3. 参考 `pocketbase/collections-schema.json` 手动创建每个 collection

## 故障排查

### 端口被占用

如果看到错误 "address already in use" 或 "端口被占用"：

```batch
# 查找占用 8090 端口的进程
netstat -ano | findstr :8090

# 结束该进程（替换 PID 为实际的进程 ID）
taskkill /F /PID <PID>
```

然后重新启动 PocketBase。

### 防火墙警告

如果 Windows 防火墙弹出警告，点击"允许访问"。

### 无法访问 http://127.0.0.1:8090

1. 确认 PocketBase 命令行窗口还在运行
2. 检查是否有错误信息
3. 尝试重启 PocketBase

## 需要帮助？

如果遇到问题，查看：
- `README-POCKETBASE.md` - 完整的设置指南
- `pocketbase/admin-management.md` - 管理员账号管理
- `MIGRATION-GUIDE.md` - 如何在 Next.js 中使用 PocketBase
