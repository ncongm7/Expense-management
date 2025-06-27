<template>
    <div class="report-pie-chart">
        <h4>Biểu đồ chi tiêu theo danh mục</h4>
        <canvas v-if="chartData" ref="pieCanvas"></canvas>
        <div v-else>Đang tải dữ liệu...</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import transactionService from '@/service/transactionService.js'
let Chart = null

const chartData = ref(null)
const pieCanvas = ref(null)
let chartInstance = null

async function fetchData() {
    // Giả lập fetch, thực tế nên dùng transactionService.getTransactionStats({ groupBy: 'category' })
    try {
        const stats = await transactionService.getTransactionStats({ groupBy: 'category' })
        chartData.value = stats.categoryStats || []
        if (chartData.value.length && pieCanvas.value) {
            if (!Chart) Chart = (await import('chart.js/auto')).default
            if (chartInstance) chartInstance.destroy()
            chartInstance = new Chart(pieCanvas.value, {
                type: 'pie',
                data: {
                    labels: chartData.value.map(c => c.categoryName),
                    datasets: [{
                        data: chartData.value.map(c => c.amount),
                        backgroundColor: [
                            '#60a5fa', '#f472b6', '#fbbf24', '#34d399', '#a78bfa', '#f87171', '#facc15', '#38bdf8', '#f472b6', '#4ade80'
                        ]
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            })
        }
    } catch (e) {
        chartData.value = null
    }
}

onMounted(fetchData)
watch(pieCanvas, fetchData)
</script>

<style scoped>
.report-pie-chart {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    min-width: 320px;
    flex: 1;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

h4 {
    margin-bottom: 1rem;
}
</style>