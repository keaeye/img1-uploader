# img1-uploader

一个通过前端页面上传图片文件至指定 GitHub 仓库路径的图床工具，支持批量上传、自动生成随机文件名，且可配置上传密码。

## ✨ 功能特性

- ✅ 上传图片至 GitHub 仓库指定目录（默认 `img/`）
- 🔒 上传前需输入密码（默认 `Hh12345`）
- 🌐 前端部署至 Vercel、Cloudflare Pages 等平台
- 🎨 简洁、美观的上传界面
- 🧩 支持批量上传
- 📁 自动生成短随机前缀防止文件重名覆盖
- 🔗 上传成功后返回可自定义域名格式的图片地址

## 🧰 使用说明

### 1. 准备工作

- 拥有一个 GitHub 仓库（如：`keaeye/img1`），用于存储上传的图片。
- 创建一个 GitHub Token，建议权限为：
  - `repo`（若为私有仓库）
  - `public_repo`（若为公开仓库）

### 2. 环境变量配置

在部署平台（如 Vercel）设置以下环境变量：

| 变量名         | 示例值                     | 说明                             |
|----------------|----------------------------|----------------------------------|
| `GITHUB_TOKEN` | `ghp_xxxxxx`               | GitHub 的访问令牌               |
| `GITHUB_REPO`  | `keaeye/img1`              | 用于存储图片的 GitHub 仓库路径  |
| `GITHUB_PATH`  | `img`                      | 图片存储路径（仓库内的子目录）  |
| `UPLOAD_SECRET`| `123456`                  | 上传密码                         |
| `手动更改无变量`   | `https://域名`  | 图片地址返回的自定义 CDN 域名   |

### 3. 部署后访问

- 上传页面地址（前端）：`https://img1.keaeye.fun`
- 上传接口地址（后端）：`https://img1backend.keaeye.fun/upload`

### 4. 上传示例

上传文件 `404.jpg` 后，将返回类似地址：
https://域名/img/iu6rxg_404.jpg

## 📁 项目结构

```text
.
├── api/               # 后端处理（用于上传）
│   └── upload.js
├── public/            # 前端页面
│   └── index.html
├── vercel.json        # Vercel 路由配置
└── README.md

