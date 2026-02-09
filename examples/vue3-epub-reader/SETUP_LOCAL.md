# Vue3 EPUB 阅读器 - 本地开发指南

本指南说明如何从本地 elegant-epub 项目安装依赖并运行 Vue3 项目。

## 📋 项目结构

```
epub.js-master/
├── src/                          # 源代码
├── lib/                          # 编译后的代码
├── dist/                         # 构建后的代码
├── package.json                  # 项目配置
├── examples/
│   └── vue3-epub-reader/         # Vue3 阅读器项目
│       ├── src/
│       ├── package.json          # 本地链接配置
│       └── ...
└── ...
```

## 🚀 安装步骤

### 步骤 1: 编译 elegant-epub（项目根目录）

首先需要编译 elegant-epub 源代码：

```bash
# 进入项目根目录
cd I:\epub.js-master\epub.js-master

# 安装项目依赖
npm install

# 编译 JavaScript 源代码到 lib/
npm run compile

# 构建生产版本
npm run build
```

**说明：**
- `npm run compile` - 使用 Babel 编译 src/ 到 lib/
- `npm run build` - 使用 Webpack 构建优化的版本

### 步骤 2: 安装 Vue3 项目依赖

```bash
# 进入 Vue3 项目目录
cd examples/vue3-epub-reader

# 安装依赖（会从本地链接 elegant-epub）
npm install
```

此时 `package.json` 中的配置：
```json
"elegant-epub": "file:../../"
```

这会自动链接到项目根目录的 elegant-epub。

### 步骤 3: 运行开发服务器

```bash
# 在 vue3-epub-reader 目录中
npm run dev
```

会自动打开浏览器访问 `http://localhost:5173`

### 步骤 4: 构建生产版本

```bash
npm run build
```

生成文件在 `dist/` 目录中。

## 🔄 本地链接工作流程

### 开发流程

如果你需要修改 elegant-epub 源代码：

```bash
# 1. 修改 elegant-epub 源代码（src/ 目录）
# 编辑文件...

# 2. 重新编译
npm run compile

# 3. Vue3 项目会自动使用新的代码
# 刷新浏览器查看更改
```

### 使用 npm link（备选方案）

如果 `file:` 协议不工作，可以使用 `npm link`：

```bash
# 在项目根目录
npm link

# 在 Vue3 项目目录
npm link elegant-epub
```

## 📦 包管理配置

### package.json 本地链接配置

```json
{
  "dependencies": {
    "elegant-epub": "file:../../"
  }
}
```

**相对路径说明：**
- `../../` - 从 `examples/vue3-epub-reader/` 回到项目根目录

### 使用 npm workspace（高级）

如果你想更好地管理多个包，可以使用 npm workspace：

在项目根目录的 `package.json` 添加：

```json
{
  "name": "epub-workspace",
  "workspaces": [
    ".",
    "examples/vue3-epub-reader"
  ]
}
```

然后在 `examples/vue3-epub-reader/package.json` 中：

```json
{
  "dependencies": {
    "elegant-epub": "*"
  }
}
```

运行 `npm install` 会自动链接工作区中的包。

## 🛠️ 常见问题

### Q1: 提示找不到 elegant-epub？

**A:** 确保：
1. ✅ 已在项目根目录运行 `npm run compile`
2. ✅ `lib/` 目录存在且包含编译后的文件
3. ✅ 相对路径正确：`file:../../`

### Q2: 修改源代码后没有生效？

**A:** 需要重新编译：
```bash
# 项目根目录
npm run compile

# 然后刷新 Vue3 项目的浏览器
```

### Q3: package-lock.json 导致问题？

**A:** 删除并重新安装：
```bash
# 在 vue3-epub-reader 目录
rm package-lock.json
npm install
```

### Q4: 如何发布到 npm？

**A:** 不使用本地链接：
```json
{
  "dependencies": {
    "elegant-epub": "^0.3.93"
  }
}
```

然后运行：
```bash
npm install
```

## 📊 本地安装 vs npm 安装

| 特性 | 本地安装 | npm 安装 |
|------|--------|--------|
| 开发速度 | ✅ 快（热重载） | ❌ 慢（需重新安装） |
| 调试 | ✅ 容易 | ❌ 困难 |
| 生产环境 | ❌ 不适用 | ✅ 推荐 |
| 修改代码 | ✅ 直接修改 | ❌ 需要 fork |

## 🔧 开发工作流推荐

```bash
# 项目初始化
npm install                    # 项目根目录
cd examples/vue3-epub-reader
npm install                    # Vue3 项目

# 开发流程
npm run dev                    # 启动 Vue3 开发服务器

# 修改 elegant-epub 源代码后
# 1. 编辑 src/ 下的文件
# 2. 在项目根目录运行：
npm run compile                # 重新编译

# 3. 刷新浏览器查看更改

# 完成开发后
npm run build                  # 构建生产版本
```

## 📚 相关文档

- [Vue3 EPUB 阅读器 README](./README.md)
- [Elegant-EPUB 使用指南](../../USAGE_CN.md)
- [npm workspaces 文档](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [npm link 文档](https://docs.npmjs.com/cli/v8/commands/npm-link)

## 🤝 故障排除

### 检查清单

- [ ] Node.js 版本 >= 20.0.0
  ```bash
  node --version
  ```

- [ ] 已安装 elegant-epub 依赖
  ```bash
  npm list elegant-epub
  ```

- [ ] elegant-epub 已编译
  ```bash
  ls lib/
  ```

- [ ] package.json 配置正确
  ```bash
  cat package.json | grep elegant-epub
  ```

### 调试

```bash
# 查看 npm 链接状态
npm ls elegant-epub

# 查看 node_modules 中的链接
ls -la node_modules/elegant-epub

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

## ✅ 成功标志

如果一切正常，你会看到：

```bash
$ npm list elegant-epub
vue3-epub-reader@1.0.0
└── elegant-epub@0.3.93 -> I:\epub.js-master\epub.js-master
```

而且在 `node_modules/elegant-epub` 中是一个符号链接。

---

**最后更新**: 2026年2月

祝开发愉快！🎉
