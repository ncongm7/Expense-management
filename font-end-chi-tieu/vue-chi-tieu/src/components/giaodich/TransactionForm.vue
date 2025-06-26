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
                            <input v-model="form.type" class="form-check-input" type="radio" value="expense"
                                id="expenseRadio">
                            <label class="form-check-label" for="expenseRadio">Chi tiêu</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="form.type" class="form-check-input" type="radio" value="income"
                                id="incomeRadio">
                            <label class="form-check-label" for="incomeRadio">Thu nhập</label>
                        </div>
                    </div>
                    <!-- Số tiền -->
                    <div class="col-md-6">
                        <label class="form-label">Số tiền (₫)</label>
                        <div class="input-group">
                            <span class="input-group-text">₫</span>
                            <input v-model="displayAmount" @input="onAmountInput" type="text" class="form-control"
                                required />
                        </div>
                    </div>
                    <!-- Danh mục -->
                    <div class="col-md-6">
                        <label class="form-label">Danh mục</label>
                        <select v-model="form.categoryId" class="form-select" required>
                            <option disabled value="">-- Chọn danh mục --</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.icon }} {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <!-- Ngày chi -->
                    <div class="col-md-6">
                        <label class="form-label">Ngày</label>
                        <input v-model="form.spentAt" type="date" class="form-control" required />
                    </div>
                    <!-- Ghi chú -->
                    <div class="col-md-6">
                        <label class="form-label">Ghi chú</label>
                        <input v-model="form.notes" type="text" class="form-control" placeholder="Ví dụ: Cà phê sáng" />
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
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import authService from '../../service/authService.js';

const toast = useToast();

const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['transaction-added']);

// Form data
const form = ref({
    type: 'expense',
    amount: null,
    categoryId: '',
    notes: '',
    spentAt: new Date().toISOString().split('T')[0],
    receipt: null,
});

// Biến hiển thị số tiền đã format
const displayAmount = ref('');

// Khi form.amount thay đổi (ví dụ khi reset form), cập nhật displayAmount
watch(() => form.value.amount, (newVal) => {
    if (newVal !== null && newVal !== undefined && newVal !== '') {
        displayAmount.value = formatNumber(newVal);
    } else {
        displayAmount.value = '';
    }
});

// Hàm format số (dùng dấu phẩy, nếu muốn dấu chấm thì thay ',' thành '.')
function formatNumber(value) {
    return value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Khi người dùng nhập vào input
function onAmountInput(e) {
    // Lấy giá trị, loại bỏ ký tự không phải số
    let raw = e.target.value.replace(/[^0-9]/g, '');
    // Cập nhật model thực tế
    form.value.amount = raw ? parseInt(raw, 10) : null;
    // Hiển thị lại đã format
    displayAmount.value = raw ? formatNumber(raw) : '';
}

/**
 * Xử lý khi user chọn file ảnh
 * @param {Event} event - Event từ input file
 */
const handleFileUpload = (event) => {
    form.value.receipt = event.target.files[0];
    toast.info('Ảnh hóa đơn đã được chọn!');
};

/**
 * Kiểm tra user đã đăng nhập chưa
 * @returns {boolean} True nếu đã đăng nhập
 */
const checkUserLogin = () => {
    if (!authService.isLoggedIn()) {
        toast.error('Vui lòng đăng nhập để thêm giao dịch!');
        return false;
    }
    return true;
};

/**
 * Xử lý khi submit form
 * Thêm userId vào formData trước khi gửi
 */
const handleSubmit = async () => {
    // Kiểm tra user đã đăng nhập chưa
    if (!checkUserLogin()) {
        return;
    }

    try {
        // Lấy thông tin user hiện tại
        const currentUser = authService.getCurrentUser();

        // Tạo FormData
        const formData = new FormData();
        formData.append('type', form.value.type);
        formData.append('amount', form.value.amount);
        formData.append('categoryId', form.value.categoryId);
        formData.append('notes', form.value.notes);
        formData.append('spentAt', form.value.spentAt);

        // Thêm userId
        const currentUser1 = authService.getCurrentUser();
        formData.append('userId', currentUser.id);



        // Thêm file ảnh nếu có
        if (form.value.receipt) {
            formData.append('receipt', form.value.receipt);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }


        // Emit event để parent component xử lý
        emit('transaction-added', formData);

        // Reset form
        form.value = {
            type: 'expense',
            amount: null,
            categoryId: '',
            notes: '',
            spentAt: new Date().toISOString().split('T')[0],
            receipt: null,
        };
        displayAmount.value = '';
    } catch (err) {
        console.error('Lỗi lưu giao dịch:', err);
        toast.error('Không thể lưu giao dịch!');
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