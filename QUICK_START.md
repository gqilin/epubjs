# 快速开始指南

## 🚀 5 分钟快速开始

### 选项 1：使用自动化脚本（推荐）

#### Windows 用户：
```bash
# 双击运行
examples\vue3-epub-reader\setup.bat
```

#### macOS / Linux 用户：
```bash
# 赋予执行权限
chmod +x examples/vue3-epub-reader/setup.sh

# 运行脚本
./examples/vue3-epub-reader/setup.sh
```

### 选项 2：手动安装

#### 步骤 1: 编译 elegant-epub（项目根目录）
```bash
npm install
npm run compile
```

#### 步骤 2: 安装 Vue3 项目依赖
```bash
cd examples/vue3-epub-reader
npm install
```

#### 步骤 3: 启动开发服务器
```bash
npm run dev
```

浏览器会自动打开 http://localhost:5173 ✨

## 📁 项目结构一览

```
epub.js-master/
├── package.json              # elegant-epub 项目配置
├── src/                      # 源代码
├── lib/                      # 编译后代码（编译生成）
├── dist/                     # 构建后代码（构建生成）
├── USAGE_CN.md               # Elegant-EPUB 中文文档
├── examples/
│   ├── vue3-reader.html      # CDN 版本示例
│   ├── EpubReader.vue        # Vue3 单文件组件示例
│   ├── VUE3_README.md        # Vue3 示例文档
│   └── vue3-epub-reader/     # Vue3 完整项目
│       ├── src/              # 源代码
│       ├── package.json      # 项目配置（本地链接）
│       ├── SETUP_LOCAL.md    # 本地安装详细指南
│       └── README.md         # 项目文档
└── ...
```

## 🎯 常见任务

### 开发 elegant-epub

```bash
# 1. 修改源代码（src/）
# 编辑 src/epub.js 等文件...

# 2. 重新编译
npm run compile

# 3. Vue3 项目自动使用新代码（刷新浏览器）
```

### 开发 Vue3 阅读器

```bash
# 1. 进入项目目录
cd examples/vue3-epub-reader

# 2. 启动开发服务器
npm run dev

# 3. 修改源代码，自动热重载
# 编辑 src/components/EpubReader.vue...

# 4. 保存文件，浏览器自动更新
```

### 构建生产版本

```bash
# 1. 构建 elegant-epub
npm run build

# 2. 构建 Vue3 项目
cd examples/vue3-epub-reader
npm run build

# 3. dist/ 目录中的文件可以部署到服务器
```

## 📊 命令参考

### 项目根目录命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run compile` | 编译源代码到 lib/ |
| `npm run build` | 构建生产版本 |
| `npm run minify` | 构建并压缩 |
| `npm run watch` | 监听文件变化自动编译 |

### Vue3 项目命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |

## ✅ 验证安装

```bash
# 1. 检查 Node.js 版本
node --version        # 应该 >= v20.0.0

# 2. 检查 npm 版本
npm --version

# 3. 检查 elegant-epub 链接
npm list elegant-epub

# 4. 检查编译输出
ls lib/               # 应该包含编译后的文件
```

## 🔗 相关文档

- **详细本地安装指南**: [SETUP_LOCAL.md](./examples/vue3-epub-reader/SETUP_LOCAL.md)
- **Vue3 项目文档**: [examples/vue3-epub-reader/README.md](./examples/vue3-epub-reader/README.md)
- **Elegant-EPUB 文档**: [USAGE_CN.md](./USAGE_CN.md)

## 🐛 常见问题

### Q: elegant-epub 找不到？
**A:** 确认在项目根目录运行了 `npm run compile`

### Q: 修改代码后没有生效？
**A:** 运行 `npm run compile` 重新编译，然后刷新浏览器

### Q: port 5173 已被占用？
**A:** Vite 会自动使用下一个可用端口

### Q: 如何卸载本地链接？
**A:**
```bash
cd examples/vue3-epub-reader
npm install elegant-epub@^0.3.93
```

## 🎉 成功标志

看到以下信息说明安装成功：

```
✨ 安装完成！

下一步：
1. 启动开发服务器:
   npm run dev

2. 浏览器会自动打开 http://localhost:5173
```

然后在浏览器中可以：
- 📤 上传 EPUB 文件
- ◀▶ 翻页导航
- 📖 查看目录
- 📊 跟踪进度

---

**需要帮助？** 查看 [SETUP_LOCAL.md](./examples/vue3-epub-reader/SETUP_LOCAL.md) 获取详细说明。
