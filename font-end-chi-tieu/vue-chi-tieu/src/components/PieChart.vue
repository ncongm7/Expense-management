<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <h3 class="h5 mb-3">Tỷ lệ chi tiêu theo danh mục</h3>
            <canvas ref="pieCanvas" style="width:100%;height:300px;"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
});

const pieCanvas = ref(null);
let pieChart = null;

const updateChart = () => {
    if (!pieCanvas.value) return;
    const ctx = pieCanvas.value.getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: props.data.map(d => d.label),
            datasets: [{
                data: props.data.map(d => d.value),
                backgroundColor: props.data.map(d => d.color),
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
            },
        },
    });
};

watch(() => props.data, () => nextTick(updateChart), { deep: true });
onMounted(() => nextTick(updateChart));
</script>