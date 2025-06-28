<template>
  <div class="notification-item" :class="{ unread: !notification.read }" @click="handleClick">
    <div class="notification-header d-flex justify-content-between align-items-start mb-1">
      <div class="d-flex align-items-center">
        <i :class="getTypeIcon()" :style="{ color: getTypeColor() }"></i>
        <span class="fw-bold ms-2">{{ notification.title }}</span>
        <span v-if="!notification.read" class="badge bg-primary ms-2">Mới</span>
      </div>
      <small class="text-muted">{{ formatTime(notification.createdAt) }}</small>
    </div>
    <div class="notification-message">
      {{ notification.message }}
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  notification: { type: Object, required: true }
});

const emit = defineEmits(['mark-read', 'click']);

function formatTime(createdAt) {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

function getTypeIcon() {
  const icons = {
    'info': 'bi bi-info-circle',
    'warning': 'bi bi-exclamation-triangle',
    'success': 'bi bi-check-circle',
    'error': 'bi bi-x-circle'
  };
  return icons[props.notification.type] || 'bi bi-bell';
}

function getTypeColor() {
  const colors = {
    'info': '#3b82f6',
    'warning': '#f59e0b',
    'success': '#10b981',
    'error': '#ef4444'
  };
  return colors[props.notification.type] || '#6b7280';
}

function handleClick() {
  // Emit click event
  emit('click', props.notification);

  // Mark as read if not already read
  if (!props.notification.read) {
    emit('mark-read', props.notification.id);
  }

  // Xử lý click vào thông báo
  if (props.notification.actionUrl) {
    // Navigate to action URL if exists
    console.log('Navigate to:', props.notification.actionUrl);
  }
}
</script>
<style scoped>
.notification-item {
  background: #f3f4f6;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: all 0.18s;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.notification-item:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.notification-item.unread {
  background: #e0e7ff;
  font-weight: 500;
  border-left-color: #3b82f6;
}

.notification-item.unread:hover {
  background: #dbeafe;
}

.notification-header {
  font-size: 0.85rem;
}

.notification-message {
  color: #4b5563;
  line-height: 1.4;
}

.badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
}
</style>