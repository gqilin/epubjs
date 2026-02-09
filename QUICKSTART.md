# 自定义下划线样式系统 - 快速入门

## 📦 创建的文件清单

| 文件 | 位置 | 用途 |
|------|------|------|
| `underline-styles.js` | `src/` | 核心管理器类 |
| `underline-styles-examples.js` | `src/` | 使用示例和高级用法 |
| `underline-styles.d.ts` | `src/` | TypeScript 类型定义 |
| `UNDERLINE_STYLES_GUIDE.md` | 项目根目录 | 完整使用文档 |

---

## 🚀 最简单的3行代码开始

```javascript
import UnderlineStyleManager from "./src/underline-styles.js";

const manager = new UnderlineStyleManager(rendition);
manager.add("/6/4[chapter]!/4/2,/1:0,/1:20", "dashed", { note: "虚线标记" });
```

---

## ✨ 功能特性速览

### ✅ 支持的线条样式

| 样式 | 效果 | 颜色 | 用途 |
|------|------|------|------|
| `solid` | 实线 | 黑色 | 常规标记 |
| `dashed` | 虚线 | 红色 | 有疑问内容 |
| `dashed_dense` | 密集虚线 | 蓝色 | 次要信息 |
| `dotted` | 点线 | 绿色 | 术语/定义 |
| `double` | 双划线 | 橙色 | 强调重点 |
| `wavy` | 波浪线 | 紫色 | 拼写错误 |
| `bold` | 粗线 | 红色 | 最高优先级 |
| `thin` | 细线 | 灰色 | 参考信息 |

### ✅ 支持的操作

- ✔ 添加下划线 - `add()`
- ✔ 删除下划线 - `remove()`
- ✔ 更新样式 - `update()`
- ✔ 批量操作 - `addBatch()`
- ✔ 自定义样式 - `registerStyle()`
- ✔ 数据获取 - `getAll()`, `getByRange()`
- ✔ 样式查询 - `getAvailableStyles()`, `getStyleConfig()`

---

## 📋 常用代码示例

### 1️⃣ 添加虚线
```javascript
manager.add(
  "/6/4[chapter]!/4/2,/1:0,/1:20",
  "dashed",
  { note: "有疑问的地方" },
  (e) => console.log("被点击了")
);
```

### 2️⃣ 添加双划线
```javascript
manager.add(
  "/6/4[chapter]!/4/2,/1:0,/1:20",
  "double",
  { note: "重点内容" }
);
```

### 3️⃣ 自定义颜色和样式
```javascript
manager.add(
  "/6/4[chapter]!/4/2,/1:0,/1:20",
  "dashed",
  { note: "自定义虚线" },
  null,
  {
    stroke: "#00FF00",      // 绿色
    "stroke-width": "2.5"   // 更粗
  }
);
```

### 4️⃣ 注册自定义样式
```javascript
manager.registerStyle("my_style", {
  stroke: "#FF00FF",      // 品红色
  "stroke-width": "2",
  "stroke-dasharray": "8,3"  // 虚线模式
});

manager.add(
  "/6/4[chapter]!/4/2,/1:0,/1:20",
  "my_style",
  { note: "我的自定义样式" }
);
```

### 5️⃣ 批量添加
```javascript
manager.addBatch([
  {
    cfiRange: "/6/4[chapter]!/4/2,/1:0,/1:10",
    styleType: "solid",
    data: { note: "第一条" }
  },
  {
    cfiRange: "/6/4[chapter]!/4/2,/1:15,/1:25",
    styleType: "dashed",
    data: { note: "第二条" }
  },
  {
    cfiRange: "/6/4[chapter]!/4/2,/1:30,/1:40",
    styleType: "double",
    data: { note: "第三条" }
  }
]);
```

### 6️⃣ 更新样式
```javascript
// 将实线改为虚线
manager.update(
  "/6/4[chapter]!/4/2,/1:0,/1:20",
  "dashed",
  { stroke: "#0000FF" }  // 蓝色虚线
);
```

### 7️⃣ 删除下划线
```javascript
manager.remove("/6/4[chapter]!/4/2,/1:0,/1:20");
```

### 8️⃣ 获取和管理
```javascript
// 获取所有下划线
const all = manager.getAll();
console.log(`共有 ${all.length} 条下划线`);

// 获取特定范围的下划线
const specific = manager.getByRange("/6/4[chapter]!/4/2,/1:0,/1:20");

// 获取所有可用样式
const styles = manager.getAvailableStyles();
console.log("可用样式:", styles);

// 获取某个样式的配置
const config = manager.getStyleConfig("dashed");
console.log("虚线配置:", config);

// 清除所有
manager.clear();
```

---

## 🎨 线条样式属性详解

可以在任何操作中使用这些属性来自定义样式：

```javascript
{
  stroke: "#FF0000",           // 线条颜色
  "stroke-width": "1.5",       // 线宽（像素）
  "stroke-opacity": "0.8",     // 透明度（0-1）
  "stroke-dasharray": "5,5",   // 虚线模式：5px线 + 5px空隙
  "stroke-linecap": "round"    // 线条端点: round/square/butt
}
```

### 虚线模式示例：
- `"5,5"` - 标准虚线（5个像素线 + 5个像素空隙）
- `"2,2"` - 密集虚线
- `"10,5"` - 长虚线
- `"1,3"` - 点线
- `"8,2,2,2"` - 双划线模拟
- `"4,2"` - 波浪线效果（配合 stroke-linecap: round）

---

## 🔗 完整文档

详细的 API 参考和高级用法请查看：`UNDERLINE_STYLES_GUIDE.md`

---

## 📝 实际使用场景

### 学习笔记
```javascript
// 红色虚线标记疑问
manager.add(range, "dashed", { type: "question", note: "这里不理解" });

// 绿色点线标记术语
manager.registerStyle("term", { stroke: "#00AA00", "stroke-dasharray": "1,3" });
manager.add(range, "term", { type: "vocabulary", term: "关键词" });

// 橙色双划线标记重点
manager.add(range, "double", { type: "important", note: "必须掌握" });
```

### 文献阅读
```javascript
// 蓝色密集虚线标记引用
manager.add(range, "dashed_dense", { type: "citation", author: "Smith, 2020" });

// 黑色实线标记常规笔记
manager.add(range, "solid", { type: "note", content: "个人理解..." });

// 紫色波浪线标记错误
manager.add(range, "wavy", { type: "error", note: "原文有误" });
```

### 多用户批注
```javascript
manager.add(range, styleType, {
  userId: currentUser.id,
  userName: currentUser.name,
  userColor: currentUser.color,  // 用户颜色
  note: annotation,
  timestamp: new Date().toISOString()
});
```

---

## 🛠 集成到你的项目

### 1. 基础集成
```javascript
import ePub from "epubjs";
import UnderlineStyleManager from "./src/underline-styles.js";

const book = ePub("book.epub");
const rendition = book.renderTo("viewer", { width: "100%", height: "100%" });
const manager = new UnderlineStyleManager(rendition);

// 监听文本选择并添加下划线
document.addEventListener("mouseup", () => {
  const selection = window.getSelection().toString();
  if (selection.length > 0) {
    // 获取 CFI 范围（需要额外实现）
    manager.add(cfiRange, "dashed", { selectedText: selection });
  }
});
```

### 2. Vue 组件集成
见 `UNDERLINE_STYLES_GUIDE.md` 中的 Vue 示例

### 3. React 组件集成
```javascript
import { useEffect, useState } from "react";
import UnderlineStyleManager from "./src/underline-styles.js";

export function EpubReader() {
  const [manager, setManager] = useState(null);

  useEffect(() => {
    if (rendition) {
      setManager(new UnderlineStyleManager(rendition));
    }
  }, [rendition]);

  const handleAddUnderline = (cfiRange, style) => {
    manager?.add(cfiRange, style, { timestamp: new Date() });
  };

  return (
    <div>
      <button onClick={() => handleAddUnderline(selectedRange, "dashed")}>
        虚线标记
      </button>
      <div>共有 {manager?.getAll().length || 0} 条下划线</div>
    </div>
  );
}
```

---

## ⚠️ 注意事项

1. **EpubCFI 范围格式**：确保使用正确的 CFI 范围格式，如 `/6/4[chapter]!/4/2,/1:0,/1:20`

2. **数据持久化**：下划线在页面刷新后会丢失，需要手动保存和恢复：
```javascript
// 保存
const data = manager.getAll();
localStorage.setItem("underlines", JSON.stringify(data));

// 恢复
const saved = JSON.parse(localStorage.getItem("underlines"));
saved.forEach(ul => {
  manager.add(ul.cfiRange, ul.styleType, ul.data);
});
```

3. **性能考虑**：添加大量下划线（>1000）可能影响性能

4. **浏览器兼容性**：使用 SVG 属性，支持所有现代浏览器

---

## 🎯 下一步

1. 查看 `src/underline-styles-examples.js` 中的完整示例
2. 阅读 `UNDERLINE_STYLES_GUIDE.md` 了解所有 API
3. 根据你的需求自定义样式
4. 集成到你的应用中

---

## 📞 问题和反馈

如有问题，请参考文档或查看示例代码。欢迎提出建议和改进意见！
