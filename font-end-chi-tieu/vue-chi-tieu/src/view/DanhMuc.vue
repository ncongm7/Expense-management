<template>
    <div class="danhmuc-container">
             
        <form @submit.prevent="handleSubmit" class="form-card">
            <h2 class="form-title">Thêm Danh Mục</h2>
            <div class="form-group">
                <label>Tên danh mục</label>
                <input v-model="form.name" type="text" required class="input" placeholder="Nhập tên danh mục" />
            </div>
            <div class="form-group">
                <label>Biểu tượng (emoji)</label>
                <div class="emoji-input-group">
                    <input v-model="form.icon" type="text" class="input emoji-input" placeholder="Chọn emoji" readonly
                        @focus="showEmoji = true" @click="showEmoji = true" />
                    <button type="button" class="emoji-btn" @click="showEmoji = !showEmoji">
                        <span v-if="form.icon">{{ form.icon }}</span>
                        <span v-else>😀</span>
                    </button>
                </div>
                <div v-if="showEmoji" class="emoji-picker-wrapper">
                    <emoji-picker @emoji-click="onEmojiClick" />
                </div>
            </div>
            <button type="submit" class="btn-submit">Lưu danh mục</button>
        </form>
        

        <div class="table-section">
            <h3 class="table-title">Danh sách Danh Mục</h3>
            <div class="table-responsive">
                <table class="danhmuc-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Biểu tượng</th>
                            <th>Tên danh mục</th>
                            <th>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(cat, idx) in categories" :key="cat.id">
                            <td>{{ idx + 1 }}</td>
                            <td class="emoji-cell">{{ cat.icon }}</td>
                            <td>{{ cat.name }}</td>
                            <td>{{ cat.userName }}</td>
                        </tr>
                        <tr v-if="categories.length === 0">
                            <td colspan="4" class="text-center empty-row">Chưa có danh mục nào.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

// ...existing code...
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import 'emoji-picker-element'
import CategoryService from '../service/categoryService'

const form = ref({
    name: '',
    icon: ''
})
const categories = ref([])
const showEmoji = ref(false)

const fetchCategories = async () => {
    try {
        const response = await CategoryService.getCategories()
        categories.value = Array.isArray(response) ? response : (response.data || [])
    } catch (err) {
        categories.value = []
    }
}

const handleSubmit = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const userId = user?.id
        if (!userId) {
            alert('Không tìm thấy thông tin người dùng!')
            return
        }
        const data = {
            ...form.value,
            user: { id: userId }
        }
        await CategoryService.createCategory(data)
        alert('Danh mục đã được lưu!')
        form.value = { name: '', icon: '' }
        fetchCategories()
    } catch (err) {
        alert('Không thể lưu danh mục.')
    }
}

const onEmojiClick = (event) => {
    form.value.icon = event.detail.unicode
    showEmoji.value = false
}

const handleClickOutside = (e) => {
    const picker = document.querySelector('.emoji-picker-wrapper')
    const input = document.querySelector('.emoji-input')
    if (picker && !picker.contains(e.target) && input && !input.contains(e.target)) {
        showEmoji.value = false
    }
}

onMounted(() => {
    fetchCategories()
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
// ...existing code...


<style scoped>
.danhmuc-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem 0 3rem 0;
}

.form-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 16px 0 rgba(80, 80, 180, 0.08);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    margin-bottom: 2.5rem;
}

.form-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
    color: #4f46e5;
    text-align: center;
}

.form-group {
    margin-bottom: 1.2rem;
}

.input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
}

.input:focus {
    border-color: #4f46e5;
}

.emoji-input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
}

.emoji-input {
    cursor: pointer;
    background: #f9fafb;
}

.emoji-btn {
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 10px;
    height: 38px;
    display: flex;
    align-items: center;
    transition: background 0.2s;
}

.emoji-btn:hover {
    background: #e0e7ff;
}

.emoji-picker-wrapper {
    position: absolute;
    z-index: 100;
    top: 48px;
    left: 0;
    box-shadow: 0 2px 16px 0 rgba(80, 80, 180, 0.12);
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    width: 320px;
    max-width: 95vw;
}

.btn-submit {
    background: linear-gradient(90deg, #6366f1, #4f46e5);
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 12px 0;
    width: 100%;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.08);
    transition: background 0.2s;
}

.btn-submit:hover {
    background: linear-gradient(90deg, #4f46e5, #6366f1);
}

.table-section {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 16px 0 rgba(80, 80, 180, 0.08);
    padding: 1.5rem 1rem;
}

.table-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #4f46e5;
}

.table-responsive {
    overflow-x: auto;
}

.danhmuc-table {
    width: 100%;
    border-collapse: collapse;
    background: #f9fafb;
    border-radius: 12px;
    overflow: hidden;
}

.danhmuc-table th,
.danhmuc-table td {
    padding: 10px 12px;
    text-align: left;
}

.danhmuc-table thead {
    background: #e0e7ff;
}

.emoji-cell {
    font-size: 1.5rem;
    text-align: center;
}

.empty-row {
    color: #b0b0b0;
    font-style: italic;
}

@media (max-width: 600px) {

    .form-card,
    .table-section {
        padding: 1rem 0.3rem;
    }

    .emoji-picker-wrapper {
        left: 0;
        width: 98vw;
        min-width: 220px;
    }
}
</style>