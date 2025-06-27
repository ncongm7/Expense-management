<template>
    <div class="setting-theme">
        <h3>Giao diện</h3>
        <label>
            <input type="checkbox" v-model="dark" @change="toggleTheme" /> Chế độ tối
        </label>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const dark = ref(localStorage.getItem('theme') === 'dark')
function toggleTheme() {
    localStorage.setItem('theme', dark.value ? 'dark' : 'light')
    document.body.classList.toggle('dark', dark.value)
}
onMounted(() => {
    document.body.classList.toggle('dark', dark.value)
})
</script>

<style scoped>
.setting-theme {
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