# Vue3 项目更新 - 路由与 UI 库集成

## 📚 更新内容

本次更新为 Vue3 EPUB 阅读器项目添加了以下功能：

### 1. 🚀 Vue Router 集成
- **路由库**: Vue Router 4.2.0
- **路由配置**: `src/router/index.js`
- **路由守卫**: 自动更新页面标题

### 2. 🎨 Element Plus UI 库
- **UI 库**: Element Plus 2.6.0
- **图标库**: @element-plus/icons-vue
- **样式**: 完整的 Element Plus 主题

### 3. 📄 新增页面

#### 首页 (`src/views/Home.vue`)
- Hero Banner 展示
- 功能特性卡片展示
- 技术栈说明
- 快速开始指南
- 响应式设计

#### 阅读器页面 (`src/views/Reader.vue`)
- EPUB 阅读器主要功能
- 左侧目录导航侧边栏
- 顶部工具栏
- Element Plus 组件集成
- 完整的交互功能

#### 关于页面 (`src/views/About.vue`)
- 项目简介
- 主要特性展示
- 技术栈详情
- 快速开始代码
- 文档链接
- 开源信息

### 4. 🔗 新增路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/reader` | Reader.vue | EPUB 阅读器 |
| `/about` | About.vue | 关于项目 |

### 5. 🎯 更新的文件

#### `src/main.js`
```javascript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

app.use(ElementPlus)
app.use(router)
```

#### `src/App.vue`
- 全局导航栏
- 路由视图容器
- 全局页脚
- 响应式布局

---

## 📦 新增依赖

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "element-plus": "^2.6.0",
    "elegant-epub": "file:../../",
    "jszip": "^3.10.1",
    "axios": "^1.6.0"
  }
}
```

---

## 🚀 安装和运行

### 步骤 1: 安装依赖

```bash
cd examples/vue3-epub-reader

# 删除旧的 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 步骤 2: 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 步骤 3: 浏览页面

- **首页**: `http://localhost:5173/` - 项目介绍和功能展示
- **阅读器**: `http://localhost:5173/reader` - EPUB 阅读功能
- **关于**: `http://localhost:5173/about` - 项目信息

---

## 📁 项目结构更新

```
src/
├── App.vue                    # 根组件（导航 + 路由视图 + 页脚）
├── main.js                    # 入口文件（集成 Router 和 Element Plus）
├── router/
│   └── index.js              # 路由配置
├── views/
│   ├── Home.vue              # 首页
│   ├── Reader.vue            # 阅读器页面
│   └── About.vue             # 关于页面
├── components/
│   └── EpubReader.vue        # EPUB 阅读器组件
└── assets/
    └── styles.css            # 全局样式
```

---

## 🎨 UI 组件使用示例

### Element Plus 组件

项目中使用的 Element Plus 组件：

```vue
<!-- 按钮 -->
<el-button type="primary">点击</el-button>

<!-- 消息提示 -->
<el-message>提示信息</el-message>
<el-alert title="警告" type="warning" />

<!-- 卡片 -->
<el-card>内容</el-card>

<!-- 栅格 -->
<el-row :gutter="20">
  <el-col :md="12">...</el-col>
</el-row>

<!-- 图标 -->
<el-icon><DocumentCopy /></el-icon>

<!-- 文件上传 -->
<el-upload @change="handleUpload">
  <template #trigger>
    <el-button>上传</el-button>
  </template>
</el-upload>

<!-- 统计数据 -->
<el-statistic title="进度" :value="45" />

<!-- 分割线 -->
<el-divider />

<!-- 空状态 -->
<el-empty description="暂无数据" />
```

---

## 🔗 路由使用示例

### 在模板中导航

```vue
<!-- router-link 自动添加 active 类 -->
<router-link to="/reader">阅读器</router-link>

<!-- 获取当前路由 -->
<div v-if="$route.path === '/reader'">
  在阅读器页面
</div>
```

### 在脚本中导航

```javascript
// 使用路由跳转
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/reader')
router.push({ name: 'Reader' })
```

### 路由守卫

```javascript
// router/index.js 中已配置：
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})
```

---

## 🎯 主要特性

### 🏠 首页特性
- 动画效果的 Hero Banner
- 功能卡片展示
- 技术栈介绍
- 快速开始代码片段
- 完整的响应式设计

### 📖 阅读器特性
- Element Plus 工具栏
- 拖拽上传 EPUB 文件
- 进度条选择器
- 统计信息显示
- 完整的阅读功能
- 移动端适配

### ℹ️ 关于页面特性
- 项目信息卡片
- 技术栈详情
- 快速开始代码
- 外部文档链接
- 清晰的页面布局

---

## 📱 响应式设计

所有页面都完全响应式：

- **桌面** (> 768px): 完整的侧边栏、导航和功能
- **平板** (375px - 768px): 折叠式导航、适配的卡片布局
- **手机** (< 375px): 简化界面、移动端优化

---

## 🛠️ 开发建议

### 添加新页面

```javascript
// 1. 创建页面文件 src/views/NewPage.vue
// 2. 在 router/index.js 中添加路由：

{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPage.vue'),
  meta: {
    title: '新页面'
  }
}

// 3. 在导航栏中添加链接
<router-link to="/new-page">新页面</router-link>
```

### 使用 Element Plus 组件

```vue
<template>
  <!-- 直接使用组件，无需导入 -->
  <el-button type="primary">按钮</el-button>
  <el-card>卡片</el-card>
</template>

<!-- Element Plus 已在 main.js 中全局注册 -->
```

### 自定义样式

Element Plus 主题可以在 `src/assets/styles.css` 中自定义：

```css
:root {
  /* 自定义 CSS 变量覆盖 Element Plus 主题 */
  --el-color-primary: #667eea;
}
```

---

## 🐛 常见问题

### Q: 启动报错找不到模块？
**A:** 运行 `npm install` 重新安装依赖。

### Q: Element Plus 样式没有加载？
**A:** 确保 `main.js` 中有 `import 'element-plus/dist/index.css'`。

### Q: 路由不工作？
**A:** 确认 `src/App.vue` 中有 `<router-view />` 组件。

### Q: 图标显示不了？
**A:** 需要从 `@element-plus/icons-vue` 导入图标组件。

---

## 📚 相关文档

- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Vite 官方文档](https://vitejs.dev/)

---

## ✅ 更新检查清单

- [ ] 已运行 `npm install` 安装新依赖
- [ ] 能看到导航栏和三个路由页面
- [ ] 首页展示了功能和技术栈
- [ ] 阅读器页面可以上传 EPUB 文件
- [ ] 关于页面显示项目信息
- [ ] 响应式设计在手机上正常显示

---

## 🎉 完成！

现在你的 Vue3 EPUB 阅读器项目已经具有：
- ✅ 完整的路由系统
- ✅ 专业的 UI 组件库
- ✅ 多页面应用架构
- ✅ 响应式设计
- ✅ 现代化的开发体验

祝开发愉快！🚀
