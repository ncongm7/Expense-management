<template>
    <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết giao dịch</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="transaction">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <b>Loại:</b> {{ transaction.type === 'expense' ? 'Chi tiêu' : 'Thu nhập' }}
                        </li>
                        <li class="list-group-item">
                            <b>Số tiền:</b> {{ transaction.amount.toLocaleString('vi-VN') }} ₫
                        </li>
                        <li class="list-group-item">
                            <b>Danh mục:</b> {{ transaction.categoryName }}
                        </li>
                        <li class="list-group-item">
                            <b>Ghi chú:</b> {{ transaction.notes || '-' }}
                        </li>
                        <li class="list-group-item">
                            <b>Ngày:</b> {{ formatDate(transaction.spentAt) }}
                        </li>
                        <li class="list-group-item">
                            <b>Hóa đơn:</b>
                            <span v-if="transaction.receiptUrl">
                                <img :src="transaction.receiptUrl" alt="Hóa đơn"
                                    style="width:80px;height:80px;object-fit:cover;cursor:pointer"
                                    @click="showReceipt(transaction.receiptUrl)" />
                            </span>
                            <span v-else class="text-muted">---</span>
                        </li>
                    </ul>
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

const emit = defineEmits(['show-receipt']);

const modalRef = ref(null);
let modalInstance = null;

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
};

const showReceipt = (url) => {
    emit('show-receipt', url);
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