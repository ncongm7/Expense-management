<template>
    <div class="progress-container w-100">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-primary">{{ percent }}%</span>
            <div class="text-end">
                <span class="fw-bold text-success">{{ currency(actualAmount) }}</span>
                <span class="text-muted mx-1">/</span>
                <span class="fw-bold text-danger">{{ currency(amount) }}</span>
            </div>
        </div>
        <div class="progress" style="height: 18px; border-radius: 10px; overflow: hidden;">
            <div class="progress-bar" :class="colorClass" role="progressbar"
                :style="{ width: percent + '%', background: 'linear-gradient(90deg, #60a5fa, #34d399)' }"
                :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    amount: { type: Number, required: true },
    actualAmount: { type: Number, required: true }
});
const percent = computed(() => {
    if (!props.amount) return 0;
    return Math.min(100, Math.round((props.actualAmount / props.amount) * 100));
});
const colorClass = computed(() => {
    if (!props.amount) return 'bg-secondary';
    if (props.actualAmount >= props.amount) return 'bg-success';
    if (props.actualAmount >= 0.8 * props.amount) return 'bg-warning text-dark';
    return 'bg-primary';
});
function currency(val) {
    if (typeof val !== 'number') return val;
    return val.toLocaleString('vi-VN') + ' ₫';
}
</script>

<style scoped>
.progress-container {
    width: 100%;
}

.progress {
    background: #e0e7ff;
    border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.5s ease-in-out;
}
</style>