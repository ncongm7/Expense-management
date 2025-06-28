<template>
    <div class="card shadow mb-4 animate-fade">
        <div class="card-body">
            <h2 class="h4 mb-4">Thêm Giao Dịch</h2>
            <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                    <!-- Loại giao dịch -->
                    <div class="col-12">
                        <label class="form-label">Loại giao dịch</label>
                        <div class="form-check form-check-inline">
                            <input v-model="formData.type" class="form-check-input" type="radio" value="expense"
                                id="expenseRadio">
                            <label class="form-check-label" for="expenseRadio">Chi tiêu</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="formData.type" class="form-check-input" type="radio" value="income"
                                id="incomeRadio">
                            <label class="form-check-label" for="incomeRadio">Thu nhập</label>
                        </div>
                    </div>
                    <!-- Số tiền -->
                    <div class="col-md-6">
                        <label class="form-label">Số tiền</label>
                        <input  v-model="formData.amount" type="number" class="form-control"
                            :class="{ 'is-invalid': errors.amount }" placeholder="Nhập số tiền"
                            @input="handleAmountInput" @blur="handleAmountBlur" required />
                        <div v-if="errors.amount" class="invalid-feedback">{{ errors.amount }}</div>
                    </div>
                    <!-- Danh mục -->
                    <div class="col-md-6">
                        <label class="form-label">Danh mục</label>
                        <select v-model="formData.categoryId" class="form-select" required>
                            <option disabled value="">-- Chọn danh mục --</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.icon }} {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <!-- Ngày chi -->
                    <div class="col-md-6">
                        <label class="form-label">Ngày</label>
                        <input v-model="formData.spentAt" type="date" class="form-control" required />
                    </div>
                    <!-- Ghi chú -->
                    <div class="col-md-6">
                        <label class="form-label">Ghi chú</label>
                        <input v-model="formData.note" type="text" class="form-control"
                            placeholder="Ví dụ: Cà phê sáng" />
                    </div>
                    <!-- Upload ảnh hóa đơn -->
                    <div class="col-12">
                        <label class="form-label">Upload Ảnh Hóa đơn</label>
                        <input type="file" accept="image/*" @change="handleFileUpload" class="form-control" />
                    </div>
                    <!-- Submit -->
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary w-100">Lưu giao dịch</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import authService from '../../service/authService.js';
import categoryService from '../../service/categoryService.js';
import { validateCurrencyInput, autoFormatInput, parseCurrency } from '../../utils/currencyFormatter.js';

const toast = useToast();

const props = defineProps({
    categories: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['transaction-added']);

const formData = reactive({
    type: 'expense',
    amount: '',
    categoryId: '',
    note: '',
    spentAt: new Date().toISOString().split('T')[0],
    receiptUrl: ''
});

// Validation state
const errors = reactive({
    amount: '',
    categoryId: '',
    spentAt: ''
});

// Handle amount input with auto formatting
const handleAmountInput = (event) => {
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
};

// Handle amount blur - final validation
const handleAmountBlur = () => {
    if (formData.amount) {
        const parsed = parseCurrency(formData.amount);
        if (parsed <= 0) {
            errors.amount = 'Số tiền phải lớn hơn 0';
        }
    }
};

/**
 * Xử lý khi user chọn file ảnh
 */
const handleFileUpload = (event) => {
    formData.receiptUrl = URL.createObjectURL(event.target.files[0]);
    toast.info('Ảnh hóa đơn đã được chọn!');
};

/**
 * Xử lý khi submit form
 */
const handleSubmit = async () => {
    try {
        // Kiểm tra đăng nhập
        if (!authService.isLoggedIn()) {
            toast.error('Vui lòng đăng nhập để thêm giao dịch!');
            return;
        }

        // Validate
        errors.amount = '';
        errors.categoryId = '';
        errors.spentAt = '';

        if (!formData.amount || parseCurrency(formData.amount) <= 0) {
            errors.amount = 'Vui lòng nhập số tiền hợp lệ';
            return;
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Vui lòng chọn danh mục';
            return;
        }

        if (!formData.spentAt) {
            errors.spentAt = 'Vui lòng chọn ngày';
            return;
        }

        const currentUser = authService.getCurrentUser();

        // Tạo FormData
        const submitData = new FormData();
        submitData.append('type', formData.type);
        submitData.append('amount', parseCurrency(formData.amount));
        submitData.append('categoryId', formData.categoryId);
        submitData.append('notes', formData.note);
        submitData.append('spentAt', formData.spentAt);
        submitData.append('userId', currentUser.id);

        // Thêm file ảnh nếu có
        // if (formData.receiptUrl && formData.receiptUrl.startsWith('blob:')) {
        //     const fileInput = document.querySelector('input[type="file"]');
        //     if (fileInput && fileInput.files[0]) {
        //         submitData.append('receipt', fileInput.files[0]);
        //     }
        // }

        // Emit event để parent component xử lý
        emit('transaction-added', submitData);

        // Reset form
        formData.type = 'expense';
        formData.amount = '';
        formData.categoryId = '';
        formData.note = '';
        formData.spentAt = new Date().toISOString().split('T')[0];
        formData.receiptUrl = '';

        toast.success('Giao dịch đã được thêm thành công!');
    } catch (err) {
        console.error('Lỗi khi thêm giao dịch:', err);
        toast.error('Có lỗi xảy ra khi thêm giao dịch!');
    }
};

// Kiểm tra đăng nhập khi component mount
onMounted(() => {
    if (!authService.isLoggedIn()) {
        toast.warning('Vui lòng đăng nhập để sử dụng tính năng này!');
    }
});
</script>

<style scoped>
.animate-fade {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>