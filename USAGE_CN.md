# Elegant-EPUB 详细使用指南

## 概述

Elegant-EPUB（原 Epub.js）是一个强大的 JavaScript 库，用于在浏览器中渲染 EPUB 电子书文档。它提供了一个简洁的接口来实现常见的电子书功能，如渲染、数据持久化和分页，无需开发专用应用程序或插件。

**主要特点：**
- ✅ 支持 EPUB3 标准格式
- ✅ 跨浏览器兼容性强
- ✅ 支持多种渲染方式（分页/连续滚动）
- ✅ 灵活的 API 和钩子系统
- ✅ 完全免费（BSD-2-Clause 许可证）

---

## 1. 安装与初始化

### 1.1 npm 安装

```bash
npm install elegant-epub
```

### 1.2 浏览器引入

如果使用 `.epub` 文件（压缩格式），需要先引入 JSZip：

```html
<!-- JSZip 必须在 epub.js 前面引入 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<!-- 引入 Elegant-EPUB -->
<script src="path/to/epub.min.js"></script>

<!-- 渲染容器 -->
<div id="viewer"></div>
```

### 1.3 现代模块化使用

```javascript
import ePub from 'elegant-epub';

// 或者使用 CommonJS
const ePub = require('elegant-epub');
```

---

## 2. 基本使用示例

### 2.1 最简单的示例

```javascript
// 创建 Book 对象
const book = ePub("path/to/book.epub");

// 渲染到指定 DOM 元素
const rendition = book.renderTo("viewer", {
  width: 600,
  height: 400
});

// 显示第一章
rendition.display();
```

### 2.2 完整的初始化示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EPUB 阅读器</title>
  <style>
    #viewer {
      width: 100%;
      height: 600px;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <div id="viewer"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="epub.min.js"></script>

  <script>
    const book = ePub("books/sample.epub");

    const rendition = book.renderTo("viewer", {
      width: "100%",
      height: "100%",
      flow: "paginated"
    });

    // 监听就绪事件
    rendition.on("ready", () => {
      console.log("渲染器已准备好");
    });

    // 显示第一章
    rendition.display().catch(err => {
      console.error("显示章节出错:", err);
    });
  </script>
</body>
</html>
```

---

## 3. 渲染方法 (Method)

### 3.1 默认方法 (Default)

一次只显示一个章节，适合桌面阅读。

```javascript
const rendition = book.renderTo("viewer", {
  method: "default",
  width: 800,
  height: 600
});
```

**特点：**
- 性能最好
- 清晰的页面分割
- 适合长篇阅读

### 3.2 连续方法 (Continuous)

显示多个章节并支持流畅滚动，适合移动设备。

```javascript
const rendition = book.renderTo("viewer", {
  method: "continuous",
  width: "100%",
  height: "100%"
});
```

**特点：**
- 支持无缝滑动/滚动
- 优化移动端体验
- 性能相对较低

---

## 4. 流程控制 (Flow)

### 4.1 自动流程 (Auto - 默认)

根据 OPF 文件中的设置决定流程类型。

```javascript
const rendition = book.renderTo("viewer", {
  flow: "auto",
  width: 900,
  height: 600
});
```

### 4.2 分页流程 (Paginated)

将内容分成多个页面，支持左右翻页。

```javascript
const rendition = book.renderTo("viewer", {
  flow: "paginated",
  width: 900,
  height: 600
});

// 上一页
rendition.prev();

// 下一页
rendition.next();
```

### 4.3 滚动流程 (Scrolled-doc)

内容以卷轴形式连续显示。

```javascript
const rendition = book.renderTo("viewer", {
  flow: "scrolled-doc"
});
```

---

## 5. 常用 API 方法

### 5.1 显示与导航

```javascript
// 显示第一章
rendition.display();

// 显示指定章节（通过 EPUB CFI）
rendition.display("epubcfi(/6/4[chap01_split0000]!/4/2/16,/1:0,/1:29)");

// 下一章
rendition.next().then(() => {
  console.log("已到下一章");
});

// 上一章
rendition.prev().then(() => {
  console.log("已到上一章");
});

// 跳转到指定位置
rendition.goto("epubcfi(/6/4[chap01_split0000]!/4/2/16,/1:0,/1:29)");
```

### 5.2 章节信息获取

```javascript
// 获取目录 (Table of Contents)
const toc = book.navigation.toc;
console.log(toc);

// 遍历目录
toc.forEach(chapter => {
  console.log(chapter.label); // 章节标题
  console.log(chapter.href);  // 章节链接
});

// 获取所有 spine 项（书籍顺序）
const spine = book.spine;
console.log(spine.items); // 所有章节

// 获取当前显示的章节
rendition.on("relocated", location => {
  console.log("当前位置:", location.start);
  console.log("当前比例:", location.progress); // 0-1
});
```

### 5.3 书籍元数据

```javascript
// 获取书籍信息
book.loaded.metadata.then(metadata => {
  console.log("书名:", metadata.title);
  console.log("作者:", metadata.creator);
  console.log("出版社:", metadata.publisher);
  console.log("语言:", metadata.language);
  console.log("修改时间:", metadata.modified_date);
});

// 获取书籍封面
book.loaded.cover.then(cover => {
  const coverUrl = book.archive.createUrl(cover);
  console.log("封面:", coverUrl);
});
```

### 5.4 书签与进度

```javascript
// 保存当前位置
const currentLocation = rendition.currentLocation();
console.log("CFI:", currentLocation.start.cfi); // 可用于书签

// 恢复到之前的位置
rendition.display(savedCFI);

// 获取阅读进度（0-1）
rendition.on("relocated", location => {
  const progress = location.progress * 100;
  console.log(`阅读进度: ${progress.toFixed(2)}%`);
});
```

---

## 6. 事件监听

### 6.1 常用事件

```javascript
// 渲染器初始化完成
rendition.on("ready", () => {
  console.log("渲染器已准备好");
});

// 章节显示完成
rendition.on("rendered", (section) => {
  console.log("章节已渲染:", section.href);
});

// 位置改变（翻页时触发）
rendition.on("relocated", (location) => {
  console.log("位置已改变");
  console.log("进度:", location.progress);
  console.log("CFI:", location.start.cfi);
});

// 章节加载完成
rendition.on("display", () => {
  console.log("章节内容已加载完成");
});

// 内容已卸载
rendition.on("unloaded", (section) => {
  console.log("章节已卸载:", section.href);
});

// 错误处理
rendition.on("error", (error) => {
  console.error("渲染错误:", error);
});

// 书籍已加载
book.ready.then(() => {
  console.log("书籍已加载");
});
```

---

## 7. 钩子系统 (Hooks)

钩子允许你在书籍渲染过程的特定阶段插入自定义逻辑。

### 7.1 内容钩子

```javascript
// 章节内容加载后
rendition.hooks.content.register((contents, view) => {
  // contents: iframe 的 Document 对象
  // view: 视图信息

  // 示例：修改所有链接的颜色
  const links = contents.document.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = '#0066cc';
  });
});

// 示例：处理图片
rendition.hooks.content.register((contents, view) => {
  const images = contents.document.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  });
});
```

### 7.2 渲染钩子

```javascript
// 章节渲染前
rendition.hooks.render.register(function(section) {
  console.log("准备渲染:", section.href);
  return new Promise(resolve => {
    // 异步操作
    setTimeout(resolve, 100);
  });
});
```

### 7.3 脊椎钩子

```javascript
// 章节序列化时
book.spine.hooks.serialize.register(function(text, section) {
  console.log("正在序列化:", section.href);
  return text;
});

// 章节内容加载时
book.spine.hooks.content.register(function(section) {
  console.log("章节内容已加载");
});
```

---

## 8. 主题与样式

### 8.1 设置主题

```javascript
// 获取主题管理器
const themes = rendition.themes;

// 注册自定义主题
themes.register("night", {
  "body": {
    "background": "#000",
    "color": "#fff"
  },
  "a": {
    "color": "#0066cc"
  },
  "p": {
    "text-indent": "1em",
    "margin-bottom": "0.5em"
  }
});

// 选择主题
themes.select("night");

// 或使用内置主题
themes.select("default");
```

### 8.2 自定义样式

```javascript
rendition.hooks.content.register((contents, view) => {
  // 添加自定义 CSS
  const style = contents.document.createElement('style');
  style.textContent = `
    body {
      font-family: "Microsoft YaHei", Arial;
      line-height: 1.8;
      font-size: 16px;
    }
    p {
      text-indent: 2em;
    }
  `;
  contents.document.head.appendChild(style);
});
```

---

## 9. 脚本内容支持

默认情况下，为了安全起见，EPUB 中的 JavaScript 脚本是被禁用的。

### 9.1 启用脚本内容

```javascript
const rendition = book.renderTo("viewer", {
  width: 600,
  height: 400,
  allowScriptedContent: true  // 启用脚本
});
```

**警告：** 仅对可信的 EPUB 启用此选项，因为不安全的脚本可能执行恶意代码。

---

## 10. 完整实战示例

### 10.1 功能完整的阅读器

```javascript
class EpubReader {
  constructor(bookPath, viewerId) {
    this.book = ePub(bookPath);
    this.rendition = null;
    this.viewerId = viewerId;
    this.init();
  }

  init() {
    this.rendition = this.book.renderTo(this.viewerId, {
      width: "100%",
      height: "100%",
      flow: "paginated"
    });

    this.rendition.on("ready", () => {
      this.setupNavigation();
      this.setupEvents();
      this.loadBook();
    });
  }

  loadBook() {
    this.book.loaded.metadata.then(metadata => {
      console.log("书籍加载完成:", metadata.title);
      this.rendition.display();
    });
  }

  setupNavigation() {
    // 显示目录
    const toc = this.book.navigation.toc;
    this.renderTableOfContents(toc);
  }

  setupEvents() {
    // 监听位置变化
    this.rendition.on("relocated", location => {
      this.updateProgressBar(location.progress);
      this.updateCurrentChapter(location.start.cfi);
    });

    // 键盘快捷键
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") this.rendition.prev();
      if (e.key === "ArrowRight") this.rendition.next();
    });
  }

  renderTableOfContents(toc) {
    const tocList = document.getElementById("toc");
    toc.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.label;
      li.style.cursor = "pointer";
      li.onclick = () => {
        this.rendition.display(item.href);
      };
      tocList.appendChild(li);
    });
  }

  updateProgressBar(progress) {
    const progressBar = document.getElementById("progress");
    progressBar.style.width = (progress * 100) + "%";
    document.getElementById("progress-text").textContent =
      (progress * 100).toFixed(1) + "%";
  }

  updateCurrentChapter(cfi) {
    // 保存当前位置到 localStorage
    localStorage.setItem("bookmark", cfi);
  }

  // 恢复上次阅读位置
  restoreBookmark() {
    const bookmark = localStorage.getItem("bookmark");
    if (bookmark) {
      this.rendition.display(bookmark);
    }
  }

  // 翻页
  nextPage() {
    this.rendition.next();
  }

  prevPage() {
    this.rendition.prev();
  }
}

// 使用
const reader = new EpubReader("books/sample.epub", "viewer");
document.getElementById("next-btn").onclick = () => reader.nextPage();
document.getElementById("prev-btn").onclick = () => reader.prevPage();
```

### 10.2 HTML 结构

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EPUB 阅读器</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial; }

    .container {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 200px;
      border-right: 1px solid #ddd;
      overflow-y: auto;
      padding: 10px;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    #viewer {
      flex: 1;
      overflow: hidden;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-top: 1px solid #ddd;
      background: #f5f5f5;
    }

    .progress-container {
      flex: 1;
      margin: 0 10px;
    }

    .progress-bar {
      width: 100%;
      height: 5px;
      background: #ddd;
      border-radius: 3px;
      overflow: hidden;
    }

    #progress {
      height: 100%;
      background: #007bff;
      width: 0;
      transition: width 0.3s;
    }

    button {
      padding: 8px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover { background: #0056b3; }

    #toc {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    #toc li {
      padding: 8px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: all 0.3s;
    }

    #toc li:hover {
      background: #f0f0f0;
      border-left-color: #007bff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h3>目录</h3>
      <ul id="toc"></ul>
    </div>

    <div class="main">
      <div id="viewer"></div>

      <div class="toolbar">
        <button id="prev-btn">上一页</button>
        <div class="progress-container">
          <div class="progress-bar">
            <div id="progress"></div>
          </div>
          <small id="progress-text">0%</small>
        </div>
        <button id="next-btn">下一页</button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <script src="epub.min.js"></script>
  <script src="reader.js"></script>
</body>
</html>
```

---

## 11. 常见问题与解决方案

### 11.1 中文显示问题

```javascript
// 在钩子中设置中文字体
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

### 11.2 处理加载错误

```javascript
rendition.on("error", (error) => {
  console.error("加载错误:", error);
  // 显示用户提示
  alert("书籍加载失败，请检查文件");
});

book.ready.catch((error) => {
  console.error("书籍准备失败:", error);
});
```

### 11.3 内存泄漏防止

```javascript
// 在销毁组件时清理资源
function cleanup() {
  rendition.destroy();
  book.destroy();
  // 移除事件监听
}

// React 示例
useEffect(() => {
  const reader = new EpubReader("book.epub", "viewer");

  return () => {
    reader.cleanup();
  };
}, []);
```

### 11.4 获取当前选中文本

```javascript
rendition.hooks.content.register((contents) => {
  contents.document.addEventListener('mouseup', () => {
    const selection = contents.window.getSelection();
    if (selection.toString()) {
      console.log("选中的文本:", selection.toString());
    }
  });
});
```

---

## 12. 性能优化建议

1. **选择合适的渲染方法**
   - 桌面应用使用 `default` 方法
   - 移动应用使用 `continuous` 方法

2. **预加载**
   ```javascript
   // 预加载下一章
   book.spine.next(currentSection).then(section => {
     book.load(section.href);
   });
   ```

3. **清理未使用资源**
   ```javascript
   rendition.on("unloaded", (section) => {
     // 释放资源
     console.log("已卸载:", section.href);
   });
   ```

4. **限制钩子数量**
   - 仅注册必要的钩子
   - 在钩子中避免复杂的 DOM 操作

---

## 13. 参考资源

- **官方文档**: http://epubjs.org/documentation/0.3/
- **GitHub 仓库**: https://github.com/futurepress/epub.js
- **示例代码**: http://futurepress.github.io/epub.js/examples/
- **EPUB 标准**: https://www.w3.org/publishing/epub/

---

## 14. 更新日志

**v0.3.93** (当前版本)
- 支持 Node 20+
- 改进了渲染性能
- 优化了中文支持
- 增强了错误处理

---

**最后更新**: 2026年2月

有任何问题或建议，欢迎提交 Issue 或 Pull Request！
