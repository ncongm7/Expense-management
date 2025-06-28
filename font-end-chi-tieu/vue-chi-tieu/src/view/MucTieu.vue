<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">Quản lý mục tiêu</h2>
    <GoalGrid :goals="goals" @edit="editGoal" @delete="deleteGoal" @add="showForm = true" />
    <GoalForm v-if="showForm" :goal="selectedGoal" @save="saveGoal" @close="closeForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GoalGrid from '../components/muctieu/GoalGrid.vue'
import GoalForm from '../components/muctieu/GoalForm.vue'
import GoalsService from '../service/goalsService.js'

const goals = ref([])
const showForm = ref(false)
const selectedGoal = ref(null)

onMounted(async () => {
  goals.value = await GoalsService.getGoals()
})

function editGoal(goal) {
  selectedGoal.value = goal
  showForm.value = true
}
function deleteGoal(id) {
  // Gọi API xóa, sau đó cập nhật goals.value
  GoalsService.deleteGoal(id).then(() => {
    goals.value = goals.value.filter(g => g.id !== id)
  })
}
function saveGoal(goal) {
  if (goal.id) {
    // Sửa
    GoalsService.updateGoal(goal).then(res => {
      const idx = goals.value.findIndex(g => g.id === goal.id)
      if (idx !== -1) goals.value[idx] = { ...goal }
    })
  } else {
    console.log('Thêm mới mục tiêu:', goal)
    // Thêm mới
    GoalsService.addGoal(goal).then(res => {
      
      goals.value.push(res.data)
    })
  }
  showForm.value = false
  selectedGoal.value = null
}
function closeForm() {
  showForm.value = false
  selectedGoal.value = null
}
</script>

<style scoped></style>