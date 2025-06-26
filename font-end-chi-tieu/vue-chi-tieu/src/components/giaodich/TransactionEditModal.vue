<template>
    <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sửa giao dịch</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label class="form-label">Số tiền (₫)</label>
                            <input v-model.number="editForm.amount" type="number" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Danh mục</label>
                            <select v-model="editForm.categoryId" class="form-select" required>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                    {{ cat.icon }} {{ cat.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ghi chú</label>
                            <input v-model="editForm.notes" type="text" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ngày</label>
                            <input v-model="editForm.spentAt" type="date" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Loại</label>
                            <select v-model="editForm.type" class="form-select" required>
                                <option value="expense">Chi tiêu</option>
                                <option value="income">Thu nhập</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Upload Ảnh Hóa đơn</label>
                            <input type="file" accept="image/*" @change="handleFileUpload" class="form-control" />
                            <div v-if="editForm.receiptUrl" class="mt-2">
                                <img :src="editForm.receiptUrl" alt="Hóa đơn"
                                    style="width:60px;height:60px;object-fit:cover" />
                            </div>
                        </div>
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, watch, onUnmounted } from 'vue';

const props = defineProps({
    transaction: {
        type: Object,
        default: null
    },
    categories: {
        type: Array,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['transaction-updated']);
const modalRef = ref(null);
const editForm = ref({});
const editFile = ref(null);
let modalInstance = null;

const handleFileUpload = (event) => {
    editFile.value = event.target.files[0];
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('type', editForm.value.type);
        formData.append('amount', editForm.value.amount);
        formData.append('categoryId', editForm.value.categoryId);
        formData.append('notes', editForm.value.notes);
        formData.append('spentAt', editForm.value.spentAt);
        if (editFile.value) formData.append('receipt', editFile.value);

        emit('transaction-updated', {
            id: editForm.value.id,
            formData: formData
        });
    } catch (err) {
        console.error('Lỗi cập nhật giao dịch:', err);
    }
};

watch(() => props.show, (newShow) => {
    if (modalRef.value) {
        if (newShow) {
            if (props.transaction) {
                editForm.value = { ...props.transaction };
                editFile.value = null;
            }
            nextTick(() => {
                if (!modalInstance) {
                    modalInstance = new window.bootstrap.Modal(modalRef.value, { backdrop: 'static' });
                }
                modalInstance.show();
            });
        } else {
            if (modalInstance) {
                modalInstance.hide();
                if (document.activeElement) document.activeElement.blur();
            }
        }
    }
});

onUnmounted(() => {
    if (modalInstance) {
        modalInstance.dispose();
        modalInstance = null;
    }
});
</script>