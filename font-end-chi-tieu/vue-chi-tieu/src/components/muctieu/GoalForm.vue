<template>
    <div class="modal-backdrop" @click.self="emit('close')">
        <div ref="modalContent" class="modal-dialog card shadow-lg rounded-4 p-4"
            style="background: linear-gradient(135deg, #f9fafb, #e0f2f7);">
            <h4 class="modal-title mb-4">{{ goal ? 'Chỉnh sửa' : 'Thêm' }} mục tiêu</h4>
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label class="form-label">Tên mục tiêu</label>
                    <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="mb-4">
                    <label class="form-label">Số tiền mục tiêu</label>
                    <input v-model.number="form.amount" type="number" class="form-control" min="1000" required />
                </div>
                <div class="mb-4">
                    <label class="form-label">Đã tiết kiệm</label>
                    <input v-model.number="form.saved" type="number" class="form-control" min="0" required />
                </div>
                <div class="mb-4 row g-3">
                    <div class="col-6">
                        <label class="form-label">Ngày bắt đầu</label>
                        <input v-model="form.startDate" type="date" class="form-control" required />
                    </div>
                    <div class="col-6">
                        <label class="form-label">Ngày kết thúc</label>
                        <input v-model="form.endDate" type="date" class="form-control" required />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label">Ảnh đại diện (URL)</label>
                    <input v-model="form.image" type="url" class="form-control"
                        placeholder="Dán link ảnh hoặc icon..." />
                </div>
                <div class="d-flex justify-content-end gap-3 mt-5">
                    <button type="button" class="btn btn-outline-secondary" @click="emit('close')">Đóng</button>
                    <button type="submit" class="btn btn-primary">Lưu</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { validateGoal } from '../../utils/goalValidator.js';

const props = defineProps({
    goal: { type: Object, default: null }
});
const emit = defineEmits(['save', 'close']);

const form = ref({
    name: '',
    amount: 0,
    saved: 0,
    startDate: '',
    endDate: '',
    image: ''
});

const modalContent = ref(null);

// Most reliable solution for click-outside detection
const handleBackdropClick = (event) => {
    if (modalContent.value && !modalContent.value.contains(event.target)) {
        emit('close');
    }
};

// Alternative: Keyboard escape handler
const handleKeydown = (event) => {
    if (event.key === 'Escape') {
        emit('close');
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});

watch(() => props.goal, (val) => {
    if (val) {
        form.value = { ...val };
    } else {
        form.value = { name: '', amount: 0, saved: 0, startDate: '', endDate: '', image: '' };
    }
}, { immediate: true });

function submitForm() {
    const result = validateGoal(form.value);
    if (!result.valid) {
        alert(result.message);
        return;
    }
    emit('save', { ...form.value, id: props.goal?.id });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    overflow: hidden;
    font-family: 'Inter', sans-serif;
}

.modal-dialog {
    min-width: 400px;
    max-width: 98vw;
    border-radius: 1.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    margin: 0 !important;
    font-family: 'Inter', sans-serif;
    animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-title {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
}

.form-label {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: block;
    font-size: 0.95rem;
}

.form-control {
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    width: 100%;
}

.form-control:focus {
    border-color: #1e3a8a;
    box-shadow: 0 0 0 0.2rem rgba(30, 58, 138, 0.25);
    background-color: #ffffff;
}

.btn {
    font-size: 0.95rem;
    transition: all 0.3s ease;
    padding: 0.65rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
    letter-spacing: -0.25px;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
    background-color: #1e3a8a;
    border: none;
}

.btn-primary:hover {
    background-color: #1a3375;
}

.btn-outline-secondary {
    border-color: #d1d5db;
    color: #4b5563;
}

.btn-outline-secondary:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
}
</style>