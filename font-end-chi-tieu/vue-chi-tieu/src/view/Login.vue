<template>
    <div class="auth-page">
        <!-- Login Form -->
        <LoginForm v-if="!showRegisterForm" @login-success="handleLoginSuccess" @show-register="toggleForm" />

        <!-- Register Form -->
        <RegisterForm v-else @register-success="handleRegisterSuccess" @show-login="toggleForm" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';

const router = useRouter();
const toast = useToast();

// State để chuyển đổi giữa login và register
const showRegisterForm = ref(false);

/**
 * Chuyển đổi giữa form đăng nhập và đăng ký
 */
const toggleForm = () => {
    showRegisterForm.value = !showRegisterForm.value;
};

/**
 * Xử lý khi đăng nhập thành công
 * Chuyển hướng về trang chính
 */
const handleLoginSuccess = (userData) => {
    toast.success('Chào mừng bạn trở lại!');
    router.push('/giaodich');
    window.location.reload();
};

/**
 * Xử lý khi đăng ký thành công
 * Chuyển về form đăng nhập
 */
const handleRegisterSuccess = () => {
    showRegisterForm.value = false;
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
};
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* Animation cho việc chuyển đổi form */
.auth-page>* {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>