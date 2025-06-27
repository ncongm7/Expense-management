<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog card shadow-lg rounded-4 p-4"
      style="background: linear-gradient(135deg, #ffffff, #e0f7fa);">
      <h4 class="fw-bold mb-4 text-primary" style="color: #1e40af;">{{ budget ? 'Chỉnh sửa' : 'Thêm' }} ngân sách</h4>
      <form @submit.prevent="submitForm" class="needs-validation">
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Danh mục</label>
          <select v-model="form.category_id" class="form-select form-select-lg border-0 bg-light" required>
            <option value="" disabled>-- Chọn danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="text-dark">{{ cat.name }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Kỳ ngân sách</label>
          <input v-model="form.period" type="text" class="form-control form-control-lg border-0 bg-light"
            placeholder="VD: Tháng 6/2025" required />
        </div>
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Số tiền ngân sách</label>
          <input v-model.number="form.amount" type="number" class="form-control form-control-lg border-0 bg-light"
            min="1000" required />
        </div>
        <div class="mb-4 row g-3">
          <div class="col-6">
            <label class="form-label text-dark fw-medium">Ngày bắt đầu</label>
            <input v-model="form.start_date" type="date" class="form-control form-control-lg border-0 bg-light"
              required />
          </div>
          <div class="col-6">
            <label class="form-label text-dark fw-medium">Ngày kết thúc</label>
            <input v-model="form.end_date" type="date" class="form-control form-control-lg border-0 bg-light"
              required />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-3 mt-5">
          <button type="button" class="btn btn-outline-secondary btn-lg rounded-pill px-4"
            @click="$emit('close')">Đóng</button>
          <button type="submit" class="btn btn-primary btn-lg rounded-pill px-4"
            style="background-color: #1e40af; border: none;">Lưu</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const props = defineProps({
  budget: { type: Object, default: null }
});
const emit = defineEmits(['save', 'close']);
const categories = ref([
  // { id: 1, name: 'Ăn uống' }, ...
]);
const form = ref({
  category_id: '',
  period: '',
  amount: 0,
  start_date: '',
  end_date: ''
});
watch(() => props.budget, (val) => {
  if (val) {
    form.value = {
      category_id: val.category_id || '',
      period: val.period || '',
      amount: val.amount || 0,
      start_date: val.start_date || '',
      end_date: val.end_date || ''
    };
  } else {
    form.value = { category_id: '', period: '', amount: 0, start_date: '', end_date: '' };
  }
}, { immediate: true });
onMounted(() => {
  // TODO: Gọi API lấy danh mục thực tế
  categories.value = [
    { id: 1, name: 'Ăn uống' },
    { id: 2, name: 'Di chuyển' },
    { id: 3, name: 'Giải trí' },
    { id: 4, name: 'Học tập' },
  ];
});
function submitForm() {
  if (
    !form.value.category_id ||
    !form.value.period ||
    !form.value.amount ||
    !form.value.start_date ||
    !form.value.end_date
  ) return;
  if (form.value.amount < 1000) {
    alert('Số tiền phải lớn hơn 1000');
    return;
  }
  if (form.value.start_date > form.value.end_date) {
    alert('Ngày bắt đầu phải trước ngày kết thúc');
    return;
  }
  emit('save', { ...form.value, id: props.budget?.id });
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.modal-dialog {
  min-width: 400px;
  max-width: 98vw;
  border-radius: 1.5rem;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.modal-dialog:hover {
  transform: scale(1.02);
}

.form-control,
.form-select {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 0.2rem rgba(30, 64, 175, 0.25);
  background-color: #ffffff;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.text-primary {
  color: #1e40af !important;
}

.text-dark {
  color: #1f2937 !important;
}

.fw-medium {
  font-weight: 500;
}
</style>