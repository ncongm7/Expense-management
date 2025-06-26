<template>
    <div class="card shadow mb-4">
        <div class="card-body">
            <h3 class="h5 mb-3">Bộ lọc giao dịch</h3>
            <form @submit.prevent="handleFilter">
                <div class="row g-3 align-items-end">
                    <div class="col-md-2">
                        <label class="form-label">Loại</label>
                        <select v-model="localFilters.type" class="form-select">
                            <option value="">Tất cả</option>
                            <option value="expense">Chi tiêu</option>
                            <option value="income">Thu nhập</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Danh mục</label>
                        <select v-model="localFilters.categoryId" class="form-select">
                            <option value="">Tất cả</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.icon }} {{ cat.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Từ ngày</label>
                        <input v-model="localFilters.fromDate" type="date" class="form-control" />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Đến ngày</label>
                        <input v-model="localFilters.toDate" type="date" class="form-control" />
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Tìm kiếm</label>
                        <input v-model="localFilters.search" type="text" class="form-control"
                            placeholder="Ghi chú hoặc danh mục" />
                    </div>
                    <div class="col-md-2 d-flex gap-2">
                        <button type="submit" class="btn btn-primary flex-fill">
                            <i class="fas fa-filter"></i> Lọc
                        </button>
                        <button type="button" @click="resetFilters" class="btn btn-secondary flex-fill">
                            <i class="fas fa-eraser"></i> Xóa
                        </button>
                        <button type="button" @click="refreshData" class="btn btn-success flex-fill">
                            <i class="fas fa-sync"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true
    },
    filters: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['filter-changed', 'reset-filters', 'refresh-data']);

// Tạo local copy của filters để tránh mutation trực tiếp
const localFilters = ref({ ...props.filters });

// Watch changes từ parent
watch(() => props.filters, (newFilters) => {
    localFilters.value = { ...newFilters };
}, { deep: true });

const handleFilter = () => {
    emit('filter-changed', { ...localFilters.value });
};

const resetFilters = () => {
    localFilters.value = {
        type: '',
        categoryId: '',
        fromDate: '',
        toDate: '',
        search: ''
    };
    emit('reset-filters');
};

const refreshData = () => {
    emit('refresh-data');
};
</script>