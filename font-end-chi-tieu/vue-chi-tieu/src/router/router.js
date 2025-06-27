import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import authService from '../service/authService.js'
import GiaoDich from '../view/GiaoDich.vue'
import DanhMuc from '../view/DanhMuc.vue'
import NganSach from '../view/NganSach.vue'
import MucTieu from '../view/MucTieu.vue'
import BaoCao from '../view/BaoCao.vue'
import CaiDat from '../view/CaiDat.vue'
import Login from '../view/Login.vue'
import Overview from '../view/Overview.vue'


const routes = [
  {
    path: '/',
    redirect: (to) => {
      // Redirect dựa trên trạng thái đăng nhập
      return authService.isLoggedIn() ? '/overview' : '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Chỉ cho phép guest truy cập
  },
  {
    path: '/giaodich',
    name: 'GiaoDich',
    component: GiaoDich,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  {
    path: '/danhmuc',
    name: 'DanhMuc',
    component: DanhMuc,
    meta: { requiresAuth: true }
  },
  {
    path: '/ngansach',
    name: 'NganSach',
    component: NganSach,
    meta: { requiresAuth: true }
  },
  {
    path: '/muctieu',
    name: 'MucTieu',
    component: MucTieu,
    meta: { requiresAuth: true }
  },
  {
    path: '/baocao',
    name: 'BaoCao',
    component: BaoCao,
    meta: { requiresAuth: true }
  },
  {
    path: '/caidat',
    name: 'CaiDat',
    component: CaiDat,
    meta: { requiresAuth: true }
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview,
    meta: { requiresAuth: true }
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      // Redirect unknown routes dựa trên trạng thái đăng nhập
      return authService.isLoggedIn() ? '/giaodich' : '/login'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = authService.isLoggedIn()

  // Nếu route yêu cầu authentication
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      // Chưa đăng nhập -> chuyển về login
      next('/login')
    } else {
      // Đã đăng nhập -> cho phép truy cập
      next()
    }
  }
  // Nếu route chỉ cho phép guest (như login)
  else if (to.meta.requiresGuest) {
    if (isLoggedIn) {
      // Đã đăng nhập -> chuyển về trang chính
      next('/overview')
    } else {
      // Chưa đăng nhập -> cho phép truy cập login
      next()
    }
  }
  // Các route khác
  else {
    next()
  }
})

export default router
