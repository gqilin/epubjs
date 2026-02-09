<template>
  <div class="reader-page">
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="250px" class="reader-aside" v-if="!isMobile || sidebarVisible">
        <div class="sidebar-header">
          <el-icon><DocumentCopy /></el-icon>
          <span>目录</span>
          <el-button
            v-if="isMobile"
            type="primary"
            link
            @click="sidebarVisible = false"
            style="margin-left: auto"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <!-- 目录列表 -->
        <div class="toc-container" v-if="tocTree.length > 0">
          <el-tree
            :data="tocTree"
            node-key="id"
            :props="{ children: 'subitems', label: 'label' }"
            :expand-on-click-node="true"
            default-expand-all
            @node-click="handleNodeClick"
            highlight-current
            :current-node-key="currentTocIndex"
          >
            <template #default="{ node, data }">
              <span class="tree-node-label">{{ data.label }}</span>
            </template>
          </el-tree>
        </div>

        <!-- 书籍信息 -->
        <div class="metadata-panel" v-if="metadata">
          <div class="info-item">
            <span class="info-label">作者:</span>
            <span class="info-value">{{ metadata.creator || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">出版社:</span>
            <span class="info-value">{{ metadata.publisher || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">语言:</span>
            <span class="info-value">{{ metadata.language || '未知' }}</span>
          </div>
        </div>
      </el-aside>

      <!-- 主容器 -->
      <el-main class="reader-main">
        <!-- 工具栏 -->
        <div class="reader-toolbar">
          <div class="toolbar-left">
            <el-button-group>
              <el-button
                @click="prevPage"
                :disabled="!rendition"
                type="primary"
              >
                <el-icon><ArrowLeft /></el-icon>
                上一页
              </el-button>
              <el-button
                @click="nextPage"
                :disabled="!rendition"
                type="primary"
              >
                下一页
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>

            <el-button
              v-if="isMobile && toc.length > 0"
              @click="sidebarVisible = true"
              type="default"
            >
              <el-icon><Menu /></el-icon>
              目录
            </el-button>
          </div>

          <!-- 进度条 -->
          <div class="progress-section">
            <el-slider
              v-model="progress"
              :min="0"
              :max="100"
              @change="handleProgressChange"
              :format-tooltip="() => progressPercent.toFixed(1) + '%'"
              style="flex: 1"
            />
            <span class="progress-text">{{ progressPercent.toFixed(1) }}%</span>
          </div>

          <!-- 右侧按钮 -->
          <div class="toolbar-right">
            <el-statistic title="章节" :value="currentSpineIndex + 1" class="stat-item" />
            <el-divider direction="vertical" />
            <el-statistic title="总数" :value="totalSpines" class="stat-item" />

            <el-button
              @click="themeSettingsVisible = true"
              type="default"
              v-if="rendition"
            >
              <el-icon><Setting /></el-icon>
              主题
            </el-button>

            <el-upload
              action="#"
              :auto-upload="false"
              accept=".epub"
              @change="handleFileUpload"
            >
              <template #trigger>
                <el-button type="success">
                  <el-icon><Upload /></el-icon>
                  上传
                </el-button>
              </template>
            </el-upload>
          </div>
        </div>

        <!-- 消息提示 -->
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="true"
          @close="errorMessage = ''"
          style="margin-bottom: 16px"
        />
        <el-alert
          v-if="infoMessage"
          :title="infoMessage"
          type="info"
          :closable="true"
          @close="infoMessage = ''"
          style="margin-bottom: 16px"
        />

        <!-- 主题设置对话框 -->
        <el-dialog
          v-model="themeSettingsVisible"
          title="阅读主题设置"
          width="500px"
          @close="saveThemeSettings"
        >
          <el-form label-width="100px">
            <!-- 背景色 -->
            <el-form-item label="背景色">
              <div style="display: flex; gap: 10px; align-items: center;">
                <el-color-picker v-model="theme.backgroundColor" show-alpha />
                <span style="font-size: 12px; color: #999;">{{ theme.backgroundColor }}</span>
              </div>
            </el-form-item>

            <!-- 字体颜色 -->
            <el-form-item label="字体颜色">
              <div style="display: flex; gap: 10px; align-items: center;">
                <el-color-picker v-model="theme.fontColor" show-alpha />
                <span style="font-size: 12px; color: #999;">{{ theme.fontColor }}</span>
              </div>
            </el-form-item>

            <!-- 字体选择 -->
            <el-form-item label="字体">
              <el-select v-model="theme.fontFamily" style="width: 100%;">
                <el-option
                  v-for="font in fontFamilyOptions"
                  :key="font.value"
                  :label="font.label"
                  :value="font.value"
                />
              </el-select>
            </el-form-item>

            <!-- 字号 -->
            <el-form-item label="字号">
              <el-select v-model.number="theme.fontSize" style="width: 100%;">
                <el-option
                  v-for="size in fontSizeOptions"
                  :key="size.value"
                  :label="size.label"
                  :value="size.value"
                />
              </el-select>
            </el-form-item>

            <!-- 行高 -->
            <el-form-item label="行高">
              <el-select v-model.number="theme.lineHeight" style="width: 100%;">
                <el-option
                  v-for="height in lineHeightOptions"
                  :key="height.value"
                  :label="height.label"
                  :value="height.value"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 预览 -->
          <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px;"
            :style="{
              backgroundColor: theme.backgroundColor,
              color: theme.fontColor,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize + 'px',
              lineHeight: theme.lineHeight
            }">
            <p style="text-indent: 2em; margin-bottom: 8px;">这是预览文本。点击下方按钮应用主题设置到当前阅读内容。</p>
            <p style="text-indent: 2em;">字体、字色、背景色和行高将立即生效，为您提供更舒适的阅读体验。</p>
          </div>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="themeSettingsVisible = false">取消</el-button>
              <el-button type="primary" @click="applyTheme">应用主题</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 阅读器容器 -->
        <div id="viewer" v-show="rendition" class="viewer">
          <div v-if="!bookLoaded" class="loading">
            <el-icon class="spinner"><Loading /></el-icon>
            <span>正在加载书籍...</span>
          </div>
        </div>

        <!-- 初始提示 -->
        <el-empty
          v-show="!rendition"
          description="请上传一个 EPUB 文件开始阅读"
          :image-size="200"
        >
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            accept=".epub"
            @change="handleFileUpload"
          >
            <template #default>
              <el-icon class="el-icon--upload"><DocumentAdd /></el-icon>
              <div class="el-upload__text">
                拖拽 EPUB 文件到此或 <em>点击上传</em>
              </div>
            </template>
          </el-upload>
        </el-empty>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  DocumentCopy,
  ArrowLeft,
  ArrowRight,
  Menu,
  Upload,
  Loading,
  DocumentAdd,
  Close,
  Document,
  Setting
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const book = ref(null)
const rendition = ref(null)
const bookTitle = ref('')
const metadata = ref(null)
const toc = ref([])
const tocTree = ref([])
const currentTocIndex = ref('')
const progress = ref(0)
const bookLoaded = ref(false)
const errorMessage = ref('')
const infoMessage = ref('')
const totalSpines = ref(0)
const currentSpineIndex = ref(0)
const isMobile = ref(false)
const sidebarVisible = ref(true)

// 主题设置
const themeSettingsVisible = ref(false)
const theme = ref({
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", "微软雅黑", serif',
  fontSize: 16,
  fontColor: '#262626',
  lineHeight: 1.8
})

// 字体选项
const fontFamilyOptions = [
  { label: '默认字体', value: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", "微软雅黑", serif' },
  { label: '宋体', value: 'SimSun, "宋体", serif' },
  { label: '黑体', value: 'SimHei, "黑体", sans-serif' },
  { label: '楷体', value: 'KaiTi, "楷体", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' }
]

// 字号选项
const fontSizeOptions = [
  { label: '12px', value: 12 },
  { label: '14px', value: 14 },
  { label: '16px', value: 16 },
  { label: '18px', value: 18 },
  { label: '20px', value: 20 },
  { label: '22px', value: 22 },
  { label: '24px', value: 24 },
  { label: '26px', value: 26 },
  { label: '28px', value: 28 },
  { label: '30px', value: 30 },
  { label: '32px', value: 32 }
]

// 行高选项
const lineHeightOptions = [
  { label: '1.2', value: 1.2 },
  { label: '1.3', value: 1.3 },
  { label: '1.4', value: 1.4 },
  { label: '1.5', value: 1.5 },
  { label: '1.6', value: 1.6 },
  { label: '1.7', value: 1.7 },
  { label: '1.8', value: 1.8 },
  { label: '1.9', value: 1.9 },
  { label: '2.0', value: 2.0 },
  { label: '2.1', value: 2.1 },
  { label: '2.2', value: 2.2 }
]

/**
 * 从 localStorage 加载主题设置
 */
const loadThemeSettings = () => {
  try {
    const saved = localStorage.getItem('epubReaderTheme')
    if (saved) {
      const savedTheme = JSON.parse(saved)
      theme.value = { ...theme.value, ...savedTheme }
    }
  } catch (error) {
    console.warn('加载主题设置失败:', error)
  }
}

/**
 * 保存主题设置到 localStorage
 */
const saveThemeSettings = () => {
  try {
    localStorage.setItem('epubReaderTheme', JSON.stringify(theme.value))
  } catch (error) {
    console.warn('保存主题设置失败:', error)
  }
}

/**
 * 应用主题到当前阅读内容
 */
const applyTheme = () => {
  if (!rendition.value) return

  const viewerElement = document.getElementById('viewer')
  if (viewerElement) {
    // 应用背景色到 viewer 容器
    viewerElement.style.backgroundColor = theme.value.backgroundColor

    // 直接修改当前显示的 iframe 中的样式
    const iframes = viewerElement.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document
        if (doc) {
          let styleTag = doc.getElementById('epub-theme-style')
          if (!styleTag) {
            styleTag = doc.createElement('style')
            styleTag.id = 'epub-theme-style'
            doc.head.appendChild(styleTag)
          }
          styleTag.textContent = `
            html {
              background-color: ${theme.value.backgroundColor} !important;
            }
            body {
              font-family: ${theme.value.fontFamily} !important;
              line-height: ${theme.value.lineHeight} !important;
              color: ${theme.value.fontColor} !important;
              background-color: ${theme.value.backgroundColor} !important;
              font-size: ${theme.value.fontSize}px !important;
            }
            p {
              text-indent: 2em;
              margin-bottom: 0.8em;
              color: ${theme.value.fontColor} !important;
            }
            h1, h2, h3, h4, h5, h6 {
              color: ${theme.value.fontColor} !important;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            a {
              color: #1890ff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          `
        }
      } catch (e) {
        console.warn('无法访问 iframe:', e)
      }
    })
  }

  // 清除旧钩子并注册新钩子（用于后续加载的章节）
  rendition.value.hooks.content.clear()
  setupHooks()
}

// 计算属性
const progressPercent = computed(() => progress.value)

/**
 * 格式化 epubjs 返回的树状目录结构
 * epubjs 已经返回树形结构，只需添加必要的属性
 */
const formatTocTree = (items, parentId = '') => {
  if (!items || items.length === 0) return []

  return items.map((item, index) => {
    const nodeId = `toc-${parentId}-${index}`
    const node = {
      id: nodeId,
      label: item.label,
      href: item.href,
      subitems: item.subitems ? formatTocTree(item.subitems, nodeId) : []
    }

    // 保留原始属性
    if (item.cfi) node.cfi = item.cfi
    if (item.index !== undefined) node.index = item.index

    return node
  })
}

/**
 * 加载 EPUB 文件
 */
const loadEpub = (epubPath) => {
  try {
    errorMessage.value = ''
    infoMessage.value = '正在加载书籍...'
    bookLoaded.value = false

    // 动态导入 ePub
    import('elegant-epub').then((module) => {
      const ePub = module.default

      book.value = ePub(epubPath)

      // 渲染到容器
      rendition.value = book.value.renderTo('viewer', {
        width: '100%',
        height: '100%',
        flow: 'paginated',
        allowScriptedContent: false
      })

      // 监听就绪事件
      rendition.value.on('ready', () => {
        console.log('渲染器已就绪')
        infoMessage.value = ''
        bookLoaded.value = true
        setupHooks()
        displayFirstPage()
      })

      // 监听位置变化
      rendition.value.on('relocated', (location) => {
        progress.value = (location.progress || 0) * 100
        updateCurrentSpineIndex(location)
        updateCurrentTocNode(location)
      })

      // 监听错误
      rendition.value.on('error', (error) => {
        console.error('渲染错误:', error)
        errorMessage.value = '渲染错误: ' + error.message
        bookLoaded.value = true // 允许显示错误
      })

      // 加载书籍元数据
      book.value.loaded.metadata.then((meta) => {
        metadata.value = meta
        bookTitle.value = meta.title || '未知书名'
        document.title = bookTitle.value
      }).catch((error) => {
        console.warn('加载元数据失败:', error)
      })

      // 加载目录 - 等待 book ready
      book.value.loaded.navigation.then(() => {
        const bookToc = book.value?.navigation?.toc || []
        console.log('原始目录结构:', bookToc)
        toc.value = bookToc
        // 直接使用 epubjs 返回的树状结构
        tocTree.value = formatTocTree(bookToc)
      }).catch((error) => {
        console.warn('加载目录失败:', error)
      })

      // 获取 Spine 信息
      if (book.value.spine?.items) {
        totalSpines.value = book.value.spine.items.length
      }

      // 添加超时检查 - 如果 5 秒后还未 ready，强制显示
      setTimeout(() => {
        if (!bookLoaded.value && rendition.value) {
          console.warn('Ready 事件未触发，强制初始化')
          bookLoaded.value = true
          infoMessage.value = ''
          setupHooks()
          displayFirstPage()
        }
      }, 5000)
    }).catch((error) => {
      console.error('导入 ePub 失败:', error)
      errorMessage.value = '导入库失败: ' + error.message
    })
  } catch (error) {
    console.error('加载失败:', error)
    errorMessage.value = '加载失败: ' + error.message
  }
}

/**
 * 处理文件上传
 */
const handleFileUpload = (file) => {
  if (!file || !file.raw) return

  if (!file.raw.name.endsWith('.epub')) {
    ElMessage.error('请选择 EPUB 文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target?.result
      if (!arrayBuffer) throw new Error('文件读取失败')

      loadEpub(arrayBuffer)
      infoMessage.value = `✅ 已加载: ${file.raw.name}`
      ElMessage.success(`已加载: ${file.raw.name}`)
    } catch (error) {
      console.error('文件处理错误:', error)
      errorMessage.value = '文件处理失败: ' + error.message
      ElMessage.error('文件处理失败')
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

/**
 * 设置内容钩子
 */
const setupHooks = () => {
  if (!rendition.value) return

  // 应用背景色到 viewer 容器
  const viewerElement = document.getElementById('viewer')
  if (viewerElement) {
    viewerElement.style.backgroundColor = theme.value.backgroundColor
  }

  rendition.value.hooks.content.register((contents, view) => {
    const style = contents.document.createElement('style')
    style.textContent = `
      html {
        background-color: ${theme.value.backgroundColor} !important;
      }
      body {
        font-family: ${theme.value.fontFamily} !important;
        line-height: ${theme.value.lineHeight} !important;
        color: ${theme.value.fontColor} !important;
        background-color: ${theme.value.backgroundColor} !important;
        font-size: ${theme.value.fontSize}px !important;
      }
      p {
        text-indent: 2em;
        margin-bottom: 0.8em;
        color: ${theme.value.fontColor} !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: ${theme.value.fontColor} !important;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      a {
        color: #1890ff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `
    contents.document.head.appendChild(style)
  })
}

/**
 * 显示第一页
 */
const displayFirstPage = () => {
  if (!rendition.value) {
    console.error('rendition 未初始化')
    return
  }

  console.log('尝试显示第一页')
  rendition.value.display()
    .then(() => {
      console.log('第一页显示成功')
    })
    .catch((error) => {
      console.error('显示第一页失败:', error)
      errorMessage.value = '显示第一页失败: ' + error.message
      // 但仍然设置为已加载，允许用户继续操作
      bookLoaded.value = true
    })
}

/**
 * 翻页 - 下一页
 */
const nextPage = () => {
  if (!rendition.value) return
  rendition.value.next().catch(() => {
    ElMessage.info('已到最后一页')
  })
}

/**
 * 翻页 - 上一页
 */
const prevPage = () => {
  if (!rendition.value) return
  rendition.value.prev().catch(() => {
    ElMessage.info('已到第一页')
  })
}

/**
 * 处理进度条变化
 */
const handleProgressChange = (value) => {
  if (!rendition.value || !book.value.locations) return

  try {
    const percent = value / 100
    if (book.value.locations.cfiFromPercentage) {
      const cfi = book.value.locations.cfiFromPercentage(percent)
      rendition.value.display(cfi)
    }
  } catch (error) {
    console.error('进度条错误:', error)
  }
}

/**
 * 点击目录跳转（树节点）
 */
const handleNodeClick = (data) => {
  if (!rendition.value) return
  try {
    // 只在有 href 时才跳转
    if (data.href) {
      rendition.value.display(data.href).catch(() => {
        errorMessage.value = '跳转失败'
      })

      // 移动端关闭侧边栏
      if (isMobile.value) {
        sidebarVisible.value = false
      }
    }
  } catch (error) {
    console.error('目录跳转错误:', error)
  }
}

/**
 * 更新当前 Spine 索引
 */
const updateCurrentSpineIndex = (location) => {
  try {
    if (location?.start && book.value.spine) {
      const href = location.start.href
      const index = book.value.spine.items.findIndex(
        (item) => item.href === href || item.href?.endsWith(href)
      )
      if (index !== -1) {
        currentSpineIndex.value = index
      }
    }
  } catch (error) {
    console.error('更新索引错误:', error)
  }
}

/**
 * 递归查找目录树中对应 href 的节点 ID
 */
const findTocNodeId = (items, targetHref) => {
  if (!items) return null

  for (const item of items) {
    if (item.href === targetHref || item.href?.endsWith(targetHref)) {
      return item.id
    }
    if (item.subitems) {
      const found = findTocNodeId(item.subitems, targetHref)
      if (found) return found
    }
  }
  return null
}

/**
 * 更新当前目录索引和高亮节点
 */
const updateCurrentTocNode = (location) => {
  try {
    if (location?.start && tocTree.value.length > 0) {
      const href = location.start.href
      const nodeId = findTocNodeId(tocTree.value, href)
      if (nodeId) {
        currentTocIndex.value = nodeId
      }
    }
  } catch (error) {
    console.error('更新目录错误:', error)
  }
}

/**
 * 检查移动设备
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    sidebarVisible.value = true
  }
}

/**
 * 处理键盘快捷键
 */
const handleKeydown = (event) => {
  if (!rendition.value) return

  switch (event.key) {
    case 'ArrowRight':
      nextPage()
      event.preventDefault()
      break
    case 'ArrowLeft':
      prevPage()
      event.preventDefault()
      break
  }
}

onMounted(() => {
  console.log('阅读器已加载')
  loadThemeSettings()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleKeydown)
  rendition.value?.destroy()
  book.value?.destroy()
})
</script>

<style scoped>
.reader-page {
  width: 100%;
  height: calc(100vh - 60px);
  background: var(--bg-color);
}

:deep(.el-container) {
  height: 100%;
}

:deep(.el-aside) {
  background: var(--bg-light);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-main) {
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: var(--text-color);
  flex-shrink: 0;
}

.toc-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

:deep(.el-tree) {
  background: transparent;
  border: none;
}

:deep(.el-tree-node) {
  font-size: 13px;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-tree-node:hover > .el-tree-node__content) {
  background: var(--bg-color);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
}

:deep(.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label) {
  color: var(--primary-color);
}

.tree-node-label {
  user-select: none;
  color: var(--text-secondary);
  display: inline-block;
  padding: 2px 0;
}

:deep(.el-tree-node.is-current .tree-node-label) {
  color: var(--primary-color);
}

.metadata-panel {
  padding: 15px;
  background: var(--bg-color);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  max-height: 100px;
  overflow-y: auto;
  flex-shrink: 0;
}

.info-item {
  margin-bottom: 8px;
}

.info-label {
  font-weight: bold;
  color: var(--text-color);
}

.info-value {
  color: var(--text-secondary);
  margin-left: 5px;
}

.reader-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  gap: 15px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  align-items: center;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 50px;
  text-align: right;
}

.toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

:deep(.el-statistic__title) {
  font-size: 12px;
}

:deep(.el-statistic__content) {
  font-size: 14px;
}

.stat-item {
  min-width: 60px;
}

:deep(.el-divider--vertical) {
  height: 20px;
  margin: 0 8px;
}

.viewer {
  flex: 1;
  overflow: hidden;
  background: white;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-tertiary);
  font-size: 14px;
  gap: 10px;
}

.spinner {
  font-size: 24px;
  animation: spin 1s linear infinite;
  color: var(--primary-color);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

:deep(.el-empty) {
  padding: 40px 20px;
}

:deep(.el-upload-dragger) {
  width: 100%;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reader-aside {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 250px !important;
    background: white;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    display: none;
  }

  .reader-aside {
    display: flex;
  }

  .reader-toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .progress-section {
    width: 100%;
    order: 3;
  }

  .toolbar-right {
    width: 100%;
    justify-content: flex-end;
  }

  :deep(.el-upload-dragger) {
    max-width: 100%;
  }
}
</style>
