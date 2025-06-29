<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>
                    <i class="bi bi-tag"></i>
                    Phân Loại Giao Dịch
                </h3>
                <button class="btn-close" @click="closeModal">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <!-- Transaction Info -->
                <div class="transaction-info-card">
                    <div class="transaction-header">
                        <div class="amount">{{ formatCurrency(transaction?.amount) }}</div>
                        <div class="date">{{ formatDate(transaction?.spentAt) }}</div>
                    </div>
                    <div class="transaction-details">
                        <div class="note">
                            <strong>Ghi chú:</strong> {{ transaction?.note || 'Không có ghi chú' }}
                        </div>
                        <div class="category">
                            <strong>Danh mục:</strong>
                            <span class="category-badge">
                                {{ transaction?.categoryName || 'Chưa phân loại' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Jar Selection -->
                <div class="jar-selection">
                    <h4>Chọn hũ để phân loại:</h4>
                    <div class="jars-grid">
                        <div v-for="jar in jars" :key="jar.id" class="jar-option"
                            :class="{ selected: selectedJarId === jar.id }" @click="selectJar(jar.id)">
                            <div class="jar-icon">{{ jar.icon }}</div>
                            <div class="jar-info">
                                <div class="jar-name">{{ jar.jarDisplayName }}</div>
                                <div class="jar-percentage">{{ jar.percentage }}%</div>
                            </div>
                            <div class="selection-indicator">
                                <i v-if="selectedJarId === jar.id" class="bi bi-check-circle-fill"></i>
                                <i v-else class="bi bi-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Note -->
                <div class="additional-note">
                    <label for="additionalNote">Ghi chú bổ sung (tùy chọn):</label>
                    <textarea id="additionalNote" v-model="additionalNote" class="form-control" rows="3"
                        placeholder="Thêm ghi chú chi tiết cho giao dịch này..."></textarea>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" @click="closeModal">
                    <i class="bi bi-x"></i>
                    Hủy
                </button>
                <button class="btn btn-primary" @click="classifyTransaction" :disabled="!selectedJarId || classifying">
                    <i v-if="classifying" class="spinner-border spinner-border-sm me-2"></i>
                    <i v-else class="bi bi-check"></i>
                    {{ classifying ? 'Đang phân loại...' : 'Phân Loại' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import moneyJarsService from '@/service/moneyJarsService.js'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    transaction: {
        type: Object,
        default: null
    },
    jars: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'classified'])

const toast = useToast()

// Data
const selectedJarId = ref(null)
const additionalNote = ref('')
const classifying = ref(false)

// Watch for transaction changes
watch(() => props.transaction, (newTransaction) => {
    if (newTransaction) {
        selectedJarId.value = null
        additionalNote.value = ''
    }
}, { immediate: true })

// Methods
const closeModal = () => {
    emit('close')
}

const selectJar = (jarId) => {
    selectedJarId.value = jarId
}

const classifyTransaction = async () => {
    if (!selectedJarId.value || !props.transaction) {
        toast.error('Vui lòng chọn hũ để phân loại')
        return
    }

    try {
        classifying.value = true

        const classificationData = {
            transactionId: props.transaction.id,
            jarId: selectedJarId.value,
            additionalNote: additionalNote.value.trim() || null
        }

        await moneyJarsService.classifyTransaction(classificationData)

        toast.success('Phân loại giao dịch thành công!')
        emit('classified')
    } catch (error) {
        console.error('Lỗi phân loại giao dịch:', error)
        toast.error('Không thể phân loại giao dịch. Vui lòng thử lại.')
    } finally {
        classifying.value = false
    }
}

// Utils
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount || 0)
}

const formatDate = (dateString) => {
    if (!dateString) return ''
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
    border-radius: 1rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.btn-close:hover {
    background: #f8f9fa;
    color: #495057;
}

.modal-body {
    padding: 1.5rem;
}

.transaction-info-card {
    background: #f8f9fa;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid #007bff;
}

.transaction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
}

.date {
    font-size: 0.9rem;
    color: #6c757d;
}

.transaction-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.note,
.category {
    font-size: 0.95rem;
    color: #495057;
}

.category-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #e9ecef;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #495057;
    margin-left: 0.5rem;
}

.jar-selection {
    margin-bottom: 2rem;
}

.jar-selection h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1rem;
}

.jars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.jar-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
}

.jar-option:hover {
    border-color: #007bff;
    background: #f0f8ff;
}

.jar-option.selected {
    border-color: #007bff;
    background: #e3f2fd;
}

.jar-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f8f9fa;
}

.jar-info {
    flex: 1;
}

.jar-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
}

.jar-percentage {
    font-size: 0.9rem;
    color: #6c757d;
}

.selection-indicator {
    font-size: 1.25rem;
    color: #007bff;
}

.selection-indicator .bi-circle {
    color: #dee2e6;
}

.additional-note {
    margin-bottom: 1rem;
}

.additional-note label {
    display: block;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
}

.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .modal-content {
        margin: 1rem;
        max-height: calc(100vh - 2rem);
    }

    .jars-grid {
        grid-template-columns: 1fr;
    }

    .transaction-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .modal-footer {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>