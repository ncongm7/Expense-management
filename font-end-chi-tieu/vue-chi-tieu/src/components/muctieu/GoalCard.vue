<template>
    <div class="goal-card shadow rounded-4 p-3 position-relative">
        <img :src="goal.urlImage || defaultImage" class="goal-image mb-2" alt="goal" />
        <h5 class="fw-bold mb-1 text-center">{{ goal.title }}</h5>
        <div class="mb-2 text-muted small text-center">{{ goal.createdAt }} - {{ goal.deadline }}</div>
        <GoalProgress :amount="goal.targetAmount" :actualAmount="goal.currentAmount" />
        <div class="d-flex justify-content-between align-items-center mt-2">
            <span :class="['badge', statusClass]">{{ statusText }}</span>
            <div>
                <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('edit', goal)">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', goal.id)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import GoalProgress from './GoalProgress.vue'
const props = defineProps({
    goal: { type: Object, required: true }
})
const defaultImage = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // icon mặc định
const statusClass = computed(() => {
    if (props.goal.currentAmount >= props.goal.targetAmount) return 'bg-success text-white'
    if (new Date(props.goal.deadline) < new Date() && props.goal.currentAmount < props.goal.targetAmount) return 'bg-danger text-white'
    return 'bg-warning text-dark'
})
const statusText = computed(() => {
    if (props.goal.currentAmount >= props.goal.targetAmount) return 'Hoàn thành'
    if (new Date(props.goal.deadline) < new Date() && props.goal.currentAmount < props.goal.targetAmount) return 'Quá hạn'
    return 'Đang thực hiện'
})
</script>

<style scoped>
.goal-card {
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 12px rgba(30, 64, 175, 0.08);
    transition: box-shadow 0.2s, transform 0.2s;
}

.goal-image {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 1rem;
    background: #f0f4f8;
    margin-bottom: 0.5rem;
}
</style>