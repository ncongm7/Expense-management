<template>
  <div v-if="show" class="notification-popup" @mousedown.self="$emit('close')">
    <div class="popup-content card shadow rounded-4 p-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold"><i class="bi bi-bell me-2"></i>Thông báo</span>
        <button v-if="unreadCount > 0" class="btn btn-link btn-sm text-primary" @click="$emit('mark-all-read')">Đánh dấu đã đọc tất cả</button>
      </div>
      <div v-if="notifications.length === 0" class="text-muted text-center py-3">
        <i class="bi bi-inbox"></i> Không có thông báo nào.
      </div>
      <div v-else class="notification-list">
        <NotificationItem v-for="n in notifications" :key="n.id" :notification="n" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import NotificationItem from './NotificationItem.vue';
const props = defineProps({
  notifications: { type: Array, default: () => [] },
  show: Boolean
});
const unreadCount = computed(() => props.notifications.filter(n => !n.read).length);
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
  .notification-popup { right: 8px; top: 56px; }
  .popup-content { min-width: 90vw; }
}
</style> 