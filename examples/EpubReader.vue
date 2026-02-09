// EpubReader.vue
<template>
  <div class="reader-wrapper">
    <div class="header">
      <h1>📚 Vue3 EPUB 阅读器</h1>
      <div class="header-info">
        <span v-if="bookTitle">{{ bookTitle }}</span>
        <span v-else>选择或上传 EPUB 文件开始阅读</span>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧目录栏 -->
      <div class="sidebar" v-if="toc.length > 0">
        <div class="sidebar-header">📖 目录</div>
        <div class="toc-container">
          <ul class="toc-list">
            <li
              v-for="(item, index) in toc"
              :key="index"
              :class="['toc-item', { 'active': currentTocIndex === index }, `level-${item.level || 1}`]"
              @click="goToTocItem(item)"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>
        <div class="metadata-panel" v-if="metadata">
          <div class="metadata-item">
            <span class="metadata-label">作者:</span>
            <span class="metadata-value">{{ metadata.creator || '未知' }}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">出版社:</span>
            <span class="metadata-value">{{ metadata.publisher || '未知' }}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">语言:</span>
            <span class="metadata-value">{{ metadata.language || '未知' }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧阅读器 -->
      <div class="reader-container">
        <!-- 工具栏 -->
        <div class="reader-toolbar">
          <div class="toolbar-group">
            <button class="toolbar-btn" @click="prevPage" :disabled="!rendition">◀ 上一页</button>
            <button class="toolbar-btn" @click="nextPage" :disabled="!rendition">下一页 ▶</button>
          </div>

          <div class="toolbar-group">
            <label class="file-input-wrapper">
              <button class="upload-btn">📤 上传</button>
              <input type="file" accept=".epub" @change="handleFileUpload" />
            </label>
          </div>

          <div class="progress-container">
            <div class="progress-bar" @click="seekProgress">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="progress-text">{{ progressPercent.toFixed(1) }}%</div>
          </div>

          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">总章节:</span>
              <span>{{ totalSpines }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">当前:</span>
              <span>{{ currentSpineIndex + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- 消息提示 -->
        <div style="padding: 0 20px">
          <div class="error-message" v-if="errorMessage">❌ {{ errorMessage }}</div>
          <div class="info-message" v-if="infoMessage">ℹ️ {{ infoMessage }}</div>
        </div>

        <!-- 阅读器容器 -->
        <div id="viewer" v-show="rendition">
          <div v-if="!bookLoaded" class="loading">
            <div class="spinner"></div>
            <span>正在加载书籍...</span>
          </div>
        </div>

        <!-- 初始提示 -->
        <div v-show="!rendition" class="loading" style="color: #999">
          <div style="text-align: center">
            <p style="font-size: 48px; margin-bottom: 20px">📚</p>
            <p>请上传或选择一个 EPUB 文件开始阅读</p>
            <p style="font-size: 12px; margin-top: 10px; opacity: 0.7">
              支持的格式: .epub
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface TocItem {
  label: string;
  href?: string;
  cfi?: string;
  index?: number;
  level?: number;
}

interface Metadata {
  title?: string;
  creator?: string;
  publisher?: string;
  language?: string;
  modified_date?: string;
}

const book = ref<any>(null);
const rendition = ref<any>(null);
const bookTitle = ref<string>('');
const metadata = ref<Metadata | null>(null);
const toc = ref<TocItem[]>([]);
const currentTocIndex = ref<number>(0);
const currentLocation = ref<any>(null);
const progress = ref<number>(0);
const bookLoaded = ref<boolean>(false);
const errorMessage = ref<string>('');
const infoMessage = ref<string>('');
const totalSpines = ref<number>(0);
const currentSpineIndex = ref<number>(0);

const progressPercent = computed(() => {
  return (progress.value * 100) || 0;
});

/**
 * 加载 EPUB 文件
 * @param epubPath - EPUB 文件路径或 ArrayBuffer
 */
const loadEpub = (epubPath: string | ArrayBuffer) => {
  try {
    errorMessage.value = '';
    infoMessage.value = '正在加载书籍...';
    bookLoaded.value = false;

    // 使用全局 ePub 对象
    book.value = (window as any).ePub(epubPath);

    // 渲染到容器
    rendition.value = book.value.renderTo('viewer', {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      allowScriptedContent: false
    });

    // 监听就绪事件
    rendition.value.on('ready', () => {
      console.log('渲染器已就绪');
      infoMessage.value = '';
      bookLoaded.value = true;
      setupHooks();
      displayFirstPage();
    });

    // 监听位置变化
    rendition.value.on('relocated', (location: any) => {
      currentLocation.value = location;
      progress.value = location.progress || 0;
      updateCurrentSpineIndex(location);
      updateCurrentTocIndex(location);
    });

    // 监听错误
    rendition.value.on('error', (error: Error) => {
      console.error('渲染错误:', error);
      errorMessage.value = '渲染错误: ' + error.message;
    });

    // 加载书籍元数据
    book.value.loaded.metadata.then((meta: Metadata) => {
      metadata.value = meta;
      bookTitle.value = meta.title || '未知书名';
      console.log('书籍元数据:', meta);
    });

    // 加载目录
    const bookToc = book.value.navigation.toc || [];
    toc.value = bookToc.map((item: any, index: number) => ({
      ...item,
      index,
      level: item.parent ? 2 : 1
    }));
    console.log('目录加载完成，共', toc.value.length, '项');

    // 获取 Spine 信息
    if (book.value.spine?.items) {
      totalSpines.value = book.value.spine.items.length;
    }
  } catch (error: any) {
    console.error('加载失败:', error);
    errorMessage.value = '加载失败: ' + error.message;
  }
};

/**
 * 处理文件上传
 */
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (!file.name.endsWith('.epub')) {
    errorMessage.value = '请选择有效的 EPUB 文件';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) throw new Error('文件读取失败');

      loadEpub(arrayBuffer);
      infoMessage.value = `✅ 已加载: ${file.name}`;
    } catch (error: any) {
      console.error('文件处理错误:', error);
      errorMessage.value = '文件处理失败: ' + error.message;
    }
  };
  reader.readAsArrayBuffer(file);
};

/**
 * 设置内容钩子
 */
const setupHooks = () => {
  if (!rendition.value) return;

  // 内容加载钩子
  rendition.value.hooks.content.register((contents: any, view: any) => {
    // 设置中文字体和样式
    const style = contents.document.createElement('style');
    style.textContent = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "微软雅黑", serif;
        line-height: 1.8;
        color: #333;
      }
      p {
        text-indent: 2em;
        margin-bottom: 0.8em;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      a {
        color: #667eea;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `;
    contents.document.head.appendChild(style);
  });
};

/**
 * 显示第一页
 */
const displayFirstPage = () => {
  if (!rendition.value) return;
  rendition.value.display().catch((error: Error) => {
    console.error('显示第一页失败:', error);
    errorMessage.value = '显示第一页失败';
  });
};

/**
 * 翻页 - 下一页
 */
const nextPage = () => {
  if (!rendition.value) return;
  rendition.value.next().catch(() => {
    console.log('已到最后一页');
  });
};

/**
 * 翻页 - 上一页
 */
const prevPage = () => {
  if (!rendition.value) return;
  rendition.value.prev().catch(() => {
    console.log('已到第一页');
  });
};

/**
 * 点击目录跳转
 */
const goToTocItem = (item: TocItem) => {
  if (!rendition.value) return;
  try {
    currentTocIndex.value = item.index || 0;
    rendition.value.display(item.href || item.cfi).catch((error: Error) => {
      console.error('跳转失败:', error);
      errorMessage.value = '跳转失败';
    });
  } catch (error: any) {
    console.error('目录跳转错误:', error);
  }
};

/**
 * 进度条拖拽
 */
const seekProgress = (event: MouseEvent) => {
  if (!rendition.value) return;
  const bar = event.currentTarget as HTMLElement;
  const percent = event.offsetX / bar.clientWidth;

  try {
    // 获取总的 locations
    if (book.value.locations?.cfiFromPercentage) {
      const cfi = book.value.locations.cfiFromPercentage(percent);
      rendition.value.display(cfi);
    }
  } catch (error: any) {
    console.error('进度条拖拽错误:', error);
  }
};

/**
 * 更新当前 Spine 索引
 */
const updateCurrentSpineIndex = (location: any) => {
  try {
    if (location?.start && book.value.spine) {
      const href = location.start.href;
      const index = book.value.spine.items.findIndex((item: any) =>
        item.href === href || item.href?.endsWith(href)
      );
      if (index !== -1) {
        currentSpineIndex.value = index;
      }
    }
  } catch (error: any) {
    console.error('更新索引错误:', error);
  }
};

/**
 * 更新当前目录索引
 */
const updateCurrentTocIndex = (location: any) => {
  try {
    if (location?.start && toc.value.length > 0) {
      const href = location.start.href;
      const index = toc.value.findIndex(item =>
        item.href === href || item.href?.endsWith(href)
      );
      if (index !== -1) {
        currentTocIndex.value = index;
      }
    }
  } catch (error: any) {
    // 忽略错误
  }
};

onMounted(() => {
  console.log('Vue3 EPUB 阅读器已加载');
  // 可以在这里加载示例文件
  // loadEpub('path/to/example.epub');
});
</script>

<style scoped>
/* 此处包含所有样式 - 详见 vue3-reader.html 中的样式部分 */
.reader-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 24px;
  margin-bottom: 5px;
}

.header-info {
  font-size: 12px;
  opacity: 0.9;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
  font-weight: bold;
  color: #333;
}

.toc-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 10px 15px;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.toc-item:hover {
  background: #f0f0f0;
  border-left-color: #667eea;
  padding-left: 18px;
}

.toc-item.active {
  background: #eef0ff;
  border-left-color: #667eea;
  color: #667eea;
  font-weight: 500;
}

.toc-item.level-2 {
  padding-left: 30px;
  font-size: 12px;
}

.metadata-panel {
  padding: 15px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 12px;
  max-height: 100px;
  overflow-y: auto;
}

.metadata-item {
  margin-bottom: 8px;
}

.metadata-label {
  font-weight: bold;
  color: #333;
}

.metadata-value {
  color: #666;
  margin-left: 5px;
}

.reader-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.reader-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f9f9f9;
  border-bottom: 1px solid #ddd;
  gap: 10px;
}

.toolbar-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar-btn {
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.toolbar-btn:hover {
  background: #764ba2;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.toolbar-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.upload-btn {
  padding: 8px 15px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: #45a049;
}

.file-input-wrapper {
  display: inline-block;
}

.file-input-wrapper input[type='file'] {
  display: none;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 300px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

#viewer {
  flex: 1;
  overflow: hidden;
  background: white;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #f44336;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 12px;
}

.info-message {
  color: #1976d2;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 12px;
}

.stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-label {
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .progress-container {
    max-width: none;
  }

  .stats {
    font-size: 11px;
    gap: 10px;
  }
}
</style>
