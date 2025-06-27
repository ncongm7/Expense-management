<template>
    <div class="report-summary">
        <div class="summary-item">
            <div class="label">Tổng thu</div>
            <div class="value text-success">{{ summary.income.toLocaleString() }} đ</div>
        </div>
        <div class="summary-item">
            <div class="label">Tổng chi</div>
            <div class="value text-danger">{{ summary.expense.toLocaleString() }} đ</div>
        </div>
        <div class="summary-item">
            <div class="label">Số dư</div>
            <div class="value">{{ (summary.income - summary.expense).toLocaleString() }} đ</div>
        </div>
        <div class="summary-item">
            <div class="label">So với tháng trước</div>
            <div class="value">{{ summary.compareLastMonth > 0 ? '+' : '' }}{{ summary.compareLastMonth.toLocaleString()
                }} đ</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import transactionService from '@/service/transactionService.js'

const summary = ref({ income: 0, expense: 0, compareLastMonth: 0 })

async function fetchSummary() {
    // Giả lập fetch, thực tế nên dùng transactionService.getTransactionStats({})
    try {
        const stats = await transactionService.getTransactionStats()
        summary.value = {
            income: stats.income || 0,
            expense: stats.expense || 0,
            compareLastMonth: stats.compareLastMonth || 0
        }
    } catch (e) {
        summary.value = { income: 0, expense: 0, compareLastMonth: 0 }
    }
}

onMounted(fetchSummary)
</script>

<style scoped>
.report-summary {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.summary-item {
    background: #f3f4f6;
    border-radius: 1rem;
    padding: 1rem 2rem;
    min-width: 160px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

.label {
    color: #64748b;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.value {
    font-size: 1.2rem;
    font-weight: 600;
}

.text-success {
    color: #16a34a;
}

.text-danger {
    color: #dc2626;
}
</style>