<template>
  <div v-if="show" class="notification-popup" @click="$emit('close')">
    <div class="popup-content card shadow rounded-4 p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold"><i class="bi bi-bell me-2"></i>Thông báo</span>
        <button v-if="unreadCount > 0" class="btn btn-link btn-sm text-primary" @click="$emit('mark-all-read')">Đánh dấu
          đã đọc tất cả</button>
      </div>
      <div v-if="notifications.length === 0" class="text-muted text-center py-3">
        <i class="bi bi-inbox"></i> Không có thông báo nào.
      </div>
      <div v-else class="notification-list">
        <NotificationItem v-for="n in notifications" :key="n.id" :notification="n" @mark-read="handleMarkRead"
          @click="handleNotificationClick" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import NotificationItem from './NotificationItem.vue';
import notificationService from '@/service/notificationService.js';

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  show: Boolean,
  unreadCount: { type: Number, default: 0 }
});

const emit = defineEmits(['close', 'mark-all-read', 'update-notifications']);

console.log('Thông báo:', props.notifications);
console.log('Unread count:', props.unreadCount);

// Xử lý đánh dấu đã đọc
const handleMarkRead = async (notificationId) => {
  try {
    await notificationService.markAsRead(notificationId);
    // Emit event để cập nhật danh sách thông báo
    emit('update-notifications');
  } catch (error) {
    console.error('Lỗi đánh dấu đã đọc:', error);
  }
};

// Xử lý click vào thông báo
const handleNotificationClick = (notification) => {
  console.log('Click vào thông báo:', notification);
  // Có thể thêm logic navigate hoặc xử lý khác ở đây
};
</script>
<style scoped>
.notification-popup {
  position: fixed;
  top: 70px;
  right: 32px;
  z-index: 3000;
  background: transparent;
}

.popup-content {
  min-width: 320px;
  max-width: 90vw;
  max-height: 60vh;
  overflow-y: auto;
  border-radius: 1.5rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .notification-popup {
    right: 8px;
    top: 56px;
  }

  .popup-content {
    min-width: 90vw;
  }
}
</style>