<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-dialog card shadow-lg rounded-4 p-4"
            style="background: linear-gradient(135deg, #f9fafb, #e0f2f7);" @click.stop>
            <h4 class="modal-title mb-4">{{ goal ? 'Chỉnh sửa' : 'Thêm' }} mục tiêu</h4>
            <form @submit.prevent="submitForm" @click.stop>
                <div class="mb-4">
                    <label class="form-label">Tên mục tiêu</label>
                    <input v-model="form.title" type="text" class="form-control" required />
                </div>
                <div class="mb-4">
                    <label class="form-label">Số tiền mục tiêu</label>
                    <input v-model.number="form.targetAmount" type="number" class="form-control" min="1000" required />
                </div>
                <div class="mb-4">
                    <label class="form-label">Đã tiết kiệm</label>
                    <input v-model.number="form.currentAmount" type="number" class="form-control" min="0" required />
                </div>
                <div class="mb-4 row g-3">
                    <div class="col-6">
                        <label class="form-label">Ngày bắt đầu</label>
                        <input v-model="form.createdAt" type="date" class="form-control" required />
                    </div>
                    <div class="col-6">
                        <label class="form-label">Ngày kết thúc</label>
                        <input v-model="form.deadline" type="date" class="form-control" required />
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label">Ảnh mục tiêu</label>
                    <div class="image-upload-container">
                        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*"
                            class="form-control" style="display: none;" />
                        <div class="upload-area" @click="$refs.fileInput.click()">
                            <div v-if="!form.urlImage" class="upload-placeholder">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click để chọn ảnh</p>
                            </div>
                            <img v-else :src="form.urlImage" alt="Ảnh mục tiêu" class="preview-image" />
                        </div>
                        <div v-if="uploading" class="upload-progress">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Đang tải...</span>
                            </div>
                            <span class="ms-2">Đang tải ảnh lên...</span>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-3 mt-5">
                    <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">Đóng</button>
                    <button type="submit" class="btn btn-primary" @click="$emit('save')">Lưu</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { validateGoal } from '../../utils/goalValidator.js';
import { uploadImageToCloudinary } from '@/utils/image/uploadImageToCloud.js';


const props = defineProps({
    goal: { type: Object, default: null }
});
const emit = defineEmits(['save', 'close']);

const form = ref({

});

const uploading = ref(false);
const fileInput = ref(null);

const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    uploading.value = true; // Hiển thị loading
    try {
        const url = await uploadImageToCloudinary(file);
        form.value.urlImage = url;
        console.log('Ảnh đã được tải lên:', url);
    } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        alert('Không thể upload ảnh. Vui lòng thử lại.');
    } finally {
        uploading.value = false; // Ẩn loading
    }
}

watch(() => props.goal, (val) => {
    if (val) {
        form.value = { ...val };
    } else {
        form.value = { name: '', amount: 0, saved: 0, startDate: '', endDate: '', image: '' };
    }
}, { immediate: true });

function submitForm() {
    console.log('Submitting form:', form.value); // Debug
    const result = validateGoal(form.value);
    if (!result.valid) {
        alert(result.message);
        return;
    }
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id 
   
    if (!userId) {
        alert('Vui lòng đăng nhập lại!');
        return;
    }
    emit('save', { ...form.value, userId: userId });
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
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    font-family: 'Inter', sans-serif;
    pointer-events: auto;
}

.modal-dialog {
    min-width: 300px;
    /* Giảm thêm từ 320px */
    max-width: 85vw;
    /* Giảm từ 90vw */
    border-radius: 1.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    margin: 0 !important;
    font-family: 'Inter', sans-serif;
    animation: modal-appear 0.3s ease-out;
    z-index: 1001;
    pointer-events: auto;
    padding: 1rem;
    /* Giảm từ 1.5rem */
    max-height: 80vh;
    /* Giới hạn chiều cao tối đa */
    overflow-y: auto;
    /* Cho phép cuộn nếu cần */
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
    font-size: 1.3rem;
    /* Giảm từ 1.5rem */
    letter-spacing: -0.5px;
    margin-bottom: 1rem;
    /* Giảm từ mb-4 */
}

.form-label {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
    /* Giảm từ 0.5rem */
    display: block;
    font-size: 0.9rem;
    /* Giảm từ 0.95rem */
    z-index: 1002;
    pointer-events: auto;
}

.form-control {
    border-radius: 0.5rem;
    /* Giảm từ 0.75rem */
    padding: 0.5rem 0.75rem;
    /* Giảm từ 0.75rem 1rem */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
    /* Giảm từ 1rem */
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    width: 100%;
    z-index: 1002;
    pointer-events: auto;
}

.form-control:focus {
    z-index: 1002;
    border-color: #1e3a8a;
    box-shadow: 0 0 0 0.2rem rgba(30, 58, 138, 0.25);
    background-color: #ffffff;
}

.btn {
    font-size: 0.9rem;
    /* Giảm từ 0.95rem */
    transition: all 0.3s ease;
    padding: 0.5rem 1.25rem;
    /* Giảm từ 0.65rem 1.5rem */
    border-radius: 1.5rem;
    /* Giảm từ 2rem */
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

/* CSS cho upload ảnh */
.image-upload-container {
    position: relative;
    max-height: 150px;
    /* Giảm từ 200px */
    overflow: hidden;
}

.upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    /* Giảm từ 0.75rem */
    padding: 1rem;
    /* Giảm từ 1.5rem */
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #f9fafb;
    min-height: 80px;
    /* Giảm từ 100px */
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-area:hover {
    border-color: #1e3a8a;
    background-color: #f0f9ff;
}

.upload-placeholder {
    color: #6b7280;
}

.upload-placeholder i {
    font-size: 1.2rem;
    /* Giảm từ 1.5rem */
    margin-bottom: 0.25rem;
    /* Giảm từ 0.5rem */
    display: block;
}

.preview-image {
    max-width: 100%;
    max-height: 120px;
    /* Giảm từ 150px */
    border-radius: 0.5rem;
    object-fit: cover;
}

.upload-progress {
    margin-top: 0.75rem;
    /* Giảm từ 1rem */
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e3a8a;
    font-size: 0.85rem;
    /* Giảm từ 0.9rem */
}
</style>