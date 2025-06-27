<template>
    <div class="setting-profile">
        <h3>Thông tin cá nhân</h3>
        <form @submit.prevent="saveProfile">
            <div class="form-group">
                <label>Họ tên</label>
                <input v-model="form.name" type="text" class="input" />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" class="input" />
            </div>
            <div class="form-group">
                <label>Ảnh đại diện (URL)</label>
                <input v-model="form.avatar" type="url" class="input" />
            </div>
            <button class="btn" type="submit">Lưu</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const user = JSON.parse(localStorage.getItem('user') || '{}')
const form = ref({
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || ''
})
function saveProfile() {
    // Lưu vào localStorage (hoặc gọi API backend nếu có)
    localStorage.setItem('user', JSON.stringify({ ...user, ...form.value }))
    alert('Đã lưu thông tin cá nhân!')
}
</script>

<style scoped>
.setting-profile {
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