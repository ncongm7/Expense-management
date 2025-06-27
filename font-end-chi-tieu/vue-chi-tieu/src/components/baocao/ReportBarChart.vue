<template>
    <div class="report-bar-chart">
        <h4>Biểu đồ thu/chi theo tháng</h4>
        <canvas v-if="chartData" ref="barCanvas"></canvas>
        <div v-else>Đang tải dữ liệu...</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import transactionService from '@/service/transactionService.js'
let Chart = null

const chartData = ref(null)
const barCanvas = ref(null)
let chartInstance = null

async function fetchData() {
    // Giả lập fetch, thực tế nên dùng transactionService.getTransactionStats({ groupBy: 'month' })
    try {
        const stats = await transactionService.getTransactionStats({ groupBy: 'month' })
        chartData.value = stats.monthStats || []
        if (chartData.value.length && barCanvas.value) {
            if (!Chart) Chart = (await import('chart.js/auto')).default
            if (chartInstance) chartInstance.destroy()
            chartInstance = new Chart(barCanvas.value, {
                type: 'bar',
                data: {
                    labels: chartData.value.map(m => m.month),
                    datasets: [
                        {
                            label: 'Thu',
                            data: chartData.value.map(m => m.income),
                            backgroundColor: '#60a5fa'
                        },
                        {
                            label: 'Chi',
                            data: chartData.value.map(m => m.expense),
                            backgroundColor: '#f87171'
                        }
                    ]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            })
        }
    } catch (e) {
        chartData.value = null
    }
}

onMounted(fetchData)
watch(barCanvas, fetchData)
</script>

<style scoped>
.report-bar-chart {
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