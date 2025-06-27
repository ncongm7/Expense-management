<template>
    <div class="report-budget-compare">
        <h4>So sánh ngân sách với thực tế</h4>
        <table>
            <thead>
                <tr>
                    <th>Ngân sách</th>
                    <th>Đã chi</th>
                    <th>Chênh lệch</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="b in budgets" :key="b.id">
                    <td>{{ b.name }}</td>
                    <td>{{ b.spent.toLocaleString() }} đ</td>
                    <td :class="b.spent > b.amount ? 'text-danger' : 'text-success'">
                        {{ (b.amount - b.spent).toLocaleString() }} đ
                    </td>
                </tr>
                <tr v-if="!budgets.length">
                    <td colspan="3">Không có dữ liệu</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import BudgetsService from '@/service/budgetsService.js'
import { ref, onMounted } from 'vue'


const budgets = ref([])

async function fetchData() {
    try {
        const all = await new BudgetsService().getBudgets()
        budgets.value = (all || []).map(b => ({
            ...b,
            spent: b.spent || 0
        }))
    } catch (e) {
        budgets.value = []
    }
}

onMounted(fetchData)
</script>

<style scoped>
.report-budget-compare {
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

.text-success {
    color: #16a34a;
}

.text-danger {
    color: #dc2626;
}
</style>