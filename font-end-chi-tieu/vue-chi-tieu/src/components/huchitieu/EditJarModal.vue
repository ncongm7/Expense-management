<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3><i class="bi bi-pencil"></i> Chỉnh Sửa Hũ</h3>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>Tên hiển thị</label>
                    <input v-model="formData.jarDisplayName" type="text" class="form-control"
                        placeholder="Tên hiển thị của hũ">
                </div>

                <div class="form-group">
                    <label>Icon</label>
                    <input v-model="formData.icon" type="text" class="form-control"
                        placeholder="Emoji icon (ví dụ: 🏠)">
                </div>

                <div class="form-group">
                    <label>Key số (1-5)</label>
                    <input v-model="formData.shortcode" type="text" class="form-control"
                        placeholder="Key số để phân loại nhanh (1, 2, 3, 4, 5)" maxlength="1">
                    <small class="form-help">Key này sẽ được dùng để tự động phân loại giao dịch</small>
                </div>

                <div class="form-group">
                    <label>Màu sắc</label>
                    <input v-model="formData.color" type="color" class="form-control color-picker">
                </div>

                <div class="form-group">
                    <label>Tỷ lệ phân bổ (%)</label>
                    <input v-model="formData.percentage" type="number" class="form-control" min="0" max="100"
                        step="0.01" placeholder="Tỷ lệ phần trăm">
                </div>

                <div class="form-group">
                    <label>Mô tả</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"
                        placeholder="Mô tả về mục đích của hũ"></textarea>
                </div>

                <div class="form-group">
                    <label>Số tiền hiện tại</label>
                    <input v-model="formData.currentAmount" type="number" class="form-control"
                        placeholder="Số tiền hiện tại trong hũ">
                </div>

                <div class="form-group">
                    <label>Mục tiêu</label>
                    <input v-model="formData.targetAmount" type="number" class="form-control"
                        placeholder="Mục tiêu của hũ">
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn btn-outline-secondary" @click="$emit('close')">
                    Hủy
                </button>
                <button class="btn btn-primary" @click="updateJar" :disabled="!canUpdate">
                    <i class="bi bi-check-lg"></i>
                    Cập Nhật
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import moneyJarsService from '@/service/moneyJarsService.js'

const toast = useToast()

const props = defineProps({
    show: Boolean,
    jar: Object
})

const emit = defineEmits(['close', 'updated'])

const formData = ref({
    jarDisplayName: '',
    icon: '',
    shortcode: '',
    color: '#007bff',
    percentage: 0,
    description: '',
    currentAmount: 0,
    targetAmount: 0
})

const canUpdate = computed(() => {
    return formData.value.jarDisplayName &&
        formData.value.icon &&
        formData.value.shortcode &&
        formData.value.color &&
        formData.value.percentage >= 0 &&
        formData.value.percentage <= 100
})

// Watch for jar changes
watch(() => props.jar, (newJar) => {
    if (newJar) {
        formData.value = {
            jarDisplayName: newJar.jarDisplayName || '',
            icon: newJar.icon || '',
            shortcode: newJar.shortcode || '',
            color: newJar.color || '#007bff',
            percentage: newJar.percentage || 0,
            description: newJar.description || '',
            currentAmount: newJar.currentAmount || 0,
            targetAmount: newJar.targetAmount || 0
        }
    }
}, { immediate: true })

const updateJar = async () => {
    try {
        await moneyJarsService.updateJar(props.jar.id, formData.value)
        emit('updated')
        toast.success('Cập nhật hũ thành công!')
    } catch (error) {
        toast.error('Lỗi cập nhật hũ')
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #6c757d;
    cursor: pointer;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.5rem;
    font-size: 1rem;
}

.color-picker {
    height: 50px;
    padding: 0.5rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
    border-radius: 0 0 1rem 1rem;
}
</style>