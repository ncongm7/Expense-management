<template>
    <div class="register-container">
        <!-- Background Animation -->
        <div class="background-animation">
            <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
                <div class="shape shape-4"></div>
                <div class="shape shape-5"></div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="register-content">
            <div class="register-card">
                <!-- Logo/Brand Section -->
                <div class="brand-section">
                    <div class="logo-container">
                        <div class="logo-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                    </div>
                    <h1 class="brand-title">Tạo Tài Khoản</h1>
                    <p class="brand-subtitle">Đăng ký để bắt đầu quản lý tài chính</p>
                </div>

                <!-- Register Form -->
                <div class="form-section">
                    <h2 class="form-title">Đăng Ký</h2>

                    <form @submit.prevent="handleRegister" class="register-form">
                        <!-- Username Field -->
                        <div class="form-group">
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                <input v-model="form.username" type="text" class="form-input"
                                    :class="{ 'error': errors.username, 'focused': usernameFocused }"
                                    placeholder="Nhập tên đăng nhập" @focus="usernameFocused = true"
                                    @blur="usernameFocused = false" required />
                                <div class="input-line"></div>
                            </div>
                            <div v-if="errors.username" class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errors.username }}
                            </div>
                        </div>

                        <!-- Email Field -->
                        <div class="form-group">
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <input v-model="form.email" type="email" class="form-input"
                                    :class="{ 'error': errors.email, 'focused': emailFocused }"
                                    placeholder="Nhập email của bạn" @focus="emailFocused = true"
                                    @blur="emailFocused = false" required />
                                <div class="input-line"></div>
                            </div>
                            <div v-if="errors.email" class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errors.email }}
                            </div>
                        </div>

                        <!-- Password Field -->
                        <div class="form-group">
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    class="form-input" :class="{ 'error': errors.password, 'focused': passwordFocused }"
                                    placeholder="Nhập mật khẩu" @focus="passwordFocused = true"
                                    @blur="passwordFocused = false" required />
                                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                                <div class="input-line"></div>
                            </div>
                            <div v-if="errors.password" class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errors.password }}
                            </div>
                        </div>

                        <!-- Confirm Password Field -->
                        <div class="form-group">
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                    class="form-input"
                                    :class="{ 'error': errors.confirmPassword, 'focused': confirmPasswordFocused }"
                                    placeholder="Xác nhận mật khẩu" @focus="confirmPasswordFocused = true"
                                    @blur="confirmPasswordFocused = false" required />
                                <button type="button" class="password-toggle"
                                    @click="showConfirmPassword = !showConfirmPassword">
                                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                                <div class="input-line"></div>
                            </div>
                            <div v-if="errors.confirmPassword" class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errors.confirmPassword }}
                            </div>
                        </div>

                        <!-- Terms & Conditions -->
                        <div class="form-group">
                            <label class="checkbox-wrapper">
                                <input v-model="form.acceptTerms" type="checkbox" class="checkbox-input">
                                <span class="checkbox-custom"></span>
                                <span class="checkbox-label">
                                    Tôi đồng ý với
                                    <a href="#" class="terms-link">Điều khoản sử dụng</a>
                                    và
                                    <a href="#" class="terms-link">Chính sách bảo mật</a>
                                </span>
                            </label>
                            <div v-if="errors.acceptTerms" class="error-message">
                                <i class="fas fa-exclamation-circle"></i>
                                {{ errors.acceptTerms }}
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="submit-btn" :class="{ 'loading': isLoading }"
                            :disabled="isLoading">
                            <span v-if="isLoading" class="loading-spinner"></span>
                            <span class="btn-text">{{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}</span>
                        </button>

                        <!-- Divider -->
                        <div class="divider">
                            <span class="divider-text">hoặc</span>
                        </div>

                        <!-- Social Register -->
                        <div class="social-register">
                            <button type="button" class="social-btn google-btn">
                                <i class="fab fa-google"></i>
                                <span>Đăng ký với Google</span>
                            </button>
                            <button type="button" class="social-btn facebook-btn">
                                <i class="fab fa-facebook-f"></i>
                                <span>Đăng ký với Facebook</span>
                            </button>
                        </div>

                        <!-- Login Link -->
                        <div class="login-section">
                            <p class="login-text">
                                Đã có tài khoản?
                                <a href="#" @click.prevent="showLogin" class="login-link">
                                    Đăng nhập ngay
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import authService from '../../service/authService.js';

const toast = useToast();

// Form data
const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
});

// Validation errors
const errors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
});

// UI states
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const usernameFocused = ref(false);
const emailFocused = ref(false);
const passwordFocused = ref(false);
const confirmPasswordFocused = ref(false);

// Emit events
const emit = defineEmits(['register-success', 'show-login']);

/**
 * Validate form data
 * @returns {boolean} True if valid, false otherwise
 */
const validateForm = () => {
    // Reset errors
    errors.username = '';
    errors.email = '';
    errors.password = '';
    errors.confirmPassword = '';
    errors.acceptTerms = '';

    let isValid = true;

    // Validate username
    if (!form.username) {
        errors.username = 'Tên đăng nhập không được để trống';
        isValid = false;
    } else if (form.username.length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
        errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
        isValid = false;
    }

    // Validate email
    if (!form.email) {
        errors.email = 'Email không được để trống';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Email không hợp lệ';
        isValid = false;
    }

    // Validate password
    if (!form.password) {
        errors.password = 'Mật khẩu không được để trống';
        isValid = false;
    } else if (form.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
        isValid = false;
    }

    // Validate confirm password
    if (!form.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        isValid = false;
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
    }

    // Validate terms
    if (!form.acceptTerms) {
        errors.acceptTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
        isValid = false;
    }

    return isValid;
};

/**
 * Handle register form submission
 */
const handleRegister = async () => {
    if (!validateForm()) {
        return;
    }

    isLoading.value = true;

    try {
        // Sử dụng authService để đăng ký
        await authService.register({
            username: form.username,
            email: form.email,
            password: form.password
        });

        // Emit event để chuyển về form đăng nhập
        emit('register-success');

        // Reset form
        form.username = '';
        form.email = '';
        form.password = '';
        form.confirmPassword = '';
        form.acceptTerms = false;

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        // Error đã được xử lý trong authService
    } finally {
        isLoading.value = false;
    }
};

/**
 * Show login form
 */
const showLogin = () => {
    emit('show-login');
};
</script>

<style scoped>
/* Main Container */
.register-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* Background Animation */
.background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.floating-shapes {
    position: relative;
    width: 100%;
    height: 100%;
}

.shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;
}

.shape-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.shape-2 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
}

.shape-3 {
    width: 60px;
    height: 60px;
    top: 80%;
    left: 20%;
    animation-delay: 4s;
}

.shape-4 {
    width: 100px;
    height: 100px;
    top: 10%;
    right: 20%;
    animation-delay: 1s;
}

.shape-5 {
    width: 40px;
    height: 40px;
    top: 40%;
    left: 50%;
    animation-delay: 3s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

/* Register Content */
.register-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 500px;
    padding: 20px;
}

.register-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Brand Section */
.brand-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 30px;
    text-align: center;
    color: white;
}

.logo-container {
    margin-bottom: 20px;
}

.logo-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 32px;
    backdrop-filter: blur(10px);
}

.brand-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;
    font-weight: 300;
}

/* Form Section */
.form-section {
    padding: 40px 30px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 30px 0;
    text-align: center;
}

/* Form Groups */
.form-group {
    margin-bottom: 24px;
}

.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 16px;
    z-index: 2;
    transition: color 0.3s ease;
}

.form-input {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 16px;
    background: #f8f9fa;
    transition: all 0.3s ease;
    outline: none;
}

.form-input:focus,
.form-input.focused {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input:focus+.input-icon,
.form-input.focused+.input-icon {
    color: #667eea;
}

.form-input.error {
    border-color: #dc3545;
    background: #fff5f5;
}

.form-input.error+.input-icon {
    color: #dc3545;
}

.password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.3s ease;
}

.password-toggle:hover {
    color: #667eea;
}

.error-message {
    color: #dc3545;
    font-size: 14px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Checkbox */
.checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    gap: 8px;
}

.checkbox-input {
    display: none;
}

.checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
    flex-shrink: 0;
    margin-top: 2px;
}

.checkbox-input:checked+.checkbox-custom {
    background: #667eea;
    border-color: #667eea;
}

.checkbox-input:checked+.checkbox-custom::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.checkbox-label {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
}

.terms-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.terms-link:hover {
    color: #5a6fd8;
}

/* Submit Button */
.submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Divider */
.divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e1e5e9;
}

.divider-text {
    background: white;
    padding: 0 16px;
    color: #999;
    font-size: 14px;
}

/* Social Register */
.social-register {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
}

.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    background: white;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.social-btn:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-1px);
}

.google-btn:hover {
    border-color: #db4437;
    color: #db4437;
}

.facebook-btn:hover {
    border-color: #4267B2;
    color: #4267B2;
}

/* Login Section */
.login-section {
    text-align: center;
}

.login-text {
    color: #666;
    font-size: 14px;
    margin: 0;
}

.login-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.login-link:hover {
    color: #5a6fd8;
}

/* Responsive */
@media (max-width: 480px) {
    .register-content {
        padding: 10px;
    }

    .brand-section,
    .form-section {
        padding: 30px 20px;
    }

    .brand-title {
        font-size: 24px;
    }

    .form-title {
        font-size: 20px;
    }
}
</style>