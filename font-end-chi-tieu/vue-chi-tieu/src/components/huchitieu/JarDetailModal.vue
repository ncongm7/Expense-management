<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <!-- Header -->
            <div class="modal-header">
                <div class="jar-header">
                    <div class="jar-icon-large" :style="{ color: jar?.color }">
                        {{ jar?.icon }}
                    </div>
                    <div class="jar-title">
                        <h2>{{ jar?.jarDisplayName }}</h2>
                        <p class="jar-description">{{ jar?.description }}</p>
                    </div>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Jar Stats -->
            <div class="jar-stats">
                <div class="stat-item">
                    <div class="stat-label">Số tiền hiện tại</div>
                    <div class="stat-value">{{ formatCurrency(jar?.currentAmount) }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Mục tiêu</div>
                    <div class="stat-value">{{ formatCurrency(jar?.targetAmount) }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Tỷ lệ phân bổ</div>
                    <div class="stat-value">{{ jar?.percentage }}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Tiến độ</div>
                    <div class="stat-value">{{ progressPercentage }}%</div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-section">
                <div class="progress-container">
                    <div class="progress-bar-large">
                        <div class="progress-fill-large" :style="{
                            width: `${progressPercentage}%`,
                            backgroundColor: jar?.color
                        }"></div>
                    </div>
                    <div class="progress-text-large">
                        {{ formatCurrency(jar?.currentAmount) }} / {{ formatCurrency(jar?.targetAmount) }}
                    </div>
                </div>
            </div>

            <!-- Transactions History -->
            <div class="transactions-section">
                <h3>Lịch sử giao dịch</h3>
                <div v-if="transactions.length === 0" class="no-transactions">
                    <i class="bi bi-inbox"></i>
                    <p>Chưa có giao dịch nào</p>
                </div>
                <div v-else class="transactions-list">
                    <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
                        <div class="transaction-icon">
                            <i :class="getTransactionIcon(transaction.transactionType)"></i>
                        </div>
                        <div class="transaction-info">
                            <div class="transaction-amount">
                                {{ formatCurrency(transaction.amount) }}
                            </div>
                            <div class="transaction-note">{{ transaction.note || 'Không có ghi chú' }}</div>
                            <div class="transaction-date">{{ formatDate(transaction.createdAt) }}</div>
                        </div>
                        <div class="transaction-type">
                            <span :class="getTransactionTypeClass(transaction.transactionType)">
                                {{ getTransactionTypeText(transaction.transactionType) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
                <button class="btn btn-outline-secondary" @click="$emit('close')">
                    Đóng
                </button>
                <button class="btn btn-primary" @click="refreshData">
                    <i class="bi bi-arrow-clockwise"></i>
                    Làm mới
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import moneyJarsService from '@/service/moneyJarsService.js'

const toast = useToast()

const props = defineProps({
    show: Boolean,
    jar: Object
})

const emit = defineEmits(['close', 'refresh'])

const transactions = ref([])
const loading = ref(false)

// Computed
const progressPercentage = computed(() => {
    if (!props.jar?.targetAmount || props.jar.targetAmount === 0) return 0
    const percentage = (props.jar.currentAmount / props.jar.targetAmount) * 100
    return Math.min(Math.round(percentage), 100)
})

// Watch for jar changes
watch(() => props.jar, async (newJar) => {
    if (newJar && props.show) {
        await loadTransactions()
    }
}, { immediate: true })

// Methods
const loadTransactions = async () => {
    if (!props.jar?.id) return

    try {
        loading.value = true
        const data = await moneyJarsService.getJarTransactions(props.jar.id)
        transactions.value = data
    } catch (error) {
        console.error('Lỗi tải lịch sử giao dịch:', error)
        toast.error('Không thể tải lịch sử giao dịch')
    } finally {
        loading.value = false
    }
}

const refreshData = async () => {
    await loadTransactions()
    emit('refresh')
    toast.success('Đã làm mới dữ liệu')
}

const getTransactionIcon = (type) => {
    switch (type) {
        case 'allocation': return 'bi bi-plus-circle text-success'
        case 'withdrawal': return 'bi bi-dash-circle text-danger'
        case 'transfer': return 'bi bi-arrow-left-right text-primary'
        default: return 'bi bi-circle text-secondary'
    }
}

const getTransactionTypeText = (type) => {
    switch (type) {
        case 'allocation': return 'Phân bổ'
        case 'withdrawal': return 'Rút tiền'
        case 'transfer': return 'Chuyển khoản'
        default: return 'Khác'
    }
}

const getTransactionTypeClass = (type) => {
    switch (type) {
        case 'allocation': return 'badge bg-success'
        case 'withdrawal': return 'badge bg-danger'
        case 'transfer': return 'badge bg-primary'
        default: return 'badge bg-secondary'
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

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
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
    background: white;
    border-radius: 1.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e9ecef;
}

.jar-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.jar-icon-large {
    font-size: 3rem;
}

.jar-title h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.jar-description {
    margin: 0.25rem 0 0 0;
    color: #6c757d;
    font-size: 0.9rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.btn-close:hover {
    background: #f8f9fa;
}

.jar-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: #f8f9fa;
    margin: 1rem 2rem;
    border-radius: 1rem;
}

.stat-item {
    text-align: center;
}

.stat-label {
    font-size: 0.8rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
}

.progress-section {
    padding: 0 2rem 1.5rem 2rem;
}

.progress-container {
    text-align: center;
}

.progress-bar-large {
    height: 12px;
    background: #e9ecef;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill-large {
    height: 100%;
    transition: width 0.8s ease-in-out;
    border-radius: 6px;
}

.progress-text-large {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
}

.transactions-section {
    padding: 0 2rem 1.5rem 2rem;
}

.transactions-section h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1rem;
}

.no-transactions {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}

.no-transactions i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.transactions-list {
    max-height: 300px;
    overflow-y: auto;
}

.transaction-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #f1f3f4;
    transition: background-color 0.2s;
}

.transaction-item:hover {
    background: #f8f9fa;
}

.transaction-item:last-child {
    border-bottom: none;
}

.transaction-icon {
    font-size: 1.5rem;
    width: 40px;
    text-align: center;
}

.transaction-info {
    flex: 1;
}

.transaction-amount {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
}

.transaction-note {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.transaction-date {
    font-size: 0.8rem;
    color: #adb5bd;
}

.transaction-type {
    text-align: right;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
    border-radius: 0 0 1.5rem 1.5rem;
}

@media (max-width: 768px) {
    .modal-content {
        margin: 1rem;
        max-height: 95vh;
    }

    .modal-header {
        padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    .jar-stats {
        margin: 1rem 1.5rem;
        padding: 1rem 1.5rem;
    }

    .progress-section,
    .transactions-section {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }

    .modal-actions {
        padding: 1rem 1.5rem;
    }
}
</style>