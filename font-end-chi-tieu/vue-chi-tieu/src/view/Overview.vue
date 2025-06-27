<template>
    <div>

        <div class="container py-4">
            <!-- Tổng số dư -->
            <div class="mb-4">
                <div
                    class="card shadow-lg rounded-4 p-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3 bg-gradient-balance">
                    <div class="d-flex align-items-center gap-3">
                        <i class="bi bi-wallet2 fs-1 text-primary"></i>
                        <div>
                            <div class="fw-bold text-secondary">Tổng số dư</div>
                            <div class="fs-2 fw-bold text-balance balance-amount">
                                <span class="amount">{{ totalBalance | currency }}</span>
                                <span class="currency">₫</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        <span class="badge bg-success bg-opacity-75 px-3 py-2" v-if="balanceDiff !== null">
                            <i class="bi" :class="balanceDiff >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i>
                            {{ Math.abs(balanceDiff) | currency }}
                            <span class="ms-1">so với kỳ trước</span>
                        </span>
                    </div>
                </div>
            </div>
            <!-- Filter thời gian -->
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 class="fw-bold mb-0"><i class="bi bi-bar-chart-line me-2"></i>Tình hình thu chi</h2>
                <div class="btn-group" role="group" aria-label="Chọn thời gian">
                    <button v-for="f in filters" :key="f.value"
                        :class="['btn', 'btn-outline-primary', { active: selectedFilter === f.value }]"
                        @click="selectedFilter = f.value" :title="f.label">
                        <i :class="f.icon" class="me-1"></i>{{ f.label }}
                    </button>
                </div>
            </div>
            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
                <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <!-- Empty state -->
            <div v-else-if="transactions.length === 0" class="alert alert-info text-center my-5">
                <i class="bi bi-emoji-frown fs-2"></i><br />Không có giao dịch nào trong kỳ này.
            </div>
            <!-- Nội dung chính -->
            <div v-else>
                <div class="row g-4">
                    <div class="col-12 col-lg-7">
                        <div class="card shadow rounded-4 p-3 h-100">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-graph-up-arrow text-primary me-2"></i>
                                <span class="fw-bold">Biểu đồ thu chi</span>
                            </div>
                            <TransactionChart :transactions="transactions" />
                        </div>
                    </div>
                    <div class="col-12 col-lg-5">
                        <div class="card shadow rounded-4 p-3 h-100">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-pie-chart text-warning me-2"></i>
                                <span class="fw-bold">Tỷ lệ chi tiêu</span>
                            </div>
                            <PieChart :data="pieData" />
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <TransactionSummary :transactions="transactions" />
                </div>
            </div>
        </div>
        <button @click="goToGiaoDich" class="btn btn-primary rounded-circle position-fixed add-btn"
            title="Thêm giao dịch mới">
            <i class="bi bi-plus-lg"></i>
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

import TransactionSummary from '../components/giaodich/TransactionSummary.vue';
import TransactionChart from '../components/giaodich/TransactionChart.vue';
import PieChart from '../components/PieChart.vue';
import transactionService from '../service/transactionService.js';
import categoryService from '../service/categoryService.js';
import { useRouter } from 'vue-router';

const filters = [
    { value: 'today', label: 'Hôm nay', icon: 'bi-calendar-day' },
    { value: 'week', label: 'Tuần này', icon: 'bi-calendar-week' },
    { value: 'month', label: 'Tháng này', icon: 'bi-calendar-month' },
    { value: 'year', label: 'Năm nay', icon: 'bi-calendar3' },
];
const selectedFilter = ref('month');
const transactions = ref([]);
const categories = ref([]);
const pieData = ref([]);
const loading = ref(false);
const router = useRouter();

const totalBalance = computed(() => {
    let income = 0, expense = 0;
    transactions.value.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expense += t.amount;
    });
    return income - expense;
});

const balanceDiff = ref(null); // So sánh với kỳ trước

function getDateRange(filter) {
    const now = new Date();
    let fromDate, toDate;
    toDate = now.toISOString().slice(0, 10);
    if (filter === 'today') {
        fromDate = toDate;
    } else if (filter === 'week') {
        const first = now.getDate() - now.getDay() + 1;
        const monday = new Date(now.setDate(first));
        fromDate = monday.toISOString().slice(0, 10);
    } else if (filter === 'month') {
        fromDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    } else if (filter === 'year') {
        fromDate = `${now.getFullYear()}-01-01`;
    }
    return { fromDate, toDate };
}

async function fetchData() {
    loading.value = true;
    const { fromDate, toDate } = getDateRange(selectedFilter.value);
    transactions.value = await transactionService.getTransactions({ fromDate, toDate });
    categories.value = await categoryService.getCategories();
    // Pie chart data
    const expenseByCat = {};
    transactions.value.forEach(t => {
        if (t.type === 'expense') {
            expenseByCat[t.categoryName] = (expenseByCat[t.categoryName] || 0) + t.amount;
        }
    });
    pieData.value = Object.entries(expenseByCat).map(([label, value], idx) => ({
        label,
        value,
        color: [
            '#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#facc15', '#4ade80', '#38bdf8', '#818cf8'
        ][idx % 10]
    }));
    // So sánh kỳ trước
    let prevFrom, prevTo;
    if (selectedFilter.value === 'month') {
        const now = new Date();
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevFrom = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
        prevTo = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;
    } else if (selectedFilter.value === 'year') {
        const now = new Date();
        prevFrom = `${now.getFullYear() - 1}-01-01`;
        prevTo = `${now.getFullYear() - 1}-12-31`;
    } else {
        balanceDiff.value = null;
        loading.value = false;
        return;
    }
    const prevTrans = await transactionService.getTransactions({ fromDate: prevFrom, toDate: prevTo });
    let prevIncome = 0, prevExpense = 0;
    prevTrans.forEach(t => {
        if (t.type === 'income') prevIncome += t.amount;
        else if (t.type === 'expense') prevExpense += t.amount;
    });
    balanceDiff.value = (totalBalance.value) - (prevIncome - prevExpense);
    loading.value = false;
}

function goToGiaoDich() {
    router.push('/giaodich');
}

onMounted(fetchData);
watch(selectedFilter, fetchData);

// Currency filter
function currency(val) {
    if (typeof val !== 'number') return val;
    return val.toLocaleString('en-US');
}
</script>

<style scoped>
.bg-gradient-balance {
    background: linear-gradient(90deg, #e0e7ff 0%, #fff 100%);
}

.text-balance {
    color: #0d6efd;
}

.add-btn {
    bottom: 32px;
    right: 32px;
    width: 56px;
    height: 56px;
    z-index: 1000;
    font-size: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-btn:hover {
    background: #6366f1;
    transform: scale(1.08);
    box-shadow: 0 8px 32px rgba(80, 80, 180, 0.18);
}

@media (max-width: 768px) {
    .add-btn {
        right: 16px;
        bottom: 16px;
        width: 48px;
        height: 48px;
        font-size: 1.5rem;
    }

    .card {
        border-radius: 1.2rem !important;
    }
}

.balance-amount {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.amount {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #0d6efd;
    text-shadow: 0 2px 8px #e0e7ff;
}

.currency {
    font-size: 1.2rem;
    color: #6366f1;
    font-weight: 500;
    margin-left: 2px;
    opacity: 0.85;
}
</style>

<!-- Add filter for currency -->
<script>
export default {
    filters: {
        currency(val) {
            if (typeof val !== 'number') return val;
            return val.toLocaleString('en-US');
        }
    }
}
</script>