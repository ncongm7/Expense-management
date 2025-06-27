<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-dialog card shadow-lg rounded-4 p-4"
            style="background: linear-gradient(135deg, #f9fafb, #e0f2f7);" @click.stop>
            <h4 class="fw-bold mb-4 text-primary" style="color: #1e3a8a; font-family: 'Poppins', sans-serif;">{{ goal ?
                'Chỉnh sửa' : 'Thêm' }} mục tiêu</h4>
            <form @submit.prevent="submitForm" @click.stop class="needs-validation">
                <div class="mb-4">
                    <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Tên mục
                        tiêu</label>
                    <input v-model="form.name" type="text" class="form-control form-control-lg border-0 bg-white"
                        required />
                </div>
                <div class="mb-4">
                    <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Số tiền
                        mục tiêu</label>
                    <input v-model.number="form.amount" type="number"
                        class="form-control form-control-lg border-0 bg-white" min="1000" required />
                </div>
                <div class="mb-4">
                    <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Đã tiết
                        kiệm</label>
                    <input v-model.number="form.saved" type="number"
                        class="form-control form-control-lg border-0 bg-white" min="0" required />
                </div>
                <div class="mb-4 row g-3">
                    <div class="col-6">
                        <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Ngày
                            bắt đầu</label>
                        <input v-model="form.startDate" type="date"
                            class="form-control form-control-lg border-0 bg-white" required />
                    </div>
                    <div class="col-6">
                        <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Ngày
                            kết thúc</label>
                        <input v-model="form.endDate" type="date" class="form-control form-control-lg border-0 bg-white"
                            required />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label text-dark fw-semibold" style="font-family: 'Roboto', sans-serif;">Ảnh đại
                        diện (URL)</label>
                    <input v-model="form.image" type="url" class="form-control form-control-lg border-0 bg-white"
                        placeholder="Dán link ảnh hoặc icon..." />
                </div>
                <div class="d-flex justify-content-end gap-3 mt-5">
                    <button type="button" class="btn btn-outline-secondary btn-lg rounded-pill px-4"
                        style="font-family: 'Poppins', sans-serif;" @click="$emit('close')">Đóng</button>
                    <button type="submit" class="btn btn-primary btn-lg rounded-pill px-4"
                        style="background-color: #1e3a8a; border: none; font-family: 'Poppins', sans-serif;">Lưu</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
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
    transition: backdrop-filter 0.3s ease;
    overflow: hidden;
}

.modal-dialog {
    min-width: 400px;
    max-width: 98vw;
    border-radius: 1.5rem;
    transform: scale(1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    margin: 0 !important;
}

.modal-dialog:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.form-control {
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #1e3a8a;
    box-shadow: 0 0 0 0.2rem rgba(30, 58, 138, 0.25);
    background-color: #ffffff;
}

.btn {
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: scale(1.05);
    opacity: 0.9;
}

.text-primary {
    color: #1e3a8a !important;
}

.text-dark {
    color: #1f2937 !important;
}

.fw-semibold {
    font-weight: 600;
}
</style>