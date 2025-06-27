<template>
    <div class="report-transaction-list">
        <h4>Giao dịch nổi bật</h4>
        <ul>
            <li v-for="tx in transactions" :key="tx.id">
                <span>{{ tx.date }}:</span>
                <span>{{ tx.categoryName }} - </span>
                <span :class="tx.type === 'income' ? 'text-success' : 'text-danger'">
                    {{ tx.amount.toLocaleString() }} đ
                </span>
                <span>({{ tx.note }})</span>
            </li>
            <li v-if="!transactions.length">Không có dữ liệu</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import transactionService from '@/service/transactionService.js'

const transactions = ref([])

async function fetchData() {
    try {
        // Lấy 5 giao dịch lớn nhất
        const all = await transactionService.getTransactions({})
        transactions.value = (all || []).sort((a, b) => b.amount - a.amount).slice(0, 5)
    } catch (e) {
        transactions.value = []
    }
}

onMounted(fetchData)
</script>

<style scoped>
.report-transaction-list {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
}

li:last-child {
    border-bottom: none;
}

.text-success {
    color: #16a34a;
}

.text-danger {
    color: #dc2626;
}
</style>