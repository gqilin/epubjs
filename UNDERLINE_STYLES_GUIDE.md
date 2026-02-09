# UnderlineStyleManager 使用文档

## 概述

`UnderlineStyleManager` 是一个功能强大的下划线样式管理器，为 epub.js 库提供了灵活的自定义下划线样式支持。它支持以下特性：

- ✅ **虚线下划线** - 支持多种虚线模式
- ✅ **双划线模拟** - 通过特殊 dasharray 组合模拟
- ✅ **波浪线模拟** - 通过 stroke-linecap 和 dasharray 组合
- ✅ **颜色自定义** - 支持所有有效的 CSS 颜色值
- ✅ **预设样式** - 内置 8 种常用样式
- ✅ **自定义样式** - 支持注册自己的样式预设
- ✅ **批量操作** - 支持一次性添加多个下划线

---

## 快速开始

### 1. 导入管理器

```javascript
import UnderlineStyleManager from "./src/underline-styles.js";

// 在 rendition 初始化后创建管理器实例
const underlineManager = new UnderlineStyleManager(rendition);
```

### 2. 添加最简单的下划线

```javascript
// 使用默认的实线样式
underlineManager.add(
  "/6/4[chap1_div]!/4/2,/1:0,/1:10",  // EpubCFI 范围
  "solid"                               // 样式类型
);
```

### 3. 添加带回调的下划线

```javascript
underlineManager.add(
  "/6/4[chap1_div]!/4/2,/1:0,/1:10",
  "dashed",
  { note: "重要内容" },                 // 关联数据
  (event) => {
    console.log("下划线被点击了");
  }
);
```

---

## API 详细参考

### 构造函数

```javascript
const manager = new UnderlineStyleManager(rendition);
```

**参数：**
- `rendition` - Epub.js 的 Rendition 实例

---

### `add(cfiRange, styleType, data, callback, customStyles)`

添加一条下划线

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cfiRange` | String | 必填 | EpubCFI 范围（如 "/6/4[chap1]!/4/2,/1:0,/1:10"） |
| `styleType` | String | "solid" | 样式类型（见下方样式表） |
| `data` | Object | {} | 关联的数据对象，可自定义任何属性 |
| `callback` | Function | null | 点击下划线时的回调函数 |
| `customStyles` | Object | {} | 自定义样式覆盖 |

**返回：** 返回对象包含 `{ cfiRange, styleType, className, reference }`

**示例：**

```javascript
underlineManager.add(
  "/6/4[chapter1]!/4/2,/1:0,/1:20",
  "dashed",
  {
    note: "这是一个问题",
    author: "John Doe",
    timestamp: new Date()
  },
  (event) => {
    console.log("用户点击了这个下划线");
  },
  {
    stroke: "#FF00FF",      // 覆盖默认颜色为品红色
    "stroke-width": "2"     // 覆盖线宽
  }
);
```

---

### `remove(cfiRange, styleType)`

删除下划线

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cfiRange` | String | EpubCFI 范围 |
| `styleType` | String | 样式类型（可选，不指定则删除该范围的所有下划线） |

**示例：**

```javascript
// 删除特定范围的所有下划线
underlineManager.remove("/6/4[chapter1]!/4/2,/1:0,/1:20");

// 只删除虚线
underlineManager.remove("/6/4[chapter1]!/4/2,/1:0,/1:20", "dashed");
```

---

### `update(cfiRange, newStyleType, customStyles)`

更新下划线样式

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `cfiRange` | String | EpubCFI 范围 |
| `newStyleType` | String | 新的样式类型 |
| `customStyles` | Object | 自定义样式覆盖（可选） |

**示例：**

```javascript
// 将实线改为虚线
underlineManager.update(
  "/6/4[chapter1]!/4/2,/1:0,/1:20",
  "dashed"
);

// 改为虚线并自定义颜色
underlineManager.update(
  "/6/4[chapter1]!/4/2,/1:0,/1:20",
  "dashed",
  { stroke: "#0000FF" }  // 蓝色
);
```

---

### `getAll()`

获取所有已添加的下划线

**返回：** 返回下划线对象数组

**示例：**

```javascript
const allUnderlines = underlineManager.getAll();
console.log(`共有 ${allUnderlines.length} 条下划线`);

allUnderlines.forEach(ul => {
  console.log(`范围: ${ul.cfiRange}, 样式: ${ul.styleType}`);
});
```

---

### `getByRange(cfiRange)`

获取指定范围的所有下划线

**参数：**
- `cfiRange` - EpubCFI 范围

**返回：** 返回匹配的下划线数组

**示例：**

```javascript
const underlines = underlineManager.getByRange("/6/4[chapter1]!/4/2,/1:0,/1:20");
console.log(`该范围有 ${underlines.length} 条下划线`);
```

---

### `registerStyle(styleName, styleConfig)`

注册自定义样式预设

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `styleName` | String | 样式名称（用于后续 add() 调用） |
| `styleConfig` | Object | 样式配置对象 |

**styleConfig 支持的属性：**

| 属性 | 类型 | 说明 | 例子 |
|------|------|------|------|
| `stroke` | String | 线条颜色 | "#FF0000", "red", "rgb(255,0,0)" |
| `stroke-width` | String | 线条宽度（像素） | "1.5", "2", "3" |
| `stroke-opacity` | String | 线条透明度 (0-1) | "0.5", "0.8", "1.0" |
| `stroke-dasharray` | String | 虚线模式 | "5,5", "2,2", "1,3" |
| `stroke-linecap` | String | 线条端点样式 | "round", "square", "butt" |

**示例：**

```javascript
// 注册一个"紧急"样式 - 粗红色虚线
underlineManager.registerStyle("urgent", {
  stroke: "#FF0000",
  "stroke-width": "2.5",
  "stroke-dasharray": "5,3",
  "stroke-opacity": "1.0"
});

// 注册一个"备注"样式 - 细灰色点线
underlineManager.registerStyle("note", {
  stroke: "#999999",
  "stroke-width": "1",
  "stroke-dasharray": "1,2",
  "stroke-opacity": "0.6"
});

// 使用新注册的样式
underlineManager.add(
  "/6/4[chapter1]!/4/2,/1:0,/1:20",
  "urgent",
  { level: "critical" }
);
```

---

### `addBatch(ranges)`

批量添加下划线

**参数：**
- `ranges` - 数组，每个元素为：
  ```javascript
  {
    cfiRange: String,           // EpubCFI 范围（必需）
    styleType: String,          // 样式类型（默认 "solid"）
    data: Object,               // 关联数据（默认 {}）
    callback: Function,         // 点击回调（默认 null）
    customStyles: Object        // 自定义样式（默认 {}）
  }
  ```

**返回：** 返回添加结果数组

**示例：**

```javascript
const ranges = [
  {
    cfiRange: "/6/4[chapter1]!/4/2,/1:0,/1:10",
    styleType: "solid",
    data: { note: "第一个重点" },
    callback: (e) => console.log("点击了第一条")
  },
  {
    cfiRange: "/6/4[chapter1]!/4/2,/1:15,/1:25",
    styleType: "dashed",
    data: { note: "第二个疑问", priority: "high" },
    callback: (e) => console.log("点击了第二条")
  },
  {
    cfiRange: "/6/4[chapter1]!/4/2,/1:30,/1:40",
    styleType: "double",
    data: { note: "第三个要点" }
  }
];

const results = underlineManager.addBatch(ranges);
console.log(`批量添加了 ${results.length} 条下划线`);
```

---

### `clear()`

清除所有下划线

**示例：**

```javascript
// 清除所有下划线
underlineManager.clear();
console.log("所有下划线已清除");
```

---

### `getAvailableStyles()`

获取所有可用的样式预设名称

**返回：** 返回样式名称数组

**示例：**

```javascript
const styles = underlineManager.getAvailableStyles();
console.log("可用样式:", styles);
// 输出: ["solid", "dashed", "dashed_dense", "dotted", "double", "wavy", "bold", "thin"]
```

---

### `getStyleConfig(styleName)`

获取指定样式的配置

**参数：**
- `styleName` - 样式名称

**返回：** 返回样式配置对象，如果不存在返回 null

**示例：**

```javascript
const config = underlineManager.getStyleConfig("dashed");
console.log("虚线配置:", config);
// 输出: {
//   stroke: "#FF0000",
//   "stroke-width": "1.5",
//   "stroke-dasharray": "5,5",
//   "stroke-opacity": "0.8"
// }
```

---

## 预设样式详解

### 1. solid（实线）- 黑色
```javascript
{
  stroke: "#000000",
  "stroke-width": "1.5",
  "stroke-opacity": "0.8"
}
```
**用途：** 标记重要内容或常规注记

---

### 2. dashed（虚线）- 红色
```javascript
{
  stroke: "#FF0000",
  "stroke-width": "1.5",
  "stroke-dasharray": "5,5",
  "stroke-opacity": "0.8"
}
```
**用途：** 标记有疑问或需要核实的内容

---

### 3. dashed_dense（密集虚线）- 蓝色
```javascript
{
  stroke: "#0066FF",
  "stroke-width": "1.5",
  "stroke-dasharray": "2,2",
  "stroke-opacity": "0.8"
}
```
**用途：** 标记次要信息或补充说明

---

### 4. dotted（点线）- 绿色
```javascript
{
  stroke: "#00AA00",
  "stroke-width": "1",
  "stroke-dasharray": "1,3",
  "stroke-opacity": "0.8"
}
```
**用途：** 标记词汇、术语或定义

---

### 5. double（双划线模拟）- 橙色
```javascript
{
  stroke: "#FF6600",
  "stroke-width": "2.5",
  "stroke-dasharray": "8,2,2,2",
  "stroke-opacity": "0.8"
}
```
**用途：** 标记特别强调或重点内容

---

### 6. wavy（波浪线模拟）- 紫色
```javascript
{
  stroke: "#9966FF",
  "stroke-width": "2",
  "stroke-dasharray": "4,2",
  "stroke-linecap": "round",
  "stroke-opacity": "0.7"
}
```
**用途：** 标记拼写错误或不确定的内容

---

### 7. bold（粗实线）- 红色
```javascript
{
  stroke: "#FF0000",
  "stroke-width": "2.5",
  "stroke-opacity": "0.9"
}
```
**用途：** 标记最高优先级的内容

---

### 8. thin（轻细线）- 灰色
```javascript
{
  stroke: "#666666",
  "stroke-width": "0.8",
  "stroke-opacity": "0.6"
}
```
**用途：** 标记参考信息或补充注解

---

## 高级用法

### 1. 颜色和样式的组合

```javascript
// 创建一个高优先级问题的标记 - 粗红色虚线
underlineManager.registerStyle("high_priority_question", {
  stroke: "#FF0000",
  "stroke-width": "2.5",
  "stroke-dasharray": "6,4",
  "stroke-opacity": "0.95"
});

underlineManager.add(
  "/6/4[chapter1]!/4/2,/1:0,/1:20",
  "high_priority_question",
  {
    level: "critical",
    question: "这是什么意思？",
    needsReview: true
  }
);
```

---

### 2. 动态样式切换

```javascript
// 根据用户选择动态切换样式
function switchUnderlineStyle(cfiRange, newStyle) {
  underlineManager.update(cfiRange, newStyle);
  console.log(`样式已更新为: ${newStyle}`);
}

// 用户点击下拉菜单时调用
document.getElementById("styleSelector").addEventListener("change", (e) => {
  switchUnderlineStyle(selectedRange, e.target.value);
});
```

---

### 3. 数据持久化

```javascript
// 导出所有批注数据
function exportAnnotations() {
  return {
    bookId: currentBook.id,
    exportDate: new Date().toISOString(),
    underlines: underlineManager.getAll().map(ul => ({
      cfiRange: ul.cfiRange,
      styleType: ul.styleType,
      data: ul.data
    }))
  };
}

// 恢复批注数据
function importAnnotations(data) {
  underlineManager.clear();
  data.underlines.forEach(ul => {
    underlineManager.add(
      ul.cfiRange,
      ul.styleType,
      ul.data
    );
  });
}
```

---

### 4. 与用户交互集成

```javascript
// 创建一个完整的批注工具栏
class AnnotationToolbar {
  constructor(rendition) {
    this.manager = new UnderlineStyleManager(rendition);
    this.selectedText = null;
    this.selectedRange = null;
    this.setupToolbar();
    this.setupTextSelection();
  }

  setupTextSelection() {
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        this.selectedText = selection.toString();
        this.showToolbar();
      }
    });
  }

  showToolbar() {
    const toolbar = document.getElementById("annotation-toolbar");
    toolbar.style.display = "block";
  }

  applyUnderline(styleType) {
    if (this.selectedRange) {
      this.manager.add(
        this.selectedRange,
        styleType,
        {
          selectedText: this.selectedText,
          timestamp: new Date().toISOString()
        },
        (e) => this.onUnderlineClick(e)
      );
      this.hideToolbar();
    }
  }

  setupToolbar() {
    const toolbar = document.createElement("div");
    toolbar.id = "annotation-toolbar";
    toolbar.innerHTML = `
      <button onclick="toolbar.applyUnderline('solid')">实线</button>
      <button onclick="toolbar.applyUnderline('dashed')">虚线</button>
      <button onclick="toolbar.applyUnderline('dotted')">点线</button>
      <button onclick="toolbar.applyUnderline('double')">双划线</button>
      <button onclick="toolbar.applyUnderline('bold')">粗线</button>
    `;
    document.body.appendChild(toolbar);
  }

  hideToolbar() {
    document.getElementById("annotation-toolbar").style.display = "none";
  }

  onUnderlineClick(event) {
    console.log("用户点击了下划线:", event);
    // 显示批注详情或提供编辑选项
  }
}
```

---

## 常见问题

### Q: 波浪线看起来不像真正的波浪线？
**A:** 当前实现是通过 SVG 属性模拟的，如果需要真正的波浪线，需要修改底层 marks-pane 库来使用 SVG 路径而非直线。

### Q: 可以同时为同一范围添加多条不同样式的下划线吗？
**A:** 可以，管理器支持为同一范围添加多条下划线，它们会堆叠显示。

### Q: 下划线颜色支持透明度吗？
**A:** 支持，使用 `stroke-opacity` 属性来控制。范围是 0-1，0 完全透明，1 完全不透明。

### Q: 如何修改所有下划线的样式？
**A:** 可以获取所有下划线，然后逐一更新：
```javascript
underlineManager.getAll().forEach(ul => {
  underlineManager.update(ul.cfiRange, "new_style");
});
```

### Q: 可以为不同的用户保存不同的下划线吗？
**A:** 可以，在数据对象中添加用户信息：
```javascript
underlineManager.add(cfiRange, "solid", {
  userId: currentUser.id,
  userName: currentUser.name,
  timestamp: new Date()
});
```

---

## 集成到 Vue 应用示例

```vue
<template>
  <div id="epub-reader">
    <div ref="epubContainer" id="epub-container"></div>
    <div class="toolbar">
      <select v-model="selectedStyle" @change="changeStyle">
        <option v-for="style in availableStyles" :key="style" :value="style">
          {{ style }}
        </option>
      </select>
      <button @click="clearAll">清除所有</button>
    </div>
    <div class="annotations">
      <div v-for="(annotation, index) in allAnnotations" :key="index" class="annotation-item">
        <strong>{{ annotation.styleType }}</strong>: {{ annotation.data.note }}
      </div>
    </div>
  </div>
</template>

<script>
import ePub from "epubjs";
import UnderlineStyleManager from "./src/underline-styles.js";

export default {
  data() {
    return {
      rendition: null,
      underlineManager: null,
      selectedStyle: "solid",
      availableStyles: [],
      allAnnotations: []
    };
  },
  mounted() {
    this.initEPUB();
  },
  methods: {
    initEPUB() {
      const book = ePub("/path/to/book.epub");
      this.rendition = book.renderTo("epub-container", {
        width: "100%",
        height: "100%"
      });

      this.rendition.display();

      // 初始化管理器
      this.underlineManager = new UnderlineStyleManager(this.rendition);
      this.availableStyles = this.underlineManager.getAvailableStyles();

      // 监听文本选择
      document.addEventListener("selectionchange", () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          // 获取 CFI 范围（这需要额外的逻辑）
          const cfiRange = this.getSelectedRange();
          if (cfiRange) {
            this.underlineManager.add(
              cfiRange,
              this.selectedStyle,
              { selectedText: selection.toString() }
            );
            this.updateAnnotations();
          }
        }
      });
    },
    changeStyle(style) {
      this.selectedStyle = style;
    },
    clearAll() {
      this.underlineManager.clear();
      this.updateAnnotations();
    },
    updateAnnotations() {
      this.allAnnotations = this.underlineManager.getAll();
    },
    getSelectedRange() {
      // 这是一个简化的实现，实际需要更复杂的逻辑来获取 EpubCFI 范围
      return null;
    }
  }
};
</script>

<style scoped>
#epub-reader {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#epub-container {
  flex: 1;
}

.toolbar {
  padding: 10px;
  border-top: 1px solid #ccc;
}

.annotations {
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #ccc;
  padding: 10px;
}

.annotation-item {
  padding: 5px;
  margin: 5px 0;
  background: #f0f0f0;
  border-left: 3px solid #0066FF;
}
</style>
```

---

## 许可证和支持

这个管理器是为 epub.js 项目开发的扩展工具。有问题或建议，欢迎提交 Issue 或 Pull Request。
