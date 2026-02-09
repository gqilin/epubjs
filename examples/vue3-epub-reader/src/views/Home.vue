<template>
  <div class="home-container">
    <!-- 顶部展示区 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Elegant-EPUB</h1>
        <p class="hero-subtitle">现代化的 EPUB 阅读器解决方案</p>
        <p class="hero-description">
          基于 Vue 3、Vite 和 Element Plus，支持本地 EPUB 文件上传和渲染
        </p>
        <div class="hero-buttons">
          <router-link to="/reader" class="btn btn-primary">
            开始阅读
          </router-link>
          <a href="#features" class="btn btn-secondary">
            了解更多
          </a>
        </div>
      </div>
    </div>

    <!-- 功能特性 -->
    <div id="features" class="features-section">
      <h2>功能特性</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>文件上传</h3>
          <p>支持上传本地 EPUB 文件，快速加载渲染</p>
        </div>
        <div class="feature-card">
          <h3>翻页导航</h3>
          <p>流畅的上一页/下一页导航，支持键盘快捷键</p>
        </div>
        <div class="feature-card">
          <h3>目录导航</h3>
          <p>交互式目录，点击快速跳转到任意章节</p>
        </div>
        <div class="feature-card">
          <h3>进度追踪</h3>
          <p>实时显示阅读进度，支持进度条拖拽</p>
        </div>
        <div class="feature-card">
          <h3>主题定制</h3>
          <p>灵活的样式定制，支持中文排版优化</p>
        </div>
        <div class="feature-card">
          <h3>响应式设计</h3>
          <p>完美适配桌面、平板和手机设备</p>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="tech-stack-section">
      <h2>技术栈</h2>
      <div class="tech-grid">
        <div class="tech-item">
          <h4>Vue 3</h4>
          <p>最新的前端框架，Composition API 设计</p>
        </div>
        <div class="tech-item">
          <h4>Vite</h4>
          <p>快速的构建工具，极速热重载体验</p>
        </div>
        <div class="tech-item">
          <h4>Element Plus</h4>
          <p>功能完整的 UI 组件库</p>
        </div>
        <div class="tech-item">
          <h4>Elegant-EPUB</h4>
          <p>强大的 EPUB 渲染引擎</p>
        </div>
      </div>
    </div>

    <!-- 快速开始 -->
    <div class="quick-start-section">
      <h2>快速开始</h2>
      <div class="code-block">
        <pre><code>
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
        </code></pre>
      </div>
    </div>

    <!-- 底部 CTA -->
    <div class="cta-section">
      <h2>准备好了吗？</h2>
      <p>立即开始使用 Elegant-EPUB 阅读器</p>
      <router-link to="/reader" class="btn btn-primary btn-large">
        进入阅读器
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 首页不需要任何脚本逻辑
</script>

<style scoped>
.home-container {
  width: 100%;
}

/* Hero 区域 */
.hero-section {
  background: var(--bg-white);
  padding: 80px 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  animation: slideInUp 0.6s ease;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--primary-color);
  margin-bottom: 12px;
  font-weight: 500;
}

.hero-description {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.btn-large {
  padding: 14px 40px;
  font-size: 16px;
}

/* 功能特性 */
.features-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-section h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 60px;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--bg-white);
  padding: 32px 24px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 技术栈 */
.tech-stack-section {
  background: var(--bg-color);
  padding: 80px 20px;
}

.tech-stack-section h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 60px;
  color: var(--text-color);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tech-item {
  background: var(--bg-white);
  padding: 24px;
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.tech-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.tech-item p {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
}

/* 快速开始 */
.quick-start-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.quick-start-section h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
  color: var(--text-color);
}

.code-block {
  background: #f6f8fa;
  border: 1px solid var(--border-color);
  padding: 24px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-block code {
  display: block;
  white-space: pre;
  color: var(--text-color);
}

/* CTA 区域 */
.cta-section {
  background: var(--bg-light);
  color: var(--text-color);
  padding: 80px 20px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.cta-section h2 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.cta-section p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .features-section h2,
  .tech-stack-section h2,
  .quick-start-section h2,
  .cta-section h2 {
    font-size: 24px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
    width: 100%;
  }

  .features-grid,
  .tech-grid {
    gap: 16px;
  }

  .feature-card,
  .tech-item {
    padding: 20px 16px;
  }

  .hero-section {
    padding: 60px 20px;
  }
}
</style>
