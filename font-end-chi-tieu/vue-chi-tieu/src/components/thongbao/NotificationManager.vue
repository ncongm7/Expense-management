<template>
    <div class="notification-manager">
        <!-- Notification Bell -->
        <NotificationBell :unread-count="unreadCount" @toggle-popup="togglePopup" />

        <!-- Notification Popup -->
        <NotificationPopup :notifications="notifications" :show="showPopup" @close="showPopup = false"
            @mark-all-read="markAllAsRead" />
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
        const data = await notificationService.getNotifications({ limit: 20 });
        notifications.value = data;
    } catch (error) {
        console.error('Lỗi lấy thông báo:', error);
    }
};

// Lấy số thông báo chưa đọc
const fetchUnreadCount = async () => {
    try {
        const count = await notificationService.getUnreadCount();
        unreadCount.value = count;
    } catch (error) {
        console.error('Lỗi lấy số thông báo chưa đọc:', error);
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

// Auto refresh mỗi 30 giây
const startAutoRefresh = () => {
    refreshInterval = setInterval(() => {
        fetchUnreadCount();
        if (showPopup.value) {
            fetchNotifications();
        }
    }, 30000); // 30 giây
};

// Dừng auto refresh
const stopAutoRefresh = () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
};

onMounted(() => {
    fetchUnreadCount();
    startAutoRefresh();
});

onUnmounted(() => {
    stopAutoRefresh();
});
</script>

<style scoped>
.notification-manager {
    position: relative;
}
</style>