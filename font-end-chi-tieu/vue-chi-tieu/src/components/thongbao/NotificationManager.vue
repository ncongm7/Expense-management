<template>
    <div class="notification-manager">
        <!-- Notification Bell -->
        <NotificationBell :unreadCount="unreadCount" @toggle-popup="togglePopup" />

        <!-- Notification Popup -->
        <NotificationPopup :notifications="notifications" :show="showPopup" :unreadCount="unreadCount"
            @close="showPopup = false" @mark-all-read="markAllAsRead" @update-notifications="fetchNotifications" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NotificationBell from './NotificationBell.vue';
import NotificationPopup from './NotificationPopup.vue';
import notificationService from '@/service/notificationService.js';

const notifications = ref([]);
const unreadCount = ref(0);
const showPopup = ref(false);
let refreshInterval = null;

// Toggle popup
const togglePopup = () => {
    showPopup.value = !showPopup.value;
    if (showPopup.value) {
        fetchNotifications();
    }
};

// Lấy danh sách thông báo
const fetchNotifications = async () => {
    try {
        console.log('Đang gọi API lấy thông báo...');
        const data = await notificationService.getNotifications({ limit: 20 });
        console.log('Dữ liệu thông báo nhận được:', data);
        notifications.value = data || [];
    } catch (error) {
        console.error('Lỗi lấy thông báo:', error);
        notifications.value = [];
    }
};

// Lấy số thông báo chưa đọc
const fetchUnreadCount = async () => {
    try {
        console.log('Đang gọi API lấy số thông báo chưa đọc...');
        const count = await notificationService.getUnreadCount();
        console.log('Số thông báo chưa đọc:', count);
        unreadCount.value = count || 0;
    } catch (error) {
        console.error('Lỗi lấy số thông báo chưa đọc:', error);
        unreadCount.value = 0;
    }
};

// Refresh notifications ngay lập tức
const refreshNotifications = async () => {
    console.log('Refresh notifications ngay lập tức...');
    await fetchUnreadCount();
    if (showPopup.value) {
        await fetchNotifications();
    }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async () => {
    try {
        await notificationService.markAllAsRead();
        await fetchNotifications();
        await fetchUnreadCount();
    } catch (error) {
        console.error('Lỗi đánh dấu tất cả đã đọc:', error);
    }
};

// Auto refresh mỗi 10 giây
const startAutoRefresh = () => {
    refreshInterval = setInterval(() => {
        fetchUnreadCount();
        if (showPopup.value) {
            fetchNotifications();
        }
    }, 10000); // 10 giây
};

// Dừng auto refresh
const stopAutoRefresh = () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
};

// Lắng nghe sự kiện refresh notifications
const handleRefreshNotifications = () => {
    refreshNotifications();
};

onMounted(() => {
    // Kiểm tra user trong localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('User trong localStorage:', user);
    console.log('Token:', token);

    if (user && user.id && token) {
        console.log('User đã đăng nhập, bắt đầu fetch notifications...');
        fetchUnreadCount();
        fetchNotifications();
        startAutoRefresh();

        // Lắng nghe sự kiện refresh notifications
        window.addEventListener('refresh-notifications', handleRefreshNotifications);
    } else {
        console.log('User chưa đăng nhập hoặc không có token');
    }
});

onUnmounted(() => {
    stopAutoRefresh();
    // Xóa event listener
    window.removeEventListener('refresh-notifications', handleRefreshNotifications);
});
</script>

<style scoped>
.notification-manager {
    position: relative;
}
</style>