<template>
    <div class="report-goal-progress">
        <h4>Tiến độ mục tiêu tài chính</h4>
        <ul>
            <li v-for="g in goals" :key="g.id">
                <span>{{ g.name }}:</span>
                <span>{{ g.saved.toLocaleString() }} / {{ g.amount.toLocaleString() }} đ</span>
                <span>({{ Math.round((g.saved / g.amount) * 100) || 0 }}%)</span>
            </li>
            <li v-if="!goals.length">Không có dữ liệu</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import goalsService from '@/service/goalsService.js'

const goals = ref([])

async function fetchData() {
    try {
        const all = await goalsService.getGoals()
        goals.value = all || []
    } catch (e) {
        goals.value = []
    }
}

onMounted(fetchData)
</script>

<style scoped>
.report-goal-progress {
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
</style>