/**
 * UnderlineStyleManager 使用示例
 * 演示如何使用自定义下划线样式管理器
 */

import UnderlineStyleManager from "./underline-styles.js";

// ============================================================
// 1. 基础使用 - 添加不同样式的下划线
// ============================================================

function basicExample(rendition) {
	// 初始化管理器
	const underlineManager = new UnderlineStyleManager(rendition);

	// 示例 CFI 范围（需要根据实际内容调整）
	const cfiRange1 = "/6/4[chap1_div]!/4/2,/1:0,/1:10";
	const cfiRange2 = "/6/4[chap1_div]!/4/2,/1:12,/1:25";
	const cfiRange3 = "/6/4[chap1_div]!/4/2,/1:30,/1:45";

	// 添加不同样式的下划线
	underlineManager.add(
		cfiRange1,
		"solid",
		{ note: "重要观点", author: "reader" },
		(event) => console.log("点击了实线", event)
	);

	underlineManager.add(
		cfiRange2,
		"dashed",
		{ note: "有疑问的地方", type: "question" },
		(event) => console.log("点击了虚线", event)
	);

	underlineManager.add(
		cfiRange3,
		"double",
		{ note: "关键术语", importance: "high" },
		(event) => console.log("点击了双划线", event)
	);

	return underlineManager;
}

// ============================================================
// 2. 高级使用 - 完整的批注系统
// ============================================================

class AdvancedAnnotationSystem {
	constructor(rendition) {
		this.rendition = rendition;
		this.underlineManager = new UnderlineStyleManager(rendition);
		this.annotations = new Map(); // 存储所有批注信息
		this.setupHighlightPanel();
	}

	/**
	 * 添加带有完整信息的批注
	 * @param {string} cfiRange - EpubCFI 范围
	 * @param {Object} annotationData - 批注数据
	 */
	addAnnotation(cfiRange, annotationData) {
		const {
			text = "",
			color = "red",
			style = "solid",
			note = "",
			tags = [],
			timestamp = new Date().toISOString()
		} = annotationData;

		// 根据颜色和样式选择下划线样式
		const styleType = this._getStyleType(color, style);

		// 添加自定义样式
		const customStyles = {
			stroke: this._getColorValue(color)
		};

		// 添加下划线
		const result = this.underlineManager.add(
			cfiRange,
			styleType,
			{
				text: text,
				note: note,
				tags: tags,
				color: color,
				style: style,
				timestamp: timestamp
			},
			(event) => this._handleAnnotationClick(event, cfiRange)
		);

		// 存储批注信息
		this.annotations.set(cfiRange, {
			...annotationData,
			styleType: styleType,
			result: result
		});

		console.log("批注已添加:", { cfiRange, ...annotationData });
		return result;
	}

	/**
	 * 根据颜色和样式获取下划线类型
	 * @private
	 */
	_getStyleType(color, style) {
		if (style === "dashed") return "dashed";
		if (style === "dotted") return "dotted";
		if (style === "double") return "double";
		if (style === "wavy") return "wavy";
		if (style === "bold") return "bold";
		return "solid";
	}

	/**
	 * 获取颜色值
	 * @private
	 */
	_getColorValue(color) {
		const colorMap = {
			red: "#FF0000",
			yellow: "#FFFF00",
			green: "#00AA00",
			blue: "#0066FF",
			orange: "#FF6600",
			purple: "#9966FF",
			pink: "#FF69B4",
			gray: "#666666"
		};
		return colorMap[color] || "#000000";
	}

	/**
	 * 处理批注点击事件
	 * @private
	 */
	_handleAnnotationClick(event, cfiRange) {
		const annotation = this.annotations.get(cfiRange);
		if (annotation) {
			console.log("批注详情:", annotation);
			// 可以在这里打开批注面板或显示详情
			this.showAnnotationDetail(annotation);
		}
	}

	/**
	 * 显示批注详情面板
	 */
	showAnnotationDetail(annotation) {
		// 这里可以实现一个 UI 面板来显示批注详情
		console.log("显示批注详情:", {
			text: annotation.text,
			note: annotation.note,
			tags: annotation.tags,
			timestamp: annotation.timestamp
		});
	}

	/**
	 * 设置高亮面板（UI 示例）
	 */
	setupHighlightPanel() {
		// 这里可以创建一个 HTML 面板，允许用户选择高亮样式
		// 示例 HTML 结构：
		const panelHTML = `
			<div id="highlight-panel" style="display: none; position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 1000;">
				<h4>批注工具</h4>
				<div>
					<label>
						<input type="radio" name="style" value="solid"> 实线
					</label>
					<label>
						<input type="radio" name="style" value="dashed"> 虚线
					</label>
					<label>
						<input type="radio" name="style" value="dotted"> 点线
					</label>
					<label>
						<input type="radio" name="style" value="double"> 双划线
					</label>
				</div>
				<div>
					<label>颜色:</label>
					<select id="color-select">
						<option value="red">红色</option>
						<option value="yellow">黄色</option>
						<option value="green">绿色</option>
						<option value="blue">蓝色</option>
						<option value="orange">橙色</option>
					</select>
				</div>
				<textarea id="note-input" placeholder="输入批注..."></textarea>
				<button onclick="applyAnnotation()">应用批注</button>
			</div>
		`;
		console.log("批注面板 HTML 结构:", panelHTML);
	}

	/**
	 * 获取所有批注
	 */
	getAllAnnotations() {
		return Array.from(this.annotations.values());
	}

	/**
	 * 删除指定范围的批注
	 */
	removeAnnotation(cfiRange) {
		this.underlineManager.remove(cfiRange);
		this.annotations.delete(cfiRange);
		console.log("批注已删除:", cfiRange);
	}

	/**
	 * 更新批注样式
	 */
	updateAnnotationStyle(cfiRange, newStyle) {
		const annotation = this.annotations.get(cfiRange);
		if (annotation) {
			const newStyleType = this._getStyleType(annotation.color, newStyle);
			this.underlineManager.update(cfiRange, newStyleType);
			annotation.style = newStyle;
			console.log("批注样式已更新:", { cfiRange, newStyle });
		}
	}
}

// ============================================================
// 3. 自定义样式注册示例
// ============================================================

function customStyleExample(rendition) {
	const underlineManager = new UnderlineStyleManager(rendition);

	// 注册自定义样式预设
	underlineManager.registerStyle("custom_important", {
		stroke: "#FF0000",
		"stroke-width": "3",
		"stroke-dasharray": "10,3",
		"stroke-opacity": "1.0"
	});

	underlineManager.registerStyle("custom_subtle", {
		stroke: "#CCCCCC",
		"stroke-width": "1",
		"stroke-dasharray": "2,2",
		"stroke-opacity": "0.5"
	});

	// 使用自定义样式
	const cfiRange = "/6/4[chap1_div]!/4/2,/1:0,/1:15";
	underlineManager.add(
		cfiRange,
		"custom_important",
		{ note: "自定义重要标记" }
	);

	return underlineManager;
}

// ============================================================
// 4. 批量操作示例
// ============================================================

function batchOperationExample(rendition) {
	const underlineManager = new UnderlineStyleManager(rendition);

	// 批量添加下划线
	const ranges = [
		{
			cfiRange: "/6/4[chap1_div]!/4/2,/1:0,/1:10",
			styleType: "solid",
			data: { note: "第一个要点" }
		},
		{
			cfiRange: "/6/4[chap1_div]!/4/2,/1:15,/1:25",
			styleType: "dashed",
			data: { note: "第二个要点" }
		},
		{
			cfiRange: "/6/4[chap1_div]!/4/2,/1:30,/1:40",
			styleType: "dotted",
			data: { note: "第三个要点" }
		},
		{
			cfiRange: "/6/4[chap1_div]!/4/2,/1:45,/1:55",
			styleType: "double",
			data: { note: "第四个要点" }
		}
	];

	underlineManager.addBatch(ranges);

	// 获取所有下划线
	console.log("所有下划线:", underlineManager.getAll());

	// 获取特定范围的下划线
	const specific = underlineManager.getByRange("/6/4[chap1_div]!/4/2,/1:0,/1:10");
	console.log("指定范围的下划线:", specific);

	return underlineManager;
}

// ============================================================
// 5. 完整的集成示例
// ============================================================

function integrateWithRendition(rendition) {
	// 初始化管理器
	const advancedSystem = new AdvancedAnnotationSystem(rendition);

	// 监听 rendition 的事件，以便在内容加载时恢复批注
	rendition.on("rendered", () => {
		console.log("内容已渲染，可以恢复批注");
	});

	// 添加示例批注
	advancedSystem.addAnnotation("/6/4[chap1_div]!/4/2,/1:0,/1:10", {
		text: "选中的文本内容",
		color: "red",
		style: "solid",
		note: "这是一个重要的观点",
		tags: ["重要", "核心概念"],
		timestamp: new Date().toISOString()
	});

	advancedSystem.addAnnotation("/6/4[chap1_div]!/4/2,/1:20,/1:30", {
		text: "另一段文本",
		color: "blue",
		style: "dashed",
		note: "这里有一些疑问",
		tags: ["问题", "待确认"],
		timestamp: new Date().toISOString()
	});

	// 导出批注数据用于保存
	const exportedAnnotations = {
		bookId: "book_id_here",
		annotations: advancedSystem.getAllAnnotations(),
		exportDate: new Date().toISOString()
	};

	console.log("批注已导出:", exportedAnnotations);

	return advancedSystem;
}

// ============================================================
// 导出示例供外部使用
// ============================================================

export {
	basicExample,
	AdvancedAnnotationSystem,
	customStyleExample,
	batchOperationExample,
	integrateWithRendition,
	UnderlineStyleManager
};
