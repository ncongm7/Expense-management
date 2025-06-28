<template>
  <div class="container py-4">

    <button class="btn btn-primary mb-3" @click="showForm = true">+ Thêm ngân sách</button>
    <BudgetTable :budgets="budgets" @edit="editBudget" @delete="deleteBudget" />
    <BudgetForm :categories="categories" v-if="showForm" :budget="selectedBudget" @save="saveBudget"
      @close="closeForm" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BudgetTable from '../components/ngansach/BudgetTable.vue'
import BudgetForm from '../components/ngansach/BudgetForm.vue'
import { onMounted } from 'vue'
import budgetsService from '../service/budgetsService.js'
import categoryService from '@/service/categoryService'
import { useToast } from 'vue-toastification'

const toast = useToast()

const budgets = ref([])
const categories = ref([]);

onMounted(async () => {
  try {
    const data = await budgetsService.getBudgets();
    budgets.value = data;

    // Lấy categories - không cần truyền userId vì service tự lấy từ localStorage
    categories.value = await categoryService.getCategories();
    console.log('Danh sách categories:', categories.value);

    console.log('Danh sách ngân sách:', budgets.value);

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
  budgetsService.deleteBudget(id).then(() => {
    budgets.value = budgets.value.filter(b => b.id !== id);

    toast.success('Xóa ngân sách thành công!');

    // Refresh notifications ngay lập tức
    window.dispatchEvent(new CustomEvent('refresh-notifications'));
  }).catch(error => {
    console.error('Lỗi xóa ngân sách:', error);
    toast.error('Xóa ngân sách thất bại!');
  });
}
function saveBudget(budget) {
  if (budget.id) {
    // Sửa ngân sách
    budgetsService.updateBudget(budget.id, budget).then(updatedBudget => {
      const idx = budgets.value.findIndex(b => b.id === budget.id);
      if (idx !== -1) {
        budgets.value[idx] = updatedBudget;
      }

      toast.success('Cập nhật ngân sách thành công!');

      // Refresh notifications ngay lập tức
      window.dispatchEvent(new CustomEvent('refresh-notifications'));
    }).catch(error => {
      console.error('Lỗi cập nhật ngân sách:', error);
      toast.error('Cập nhật ngân sách thất bại!');
    });
  } else {
    // Thêm ngân sách mới
    budgetsService.createBudget(budget).then(newBudget => {
      budgets.value.push(newBudget);

      toast.success('Thêm ngân sách thành công!');

      // Refresh notifications ngay lập tức
      window.dispatchEvent(new CustomEvent('refresh-notifications'));
    }).catch(error => {
      console.error('Lỗi tạo ngân sách:', error);
      toast.error('Thêm ngân sách thất bại!');
    });
  }

  showForm.value = false;
  selectedBudget.value = null;
}
function closeForm() {
  showForm.value = false
  selectedBudget.value = null
}
</script>

<style scoped></style>