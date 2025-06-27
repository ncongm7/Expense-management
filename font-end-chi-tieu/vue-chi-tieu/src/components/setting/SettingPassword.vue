<template>
    <div class="setting-password">
        <h3>Đổi mật khẩu</h3>
        <form @submit.prevent="changePassword">
            <div class="form-group">
                <label>Mật khẩu cũ</label>
                <input v-model="oldPassword" type="password" class="input" />
            </div>
            <div class="form-group">
                <label>Mật khẩu mới</label>
                <input v-model="newPassword" type="password" class="input" />
            </div>
            <button class="btn" type="submit">Đổi mật khẩu</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const oldPassword = ref('')
const newPassword = ref('')
function changePassword() {
    // Giả lập đổi mật khẩu
    alert('Đổi mật khẩu thành công!')
    oldPassword.value = ''
    newPassword.value = ''
}
</script>

<style scoped>
.setting-password {
    margin-bottom: 2rem;
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

.form-group {
    margin-bottom: 1rem;
}

.input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.btn {
    background: #6366f1;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 24px;
    font-weight: 600;
}
</style>