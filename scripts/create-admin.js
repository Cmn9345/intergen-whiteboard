#!/usr/bin/env node

/**
 * 快速创建 PocketBase 管理员账号
 *
 * 使用方法：
 *   node scripts/create-admin.js
 *
 * 或使用环境变量：
 *   POCKETBASE_URL=http://localhost:8090 \
 *   EXISTING_ADMIN_EMAIL=admin@example.com \
 *   EXISTING_ADMIN_PASSWORD=password \
 *   NEW_ADMIN_EMAIL=newadmin@example.com \
 *   NEW_ADMIN_PASSWORD=newpassword \
 *   node scripts/create-admin.js
 */

async function createAdmin() {
  // 动态导入 PocketBase（支持 ESM 和 CommonJS）
  let PocketBase;
  try {
    const module = await import('pocketbase');
    PocketBase = module.default;
  } catch {
    PocketBase = require('pocketbase');
  }

  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function prompt(question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }

  const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  const pb = new PocketBase(POCKETBASE_URL);

  console.log('🔐 PocketBase 管理员创建工具');
  console.log('================================\n');
  console.log(`连接到: ${POCKETBASE_URL}\n`);

  try {
    // 检查 PocketBase 是否运行
    await fetch(`${POCKETBASE_URL}/api/health`);
    console.log('✅ PocketBase 正在运行\n');
  } catch (error) {
    console.error(`❌ 无法连接到 PocketBase: ${POCKETBASE_URL}`);
    console.error('请确保 PocketBase 正在运行');
    rl.close();
    process.exit(1);
  }

  // 检查是否已有管理员
  let needsFirstAdmin = false;
  try {
    const admins = await pb.admins.getFullList();
    if (admins.length === 0) {
      needsFirstAdmin = true;
      console.log('ℹ️  这是首个管理员账号\n');
    } else {
      console.log('ℹ️  系统已有管理员账号，需要先登录\n');
    }
  } catch (error) {
    // 如果是 401 错误，说明已有管理员，需要登录
    needsFirstAdmin = error.status !== 401;
  }

  // 如果不是首个管理员，需要先登录
  if (!needsFirstAdmin) {
    const existingEmail = process.env.EXISTING_ADMIN_EMAIL ||
                         await prompt('现有管理员邮箱: ');
    const existingPassword = process.env.EXISTING_ADMIN_PASSWORD ||
                            await prompt('现有管理员密码: ');

    try {
      await pb.admins.authWithPassword(existingEmail, existingPassword);
      console.log('✅ 认证成功\n');
    } catch (error) {
      console.error('❌ 认证失败，请检查邮箱和密码');
      rl.close();
      process.exit(1);
    }
  }

  // 创建新管理员
  const newEmail = process.env.NEW_ADMIN_EMAIL ||
                  await prompt('新管理员邮箱: ');
  const newPassword = process.env.NEW_ADMIN_PASSWORD ||
                     await prompt('新管理员密码: ');

  try {
    const newAdmin = await pb.admins.create({
      email: newEmail,
      password: newPassword,
      passwordConfirm: newPassword
    });

    console.log('\n✅ 管理员创建成功！');
    console.log('📧 邮箱:', newAdmin.email);
    console.log('🆔 ID:', newAdmin.id);
    console.log('\n现在可以使用此账号登录 Admin UI:');
    console.log(`   ${POCKETBASE_URL}/_/`);
  } catch (error) {
    console.error('\n❌ 创建管理员失败:');
    if (error.data?.data) {
      Object.entries(error.data.data).forEach(([field, errors]) => {
        console.error(`   ${field}: ${errors.message}`);
      });
    } else {
      console.error('   ', error.message);
    }
  }

  rl.close();
}

// 运行
createAdmin().catch(error => {
  console.error('❌ 发生错误:', error);
  process.exit(1);
});
