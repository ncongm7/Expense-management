<template>
  <div class="container py-4">

    <button class="btn btn-primary mb-3" @click="showForm = true">+ Thêm ngân sách</button>
    <BudgetTable :budgets="budgets" @edit="editBudget" @delete="deleteBudget" />
    <BudgetForm v-if="showForm" :budget="selectedBudget" @save="saveBudget" @close="closeForm" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BudgetTable from '../components/ngansach/BudgetTable.vue'
import BudgetForm from '../components/ngansach/BudgetForm.vue'
import { onMounted } from 'vue'
import budgetsService from '../service/budgetsService.js'
const budgets = ref([
])
onMounted(async () => {
  try {
    const data = await budgetsService.getBudgets();
    budgets.value = data;
    console.log(budgets.value);
  } catch (error) {
    console.error('Lỗi lấy danh sách ngân sách:', error);
  }
})


const showForm = ref(false)
const selectedBudget = ref(null)

function editBudget(budget) {
  selectedBudget.value = budget
  showForm.value = true
}
function deleteBudget(id) {
  budgets.value = budgets.value.filter(b => b.id !== id)
}
function saveBudget(budget) {
  if (budget.id) {
    // Sửa
    const idx = budgets.value.findIndex(b => b.id === budget.id)
    if (idx !== -1) budgets.value[idx] = { ...budget, categoryName: budgets.value[idx].categoryName }
  } else {
    // Thêm mới
    budgets.value.push({
      ...budget,
      id: Date.now(),
      categoryName: 'Danh mục demo' // Bạn thay bằng tên thực tế
    })
  }
  showForm.value = false
  selectedBudget.value = null
}
function closeForm() {
  showForm.value = false
  selectedBudget.value = null
}
</script>

<style scoped></style>