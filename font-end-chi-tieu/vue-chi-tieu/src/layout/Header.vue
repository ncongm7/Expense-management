<template>
    <header>
        <nav
            class="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded-bottom-4 px-3 py-2 position-relative">
            <button class="btn d-lg-none me-2 btn-menu" @click="$emit('toggle-menu')">
                <i class="bi bi-list" style="font-size: 1.7rem;"></i>
            </button>
            <div class="d-flex align-items-center flex-grow-1">
                <img src="https://ui-avatars.com/api/?name=QLCT&background=0d6efd&color=fff" alt="Avatar"
                    class="rounded-circle me-3 shadow" style="width: 48px; height: 48px; border: 2.5px solid #0d6efd;">
                <div>
                    <span class="fw-bold fs-4 app-title">Quản Lý Chi Tiêu</span>
                    <div class="text-muted small">Hệ thống quản lý tài chính cá nhân</div>
                </div>
            </div>
            <div class="d-flex align-items-center ms-auto gap-3">
                <button class="btn position-relative btn-icon" title="Thông báo">
                    <i class="bi bi-bell fs-5"></i>
                    <span
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-pulse"
                        style="font-size: 0.7rem;">!</span>
                </button>
                <button class="btn btn-icon" title="Đồng bộ">
                    <i class="bi bi-cloud-arrow-up fs-5"></i>
                </button>
                <div class="dropdown">
                    <button
                        class="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center dropdown-toggle"
                        type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width:40px;height:40px;">
                        <img :src="userAvatar" alt="User" class="rounded-circle" style="width:36px;height:36px;">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end mt-2">
                        <li><span class="dropdown-item-text fw-bold">Xin chào, {{ userName }}!</span></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#" @click.prevent="showProfile">Tài khoản</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
            <div class="header-gradient"></div>
            <div class="position-absolute end-0 bottom-0 me-3 mb-1 text-muted small d-none d-md-block"
                style="z-index:2;">
                <i class="bi bi-clock me-1"></i> <span>{{ now }}</span>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import authService from '../service/authService.js'

const router = useRouter()
const toast = useToast()

defineEmits(['toggle-menu'])

const now = ref('')
let timer = null

// Lấy thông tin user hiện tại
const currentUser = computed(() => {
    return authService.getCurrentUser()
})

// Tạo avatar URL từ tên user
const userAvatar = computed(() => {
    const user = currentUser.value
    if (user && user.name) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
    }
    return 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
})

// Tên user để hiển thị
const userName = computed(() => {
    const user = currentUser.value
    return user ? (user.name || user.email || 'User') : 'User'
})

function updateTime() {
    const d = new Date()
    now.value = d.toLocaleTimeString('vi-VN')
}

/**
 * Xử lý đăng xuất
 */
const handleLogout = () => {
    authService.logout()
    toast.success('Đã đăng xuất thành công!')
    router.push('/login')
    window.location.reload()
}

/**
 * Hiển thị trang profile (có thể implement sau)
 */
const showProfile = () => {
    toast.info('Tính năng này sẽ được phát triển sau!')
}

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>

<style scoped>
.navbar {
    min-height: 64px;
    background: linear-gradient(90deg, #e0e7ff 0%, #fff 100%);
    border-bottom: 2.5px solid #0d6efd11;
    border-radius: 0 0 2rem 2rem;
    box-shadow: 0 2px 16px 0 rgba(80, 80, 180, 0.08);
    position: relative;
}

.app-title {
    background: linear-gradient(90deg, #0d6efd 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.btn-menu {
    background: #e0e7ff;
    border-radius: 1rem;
    transition: background 0.18s;
}

.btn-menu:hover {
    background: #c7d2fe;
}

.btn-icon {
    background: #f3f4f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s;
}

.btn-icon:hover {
    background: #e0e7ff;
}

.header-gradient {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 18px;
    background: linear-gradient(0deg, #0d6efd11 60%, transparent 100%);
    z-index: 1;
}

.animate-pulse {
    animation: pulse 1.2s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .navbar .fw-bold.fs-4 {
        font-size: 1.1rem !important;
    }

    .navbar img {
        width: 32px !important;
        height: 32px !important;
    }
}
</style>
