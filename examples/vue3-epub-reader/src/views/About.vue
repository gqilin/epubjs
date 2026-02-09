<template>
  <div class="about-container">
    <div class="about-content">
      <!-- 项目标题 -->
      <div class="about-header">
        <h1>关于 Elegant-EPUB</h1>
        <p>一个现代化的 EPUB 阅读器解决方案</p>
      </div>

      <!-- 项目简介 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>📖 项目简介</span>
          </div>
        </template>
        <p>
          Elegant-EPUB 是一个基于 Vue 3 + Vite + Element Plus 构建的现代化 EPUB 阅读器。
          它继承了 Epub.js 的强大功能，并提供了更优雅的用户界面和更好的开发体验。
        </p>
        <p>
          项目支持完整的 EPUB 文件加载、渲染、导航和交互功能，适合构建各种阅读应用。
        </p>
      </el-card>

      <!-- 主要特性 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>✨ 主要特性</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :md="12" :xs="24">
            <div class="feature-list">
              <div class="feature-item">
                <el-icon class="feature-icon"><DocumentCopy /></el-icon>
                <div>
                  <h4>EPUB 支持</h4>
                  <p>完整支持 EPUB2 和 EPUB3 标准</p>
                </div>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Menu /></el-icon>
                <div>
                  <h4>交互式导航</h4>
                  <p>目录、书签、进度跟踪</p>
                </div>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Setting /></el-icon>
                <div>
                  <h4>主题定制</h4>
                  <p>灵活的样式和排版配置</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :md="12" :xs="24">
            <div class="feature-list">
              <div class="feature-item">
                <el-icon class="feature-icon"><Monitor /></el-icon>
                <div>
                  <h4>响应式设计</h4>
                  <p>完美适配各种设备尺寸</p>
                </div>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Code /></el-icon>
                <div>
                  <h4>开源项目</h4>
                  <p>开放源码，欢迎贡献</p>
                </div>
              </div>
              <div class="feature-item">
                <el-icon class="feature-icon"><Rocket /></el-icon>
                <div>
                  <h4>高性能</h4>
                  <p>快速的加载和渲染</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 技术栈 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>🛠️ 技术栈</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :sm="12" :xs="24">
            <h4>前端框架</h4>
            <ul>
              <li><strong>Vue 3</strong> - 最新的 JavaScript 框架</li>
              <li><strong>Vite</strong> - 下一代前端构建工具</li>
              <li><strong>Vue Router</strong> - 官方路由库</li>
              <li><strong>Element Plus</strong> - 企业级 UI 组件库</li>
            </ul>
          </el-col>
          <el-col :sm="12" :xs="24">
            <h4>核心库</h4>
            <ul>
              <li><strong>Elegant-EPUB</strong> - EPUB 渲染引擎</li>
              <li><strong>JSZip</strong> - ZIP 文件处理</li>
              <li><strong>Axios</strong> - HTTP 客户端</li>
              <li><strong>Babel</strong> - JavaScript 编译器</li>
            </ul>
          </el-col>
        </el-row>
      </el-card>

      <!-- 快速开始 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>🚀 快速开始</span>
          </div>
        </template>
        <div class="code-section">
          <h4>安装依赖</h4>
          <div class="code-block">
            <code>npm install</code>
          </div>

          <h4>启动开发服务器</h4>
          <div class="code-block">
            <code>npm run dev</code>
          </div>

          <h4>构建生产版本</h4>
          <div class="code-block">
            <code>npm run build</code>
          </div>
        </div>
      </el-card>

      <!-- 文档链接 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>📚 相关文档</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :md="8" :xs="24">
            <a href="https://github.com/futurepress/epub.js" target="_blank" class="doc-link">
              <el-icon><DocumentCopy /></el-icon>
              <span>Epub.js GitHub</span>
            </a>
          </el-col>
          <el-col :md="8" :xs="24">
            <a href="https://www.w3.org/publishing/epub/" target="_blank" class="doc-link">
              <el-icon><Link /></el-icon>
              <span>EPUB 标准</span>
            </a>
          </el-col>
          <el-col :md="8" :xs="24">
            <a href="https://vuejs.org" target="_blank" class="doc-link">
              <el-icon><Code /></el-icon>
              <span>Vue 3 文档</span>
            </a>
          </el-col>
        </el-row>
      </el-card>

      <!-- 关于作者 -->
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <span>👨‍💻 关于项目</span>
          </div>
        </template>
        <div class="about-footer">
          <p>
            <strong>版本:</strong> 0.3.93
          </p>
          <p>
            <strong>许可证:</strong>
            <el-tag>BSD-2-Clause</el-tag>
          </p>
          <p>
            <strong>主要贡献:</strong>
            <span>继承自 Epub.js 项目，由 FuturePress 维护</span>
          </p>
          <el-divider />
          <p style="text-align: center; color: #999; font-size: 12px">
            © 2026 Elegant-EPUB. All rights reserved.
          </p>
        </div>
      </el-card>

      <!-- 返回按钮 -->
      <div class="action-buttons">
        <router-link to="/reader" class="action-link">
          <el-button type="primary" size="large">
            <el-icon><ArrowLeft /></el-icon>
            返回阅读器
          </el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentCopy,
  Menu,
  Setting,
  Monitor,
  Code,
  Rocket,
  Link,
  ArrowLeft
} from '@element-plus/icons-vue'
</script>

<style scoped>
.about-container {
  background: #f5f5f5;
  padding: 20px;
  min-height: 100vh;
}

.about-content {
  max-width: 1000px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.about-header h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.about-header p {
  font-size: 16px;
  opacity: 0.9;
}

.about-card {
  margin-bottom: 20px;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

:deep(.el-card__body) {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

:deep(.el-card__body) p {
  margin-bottom: 12px;
}

:deep(.el-card__body) p:last-child {
  margin-bottom: 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.feature-icon {
  font-size: 20px;
  color: #667eea;
  flex-shrink: 0;
}

.feature-item h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.feature-item p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

:deep(.el-row) {
  margin-bottom: 20px;
}

:deep(.el-row) h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
}

:deep(.el-col) ul {
  padding-left: 20px;
  margin: 0;
}

:deep(.el-col) li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.code-section h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
}

.code-section h4:first-child {
  margin-top: 0;
}

.code-block {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  margin-bottom: 15px;
  overflow-x: auto;
}

.code-block code {
  color: #667eea;
}

.doc-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  border: 1px solid #ddd;
}

.doc-link:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.doc-link :deep(.el-icon) {
  font-size: 24px;
}

.about-footer {
  line-height: 1.8;
}

.about-footer p {
  margin-bottom: 12px;
}

:deep(.el-tag) {
  margin-left: 8px;
}

:deep(.el-divider--horizontal) {
  margin: 20px 0;
}

.action-buttons {
  text-align: center;
  margin-top: 40px;
}

.action-link {
  text-decoration: none;
}

@media (max-width: 768px) {
  .about-header {
    padding: 30px 15px;
  }

  .about-header h1 {
    font-size: 28px;
  }

  .about-header p {
    font-size: 14px;
  }

  .about-container {
    padding: 10px;
  }
}
</style>
