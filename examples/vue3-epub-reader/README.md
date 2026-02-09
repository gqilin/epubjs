# Vue3 EPUB 阅读器完整项目

这是一个使用 **Vue 3** + **Vite** + **Elegant-EPUB** 构建的功能完整的 EPUB 阅读器项目。

## 📋 项目结构

```
vue3-epub-reader/
├── src/
│   ├── assets/
│   │   └── styles.css          # 全局样式
│   ├── components/
│   │   └── EpubReader.vue      # EPUB 阅读器组件
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── public/                     # 静态资源
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── package.json                # 项目依赖
└── README.md                   # 项目文档
```

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 20.0.0
- npm 或 yarn

### 2. 安装依赖

```bash
cd vue3-epub-reader
npm install
```

### 3. 开发模式

```bash
npm run dev
```

会自动打开浏览器，访问 `http://localhost:5173`

### 4. 构建生产版本

```bash
npm run build
```

生成文件将在 `dist/` 目录中

### 5. 预览构建结果

```bash
npm run preview
```

## 🎯 功能特性

### 核心功能

- ✅ **文件上传** - 支持上传本地 EPUB 文件
- ✅ **翻页导航** - 上一页/下一页
- ✅ **目录导航** - 点击目录快速跳转到任意章节
- ✅ **进度追踪** - 显示阅读进度百分比
- ✅ **进度条跳转** - 点击进度条快速定位到指定位置
- ✅ **书籍信息** - 显示作者、出版社、语言等元数据
- ✅ **键盘快捷键** - 左右箭头键翻页
- ✅ **响应式设计** - 适配桌面和移动设备

### 用户界面

- 🎨 现代化深紫色主题
- 🌙 流畅的交互体验
- 📱 完全响应式布局
- ⚡ 快速的性能表现

## 📖 使用示例

### 基本使用

```vue
<template>
  <EpubReader />
</template>

<script setup>
import EpubReader from '@/components/EpubReader.vue'
</script>
```

### 与后端集成

```typescript
// 从服务器加载 EPUB
const loadFromServer = async (bookId) => {
  const response = await fetch(`/api/books/${bookId}`)
  const arrayBuffer = await response.arrayBuffer()
  loadEpub(arrayBuffer)
}
```

### 自定义样式

在 `src/assets/styles.css` 中修改 CSS 变量：

```css
:root {
  --primary-color: #667eea;        /* 主色调 */
  --primary-dark: #764ba2;         /* 深色调 */
  --success-color: #4caf50;        /* 成功色 */
  --error-color: #f44336;          /* 错误色 */
}
```

## 🎮 快捷键

| 快捷键 | 功能 |
|--------|------|
| ← 左箭头 | 上一页 |
| → 右箭头 | 下一页 |

## 📱 响应式设计

项目在不同尺寸设备上的表现：

- **桌面** (> 768px)
  - 左侧显示目录
  - 右侧显示完整阅读器

- **平板 & 手机** (≤ 768px)
  - 隐藏侧边栏
  - 添加切换按钮
  - 优化工具栏

## 🔧 项目配置

### Vite 配置

编辑 `vite.config.js` 自定义构建选项：

```javascript
export default defineConfig({
  server: {
    port: 5173,           // 开发服务器端口
    open: true,          // 自动打开浏览器
  },
  build: {
    outDir: 'dist',      // 输出目录
  }
})
```

### 环境变量

在项目根目录创建 `.env` 文件：

```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=我的EPUB阅读器
```

在代码中使用：

```javascript
import.meta.env.VITE_API_BASE_URL
```

## 📦 依赖说明

| 包 | 版本 | 说明 |
|----|------|------|
| vue | ^3.4.0 | Vue 框架 |
| elegant-epub | ^0.3.93 | EPUB 解析库 |
| jszip | ^3.10.1 | ZIP 文件处理 |
| @vitejs/plugin-vue | ^5.0.0 | Vite Vue 插件 |
| vite | ^5.0.0 | 构建工具 |

## 🐛 常见问题

### Q1: 上传后看不到内容？

**A:** 检查以下项：
1. 文件是否是有效的 EPUB 格式
2. 浏览器控制台是否有错误信息
3. JSZip 是否加载成功

```bash
# 检查控制台错误
F12 打开开发者工具 → Console 标签
```

### Q2: 如何调试？

**A:** 使用 Vue DevTools：

```bash
# Chrome/Edge 安装 Vue DevTools 扩展
# https://devtools.vuejs.org/guide/installation.html
```

### Q3: 如何部署到生产环境？

**A:** 构建并上传到服务器：

```bash
# 1. 构建
npm run build

# 2. 上传 dist 目录到服务器
# 3. 配置服务器指向 index.html

# Nginx 配置示例
location / {
  try_files $uri $uri/ /index.html;
}
```

### Q4: 如何添加更多功能？

**A:** 在 `EpubReader.vue` 中添加新方法和功能。例如添加书签：

```javascript
const bookmarks = ref([])

const addBookmark = () => {
  const cfi = rendition.value.currentLocation().start.cfi
  bookmarks.value.push({
    title: `书签 ${bookmarks.value.length + 1}`,
    cfi,
    timestamp: new Date()
  })
}
```

## 🌐 部署指南

### Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### Netlify 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建并部署
netlify deploy --prod --dir=dist
```

### 传统服务器部署

```bash
# 1. 构建项目
npm run build

# 2. 上传 dist 文件夹到服务器
# 使用 FTP 或其他工具上传

# 3. 配置 Web 服务器
# 确保所有路由都指向 index.html
```

## 📚 API 参考

### EpubReader 组件主要方法

#### 加载 EPUB

```typescript
loadEpub(epubPath: string | ArrayBuffer): void
```

#### 翻页

```typescript
nextPage(): void
prevPage(): void
```

#### 跳转到目录项

```typescript
goToTocItem(item: TocItem): void
```

#### 跳转到指定进度

```typescript
seekProgress(event: MouseEvent): void
```

### 响应式数据

```typescript
// 书籍和渲染器
book: Ref<any>
rendition: Ref<any>

// 内容信息
bookTitle: Ref<string>
metadata: Ref<Metadata | null>
toc: Ref<TocItem[]>

// 进度
progress: Ref<number>  // 0-1
progressPercent: Computed<number>

// 状态
bookLoaded: Ref<boolean>
errorMessage: Ref<string>
infoMessage: Ref<string>
```

## 🤝 贡献指南

欢迎提交 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

BSD-2-Clause License - 详见 LICENSE 文件

## 🔗 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Elegant-EPUB 文档](../../USAGE_CN.md)
- [EPUB 标准](https://www.w3.org/publishing/epub/)

## 📞 技术支持

如有问题或建议，欢迎：

- 提交 Issue
- 发起讨论
- 联系维护者

---

**最后更新**: 2026年2月

祝你使用愉快！🎉
