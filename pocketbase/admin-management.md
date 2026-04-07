# PocketBase 管理员账号管理

本指南介绍如何管理 PocketBase 的管理员账号。

## 创建管理员账号的方法

### 方法 1: 通过 Admin UI（推荐）

如果你已经有一个管理员账号：

1. 启动 PocketBase
2. 访问 http://127.0.0.1:8090/_/
3. 使用现有管理员账号登录
4. 点击左侧菜单的 "Settings" → "Admins"
5. 点击 "New admin" 按钮
6. 填写新管理员的信息：
   - Email
   - Password
   - Avatar（可选）
7. 点击 "Create" 保存

### 方法 2: 使用命令行

#### 创建新管理员

```bash
cd pocketbase

# 创建管理员账号
./pocketbase admin create admin@example.com password123

# 或者，让系统提示输入密码（更安全）
./pocketbase admin create admin@example.com
```

在 Windows 上：

```batch
cd pocketbase
pocketbase.exe admin create admin@example.com password123
```

#### 更新现有管理员的密码

```bash
cd pocketbase
./pocketbase admin update admin@example.com newpassword123
```

#### 删除管理员

```bash
cd pocketbase
./pocketbase admin delete admin@example.com
```

### 方法 3: 使用 API

如果你已经有管理员账号并想通过代码创建新管理员：

创建文件 `scripts/create-admin.js`：

```javascript
const PocketBase = require('pocketbase');

const pb = new PocketBase('http://127.0.0.1:8090');

async function createAdmin() {
  try {
    // 使用现有管理员账号登录
    await pb.admins.authWithPassword(
      'existing-admin@example.com',
      'existing-password'
    );

    // 创建新管理员
    const newAdmin = await pb.admins.create({
      email: 'new-admin@example.com',
      password: 'secure-password',
      passwordConfirm: 'secure-password'
    });

    console.log('✅ New admin created:', newAdmin.email);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

createAdmin();
```

运行：

```bash
ADMIN_EMAIL=existing@example.com ADMIN_PASSWORD=password node scripts/create-admin.js
```

### 方法 4: 首次设置时创建

如果这是全新的 PocketBase 实例（没有任何管理员）：

1. 启动 PocketBase
2. 访问 http://127.0.0.1:8090/_/
3. 系统会自动显示创建首个管理员的表单
4. 填写信息并创建

## 管理员账号最佳实践

### 1. 使用强密码

```bash
# 生成强密码（Linux/Mac）
openssl rand -base64 32

# 或使用密码管理器生成
```

### 2. 为不同环境使用不同账号

- **开发环境**: dev-admin@example.com
- **测试环境**: test-admin@example.com
- **生产环境**: prod-admin@example.com

### 3. 定期更新密码

```bash
# 每 90 天更新一次
./pocketbase admin update admin@example.com
```

### 4. 限制管理员数量

只创建必要的管理员账号，避免权限滥用。

### 5. 记录管理员操作

PocketBase 会自动记录所有管理员操作，可以在日志中查看。

## 完整的管理脚本

创建 `scripts/manage-admins.js`：

```javascript
#!/usr/bin/env node
const PocketBase = require('pocketbase');
const readline = require('readline');

const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function listAdmins() {
  try {
    const admins = await pb.admins.getFullList();
    console.log('\n📋 Current Admins:');
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email} (ID: ${admin.id})`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error listing admins:', error.message);
  }
}

async function createAdmin() {
  const email = await prompt('New admin email: ');
  const password = await prompt('New admin password: ');

  try {
    const admin = await pb.admins.create({
      email,
      password,
      passwordConfirm: password
    });
    console.log('✅ Admin created:', admin.email);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

async function updateAdmin() {
  const email = await prompt('Admin email to update: ');
  const newPassword = await prompt('New password: ');

  try {
    // 需要先找到管理员 ID
    const admins = await pb.admins.getFullList();
    const admin = admins.find(a => a.email === email);

    if (!admin) {
      console.error('❌ Admin not found');
      return;
    }

    await pb.admins.update(admin.id, {
      password: newPassword,
      passwordConfirm: newPassword
    });
    console.log('✅ Admin password updated');
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
  }
}

async function deleteAdmin() {
  const email = await prompt('Admin email to delete: ');
  const confirm = await prompt(`Are you sure you want to delete ${email}? (yes/no): `);

  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ Cancelled');
    return;
  }

  try {
    const admins = await pb.admins.getFullList();
    const admin = admins.find(a => a.email === email);

    if (!admin) {
      console.error('❌ Admin not found');
      return;
    }

    await pb.admins.delete(admin.id);
    console.log('✅ Admin deleted');
  } catch (error) {
    console.error('❌ Error deleting admin:', error.message);
  }
}

async function main() {
  console.log('🔐 PocketBase Admin Management');
  console.log('================================\n');

  // 登录
  const loginEmail = await prompt('Your admin email: ');
  const loginPassword = await prompt('Your admin password: ');

  try {
    await pb.admins.authWithPassword(loginEmail, loginPassword);
    console.log('✅ Authenticated\n');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    rl.close();
    return;
  }

  let running = true;
  while (running) {
    console.log('\nWhat would you like to do?');
    console.log('1. List admins');
    console.log('2. Create admin');
    console.log('3. Update admin password');
    console.log('4. Delete admin');
    console.log('5. Exit');

    const choice = await prompt('\nChoice: ');

    switch (choice) {
      case '1':
        await listAdmins();
        break;
      case '2':
        await createAdmin();
        break;
      case '3':
        await updateAdmin();
        break;
      case '4':
        await deleteAdmin();
        break;
      case '5':
        running = false;
        break;
      default:
        console.log('❌ Invalid choice');
    }
  }

  rl.close();
  console.log('\n👋 Goodbye!');
}

main().catch(console.error);
```

使用方法：

```bash
node scripts/manage-admins.js
```

## 生产环境注意事项

### 1. 使用环境变量

```bash
# .env.production
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=very-secure-password
```

### 2. 不要在代码中硬编码密码

❌ 错误做法：

```javascript
await pb.admins.authWithPassword('admin@example.com', 'password123');
```

✅ 正确做法：

```javascript
await pb.admins.authWithPassword(
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_PASSWORD
);
```

### 3. 使用 HTTPS

确保生产环境使用 HTTPS 来保护管理员登录。

### 4. IP 白名单（可选）

在 Nginx 配置中限制管理员 UI 的访问：

```nginx
location /_/ {
    allow 你的IP地址;
    deny all;

    proxy_pass http://127.0.0.1:8090;
    # ... 其他配置
}
```

## 故障排查

### 忘记管理员密码

使用命令行重置：

```bash
cd pocketbase
./pocketbase admin update admin@example.com newpassword
```

### 无法登录管理员账号

1. 检查 PocketBase 是否正在运行
2. 确认邮箱和密码正确
3. 查看日志：`journalctl -u pocketbase -f`（如果使用 systemd）

### 创建管理员时出错

检查：
- 邮箱格式是否正确
- 密码是否符合要求（通常至少 8 个字符）
- 该邮箱是否已被使用

## 参考

- [PocketBase Admin API](https://pocketbase.io/docs/api-admins/)
- [PocketBase CLI](https://pocketbase.io/docs/going-to-production/#using-the-cli)
