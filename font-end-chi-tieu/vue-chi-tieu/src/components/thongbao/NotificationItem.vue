<template>
  <div class="notification-item" :class="{unread: !notification.read}">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <span class="fw-bold" v-if="!notification.read"><i class="bi bi-dot text-primary"></i></span>
        {{ notification.message }}
      </div>
      <small class="text-muted ms-2">{{ formatTime(notification.time) }}</small>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  notification: { type: Object, required: true }
});
function formatTime(time) {
  const d = new Date(time);
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}
</script>
<style scoped>
.notification-item {
  background: #f3f4f6;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: background 0.18s;
}
.notification-item.unread {
  background: #e0e7ff;
  font-weight: 600;
}
</style> 