<template>
    <nav class="sidebar bg-white shadow-lg rounded-4 d-flex flex-column p-4 vh-100 position-relative">
        <div class="d-flex flex-column align-items-center mb-4">
            <img src="https://ui-avatars.com/api/?name=QLCT&background=0d6efd&color=fff" alt="Avatar"
                class="rounded-circle mb-2 shadow" style="width: 64px; height: 64px; border: 3px solid #0d6efd;">
            <h4 class="fw-bold mb-0">Quản Lý Chi Tiêu</h4>
            <span class="text-muted small">Xin chào, {{ userName }}!</span>
        </div>
        <ul class="nav nav-pills flex-column mb-auto gap-2">
            <li class="nav-item">
                <router-link to="/overview" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-cash-coin me-3 fs-4"></i> Giao dịch
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/danhmuc" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-list-ul me-3 fs-4"></i> Danh mục
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/ngansach" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-wallet2 me-3 fs-4"></i> Ngân sách
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/muctieu" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-bullseye me-3 fs-4"></i> Mục tiêu
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/baocao" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-bar-chart-line me-3 fs-4"></i> Báo cáo
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/caidat" class="nav-link menu-link" active-class="active"
                    @click="$emit('menu-selected')">
                    <i class="bi bi-gear me-3 fs-4"></i> Cài đặt
                </router-link>
            </li>
        </ul>
        <div class="sidebar-gradient"></div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import authService from '../service/authService.js';

// Lấy thông tin user hiện tại
const currentUser = computed(() => {
    return authService.getCurrentUser();
});

// Tên user để hiển thị
const userName = computed(() => {
    const user = currentUser.value;
    return user ? (user.name || user.email || 'User') : 'User';
});
</script>

<style scoped>
.sidebar {
    min-width: 220px;
    max-width: 260px;
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 6px 32px 0 rgba(13, 110, 253, 0.10), 0 1.5px 4px 0 rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
}

.menu-link {
    display: flex;
    align-items: center;
    font-size: 1.15rem;
    font-weight: 500;
    color: #333;
    border-radius: 1.5rem;
    padding: 0.75rem 1.2rem;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    box-shadow: none;
    position: relative;
}

.menu-link .bi {
    min-width: 28px;
    text-align: center;
}

.menu-link:hover {
    background: linear-gradient(90deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #0d6efd;
    box-shadow: 0 2px 8px 0 rgba(13, 110, 253, 0.08);
}

.menu-link.active,
.menu-link.router-link-exact-active {
    background: linear-gradient(90deg, #0d6efd 0%, #6366f1 100%);
    color: #fff !important;
    box-shadow: 0 4px 16px 0 rgba(13, 110, 253, 0.13);
}

.menu-link.active .bi,
.menu-link.router-link-exact-active .bi {
    color: #fff;
}

.sidebar-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(0deg, #0d6efd11 60%, transparent 100%);
    pointer-events: none;
}

@media (max-width: 768px) {
    .sidebar {
        min-width: 100vw;
        max-width: 100vw;
        height: auto;
        position: relative;
        padding-bottom: 1rem;
        border-radius: 0 0 2rem 2rem;
    }
}
</style>
