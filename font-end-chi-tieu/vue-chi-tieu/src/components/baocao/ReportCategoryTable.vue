<template>
    <div class="report-category-table">
        <h4>Chi tiết theo danh mục</h4>
        <table>
            <thead>
                <tr>
                    <th>Danh mục</th>
                    <th>Số tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cat in categories" :key="cat.categoryId">
                    <td>{{ cat.categoryName }}</td>
                    <td>{{ cat.amount.toLocaleString() }} đ</td>
                </tr>
                <tr v-if="!categories.length">
                    <td colspan="2">Không có dữ liệu</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import transactionService from '@/service/transactionService.js'

const categories = ref([])

async function fetchData() {
    try {
        const stats = await transactionService.getTransactionStats({ groupBy: 'category' })
        categories.value = stats.categoryStats || []
    } catch (e) {
        categories.value = []
    }
}

onMounted(fetchData)
</script>

<style scoped>
.report-category-table {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

th {
    background: #f3f4f6;
    text-align: left;
}
</style>