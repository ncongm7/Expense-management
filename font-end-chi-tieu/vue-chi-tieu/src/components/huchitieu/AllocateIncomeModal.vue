<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3><i class="bi bi-plus-circle"></i> Phân Bổ Thu Nhập</h3>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>Số tiền thu nhập</label>
                    <input v-model="incomeAmount" type="number" class="form-control" placeholder="Nhập số tiền thu nhập"
                        @input="calculateAllocation">
                </div>

                <div class="allocation-preview">
                    <h4>Phân bổ tự động:</h4>
                    <div class="allocation-grid">
                        <div v-for="jar in jars" :key="jar.id" class="allocation-item"
                            :style="{ borderColor: jar.color }">
                            <div class="allocation-icon">{{ jar.icon }}</div>
                            <div class="allocation-info">
                                <div class="allocation-name">{{ jar.jarDisplayName }}</div>
                                <div class="allocation-amount">{{ formatCurrency(allocation[jar.jarName] || 0) }}</div>
                                <div class="allocation-percentage">{{ jar.percentage }}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn btn-outline-secondary" @click="$emit('close')">
                    Hủy
                </button>
                <button class="btn btn-primary" @click="allocateIncome" :disabled="!incomeAmount || incomeAmount <= 0">
                    <i class="bi bi-check-lg"></i>
                    Phân Bổ
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import moneyJarsService from '@/service/moneyJarsService.js'

const toast = useToast()

const props = defineProps({
    show: Boolean,
    jars: Array
})

const emit = defineEmits(['close', 'allocated'])

const incomeAmount = ref('')
const allocation = ref({})

const calculateAllocation = () => {
    if (!incomeAmount.value || incomeAmount.value <= 0) {
        allocation.value = {}
        return
    }

    const amount = parseFloat(incomeAmount.value)
    allocation.value = moneyJarsService.calculateAllocation(amount)
}

const allocateIncome = async () => {
    try {
        await moneyJarsService.allocateIncome(parseFloat(incomeAmount.value))
        emit('allocated')
        toast.success('Phân bổ thu nhập thành công!')
    } catch (error) {
        toast.error('Lỗi phân bổ thu nhập')
    }
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0)
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 1rem;
}

.modal-content {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 1rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 123, 255, 0.1);
    animation: fadeIn 0.3s ease-in-out;
    overflow: hidden;
    /* Ngăn nội dung tràn ra ngoài */
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
    margin: 0;
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    color: #6c757d;
    cursor: pointer;
    transition: color 0.2s;
}

.btn-close:hover {
    color: #dc3545;
}

.modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    /* Giới hạn chiều cao */
    overflow-y: auto;
    /* Thêm scroll nếu nội dung dài */
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.5rem;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.allocation-preview h4 {
    margin-bottom: 1rem;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    font-weight: 600;
    color: #2c3e50;
}

.allocation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    /* Giảm kích thước tối thiểu */
    gap: 1rem;
}

.allocation-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    /* Giảm khoảng cách */
    padding: 0.75rem;
    border: 2px solid;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    background: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.allocation-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.allocation-icon {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    /* Giảm kích thước icon */
    width: 40px;
    /* Giảm chiều rộng */
    text-align: center;
    color: #2c3e50;
}

.allocation-info {
    flex: 1;
    text-align: left;
}

.allocation-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
    font-size: clamp(0.8rem, 2vw, 1rem);
}

.allocation-amount {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    /* Giảm kích thước */
    font-weight: 700;
    color: #28a745;
    margin-bottom: 0.25rem;
}

.allocation-percentage {
    font-size: clamp(0.6rem, 1.5vw, 0.8rem);
    /* Giảm kích thước */
    color: #6c757d;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    background: #ffffff;
    border-radius: 0 0 1rem 1rem;
}

.btn {
    padding: 0.5rem 1rem;
    /* Giảm padding */
    border-radius: 0.5rem;
    font-size: clamp(0.8rem, 2vw, 1rem);
    transition: all 0.3s ease;
}

.btn-outline-secondary {
    color: #6c757d;
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #ffffff;
}

.btn-primary {
    background-color: #007bff;
    color: #ffffff;
    border: none;
}

.btn-primary:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

@media (max-width: 576px) {
    .modal-content {
        width: 85%;
        /* Giảm xuống để vừa màn hình nhỏ */
        max-height: 80vh;
        /* Giới hạn chiều cao */
    }

    .allocation-grid {
        grid-template-columns: 1fr;
    }

    .modal-actions {
        flex-direction: column;
        gap: 0.5rem;
    }

    .btn {
        width: 100%;
    }
}

@media (min-width: 577px) and (max-width: 768px) {
    .modal-content {
        width: 80%;
        /* Giảm xuống để vừa màn hình trung */
        max-height: 75vh;
    }

    .allocation-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 769px) {
    .modal-content {
        width: 500px;
        /* Cố định kích thước tối đa */
        max-height: 70vh;
    }
}
</style>