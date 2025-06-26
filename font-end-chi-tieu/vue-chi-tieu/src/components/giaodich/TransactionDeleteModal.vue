<template>
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Xác nhận xóa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Bạn có chắc chắn muốn xóa giao dịch này không?</p>
                    <div v-if="transaction" class="alert alert-warning">
                        <strong>Chi tiết giao dịch:</strong><br>
                        Loại: {{ transaction.type === 'expense' ? 'Chi tiêu' : 'Thu nhập' }}<br>
                        Số tiền: {{ transaction.amount.toLocaleString('vi-VN') }} ₫<br>
                        Danh mục: {{ transaction.categoryName }}<br>
                        Ngày: {{ formatDate(transaction.spentAt) }}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-danger" @click="confirmDelete">Xóa</button>
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
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['transaction-deleted']);

const modalRef = ref(null);
let modalInstance = null;

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
};

const confirmDelete = () => {
    if (props.transaction) {
        emit('transaction-deleted', props.transaction);
    }
};

watch(() => props.show, (newShow) => {
    if (modalRef.value) {
        if (newShow) {
            nextTick(() => {
                if (!modalInstance) {
                    modalInstance = new window.bootstrap.Modal(modalRef.value, { backdrop: 'static' });
                }
                modalInstance.show();
            });
        } else {
            if (modalInstance) {
                modalInstance.hide();
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