<template>
  <!-- Hiển thị layout chính cho các trang khác -->
  <div v-if="!isLoginPage">
    <Header @toggle-menu="toggleMenuSide" />
    <main>
      <Body :showMenuSide="showMenuSide" @close-menu="closeMenuSide" />
    </main>
    <Footer />
  </div>

  <!-- Hiển thị trực tiếp router-view cho trang Login -->
  <router-view v-else />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Footer from './layout/Footer.vue';
import Header from './layout/Header.vue';
import Body from './layout/Body.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const showMenuSide = ref(false);

// Kiểm tra xem có phải trang login không
const isLoginPage = computed(() => {
  return route.path === '/login';
});

const toggleMenuSide = () => {
  showMenuSide.value = !showMenuSide.value;
};

const closeMenuSide = () => {
  showMenuSide.value = false;
};

// Handle unauthorized event
const handleUnauthorized = () => {
  toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
  router.push('/login');
};

onMounted(() => {
  // Listen for unauthorized event
  window.addEventListener('auth:unauthorized', handleUnauthorized);
});

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('auth:unauthorized', handleUnauthorized);
});
</script>

<style scoped>
/* Styles cho layout chính */
</style>