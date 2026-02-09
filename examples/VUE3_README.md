# Vue3 EPUB 阅读器示例

这是使用 Elegant-EPUB 库和 Vue3 框架构建的功能完整的 EPUB 阅读器示例。

## 📁 文件说明

### 1. `vue3-reader.html` (CDN 版本)

直接在浏览器中使用，无需构建工具。

**特点：**
- ✅ 开箱即用，无需安装依赖
- ✅ 使用 CDN 加载 Vue3
- ✅ 支持文件上传功能
- ✅ 完整的阅读器功能

**快速开始：**
```bash
# 直接在浏览器中打开
open vue3-reader.html
```

**功能：**
- 📤 上传 EPUB 文件
- ◀ ▶ 上一页/下一页
- 📖 交互式目录导航
- 📊 进度条显示和拖拽跳转
- 📚 显示书籍元数据
- 🎨 美观的深紫色主题 UI

### 2. `EpubReader.vue` (SFC 版本)

Vue3 单文件组件，用于项目集成。

**特点：**
- ✅ 使用 TypeScript 类型
- ✅ Composition API 组织
- ✅ 组件化设计，易于集成
- ✅ 完整的类型定义

**在 Vue3 项目中使用：**

```vue
<template>
  <EpubReader />
</template>

<script setup>
import EpubReader from '@/components/EpubReader.vue';
</script>
```

---

## 🚀 使用指南

### 方式一：CDN 版本（推荐快速尝试）

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Vue3 CDN -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

  <!-- JSZip (用于读取压缩的 EPUB 文件) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

  <!-- Elegant-EPUB -->
  <script src="path/to/epub.min.js"></script>
</head>
<body>
  <div id="app">
    <epub-reader></epub-reader>
  </div>

  <script src="vue3-reader.html"></script>
</body>
</html>
```

### 方式二：npm 项目集成

```bash
# 1. 安装依赖
npm install elegant-epub jszip vue@3

# 2. 在项目中导入组件
import EpubReader from '@/components/EpubReader.vue';

# 3. 在模板中使用
<template>
  <EpubReader />
</template>
```

---

## 🎨 主要功能演示

### 1. 上传 EPUB 文件

```javascript
// 用户通过界面上传文件
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    // 将 ArrayBuffer 传递给 loadEpub
    loadEpub(e.target.result);
  };

  reader.readAsArrayBuffer(file);
};
```

### 2. 加载和显示 EPUB

```javascript
const loadEpub = (epubPath) => {
  // 创建书籍对象
  book = ePub(epubPath);

  // 渲染到容器
  rendition = book.renderTo('viewer', {
    width: '100%',
    height: '100%',
    flow: 'paginated'
  });

  // 监听就绪事件
  rendition.on('ready', () => {
    // 设置钩子、加载元数据等
    setupHooks();
    displayFirstPage();
  });
};
```

### 3. 交互式导航

```javascript
// 点击目录跳转到指定章节
const goToTocItem = (item) => {
  rendition.display(item.href || item.cfi);
};

// 翻页
const nextPage = () => {
  rendition.next();
};

const prevPage = () => {
  rendition.prev();
};
```

### 4. 进度追踪

```javascript
// 监听位置变化
rendition.on('relocated', (location) => {
  // 更新进度
  progress.value = location.progress; // 0-1

  // 更新当前章节
  currentSpineIndex.value = calculateSpineIndex(location);
});

// 点击进度条跳转
const seekProgress = (event) => {
  const percent = event.offsetX / event.currentTarget.clientWidth;
  const cfi = book.locations.cfiFromPercentage(percent);
  rendition.display(cfi);
};
```

### 5. 自定义样式钩子

```javascript
const setupHooks = () => {
  rendition.hooks.content.register((contents, view) => {
    // 添加自定义样式
    const style = contents.document.createElement('style');
    style.textContent = `
      body {
        font-family: "Microsoft YaHei", Arial;
        line-height: 1.8;
      }
      p {
        text-indent: 2em;
      }
    `;
    contents.document.head.appendChild(style);
  });
};
```

---

## 📊 组件状态管理

### 关键响应式变量

```typescript
// 书籍和渲染器
const book = ref<any>(null);              // EPUB Book 对象
const rendition = ref<any>(null);        // 渲染器实例

// 内容信息
const bookTitle = ref<string>('');       // 书名
const metadata = ref<Metadata | null>(); // 书籍元数据
const toc = ref<TocItem[]>([]);          // 目录列表

// 进度和位置
const progress = ref<number>(0);         // 阅读进度 (0-1)
const currentLocation = ref<any>(null);  // 当前位置
const currentSpineIndex = ref<number>(); // 当前章节索引
const currentTocIndex = ref<number>();  // 当前目录索引

// UI 状态
const bookLoaded = ref<boolean>(false);  // 书籍是否加载完成
const errorMessage = ref<string>('');    // 错误消息
const infoMessage = ref<string>('');     // 信息提示
```

---

## 🎯 核心 API 方法

### 初始化和加载

| 方法 | 说明 |
|------|------|
| `loadEpub(path)` | 加载 EPUB 文件 |
| `handleFileUpload(event)` | 处理文件上传 |
| `setupHooks()` | 设置渲染钩子 |
| `displayFirstPage()` | 显示第一页 |

### 导航和翻页

| 方法 | 说明 |
|------|------|
| `nextPage()` | 下一页 |
| `prevPage()` | 上一页 |
| `goToTocItem(item)` | 跳转到目录项 |
| `seekProgress(event)` | 根据进度条跳转 |

### 数据更新

| 方法 | 说明 |
|------|------|
| `updateCurrentSpineIndex(location)` | 更新当前章节索引 |
| `updateCurrentTocIndex(location)` | 更新当前目录索引 |

---

## 🔧 配置选项

### 渲染配置

```typescript
const rendition = book.renderTo('viewer', {
  width: '100%',           // 宽度
  height: '100%',          // 高度
  flow: 'paginated',       // 流程方式: 'paginated'|'scrolled-doc'|'continuous'
  allowScriptedContent: false  // 是否允许脚本内容 (安全起见默认禁用)
});
```

### 支持的流程方式

- `paginated` - 分页显示（推荐）
- `scrolled-doc` - 卷轴滚动
- `continuous` - 连续显示

---

## 🎨 UI 界面结构

```
┌─────────────────────────────────────────────────┐
│  📚 Vue3 EPUB 阅读器                             │
└─────────────────────────────────────────────────┘
┌──────────────┬─────────────────────────────────┐
│              │                                 │
│   目录        │        阅读器工具栏              │
│  ┌────────┐  │  ◀  ▶  📤  [█████████] 45.2%   │
│  │章节1   │  │                                 │
│  │章节2   │  │  ┌────────────────────────────┐ │
│  │  2.1   │  │  │                            │ │
│  │章节3   │  │  │     EPUB 内容显示           │ │
│  │章节4   │  │  │                            │ │
│  └────────┘  │  │                            │ │
│              │  └────────────────────────────┘ │
│  作者:       │                                 │
│  出版社:     │                                 │
│  语言:       │                                 │
└──────────────┴─────────────────────────────────┘
```

---

## ⌨️ 快捷操作

### 键盘快捷键（可在代码中添加）

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') rendition.next();    // 右箭头 → 下一页
  if (e.key === 'ArrowLeft') rendition.prev();     // 左箭头 ← 上一页
  if (e.key === '+') zoomIn();                     // + 放大
  if (e.key === '-') zoomOut();                    // - 缩小
});
```

### 鼠标操作

- 📖 左点击进度条 → 跳转到指定位置
- 🖱️ 悬停目录项 → 高亮显示
- 📤 点击上传按钮 → 选择 EPUB 文件

---

## 🐛 常见问题

### Q1: 上传文件后无法显示怎么办？

**A:** 检查以下几点：
1. 确保文件是有效的 EPUB 格式
2. 检查浏览器控制台是否有错误信息
3. 确保已加载 JSZip 库

```javascript
// 添加错误日志
rendition.on('error', (error) => {
  console.error('渲染错误:', error);
});
```

### Q2: 中文显示乱码怎么办？

**A:** 钩子中已设置中文字体，确保样式正确应用：

```javascript
rendition.hooks.content.register((contents) => {
  const style = contents.document.createElement('style');
  style.textContent = `
    body {
      font-family: -apple-system, BlinkMacSystemFont,
                   "Microsoft YaHei", "微软雅黑", serif;
    }
  `;
  contents.document.head.appendChild(style);
});
```

### Q3: 如何自定义主题颜色？

**A:** 修改 CSS 变量或直接编辑样式：

```css
/* 修改主色调 */
.toolbar-btn {
  background: #your-color; /* 改成你喜欢的颜色 */
}

.progress-fill {
  background: linear-gradient(90deg, #color1, #color2);
}
```

### Q4: 如何添加书签功能？

**A:** 保存当前位置的 CFI：

```javascript
// 保存书签
const saveBookmark = () => {
  const cfi = rendition.currentLocation().start.cfi;
  localStorage.setItem('bookmark', cfi);
};

// 恢复书签
const loadBookmark = () => {
  const cfi = localStorage.getItem('bookmark');
  if (cfi) rendition.display(cfi);
};
```

---

## 📱 响应式设计

该示例包含响应式设计，在移动设备上会自动隐藏侧边栏。

```css
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
```

---

## 🚀 性能优化建议

1. **预加载下一章**
   ```javascript
   const preloadNext = () => {
     const nextSection = book.spine.next(currentSection);
     if (nextSection) {
       book.load(nextSection.href);
     }
   };
   ```

2. **及时清理资源**
   ```javascript
   // 组件卸载时
   onUnmounted(() => {
     rendition?.destroy();
     book?.destroy();
   });
   ```

3. **限制事件监听**
   - 仅注册必要的钩子
   - 避免在钩子中执行复杂计算

---

## 📚 参考资源

- [Elegant-EPUB 中文文档](../USAGE_CN.md)
- [Vue3 官方文档](https://vuejs.org/)
- [EPUB 标准](https://www.w3.org/publishing/epub/)
- [EPUB.js GitHub](https://github.com/futurepress/epub.js)

---

## 📄 许可证

BSD-2-Clause License

---

**最后更新**: 2026年2月

欢迎提交 Issue 和 Pull Request！
