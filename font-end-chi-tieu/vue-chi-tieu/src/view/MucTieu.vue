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
  try {
    console.log('MucTieu - Loading goals...');
    goals.value = await GoalsService.getGoals()
    console.log('MucTieu - Goals loaded:', goals.value);
  } catch (error) {
    console.error('MucTieu - Error loading goals:', error);
  }
})

function editGoal(goal) {
  console.log('MucTieu - Editing goal:', goal);
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
  try {
    console.log('MucTieu - Saving goal:', goal);

    // Kiểm tra goal parameter
    if (!goal || typeof goal !== 'object') {
      console.error('MucTieu - Invalid goal parameter:', goal);
      return;
    }

    // Kiểm tra xem có id hay không (cho edit) hoặc không có id (cho thêm mới)
    if (goal.id && goal.id !== '') {
      console.log('MucTieu - Updating existing goal with id:', goal.id);
      // Sửa
      GoalsService.updateGoal(goal).then(res => {
        const idx = goals.value.findIndex(g => g.id === goal.id)
        if (idx !== -1) goals.value[idx] = { ...goal }

        // Refresh notifications ngay lập tức
        window.dispatchEvent(new CustomEvent('refresh-notifications'));
      }).catch(error => {
        console.error('MucTieu - Error updating goal:', error);
      })
    } else {
      console.log('MucTieu - Adding new goal:', goal)
      // Thêm mới
      GoalsService.addGoal(goal).then(res => {
        goals.value.push(res.data)

        // Refresh notifications ngay lập tức
        window.dispatchEvent(new CustomEvent('refresh-notifications'));
      }).catch(error => {
        console.error('MucTieu - Error adding goal:', error);
      })
    }
    showForm.value = false
    selectedGoal.value = null
  } catch (error) {
    console.error('MucTieu - Error in saveGoal:', error);
  }
}
function closeForm() {
  showForm.value = false
  selectedGoal.value = null
}
</script>

<style scoped></style>