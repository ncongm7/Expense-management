<template>
  <div class="card shadow-lg rounded-4 p-4 bg-gradient" style="background: linear-gradient(135deg, #f0f4f8, #d9e2ec);">
    <div class="table-responsive-custom">
      <table class="table align-middle table-hover">
        <thead class="table-light">
          <tr>
            <th class="text-primary fw-bold"><i class="bi bi-list-ul"></i> Danh mục</th>
            <th class="text-primary fw-bold"><i class="bi bi-calendar"></i> Kỳ</th>
            <th class="text-primary fw-bold"><i class="bi bi-cash-stack"></i> Số tiền</th>
            <th class="text-primary fw-bold"><i class="bi bi-wallet2"></i> Đã chi</th>
            <th class="text-primary fw-bold"><i class="bi bi-clock"></i> Thời gian</th>
            <th class="text-primary fw-bold"><i class="bi bi-bar-chart"></i> Tiến độ</th>
            <th class="text-primary fw-bold"><i class="bi bi-activity"></i> Trạng thái</th>
            <th class="text-primary fw-bold"><i class="bi bi-gear"></i> Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in budgets" :key="b.id" class="table-row-hover">
            <td class="text-dark" data-label="Danh mục">{{ b.categoryName }}</td>
            <td class="text-dark" data-label="Kỳ">{{ formatPeriod(b.period) }}</td>
            <td class="text-end">
              <span class="fw-bold text-primary">{{ formatCurrency(b.amount) }}</span>
            </td>
            <td class="text-danger" data-label="Đã chi">{{ formatCurrency(b.amountSpent) }}</td>
            <td class="text-muted" data-label="Thời gian">{{ b.startDate }} - {{ b.endDate }}</td>
            <td style="min-width:160px" data-label="Tiến độ">
              <BudgetProgress :amount="b.amount" :actualAmount="b.amountSpent" />
            </td>
            <td data-label="Trạng thái">
              <span v-if="b.amountSpent > b.amount" class="badge rounded-pill bg-danger text-white">Vượt</span>
              <span v-else-if="b.amountSpent >= 0.8 * b.amount" class="badge rounded-pill bg-warning text-dark">Sắp
                hết</span>
              <span v-else class="badge rounded-pill bg-success text-white">Còn lại</span>
            </td>
            <td data-label="Hành động">
              <button class="btn btn-sm btn-warning me-2 rounded-pill" @click="$emit('edit', b)">
                <i class="bi bi-pencil"></i> Sửa
              </button>
              <button class="btn btn-sm btn-danger rounded-pill" @click="$emit('delete', b.id)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </td>
          </tr>
          <tr v-if="budgets.length === 0">
            <td colspan="8" class="text-center text-muted py-4">Chưa có ngân sách nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import BudgetProgress from './BudgetProgress.vue';
import { formatCurrency } from '../../utils/currencyFormatter.js';

const props = defineProps({
  budgets: { type: Array, default: () => [] }
});

function formatPeriod(period) {
  if (period === 'month') return '📅 Tháng';
  if (period === 'week') return '📊 Tuần';
  // Nếu là string dài thì extract và format
  if (period.includes('Tháng') || period.includes('month')) return '📅 Tháng';
  if (period.includes('Tuần') || period.includes('week')) return '📊 Tuần';
  return period; // Fallback
}
</script>

<style scoped>
.card {
  border: none;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.01);
}

.table-responsive-custom {
  width: 100%;
  overflow-x: auto;
}

.table-row-hover:hover {
  background-color: #f8fafc;
  transition: background-color 0.2s;
}

.btn {
  padding: 6px 12px;
  transition: all 0.3s;
}

.btn:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

.text-primary {
  color: #1e40af !important;
}

.text-success {
  color: #10b981 !important;
}

.text-danger {
  color: #ef4444 !important;
}

.text-muted {
  color: #6b7280 !important;
}

.badge {
  padding: 6px 12px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .table thead {
    display: none;
  }

  .table tbody tr {
    display: block;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .table tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0.5rem;
    border: none;
    font-size: 0.98rem;
  }

  .table tbody td:before {
    content: attr(data-label);
    font-weight: 600;
    color: #1e40af;
    flex-basis: 45%;
    text-align: left;
  }
}
</style>