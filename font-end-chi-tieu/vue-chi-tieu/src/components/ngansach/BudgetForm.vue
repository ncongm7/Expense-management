<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog card shadow-lg rounded-4 p-4"
      style="background: linear-gradient(135deg, #ffffff, #e0f7fa);">
      <h4 class="fw-bold mb-4 text-primary" style="color: #1e40af;">{{ budget ? 'Chỉnh sửa' : 'Thêm' }} ngân sách</h4>
      <form @submit.prevent="submitForm" class="needs-validation">
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Danh mục</label>
          <select v-model="formData.categoryId" class="form-select form-select-lg border-0 bg-light"
            :class="{ 'is-invalid': errors.categoryId }" required>
            <option value="" disabled>-- Chọn danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="text-dark">{{ cat.icon }} {{ cat.name
            }}</option>
          </select>
          <div v-if="errors.categoryId" class="invalid-feedback">{{ errors.categoryId }}</div>
        </div>
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Kỳ ngân sách</label>
          <select v-model="formData.period" class="form-select form-select-lg border-0 bg-light"
            :class="{ 'is-invalid': errors.period }" required>
            <option value="" disabled>-- Chọn kỳ ngân sách --</option>
            <option value="month" class="text-dark">📅 Tháng</option>
            <option value="week" class="text-dark">📊 Tuần</option>
          </select>
          <div v-if="errors.period" class="invalid-feedback">{{ errors.period }}</div>
        </div>
        <div class="mb-4">
          <label class="form-label text-dark fw-medium">Số tiền ngân sách</label>
          <input v-model="formData.amount" type="text" class="form-control form-control-lg border-0 bg-light"
            :class="{ 'is-invalid': errors.amount }" placeholder="Nhập số tiền" @input="handleAmountInput"
            @blur="handleAmountBlur" required />
          <div v-if="errors.amount" class="invalid-feedback">{{ errors.amount }}</div>
        </div>
        <div class="mb-4 row g-3">
          <div class="col-6">
            <label class="form-label text-dark fw-medium">Ngày bắt đầu</label>
            <input v-model="formData.startDate" type="date" class="form-control form-control-lg border-0 bg-light"
              :class="{ 'is-invalid': errors.startDate }" required />
            <div v-if="errors.startDate" class="invalid-feedback">{{ errors.startDate }}</div>
          </div>
          <div class="col-6">
            <label class="form-label text-dark fw-medium">Ngày kết thúc</label>
            <input v-model="formData.endDate" type="date" class="form-control form-control-lg border-0 bg-light"
              :class="{ 'is-invalid': errors.endDate }" required />
            <div v-if="errors.endDate" class="invalid-feedback">{{ errors.endDate }}</div>
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
import { ref, onMounted, watch, reactive } from 'vue';
import categoryService from '../../service/categoryService.js';
import { validateCurrencyInput, autoFormatInput, parseCurrency } from '../../utils/currencyFormatter.js';

const props = defineProps({
  budget: {
    type: Object,
    default: null,
    required: false
  },
  categories: {
    type: Array,
    default: () => [],
    required: false
  }
});
const emit = defineEmits(['save', 'close']);

// Debug categories prop
console.log('BudgetForm - Categories prop:', props.categories);
console.log('BudgetForm - Budget prop:', props.budget);

const formData = reactive({
  categoryId: '',
  amount: '',
  period: 'month',
  startDate: new Date().toISOString().split('T')[0],
  endDate: ''
});

// Validation state
const errors = reactive({
  categoryId: '',
  amount: '',
  period: '',
  startDate: '',
  endDate: ''
});

watch(() => props.budget, (val) => {
  try {
    console.log('BudgetForm - Watch triggered with val:', val);

    if (val && typeof val === 'object') {
      // Xử lý period value - nếu là string dài thì extract 'month' hoặc 'week'
      let periodValue = val.period || '';
      if (periodValue.includes('Tháng') || periodValue.includes('month')) {
        periodValue = 'month';
      } else if (periodValue.includes('Tuần') || periodValue.includes('week')) {
        periodValue = 'week';
      }

      formData.categoryId = val.categoryId || val.category_id || '';
      formData.period = periodValue;
      formData.amount = val.amount ? val.amount.toString() : '';
      formData.startDate = val.startDate || val.start_date || '';
      formData.endDate = val.endDate || val.end_date || '';
    } else {
      // Reset form khi không có budget
      formData.categoryId = '';
      formData.period = 'month';
      formData.amount = '';
      formData.startDate = new Date().toISOString().split('T')[0];
      formData.endDate = '';
    }
  } catch (error) {
    console.error('BudgetForm - Error in watch function:', error);
    // Reset form nếu có lỗi
    formData.categoryId = '';
    formData.period = 'month';
    formData.amount = '';
    formData.startDate = new Date().toISOString().split('T')[0];
    formData.endDate = '';
  }
}, { immediate: true });

function submitForm() {
  // Validate
  errors.categoryId = '';
  errors.amount = '';
  errors.period = '';
  errors.startDate = '';
  errors.endDate = '';

  if (!formData.categoryId) {
    errors.categoryId = 'Vui lòng chọn danh mục';
    return;
  }

  if (!formData.period) {
    errors.period = 'Vui lòng chọn kỳ ngân sách';
    return;
  }

  if (!formData.amount || parseCurrency(formData.amount) < 1000) {
    errors.amount = 'Số tiền phải lớn hơn 1.000 ₫';
    return;
  }

  if (!formData.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu';
    return;
  }

  if (!formData.endDate) {
    errors.endDate = 'Vui lòng chọn ngày kết thúc';
    return;
  }

  if (formData.period !== 'month' && formData.period !== 'week') {
    errors.period = 'Vui lòng chọn kỳ ngân sách (Tháng hoặc Tuần)';
    return;
  }

  if (formData.startDate > formData.endDate) {
    errors.endDate = 'Ngày bắt đầu phải trước ngày kết thúc';
    return;
  }

  // Parse amount to number before emitting
  const submitData = {
    ...formData,
    amount: parseCurrency(formData.amount)
  };

  // Chỉ thêm id nếu có budget
  if (props.budget && props.budget.id) {
    submitData.id = props.budget.id;
  }

  emit('save', submitData);
}

function handleAmountInput(event) {
  const value = event.target.value;

  // Validate input
  if (!validateCurrencyInput(value)) {
    return;
  }

  // Auto format while typing
  const formatted = autoFormatInput(value);
  formData.amount = formatted;

  // Clear error when user starts typing
  if (errors.amount) {
    errors.amount = '';
  }
}

function handleAmountBlur() {
  if (formData.amount) {
    const parsed = parseCurrency(formData.amount);
    if (parsed < 1000) {
      errors.amount = 'Số tiền phải lớn hơn 1.000 ₫';
    }
  }
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
  pointer-events: auto;
  /* Đảm bảo backdrop nhận sự kiện */
}

.modal-dialog {
  min-width: 400px;
  max-width: 98vw;
  border-radius: 1.5rem;
  transform: scale(1);
  transition: transform 0.3s ease;
  pointer-events: auto;
  /* Đảm bảo modal-dialog nhận sự kiện */
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
  pointer-events: auto;
  /* Đảm bảo input và select nhận sự kiện */
}

.form-control:focus,
.form-select:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 0.2rem rgba(30, 64, 175, 0.25);
  background-color: #ffffff;
}

.btn {
  transition: all 0.3s ease;
  pointer-events: auto;
  /* Đảm bảo nút nhận sự kiện */
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