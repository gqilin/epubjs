import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/reader',
    name: 'Reader',
    component: () => import('@/views/Reader.vue'),
    meta: {
      title: 'EPUB 阅读器'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于项目'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Vue3 EPUB 阅读器'
  document.title = title
  next()
})

export default router
