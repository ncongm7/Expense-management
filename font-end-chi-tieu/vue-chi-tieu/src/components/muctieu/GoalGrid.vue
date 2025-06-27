<template>
    <div class="row g-4">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="goal in goals" :key="goal.id">
            <GoalCard :goal="goal" @edit="$emit('edit', goal)" @delete="$emit('delete', goal.id)" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="goal-card add-card d-flex flex-column align-items-center justify-content-center"
                @click="$emit('add')">
                <i class="bi bi-plus-circle fs-1 text-primary"></i>
                <span class="mt-2 fw-bold">Thêm mục tiêu</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import GoalCard from './GoalCard.vue'
const props = defineProps({
    goals: { type: Array, default: () => [] }
})
</script>

<style scoped>
.goal-card {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 12px rgba(30, 64, 175, 0.08);
    padding: 1.5rem 1.2rem;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.2s, transform 0.2s;
    position: relative;
}

.goal-card:hover {
    box-shadow: 0 4px 24px rgba(30, 64, 175, 0.16);
    transform: translateY(-4px) scale(1.02);
}

.add-card {
    cursor: pointer;
    background: linear-gradient(135deg, #e0e7ff, #f0f4f8);
    color: #1e40af;
    border: 2px dashed #a5b4fc;
    min-height: 320px;
    justify-content: center;
}
</style>