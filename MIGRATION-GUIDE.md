# 从 Prisma 迁移到 PocketBase 指南

本指南将帮助你从当前的 Prisma + SQLite 架构迁移到 PocketBase。

## 概述

**当前架构：**
- Next.js 前端 + API Routes
- Prisma ORM
- SQLite 数据库

**目标架构：**
- Next.js 前端
- PocketBase 后端（带内置 Admin UI）
- PocketBase SQLite 数据库

## 迁移优势

1. **内置 Admin UI** - 无需编写后台管理界面
2. **实时订阅** - 内置 WebSocket 支持
3. **文件存储** - 原生文件上传和管理
4. **认证系统** - 完整的用户认证和授权
5. **API 自动生成** - 无需手写 CRUD API
6. **简化部署** - 单一可执行文件，无需复杂配置

## 迁移步骤

### 第 1 步：本地开发环境设置

#### 1.1 下载和启动 PocketBase

在 Windows 上：

```powershell
# 下载 PocketBase
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.23.8/pocketbase_0.23.8_windows_amd64.zip" -OutFile "pocketbase.zip"

# 解压
Expand-Archive -Path "pocketbase.zip" -DestinationPath "pocketbase"
Remove-Item "pocketbase.zip"

# 启动
cd pocketbase
.\pocketbase.exe serve
```

或使用提供的脚本：

```batch
start-pocketbase.bat
```

#### 1.2 创建管理员账号

1. 访问 http://127.0.0.1:8090/_/
2. 按提示创建管理员账号

#### 1.3 设置 Collections

**选项 A：使用自动化脚本（推荐）**

```bash
# 安装 Node.js（如果还没有）
# 然后运行：

cd pocketbase
ADMIN_EMAIL=your-admin@email.com ADMIN_PASSWORD=your-password node setup-collections.js
```

**选项 B：手动创建**

参考 `pocketbase/collections-schema.json`，在 Admin UI 中手动创建每个 collection。

### 第 2 步：迁移数据

#### 2.1 导出 Prisma 数据

创建导出脚本 `scripts/export-data.js`：

```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  const users = await prisma.user.findMany();
  const courses = await prisma.course.findMany();
  const enrollments = await prisma.enrollment.findMany();
  const textPosts = await prisma.textPost.findMany();
  const voicePosts = await prisma.voicePost.findMany();
  const moods = await prisma.mood.findMany();
  const checkins = await prisma.checkin.findMany();

  const data = {
    users,
    courses,
    enrollments,
    textPosts,
    voicePosts,
    moods,
    checkins
  };

  fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2));
  console.log('✅ Data exported to data-export.json');
}

exportData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行导出：

```bash
node scripts/export-data.js
```

#### 2.2 导入数据到 PocketBase

创建导入脚本 `scripts/import-to-pocketbase.js`：

```javascript
const fs = require('fs');
const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

async function importData() {
  // 使用管理员账号登录
  await pb.admins.authWithPassword('your-admin@email.com', 'your-password');

  const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));

  // 导入用户
  console.log('Importing users...');
  for (const user of data.users) {
    try {
      await pb.collection('users').create({
        email: user.email,
        password: user.passwordHash, // 注意：需要重新加密或要求用户重置密码
        passwordConfirm: user.passwordHash,
        displayName: user.displayName,
        role: user.role,
        isTester: user.isTester,
        emailVisibility: true
      });
    } catch (error) {
      console.error(`Failed to import user ${user.email}:`, error.message);
    }
  }

  // 导入课程
  console.log('Importing courses...');
  for (const course of data.courses) {
    try {
      await pb.collection('courses').create({
        title: course.title,
        description: course.description,
        startsAt: course.startsAt,
        endsAt: course.endsAt
      });
    } catch (error) {
      console.error(`Failed to import course ${course.title}:`, error.message);
    }
  }

  // 类似地导入其他数据...

  console.log('✅ Data import completed');
}

importData().catch(console.error);
```

### 第 3 步：更新 Next.js 代码

#### 3.1 安装 PocketBase SDK

```bash
npm install pocketbase
```

#### 3.2 创建 PocketBase 客户端

创建 `lib/pocketbase.ts`：

```typescript
import PocketBase from 'pocketbase';

export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
);

// 类型定义
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'TESTER';
  isTester: boolean;
  created: string;
  updated: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  startsAt?: string;
  endsAt?: string;
  created: string;
  updated: string;
}

// 更多类型定义...
```

#### 3.3 更新环境变量

创建或更新 `.env.local`：

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

对于生产环境：

```env
NEXT_PUBLIC_POCKETBASE_URL=https://your-domain.com
```

#### 3.4 替换 Prisma 调用

**之前（Prisma）：**

```typescript
import { prisma } from '@/lib/prisma';

// 获取所有用户
const users = await prisma.user.findMany();

// 创建课程
const course = await prisma.course.create({
  data: {
    title: 'New Course',
    description: 'Course description'
  }
});
```

**之后（PocketBase）：**

```typescript
import { pb } from '@/lib/pocketbase';

// 获取所有用户
const users = await pb.collection('users').getFullList();

// 创建课程
const course = await pb.collection('courses').create({
  title: 'New Course',
  description: 'Course description'
});
```

#### 3.5 认证示例

```typescript
import { pb } from '@/lib/pocketbase';

// 登录
async function login(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// 注册
async function register(email: string, password: string, displayName: string) {
  try {
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      displayName,
      role: 'STUDENT',
      emailVisibility: true
    });

    // 自动登录
    await login(email, password);
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// 登出
function logout() {
  pb.authStore.clear();
}

// 检查是否已登录
function isLoggedIn() {
  return pb.authStore.isValid;
}

// 获取当前用户
function getCurrentUser() {
  return pb.authStore.model;
}
```

#### 3.6 实时订阅示例

```typescript
import { pb } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';

function useRealtimeCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // 初始加载
    pb.collection('courses').getFullList().then(setCourses);

    // 订阅实时更新
    pb.collection('courses').subscribe('*', (e) => {
      if (e.action === 'create') {
        setCourses(prev => [...prev, e.record]);
      } else if (e.action === 'update') {
        setCourses(prev => prev.map(c => c.id === e.record.id ? e.record : c));
      } else if (e.action === 'delete') {
        setCourses(prev => prev.filter(c => c.id !== e.record.id));
      }
    });

    // 清理订阅
    return () => {
      pb.collection('courses').unsubscribe();
    };
  }, []);

  return courses;
}
```

### 第 4 步：更新 package.json

移除 Prisma 依赖：

```json
{
  "dependencies": {
    // 移除这些：
    // "@prisma/client": "^6.16.2",
    // "pg": "^8.16.3",
    // "@types/pg": "^8.15.5",

    // 添加这个：
    "pocketbase": "^0.21.5"
  },
  "devDependencies": {
    // 移除这个：
    // "prisma": "^6.16.2"
  }
}
```

### 第 5 步：清理旧代码

1. 删除 `prisma` 目录
2. 删除 Prisma 相关的 API routes
3. 移除 `lib/prisma.ts` 或类似文件
4. 更新 `.gitignore`：

```gitignore
# 移除 Prisma 相关
# prisma/*.db
# prisma/*.db-journal

# 添加 PocketBase 相关
pocketbase/pb_data/
pocketbase/pb_migrations/
pocketbase/*.exe
pocketbase/pocketbase
```

### 第 6 步：测试

1. 启动 PocketBase：`start-pocketbase.bat`
2. 启动 Next.js：`npm run dev`
3. 测试所有功能：
   - 用户注册/登录
   - CRUD 操作
   - 文件上传（如果有）
   - 实时更新（如果实现）

### 第 7 步：部署到生产环境

参考 `pocketbase/deploy/deploy-guide.md` 进行云服务器部署。

## API 对照表

| 操作 | Prisma | PocketBase |
|------|--------|------------|
| 获取全部 | `prisma.model.findMany()` | `pb.collection('name').getFullList()` |
| 获取单个 | `prisma.model.findUnique({ where: { id } })` | `pb.collection('name').getOne(id)` |
| 创建 | `prisma.model.create({ data })` | `pb.collection('name').create(data)` |
| 更新 | `prisma.model.update({ where: { id }, data })` | `pb.collection('name').update(id, data)` |
| 删除 | `prisma.model.delete({ where: { id } })` | `pb.collection('name').delete(id)` |
| 分页 | `prisma.model.findMany({ skip, take })` | `pb.collection('name').getList(page, perPage)` |
| 筛选 | `prisma.model.findMany({ where })` | `pb.collection('name').getList(1, 50, { filter: 'field="value"' })` |
| 排序 | `prisma.model.findMany({ orderBy })` | `pb.collection('name').getList(1, 50, { sort: '-created' })` |

## 常见问题

### Q: 密码如何处理？

A: PocketBase 使用自己的密码哈希，无法直接迁移 Prisma 的密码哈希。建议：
1. 要求所有用户重置密码
2. 或在迁移时设置临时密码，然后要求用户首次登录时修改

### Q: 如何处理关系数据？

A: PocketBase 使用 relation 字段类型，在查询时需要使用 `expand` 参数：

```typescript
const posts = await pb.collection('textPosts').getList(1, 50, {
  expand: 'authorId,courseId'
});

// 访问关联数据
posts.items.forEach(post => {
  console.log(post.expand?.authorId?.displayName);
});
```

### Q: 文件上传如何处理？

A: PocketBase 原生支持文件上传。将 `audioUrl` 字段改为 `file` 类型：

```typescript
const formData = new FormData();
formData.append('title', 'My Voice Post');
formData.append('audioFile', file); // File 对象
formData.append('authorId', userId);

const post = await pb.collection('voicePosts').create(formData);

// 访问文件 URL
const fileUrl = pb.files.getUrl(post, post.audioFile);
```

### Q: 如何实现复杂查询？

A: PocketBase 支持强大的过滤语法：

```typescript
// 复杂过滤
const results = await pb.collection('moods').getList(1, 50, {
  filter: 'value >= 7 && userId = "xxx" && created >= "2024-01-01"',
  sort: '-created'
});
```

## 下一步

1. 阅读 [PocketBase 官方文档](https://pocketbase.io/docs/)
2. 了解 [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
3. 探索 [PocketBase Admin UI](http://127.0.0.1:8090/_/)
4. 部署到生产环境（参考 `deploy-guide.md`）

## 支持

如果遇到问题：
- 查看 PocketBase 文档
- 访问 PocketBase Discord 社区
- 检查 GitHub Issues

祝迁移顺利！
