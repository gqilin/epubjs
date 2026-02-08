import EventEmitter from "event-emitter";
import {extend, borders, uuid, isNumber, bounds, defer} from "../../utils/core";
import Url from "../../utils/url";
import EpubCFI from "../../epubcfi";
import Contents from "../../contents";
import { EVENTS } from "../../utils/constants";
import { Pane, Highlight, Underline } from "marks-pane";

class IframeView {
	constructor(section, options) {
		this.settings = extend({
			ignoreClass : "",
			axis: undefined,
			direction: undefined,
			width: 0,
			height: 0,
			layout: undefined,
			globalLayoutProperties: {},
			forceRight: false
		}, options || {});

		this.id = "epubjs-view-" + uuid();
		this.section = section;
		this.index = section.index;

		this.element = this.container(this.settings.axis);

		this.added = false;
		this.displayed = false;
		this.rendered = false;

		// this.width  = this.settings.width;
		// this.height = this.settings.height;

		this.fixedWidth  = 0;
		this.fixedHeight = 0;

		// Blank Cfi for Parsing
		this.epubcfi = new EpubCFI();

		this.layout = this.settings.layout;
		// Dom events to listen for
		// this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click", "touchend", "touchstart"];

		this.pane = undefined;
		this.highlights = {};
		this.underlines = {};
		this.marks = {};

	}

	container(axis) {
		var element = document.createElement("div");

		element.classList.add("epub-view");

		// this.element.style.minHeight = "100px";
		element.style.height = "0px";
		element.style.width = "0px";
		element.style.overflow = "hidden";
		element.style.position = "relative";
		element.style.display = "block";

		if(axis && axis == "horizontal"){
			element.style.flex = "none";
		} else {
			element.style.flex = "initial";
		}

		return element;
	}

	create() {

		if(this.contentDiv) {
			return this.contentDiv;
		}

		if(!this.element) {
			this.element = this.createContainer();
		}

		this.contentDiv = document.createElement("div");
		this.contentDiv.id = this.id;
		this.contentDiv.style.overflow = "hidden";
		this.contentDiv.style.border = "none";
		this.contentDiv.setAttribute("enable-annotation", "true");

		this.resizing = true;

		this.element.style.visibility = "hidden";
		this.contentDiv.style.visibility = "hidden";

		this.contentDiv.style.width = "0";
		this.contentDiv.style.height = "0";
		this._width = 0;
		this._height = 0;

		this.element.setAttribute("ref", this.index);

		this.added = true;

		this.elementBounds = bounds(this.element);

		return this.contentDiv;
	}

	render(request, show) {

		// view.onLayout = this.layout.format.bind(this.layout);
		this.create();

		// Fit to size of the container, apply padding
		this.size();

		if(!this.sectionRender) {
			this.sectionRender = this.section.render(request);
		}

		// Render Chain
		return this.sectionRender
			.then(function(contents){
				return this.load(contents);
			}.bind(this))
			.then(function(){

				// find and report the writingMode axis
				let writingMode = this.contents.writingMode();

				// Set the axis based on the flow and writing mode
				let axis;
				if (this.settings.flow === "scrolled") {
					axis = (writingMode.indexOf("vertical") === 0) ? "horizontal" : "vertical";
				} else {
					axis = (writingMode.indexOf("vertical") === 0) ? "vertical" : "horizontal";
				}

				if (writingMode.indexOf("vertical") === 0 && this.settings.flow === "paginated") {
					this.layout.delta = this.layout.height;
				}

				this.setAxis(axis);
				this.emit(EVENTS.VIEWS.AXIS, axis);

				this.setWritingMode(writingMode);
				this.emit(EVENTS.VIEWS.WRITING_MODE, writingMode);


				// apply the layout function to the contents
				this.layout.format(this.contents, this.section, this.axis);

				// Listen for events that require an expansion of the iframe
				this.addListeners();

				return new Promise((resolve, reject) => {
					// Expand the iframe to the full size of the content
					this.expand();

					if (this.settings.forceRight) {
						this.element.style.marginLeft = this.width() + "px";
					}
					resolve();
				});

			}.bind(this), function(e){
				this.emit(EVENTS.VIEWS.LOAD_ERROR, e);
				return new Promise((resolve, reject) => {
					reject(e);
				});
			}.bind(this))
			.then(function() {
				this.emit(EVENTS.VIEWS.RENDERED, this.section);
			}.bind(this));

	}

	reset () {
		if (this.contentDiv) {
			this.contentDiv.style.width = "0";
			this.contentDiv.style.height = "0";
			this._width = 0;
			this._height = 0;
			this._textWidth = undefined;
			this._contentWidth = undefined;
			this._textHeight = undefined;
			this._contentHeight = undefined;
		}
		this._needsReframe = true;
	}

	// Determine locks base on settings
	size(_width, _height) {
		var width = _width || this.settings.width;
		var height = _height || this.settings.height;

		if(this.layout.name === "pre-paginated") {
			this.lock("both", width, height);
		} else if(this.settings.axis === "horizontal") {
			this.lock("height", width, height);
		} else {
			this.lock("width", width, height);
		}

		this.settings.width = width;
		this.settings.height = height;
	}

	// Lock an axis to element dimensions, taking borders into account
	lock(what, width, height) {
		var elBorders = borders(this.element);
		var divBorders;

		if(this.contentDiv) {
			divBorders = borders(this.contentDiv);
		} else {
			divBorders = {width: 0, height: 0};
		}

		if(what == "width" && isNumber(width)){
			this.lockedWidth = width - elBorders.width - divBorders.width;
			// this.resize(this.lockedWidth, width); //  width keeps ratio correct
		}

		if(what == "height" && isNumber(height)){
			this.lockedHeight = height - elBorders.height - divBorders.height;
			// this.resize(width, this.lockedHeight);
		}

		if(what === "both" &&
			 isNumber(width) &&
			 isNumber(height)){

			this.lockedWidth = width - elBorders.width - divBorders.width;
			this.lockedHeight = height - elBorders.height - divBorders.height;
			// this.resize(this.lockedWidth, this.lockedHeight);
		}

		if(this.displayed && this.contentDiv) {

			// this.contents.layout();
			this.expand();
		}



	}

	// Resize a single axis based on content dimensions
	expand(force) {
		var width = this.lockedWidth;
		var height = this.lockedHeight;
		var columns;

		var textWidth, textHeight;

		if(!this.contentDiv || this._expanding) return;

		this._expanding = true;

		if(this.layout.name === "pre-paginated") {
			width = this.layout.columnWidth;
			height = this.layout.height;
		}
		// Expand Horizontally
		else if(this.settings.axis === "horizontal") {
			// Get the width of the text
			width = this.contents.textWidth();

			if (width % this.layout.pageWidth > 0) {
				width = Math.ceil(width / this.layout.pageWidth) * this.layout.pageWidth;
			}

			if (this.settings.forceEvenPages) {
				columns = (width / this.layout.pageWidth);
				if ( this.layout.divisor > 1 &&
						 this.layout.name === "reflowable" &&
						(columns % 2 > 0)) {
					// add a blank page
					width += this.layout.pageWidth;
				}
			}

		} // Expand Vertically
		else if(this.settings.axis === "vertical") {
			height = this.contents.textHeight();
			if (this.settings.flow === "paginated" &&
				height % this.layout.height > 0) {
				height = Math.ceil(height / this.layout.height) * this.layout.height;
			}
		}

		// Only Resize if dimensions have changed or
		// if Frame is still hidden, so needs reframing
		if(this._needsReframe || width != this._width || height != this._height){
			this.reframe(width, height);
		}

		this._expanding = false;
	}

	reframe(width, height) {
		var size;

		if(isNumber(width)){
			this.element.style.width = width + "px";
			this.contentDiv.style.width = width + "px";
			this._width = width;
		}

		if(isNumber(height)){
			this.element.style.height = height + "px";
			this.contentDiv.style.height = height + "px";
			this._height = height;
		}

		let widthDelta = this.prevBounds ? width - this.prevBounds.width : width;
		let heightDelta = this.prevBounds ? height - this.prevBounds.height : height;

		size = {
			width: width,
			height: height,
			widthDelta: widthDelta,
			heightDelta: heightDelta,
		};

		this.pane && this.pane.render();

		requestAnimationFrame(() => {
			let mark;
			for (let m in this.marks) {
				if (this.marks.hasOwnProperty(m)) {
					mark = this.marks[m];
					this.placeMark(mark.element, mark.range);
				}
			}
		});

		this.onResize(this, size);

		this.emit(EVENTS.VIEWS.RESIZED, size);

		this.prevBounds = size;

		this.elementBounds = bounds(this.element);

	}


	load(contents) {
		var loading = new defer();
		var loaded = loading.promise;

		if(!this.contentDiv) {
			loading.reject(new Error("No Content Div Available"));
			return loaded;
		}

		// Append to container first
		this.element.appendChild(this.contentDiv);

		// Parse the HTML string to extract body content
		var parser = new DOMParser();
		var doc = parser.parseFromString(contents, "text/html");
		var body = doc.querySelector("body");

		if (!body) {
			loading.reject(new Error("No body element in content"));
			return loaded;
		}

		// Create URL resolver for this section
		var sectionUrl = new Url(this.section.url);

		// Process and move body children to contentDiv
		var childNodes = Array.from(body.childNodes);
		for (let node of childNodes) {
			// Convert relative paths in elements
			this.resolveUrls(node, sectionUrl);
			this.contentDiv.appendChild(node);
		}

		// Copy and process head elements (styles)
		var head = doc.querySelector("head");
		if (head) {
			var styles = head.querySelectorAll("style, link[rel='stylesheet']");
			styles.forEach(style => {
				let clonedStyle = style.cloneNode(true);

				// Process link elements - convert to style tags
				if (clonedStyle.tagName === 'LINK') {
					const href = clonedStyle.getAttribute('href');
					if (href && !href.startsWith('data:')) {
						const resolvedUrl = sectionUrl.resolve(href);

						// Fetch CSS and convert to style tag to avoid MIME type issues
						fetch(resolvedUrl)
							.then(response => response.text())
							.then(cssText => {
								// Resolve relative URLs within the CSS
								const resolvedCss = this.resolveImportUrls(cssText, sectionUrl);
								const styleTag = document.createElement('style');
								styleTag.textContent = resolvedCss;
								document.head.appendChild(styleTag);
							})
							.catch(err => {
								// Fallback: still try to load as link if fetch fails
								clonedStyle.href = resolvedUrl;
								document.head.appendChild(clonedStyle);
							});
					}
				}
				// Process style elements with @import
				else if (clonedStyle.tagName === 'STYLE') {
					if (clonedStyle.textContent) {
						clonedStyle.textContent = this.resolveImportUrls(clonedStyle.textContent, sectionUrl);
					}
					document.head.appendChild(clonedStyle);
				}
			});
		}

		this.document = document;
		this.window = window;

		// Create Contents wrapper for the DOM
		this.contents = new Contents(document, this.contentDiv, this.section.cfiBase, this.section.index);

		this.rendering = false;

		// Add canonical link
		var link = document.querySelector("link[rel='canonical']");
		if (link) {
			link.setAttribute("href", this.section.canonical);
		} else {
			link = document.createElement("link");
			link.setAttribute("rel", "canonical");
			link.setAttribute("href", this.section.canonical);
			document.querySelector("head").appendChild(link);
		}

		this.contents.on(EVENTS.CONTENTS.EXPAND, () => {
			if(this.displayed && this.contentDiv) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
			}
		});

		this.contents.on(EVENTS.CONTENTS.RESIZE, (e) => {
			if(this.displayed && this.contentDiv) {
				this.expand();
				if (this.contents) {
					this.layout.format(this.contents);
				}
			}
		});

		// Trigger onLoad immediately
		this.onLoad(undefined, loading);

		return loaded;
	}

	// Helper method to resolve relative URLs in DOM elements
	resolveUrls(node, sectionUrl) {
		if (node.nodeType !== 1) return; // Skip non-element nodes

		const tagName = node.tagName;

		// Handle img src
		if (tagName === 'IMG' && node.src) {
			const src = node.getAttribute('src');
			if (src && !src.startsWith('data:')) {
				node.src = sectionUrl.resolve(src);
			}
		}

		// Handle link href
		if (tagName === 'LINK' && node.href) {
			const href = node.getAttribute('href');
			if (href && !href.startsWith('data:')) {
				node.href = sectionUrl.resolve(href);
			}
		}

		// Handle script src
		if (tagName === 'SCRIPT' && node.src) {
			const src = node.getAttribute('src');
			if (src && !src.startsWith('data:')) {
				node.src = sectionUrl.resolve(src);
			}
		}

		// Handle video/audio src and sources
		if ((tagName === 'VIDEO' || tagName === 'AUDIO') && node.src) {
			const src = node.getAttribute('src');
			if (src && !src.startsWith('data:')) {
				node.src = sectionUrl.resolve(src);
			}
		}

		// Handle source elements in video/audio
		if (tagName === 'SOURCE' && node.src) {
			const src = node.getAttribute('src');
			if (src && !src.startsWith('data:')) {
				node.src = sectionUrl.resolve(src);
			}
		}

		// Handle iframe src
		if (tagName === 'IFRAME' && node.src) {
			const src = node.getAttribute('src');
			if (src && !src.startsWith('data:')) {
				node.src = sectionUrl.resolve(src);
			}
		}

		// Recursively process child nodes
		for (let child of node.childNodes) {
			this.resolveUrls(child, sectionUrl);
		}
	}

	// Helper method to resolve @import URLs in CSS text
	resolveImportUrls(cssText, sectionUrl) {
		// Match @import url('...') and @import url("...") and @import '...' and @import "..."
		let resolved = cssText.replace(/@import\s+(?:url\()?\s*['"]?([^'")\s]+)['"]?\)?/gi, (match, url) => {
			if (url.startsWith('data:')) {
				return match;
			}
			const resolvedUrl = sectionUrl.resolve(url);
			// Return with url() format
			return `@import url('${resolvedUrl}')`;
		});

		// Also resolve url() in CSS rules (for background-image, font-face src, etc)
		resolved = resolved.replace(/url\s*\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi, (match, url) => {
			if (url.startsWith('data:') || url.startsWith('http')) {
				return match;
			}
			const resolvedUrl = sectionUrl.resolve(url);
			return `url('${resolvedUrl}')`;
		});

		return resolved;
	}

	onLoad(event, promise) {

		this.window = window;
		this.document = document;

		// Contents object is already created in load()
		// Just resolve the promise
		if (promise) {
			promise.resolve(this.contents);
		}
	}

	setLayout(layout) {
		this.layout = layout;

		if (this.contents) {
			this.layout.format(this.contents);
			this.expand();
		}
	}

	setAxis(axis) {

		this.settings.axis = axis;

		if(axis == "horizontal"){
			this.element.style.flex = "none";
		} else {
			this.element.style.flex = "initial";
		}

		this.size();

	}

	setWritingMode(mode) {
		// this.element.style.writingMode = writingMode;
		this.writingMode = mode;
	}

	addListeners() {
		//TODO: Add content listeners for expanding
	}

	removeListeners(layoutFunc) {
		//TODO: remove content listeners for expanding
	}

	display(request) {
		var displayed = new defer();

		if (!this.displayed) {

			this.render(request)
				.then(function () {

					this.emit(EVENTS.VIEWS.DISPLAYED, this);
					this.onDisplayed(this);

					this.displayed = true;
					displayed.resolve(this);

				}.bind(this), function (err) {
					displayed.reject(err, this);
				});

		} else {
			displayed.resolve(this);
		}


		return displayed.promise;
	}

	show() {

		this.element.style.visibility = "visible";

		if(this.contentDiv){
			this.contentDiv.style.visibility = "visible";

			// Trigger a reflow to ensure visibility
			this.contentDiv.offsetWidth;
		}

		this.emit(EVENTS.VIEWS.SHOWN, this);
	}

	hide() {
		this.element.style.visibility = "hidden";
		this.contentDiv.style.visibility = "hidden";

		this.stopExpanding = true;
		this.emit(EVENTS.VIEWS.HIDDEN, this);
	}

	offset() {
		return {
			top: this.element.offsetTop,
			left: this.element.offsetLeft
		}
	}

	width() {
		return this._width;
	}

	height() {
		return this._height;
	}

	position() {
		return this.element.getBoundingClientRect();
	}

	locationOf(target) {
		var parentPos = this.contentDiv.getBoundingClientRect();
		var targetPos = this.contents.locationOf(target, this.settings.ignoreClass);

		return {
			"left": targetPos.left,
			"top": targetPos.top
		};
	}

	onDisplayed(view) {
		// Stub, override with a custom functions
	}

	onResize(view, e) {
		// Stub, override with a custom functions
	}

	bounds(force) {
		if(force || !this.elementBounds) {
			this.elementBounds = bounds(this.element);
		}

		return this.elementBounds;
	}

	highlight(cfiRange, data={}, cb, className = "epubjs-hl", styles = {}) {
		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({"fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"}, styles);
		let range = this.contents.range(cfiRange);

		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.element);
		}

		let m = new Highlight(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.highlights[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	underline(cfiRange, data={}, cb, className = "epubjs-ul", styles = {}) {
		if (!this.contents) {
			return;
		}
		const attributes = Object.assign({"stroke": "black", "stroke-opacity": "0.3", "mix-blend-mode": "multiply"}, styles);
		let range = this.contents.range(cfiRange);
		let emitter = () => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		data["epubcfi"] = cfiRange;

		if (!this.pane) {
			this.pane = new Pane(this.element);
		}

		let m = new Underline(range, className, data, attributes);
		let h = this.pane.addMark(m);

		this.underlines[cfiRange] = { "mark": h, "element": h.element, "listeners": [emitter, cb] };

		h.element.setAttribute("ref", className);
		h.element.addEventListener("click", emitter);
		h.element.addEventListener("touchstart", emitter);

		if (cb) {
			h.element.addEventListener("click", cb);
			h.element.addEventListener("touchstart", cb);
		}
		return h;
	}

	mark(cfiRange, data={}, cb) {
		if (!this.contents) {
			return;
		}

		if (cfiRange in this.marks) {
			let item = this.marks[cfiRange];
			return item;
		}

		let range = this.contents.range(cfiRange);
		if (!range) {
			return;
		}
		let container = range.commonAncestorContainer;
		let parent = (container.nodeType === 1) ? container : container.parentNode;

		let emitter = (e) => {
			this.emit(EVENTS.VIEWS.MARK_CLICKED, cfiRange, data);
		};

		if (range.collapsed && container.nodeType === 1) {
			range = new Range();
			range.selectNodeContents(container);
		} else if (range.collapsed) { // Webkit doesn't like collapsed ranges
			range = new Range();
			range.selectNodeContents(parent);
		}

		let mark = this.document.createElement("a");
		mark.setAttribute("ref", "epubjs-mk");
		mark.style.position = "absolute";

		mark.dataset["epubcfi"] = cfiRange;

		if (data) {
			Object.keys(data).forEach((key) => {
				mark.dataset[key] = data[key];
			});
		}

		if (cb) {
			mark.addEventListener("click", cb);
			mark.addEventListener("touchstart", cb);
		}

		mark.addEventListener("click", emitter);
		mark.addEventListener("touchstart", emitter);

		this.placeMark(mark, range);

		this.element.appendChild(mark);

		this.marks[cfiRange] = { "element": mark, "range": range, "listeners": [emitter, cb] };

		return parent;
	}

	placeMark(element, range) {
		let top, right, left;

		if(this.layout.name === "pre-paginated" ||
			this.settings.axis !== "horizontal") {
			let pos = range.getBoundingClientRect();
			top = pos.top;
			right = pos.right;
		} else {
			// Element might break columns, so find the left most element
			let rects = range.getClientRects();

			let rect;
			for (var i = 0; i != rects.length; i++) {
				rect = rects[i];
				if (!left || rect.left < left) {
					left = rect.left;
					// right = rect.right;
					right = Math.ceil(left / this.layout.props.pageWidth) * this.layout.props.pageWidth - (this.layout.gap / 2);
					top = rect.top;
				}
			}
		}

		element.style.top = `${top}px`;
		element.style.left = `${right}px`;
	}

	unhighlight(cfiRange) {
		let item;
		if (cfiRange in this.highlights) {
			item = this.highlights[cfiRange];

			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.highlights[cfiRange];
		}
	}

	ununderline(cfiRange) {
		let item;
		if (cfiRange in this.underlines) {
			item = this.underlines[cfiRange];
			this.pane.removeMark(item.mark);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.underlines[cfiRange];
		}
	}

	unmark(cfiRange) {
		let item;
		if (cfiRange in this.marks) {
			item = this.marks[cfiRange];
			this.element.removeChild(item.element);
			item.listeners.forEach((l) => {
				if (l) {
					item.element.removeEventListener("click", l);
					item.element.removeEventListener("touchstart", l);
				};
			});
			delete this.marks[cfiRange];
		}
	}

	destroy() {

		for (let cfiRange in this.highlights) {
			this.unhighlight(cfiRange);
		}

		for (let cfiRange in this.underlines) {
			this.ununderline(cfiRange);
		}

		for (let cfiRange in this.marks) {
			this.unmark(cfiRange);
		}

		if(this.displayed){
			this.displayed = false;

			this.removeListeners();
			this.contents.destroy();

			this.stopExpanding = true;
			this.element.removeChild(this.contentDiv);

			if (this.pane) {
				this.pane.element.remove();
				this.pane = undefined;
			}

			this.contentDiv = undefined;
			this.contents = undefined;

			this._textWidth = null;
			this._textHeight = null;
			this._width = null;
			this._height = null;
		}

	}
}

EventEmitter(IframeView.prototype);

export default IframeView;
