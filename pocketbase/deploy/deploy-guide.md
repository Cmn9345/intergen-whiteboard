# PocketBase 云服务器部署指南

本指南将帮助你在云服务器（VPS）上部署 PocketBase。

## 前置要求

- 一台 Linux 服务器（Ubuntu 20.04+, Debian 11+, CentOS 8+ 等）
- Root 或 sudo 权限
- 一个域名（可选，但推荐用于生产环境）
- 基本的 Linux 命令行知识

## 部署步骤

### 1. 连接到服务器

```bash
ssh your-username@your-server-ip
```

### 2. 更新系统

```bash
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
# 或
sudo yum update -y  # CentOS/RHEL
```

### 3. 安装必要的工具

```bash
# Ubuntu/Debian
sudo apt install -y curl unzip

# CentOS/RHEL
sudo yum install -y curl unzip
```

### 4. 上传部署脚本

将 `deploy.sh` 上传到服务器：

```bash
# 在本地电脑运行
scp deploy.sh your-username@your-server-ip:~/
```

或者直接在服务器上下载：

```bash
# 在服务器上运行
curl -L https://raw.githubusercontent.com/YOUR_REPO/deploy.sh -o deploy.sh
chmod +x deploy.sh
```

### 5. 运行部署脚本

```bash
sudo ./deploy.sh
```

脚本会自动：
- 下载 PocketBase
- 创建系统服务
- 配置自动启动
- 启动 PocketBase

### 6. 验证部署

检查 PocketBase 是否正在运行：

```bash
sudo systemctl status pocketbase
```

访问 Admin UI：
```
http://your-server-ip:8090/_/
```

首次访问时，需要创建管理员账号。

### 7. 配置防火墙

如果使用 UFW（Ubuntu）：

```bash
sudo ufw allow 8090/tcp
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

如果使用 firewalld（CentOS）：

```bash
sudo firewall-cmd --permanent --add-port=8090/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 8. 设置 Nginx 反向代理（推荐）

#### 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 配置 Nginx

```bash
# 上传 nginx.conf 到服务器
sudo nano /etc/nginx/sites-available/pocketbase

# 粘贴 nginx.conf 的内容，并修改 your-domain.com 为你的域名

# 创建符号链接
sudo ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 9. 配置 SSL（HTTPS）

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
# 安装 Certbot
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# Certbot 会自动配置 Nginx 并获取证书
```

### 10. 导入 Collections

在服务器上设置 collections：

#### 方法 1: 使用 Admin UI（推荐）

1. 访问 https://your-domain.com/_/
2. 登录管理员账号
3. 点击 "Collections"
4. 根据 `collections-schema.json` 手动创建每个 collection

#### 方法 2: 使用自动化脚本

```bash
# 在服务器上安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs  # Ubuntu/Debian

# 上传 setup-collections.js 和 collections-schema.json
scp setup-collections.js your-username@your-server-ip:~/
scp collections-schema.json your-username@your-server-ip:~/

# 运行脚本
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword POCKETBASE_URL=http://localhost:8090 node setup-collections.js
```

## 维护和管理

### 查看日志

```bash
# 实时查看日志
sudo journalctl -u pocketbase -f

# 查看最近的日志
sudo journalctl -u pocketbase -n 100
```

### 重启服务

```bash
sudo systemctl restart pocketbase
```

### 停止服务

```bash
sudo systemctl stop pocketbase
```

### 启动服务

```bash
sudo systemctl start pocketbase
```

### 更新 PocketBase

```bash
# 停止服务
sudo systemctl stop pocketbase

# 下载新版本
cd /opt/pocketbase
sudo curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.XX.X/pocketbase_0.XX.X_linux_amd64.zip -o pocketbase.zip
sudo unzip -o pocketbase.zip
sudo rm pocketbase.zip
sudo chmod +x pocketbase
sudo chown pocketbase:pocketbase pocketbase

# 启动服务
sudo systemctl start pocketbase
```

## 备份

定期备份 PocketBase 数据：

```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-pocketbase.sh
```

```bash
#!/bin/bash
# 备份脚本内容

BACKUP_DIR="/var/backups/pocketbase"
POCKETBASE_DIR="/opt/pocketbase/pb_data"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/pocketbase_$DATE.tar.gz -C /opt/pocketbase pb_data

# 保留最近 30 天的备份
find $BACKUP_DIR -name "pocketbase_*.tar.gz" -mtime +30 -delete

echo "Backup completed: pocketbase_$DATE.tar.gz"
```

```bash
# 设置权限
sudo chmod +x /usr/local/bin/backup-pocketbase.sh

# 设置每日自动备份（cron）
sudo crontab -e
# 添加以下行（每天凌晨 2 点备份）
0 2 * * * /usr/local/bin/backup-pocketbase.sh
```

## 常见问题

### 无法连接到服务器

检查：
1. 防火墙是否允许端口 8090
2. PocketBase 服务是否正在运行
3. 云服务商的安全组是否允许该端口

### SSL 证书问题

确保：
1. 域名 DNS 已正确指向服务器 IP
2. 端口 80 和 443 开放
3. Nginx 配置正确

### 性能优化

对于生产环境：
1. 增加服务器资源（内存、CPU）
2. 使用 CDN 加速静态文件
3. 定期清理旧数据
4. 监控服务器性能

## 安全建议

1. 使用强密码
2. 定期更新 PocketBase 和系统
3. 配置 HTTPS
4. 限制管理员 IP 访问
5. 定期备份数据
6. 使用防火墙
7. 监控异常访问

## 参考资源

- [PocketBase 官方文档](https://pocketbase.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx 文档](https://nginx.org/en/docs/)
