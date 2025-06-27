<template>
  <button class="btn position-relative btn-icon" @click="$emit('toggle-popup')" title="Thông báo">
    <i class="bi bi-bell fs-5"></i>
    <span v-if="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-pulse" style="font-size: 0.7rem;">
      {{ unreadCount }}
    </span>
  </button>
</template>
<script setup>
const props = defineProps({
  unreadCount: { type: Number, default: 0 }
});
</script>
<style scoped>
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
.animate-pulse {
  animation: pulse 1.2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style> 