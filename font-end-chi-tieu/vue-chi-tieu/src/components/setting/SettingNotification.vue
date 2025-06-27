<template>
    <div class="setting-notification">
        <h3>Cài đặt thông báo</h3>
        <label class="switch-label">
            <label>
                <input type="checkbox" v-model="enabled" @change="save" /> Bật thông báo nhắc nhở
            </label>
        </label>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const enabled = ref(localStorage.getItem('notify') === '1')
function save() {
    localStorage.setItem('notify', enabled.value ? '1' : '0')
    alert('Đã lưu cài đặt thông báo!')
}
</script>

<style scoped>
.setting-notification {
    margin-bottom: 2rem;
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

label {
    font-weight: 500;
}
</style>