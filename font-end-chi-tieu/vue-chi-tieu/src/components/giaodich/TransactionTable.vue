<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 mb-0">Danh sách giao dịch</h3>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-success btn-sm" @click="downloadExcel">
                        <i class="fas fa-file-excel"></i> Tải Excel
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Loại</th>
                            <th>Số tiền</th>
                            <th>Danh mục</th>
                            <th>Ghi chú</th>
                            <th>Ngày</th>
                            <!-- <th>Hóa đơn</th> -->
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(gd, idx) in paginatedTransactions" :key="gd.id" @click="showDetail(gd)"
                            style="cursor:pointer">
                            <td>{{ idx + 1 + (currentPage - 1) * pageSize }}</td>
                            <td>
                                <span v-if="gd.type === 'expense'" class="badge bg-danger">Chi tiêu</span>
                                <span v-else class="badge bg-success">Thu nhập</span>
                            </td>
                            <td :class="gd.type === 'expense' ? 'text-danger fw-bold' : 'text-success fw-bold'">
                                {{ formatCurrency(gd.amount) }}
                            </td>
                            <td>{{ gd.categoryName || '---' }}</td>
                            <td :class="!gd.note ? 'text-muted fst-italic' : ''">{{ gd.note || '-' }}</td>
                            <td>{{ formatDate(gd.spentAt) }}</td>
                            <!-- <td>
                                    <span v-if="gd.receiptUrl">
                                        <img :src="gd.receiptUrl" alt="Hóa đơn"
                                            style="width:32px;height:32px;object-fit:cover;cursor:pointer"
                                            @click.stop="showReceipt(gd.receiptUrl)" />
                                    </span>
                                    <span v-else class="text-muted">---</span>
                                </td> -->
                            <td>
                                <button class="btn btn-sm btn-warning me-1" @click.stop="editTransaction(gd)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" @click.stop="confirmDelete(gd)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="paginatedTransactions.length === 0">
                            <td colspan="8" class="text-center text-muted">Không có giao dịch nào phù hợp.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination -->
            <nav v-if="totalPages > 1" class="mt-3">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="gotoPage(currentPage - 1)"
                            :disabled="currentPage === 1">&laquo;</button>
                    </li>
                    <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: currentPage === p }">
                        <button class="page-link" @click="gotoPage(p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="gotoPage(currentPage + 1)"
                            :disabled="currentPage === totalPages">&raquo;</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { formatCurrency } from '../../utils/currencyFormatter.js';

const props = defineProps({
    transactions: {
        type: Array,
        required: true
    },
    pageSize: {
        type: Number,
        default: 10
    }
});

const emit = defineEmits(['show-detail', 'show-receipt', 'edit-transaction', 'delete-transaction', 'download-excel']);

const currentPage = ref(1);

const sortedTransactions = computed(() => {
    // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
    return [...props.transactions].sort((a, b) => new Date(b.spentAt) - new Date(a.spentAt));
});

const totalPages = computed(() => Math.ceil(sortedTransactions.value.length / props.pageSize));

const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * props.pageSize;
    return sortedTransactions.value.slice(start, start + props.pageSize);
});

// Reset to first page when transactions change
watch(() => props.transactions, () => {
    currentPage.value = 1;
});

const gotoPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
};

const showDetail = (transaction) => {
    emit('show-detail', transaction);
};

const showReceipt = (url) => {
    emit('show-receipt', url);
};

const editTransaction = (transaction) => {
    emit('edit-transaction', transaction);
};

const confirmDelete = (transaction) => {
    emit('delete-transaction', transaction);
};

const downloadExcel = () => {
    emit('download-excel');
};

function getTypeIcon(type) {
    return type === 'income' ? 'bi-arrow-up-circle-fill text-success' : 'bi-arrow-down-circle-fill text-danger';
}

function getTypeText(type) {
    return type === 'income' ? 'Thu nhập' : 'Chi tiêu';
}
</script>