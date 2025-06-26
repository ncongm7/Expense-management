<template>
    <div class="alert alert-info d-flex justify-content-between align-items-center mb-3">
        <div>
            <b>Tổng chi tiêu:</b>
            <span class="text-danger">{{ totalExpense.toLocaleString('vi-VN') }} ₫</span>
        </div>
        <div>
            <b>Tổng thu nhập:</b>
            <span class="text-success">{{ totalIncome.toLocaleString('vi-VN') }} ₫</span>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    transactions: {
        type: Array,
        required: true
    }
});

const totalExpense = computed(() =>
    props.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
);

const totalIncome = computed(() =>
    props.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
);
</script>