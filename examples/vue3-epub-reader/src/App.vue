<template>
  <div id="app" class="app-wrapper">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          Elegant-EPUB
        </router-link>

        <div class="nav-menu">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            首页
          </router-link>
          <router-link to="/reader" class="nav-link" :class="{ active: $route.path === '/reader' }">
            阅读器
          </router-link>
          <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">
            关于
          </router-link>
          <a href="https://github.com/futurepress/epub.js" target="_blank" class="nav-link">
            GitHub
          </a>
        </div>
      </div>
    </nav>

    <!-- 路由视图 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 Elegant-EPUB | 基于 Vue 3 + Element Plus + Epub.js</p>
        <div class="footer-links">
          <a href="https://vuejs.org" target="_blank">Vue</a>
          <span>•</span>
          <a href="https://element-plus.org" target="_blank">Element Plus</a>
          <span>•</span>
          <a href="https://github.com/futurepress/epub.js" target="_blank">Epub.js</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 使用路由视图自动处理路由切换
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-color);
}

/* 导航栏 */
.navbar {
  background: var(--bg-light);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* 主内容 */
.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

/* 页脚 */
.footer {
  background: var(--bg-light);
  border-top: 1px solid var(--border-color);
  padding: 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 12px;
}

.footer-content p {
  margin: 0 0 8px 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.footer-links a {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s;
}

.footer-links a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.footer-links span {
  color: var(--border-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 10px;
  }

  .nav-menu {
    gap: 15px;
  }

  .nav-link {
    font-size: 12px;
  }

  .main-content {
    padding: 0;
  }
}
</style>
