<template>
  <div class="container py-4">
    <!-- Form thêm giao dịch -->
    <TransactionForm :categories="categories" @transaction-added="handleTransactionAdded" />

    <!-- Bộ lọc và tìm kiếm -->
    <TransactionFilter :categories="categories" :filters="filters" @filter-changed="handleFilterChanged"
      @reset-filters="resetFilters" @refresh-data="fetchTransactions" />

    <!-- Tổng hợp số tiền -->
    <TransactionSummary :transactions="filteredTransactions" />

    <!-- Danh sách giao dịch -->
    <TransactionTable :transactions="filteredTransactions" :page-size="pageSize" @show-detail="showDetail"
      @show-receipt="showReceipt" @edit-transaction="editTransaction" @delete-transaction="confirmDelete"
      @download-excel="downloadExcel" />

    <!-- Biểu đồ chi tiêu -->
    <TransactionChart :transactions="filteredTransactions" />

    <!-- Các modal được teleport để tránh lỗi aria-hidden -->
    <TransactionDetailModal :transaction="selectedTransaction" :show="showDetailModal" @close="showDetailModal = false"
      @show-receipt="showReceipt" />

    <ReceiptViewModal :receipt-url="receiptUrl" :show="showReceiptModal" @close="showReceiptModal = false" />

    <TransactionDeleteModal :transaction="transactionToDelete" :show="showDeleteModal"
      @transaction-deleted="deleteTransaction" @close="showDeleteModal = false" />

    <TransactionEditModal :transaction="transactionToEdit" :categories="categories" :show="showEditModal"
      @transaction-updated="submitEdit" @close="showEditModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from "vue-toastification";

import transactionService from '../service/transactionService.js';
import categoryService from '../service/categoryService.js';

import TransactionForm from '../components/giaodich/TransactionForm.vue';
import TransactionFilter from '../components/giaodich/TransactionFilter.vue';
import TransactionChart from '../components/giaodich/TransactionChart.vue';
import TransactionSummary from '../components/giaodich/TransactionSummary.vue';
import TransactionTable from '../components/giaodich/TransactionTable.vue';
import TransactionDetailModal from '../components/giaodich/TransactionDetailModal.vue';
import TransactionEditModal from '../components/giaodich/TransactionEditModal.vue';
import TransactionDeleteModal from '../components/giaodich/TransactionDeleteModal.vue';
import ReceiptViewModal from '../components/giaodich/ReceiptViewModal.vue';
import axios from 'axios';

const categories = ref([]);
const transactions = ref([]);
const filters = ref({ type: '', categoryId: '', fromDate: '', toDate: '', search: '' });

const selectedTransaction = ref(null);
const transactionToDelete = ref(null);
const transactionToEdit = ref(null);
const receiptUrl = ref('');

const showDetailModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showReceiptModal = ref(false);

const pageSize = 10;
const toast = useToast();

const filteredTransactions = computed(() => {
  let arr = transactions.value;
  if (filters.value.search) {
    const s = filters.value.search.toLowerCase();
    arr = arr.filter(t => (t.notes || '').toLowerCase().includes(s) || (t.categoryName || '').toLowerCase().includes(s));
  }
  return arr;
});

const fetchCategories = async () => {
  try {
    categories.value = await categoryService.getCategories();
  } catch (err) {
    console.error('Lỗi tải danh mục:', err);
  }
};

const fetchTransactions = async () => {
  try {
    transactions.value = await transactionService.getTransactions(filters.value);
  } catch (err) {
    console.error('Lỗi tải giao dịch:', err);
  }
};

const resetFilters = () => {
  filters.value = { type: '', categoryId: '', fromDate: '', toDate: '', search: '' };
  fetchTransactions();
};

const handleFilterChanged = (newFilters) => {
  filters.value = newFilters;
  fetchTransactions();
};

const handleTransactionAdded = async (formData) => {
  try {
    await axios.post('https://expense-backend.up.railway.app/transactions/post', formData);
    fetchTransactions();
    toast.success("Thêm giao dịch thành công!");
  } catch (err) {
    console.error('Lỗi lưu giao dịch:', err);
    toast.error("Thêm giao dịch thất bại!");
  }
};

const showDetail = (transaction) => {
  selectedTransaction.value = transaction;
  showDetailModal.value = true;
};

const showReceipt = (url) => {
  receiptUrl.value = url;
  showReceiptModal.value = true;
};

const confirmDelete = (transaction) => {
  transactionToDelete.value = transaction;
  showDeleteModal.value = true;
};

const deleteTransaction = async () => {
  try {
    await transactionService.deleteTransaction(transactionToDelete.value.id);
    fetchTransactions();
    showDeleteModal.value = false;
  } catch (err) {
    console.error('Lỗi xóa giao dịch:', err);
  }
};

const editTransaction = (transaction) => {
  transactionToEdit.value = transaction;
  showEditModal.value = true;
};

const submitEdit = async ({ id, formData }) => {
  try {
    await transactionService.updateTransaction(id, formData);
    fetchTransactions();
    showEditModal.value = false;
  } catch (err) {
    console.error('Lỗi cập nhật giao dịch:', err);
  }
};

const downloadExcel = () => {
  const rows = [
    ['Loại', 'Số tiền', 'Danh mục', 'Ghi chú', 'Ngày'],
    ...filteredTransactions.value.map(t => [
      t.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
      t.amount,
      t.categoryName,
      t.notes,
      new Date(t.spentAt).toLocaleDateString('vi-VN')
    ])
  ];

  const csv = rows.map(r => r.map(x => '"' + (x || '') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'giao_dich.csv';
  a.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  fetchCategories();
  fetchTransactions();
});
</script>

<style scoped>
.animate-fade {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
