/**
 * UnderlineStyleManager - 自定义下划线样式管理器
 * 支持：实线、虚线、点线、双划线模拟等多种下划线样式
 * @param {Rendition} rendition
 * @class
 */
class UnderlineStyleManager {
	constructor(rendition) {
		this.rendition = rendition;
		this.styles = this._initializeDefaultStyles();
		this.underlines = new Map(); // 存储已添加的下划线，用于后续更新或删除
	}

	/**
	 * 初始化默认的下划线样式预设
	 * @private
	 * @returns {Object} 包含所有预设样式的对象
	 */
	_initializeDefaultStyles() {
		return {
			// 实线下划线（黑色）
			solid: {
				stroke: "#000000",
				"stroke-width": "1.5",
				"stroke-opacity": "0.8"
			},

			// 虚线下划线（红色）- 标准虚线
			dashed: {
				stroke: "#FF0000",
				"stroke-width": "1.5",
				"stroke-dasharray": "5,5",
				"stroke-opacity": "0.8"
			},

			// 密集虚线（蓝色）
			dashed_dense: {
				stroke: "#0066FF",
				"stroke-width": "1.5",
				"stroke-dasharray": "2,2",
				"stroke-opacity": "0.8"
			},

			// 点线（绿色）
			dotted: {
				stroke: "#00AA00",
				"stroke-width": "1",
				"stroke-dasharray": "1,3",
				"stroke-opacity": "0.8"
			},

			// 双划线模拟（橙色）- 使用特殊的 dasharray 模式
			double: {
				stroke: "#FF6600",
				"stroke-width": "2.5",
				"stroke-dasharray": "8,2,2,2",
				"stroke-opacity": "0.8"
			},

			// 波浪线模拟（紫色）- 使用 stroke-linecap 和特殊模式
			wavy: {
				stroke: "#9966FF",
				"stroke-width": "2",
				"stroke-dasharray": "4,2",
				"stroke-linecap": "round",
				"stroke-opacity": "0.7"
			},

			// 粗实线（标记重点）
			bold: {
				stroke: "#FF0000",
				"stroke-width": "2.5",
				"stroke-opacity": "0.9"
			},

			// 轻细线
			thin: {
				stroke: "#666666",
				"stroke-width": "0.8",
				"stroke-opacity": "0.6"
			}
		};
	}

	/**
	 * 添加下划线
	 * @param {string} cfiRange - EpubCFI 范围
	 * @param {string} styleType - 样式类型（solid, dashed, dotted 等）
	 * @param {Object} data - 关联的数据对象
	 * @param {Function} callback - 点击回调函数
	 * @param {Object} customStyles - 自定义样式覆盖（可选）
	 * @returns {Object} 返回下划线引用对象
	 */
	add(cfiRange, styleType = "solid", data = {}, callback = null, customStyles = {}) {
		// 获取预设样式
		const baseStyle = this.styles[styleType] || this.styles.solid;

		// 合并自定义样式
		const finalStyles = { ...baseStyle, ...customStyles };

		// 生成唯一的 className
		const uniqueClass = `underline-${styleType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		// 添加数据字段
		const annotationData = {
			...data,
			styleType: styleType,
			customClass: uniqueClass,
			timestamp: new Date().toISOString()
		};

		// 调用原生的 underline 方法
		const result = this.rendition.annotations.underline(
			cfiRange,
			annotationData,
			callback,
			uniqueClass,
			finalStyles
		);

		// 存储引用用于后续操作
		const key = this._generateKey(cfiRange, styleType);
		this.underlines.set(key, {
			cfiRange: cfiRange,
			styleType: styleType,
			className: uniqueClass,
			styles: finalStyles,
			data: annotationData,
			reference: result
		});

		return {
			cfiRange: cfiRange,
			styleType: styleType,
			className: uniqueClass,
			reference: result
		};
	}

	/**
	 * 删除下划线
	 * @param {string} cfiRange - EpubCFI 范围
	 * @param {string} styleType - 样式类型（可选，不指定则删除所有该范围的下划线）
	 */
	remove(cfiRange, styleType = null) {
		if (styleType) {
			const key = this._generateKey(cfiRange, styleType);
			this.underlines.delete(key);
		}

		// 调用原生的 remove 方法
		this.rendition.annotations.remove(cfiRange, "underline");
	}

	/**
	 * 更新下划线样式
	 * @param {string} cfiRange - EpubCFI 范围
	 * @param {string} newStyleType - 新的样式类型
	 * @param {Object} customStyles - 自定义样式覆盖（可选）
	 */
	update(cfiRange, newStyleType = "solid", customStyles = {}) {
		// 先删除旧的
		this.remove(cfiRange);

		// 获取原始数据
		const existingKeys = Array.from(this.underlines.keys()).filter(key =>
			key.startsWith(cfiRange)
		);

		let originalData = {};
		if (existingKeys.length > 0) {
			originalData = this.underlines.get(existingKeys[0]).data;
		}

		// 添加新的样式
		return this.add(cfiRange, newStyleType, originalData, null, customStyles);
	}

	/**
	 * 获取所有已添加的下划线
	 * @returns {Array} 下划线对象数组
	 */
	getAll() {
		return Array.from(this.underlines.values());
	}

	/**
	 * 获取指定 CFI 范围的下划线
	 * @param {string} cfiRange - EpubCFI 范围
	 * @returns {Array} 匹配的下划线数组
	 */
	getByRange(cfiRange) {
		return Array.from(this.underlines.values()).filter(ul => ul.cfiRange === cfiRange);
	}

	/**
	 * 注册自定义样式预设
	 * @param {string} styleName - 样式名称
	 * @param {Object} styleConfig - 样式配置对象
	 */
	registerStyle(styleName, styleConfig) {
		if (typeof styleName !== "string" || typeof styleConfig !== "object") {
			console.warn("registerStyle: 参数类型错误");
			return;
		}

		this.styles[styleName] = {
			stroke: styleConfig.stroke || "#000000",
			"stroke-width": styleConfig["stroke-width"] || "1.5",
			"stroke-opacity": styleConfig["stroke-opacity"] || "0.8",
			...styleConfig
		};
	}

	/**
	 * 批量添加下划线
	 * @param {Array} ranges - 范围数组，每个元素为 {cfiRange, styleType, data, callback}
	 */
	addBatch(ranges) {
		const results = [];
		ranges.forEach(range => {
			const result = this.add(
				range.cfiRange,
				range.styleType || "solid",
				range.data || {},
				range.callback || null,
				range.customStyles || {}
			);
			results.push(result);
		});
		return results;
	}

	/**
	 * 清除所有下划线
	 */
	clear() {
		this.underlines.clear();
		// 调用原生方法清除所有注解
		const allAnnotations = this.rendition.annotations.getAll?.() || [];
		allAnnotations.forEach(annotation => {
			if (annotation.type === "underline") {
				this.rendition.annotations.remove(annotation.cfiRange, "underline");
			}
		});
	}

	/**
	 * 生成用于存储的唯一 key
	 * @private
	 * @param {string} cfiRange
	 * @param {string} styleType
	 * @returns {string}
	 */
	_generateKey(cfiRange, styleType) {
		return `${encodeURIComponent(cfiRange)}_${styleType}`;
	}

	/**
	 * 获取所有可用的样式预设
	 * @returns {Array} 样式名称数组
	 */
	getAvailableStyles() {
		return Object.keys(this.styles);
	}

	/**
	 * 获取指定样式的配置
	 * @param {string} styleName - 样式名称
	 * @returns {Object} 样式配置对象
	 */
	getStyleConfig(styleName) {
		return this.styles[styleName] || null;
	}
}

export default UnderlineStyleManager;
