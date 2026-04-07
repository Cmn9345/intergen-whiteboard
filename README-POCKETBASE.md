# PocketBase 部署快速开始

本项目已配置好 PocketBase 部署所需的所有文件。

## 快速开始（本地开发）

### Windows

1. 下载 PocketBase：

```powershell
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.23.8/pocketbase_0.23.8_windows_amd64.zip" -OutFile "pocketbase.zip"
Expand-Archive -Path "pocketbase.zip" -DestinationPath "pocketbase"
Remove-Item "pocketbase.zip"
```

2. 启动 PocketBase：

```batch
start-pocketbase.bat
```

3. 访问 http://127.0.0.1:8090/_/ 创建管理员账号

4. 设置 Collections：

```bash
cd pocketbase
set ADMIN_EMAIL=your-admin@email.com
set ADMIN_PASSWORD=your-password
node setup-collections.js
```

### Linux/Mac

1. 下载并启动：

```bash
chmod +x start-pocketbase.sh
./start-pocketbase.sh
```

2. 其余步骤同 Windows

## 快速开始（云服务器部署）

### 自动部署（推荐）

1. SSH 连接到服务器：

```bash
ssh your-username@your-server-ip
```

2. 上传并运行部署脚本：

```bash
# 上传 deploy.sh
scp pocketbase/deploy/deploy.sh your-username@your-server-ip:~/

# 在服务器上运行
chmod +x deploy.sh
sudo ./deploy.sh
```

3. 配置域名和 SSL（可选但推荐）：

参考 `pocketbase/deploy/deploy-guide.md` 中的详细说明。

## 项目文件结构

```
intergen-whiteboard/
├── pocketbase/                           # PocketBase 相关文件
│   ├── download.md                       # 下载说明
│   ├── collections-schema.json           # Collections 配置
│   ├── setup-collections.js              # 自动创建 collections
│   ├── pb_migrations/                    # 迁移文件目录
│   │   └── initial_setup.js             # 初始设置
│   └── deploy/                           # 部署相关文件
│       ├── deploy.sh                     # 自动部署脚本
│       ├── nginx.conf                    # Nginx 配置示例
│       └── deploy-guide.md              # 详细部署指南
├── start-pocketbase.bat                  # Windows 启动脚本
├── start-pocketbase.sh                   # Linux/Mac 启动脚本
├── MIGRATION-GUIDE.md                    # 完整迁移指南
└── README-POCKETBASE.md                  # 本文件
```

## 主要功能

### 已配置的 Collections

基于你的 Prisma schema，已创建以下 collections：

1. **users** (auth) - 用户认证和管理
   - email, displayName, role, isTester

2. **courses** - 课程管理
   - title, description, startsAt, endsAt

3. **enrollments** - 课程注册
   - userId, courseId

4. **textPosts** - 文字帖子
   - content, authorId, courseId

5. **voicePosts** - 语音帖子
   - title, audioFile, authorId, courseId

6. **moods** - 心情记录
   - value, note, recordedAt, userId, courseId

7. **checkins** - 签到记录
   - date, userId, courseId, checkinType, status

### 权限规则

所有 collections 都已配置适当的访问权限：
- 已登录用户可读取
- 根据角色（ADMIN, TEACHER, STUDENT）控制创建/更新/删除权限
- 用户只能修改自己的数据

## 使用 PocketBase

### 在 Next.js 中使用

```bash
npm install pocketbase
```

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// 登录
await pb.collection('users').authWithPassword(email, password);

// CRUD 操作
const courses = await pb.collection('courses').getFullList();
const course = await pb.collection('courses').getOne(id);
await pb.collection('courses').create(data);
await pb.collection('courses').update(id, data);
await pb.collection('courses').delete(id);

// 实时订阅
pb.collection('courses').subscribe('*', (e) => {
  console.log(e.action, e.record);
});
```

详细代码示例请参考 `MIGRATION-GUIDE.md`。

## 重要链接

- **本地 Admin UI**: http://127.0.0.1:8090/_/
- **本地 API**: http://127.0.0.1:8090/api/
- **官方文档**: https://pocketbase.io/docs/
- **JavaScript SDK**: https://github.com/pocketbase/js-sdk

## 下一步

1. ✅ 完成本地 PocketBase 设置
2. ✅ 在 Admin UI 中验证 collections
3. ⬜ 阅读 `MIGRATION-GUIDE.md` 了解如何更新 Next.js 代码
4. ⬜ 迁移现有数据（如有）
5. ⬜ 测试所有功能
6. ⬜ 部署到生产环境

## 需要帮助？

- 查看 `MIGRATION-GUIDE.md` - 完整的迁移指南
- 查看 `pocketbase/deploy/deploy-guide.md` - 详细的部署说明
- 访问 [PocketBase 官方文档](https://pocketbase.io/docs/)
- 加入 [PocketBase Discord](https://discord.gg/pocketbase)

## 注意事项

⚠️ **重要提醒**：

1. **不要提交敏感文件到 Git**：
   - `pocketbase/pb_data/` （数据库文件）
   - `pocketbase/*.exe` （可执行文件）
   - `.env.local` （环境变量）

2. **生产环境配置**：
   - 务必使用 HTTPS
   - 配置防火墙
   - 定期备份数据
   - 使用强密码

3. **数据迁移**：
   - 迁移前备份现有数据
   - 测试迁移脚本
   - 密码需要重新设置

祝部署顺利！
