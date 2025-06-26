<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <h3 class="h5 mb-3">Phân tích chi tiêu</h3>
            <canvas ref="chartCanvas" style="width:100%;height:300px;"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const props = defineProps({
    transactions: {
        type: Array,
        required: true
    }
});

const chartCanvas = ref(null);
let expenseChart = null;

const updateChart = () => {
    if (!chartCanvas.value) return;

    const ctx = chartCanvas.value.getContext('2d');
    const expenseData = props.transactions.reduce((acc, curr) => {
        if (curr.type === 'expense') {
            acc[curr.categoryName] = (acc[curr.categoryName] || 0) + curr.amount;
        }
        return acc;
    }, {});

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(expenseData),
            datasets: [{
                label: 'Chi tiêu theo danh mục',
                data: Object.values(expenseData),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Số tiền (₫)' },
                },
            },
        },
    });
};

// Watch changes in transactions
watch(() => props.transactions, () => {
    nextTick(() => {
        updateChart();
    });
}, { deep: true });

onMounted(() => {
    nextTick(() => {
        updateChart();
    });
});
</script>