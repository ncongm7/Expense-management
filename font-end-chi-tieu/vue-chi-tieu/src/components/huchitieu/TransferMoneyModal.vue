<template>
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3><i class="bi bi-arrow-left-right"></i> Chuyển Tiền Giữa Hũ</h3>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>Từ hũ</label>
                    <select v-model="fromJarId" class="form-control" @change="updateAvailableAmount">
                        <option value="">Chọn hũ nguồn</option>
                        <option v-for="jar in jars" :key="jar.id" :value="jar.id" :disabled="jar.currentAmount <= 0">
                            {{ jar.jarDisplayName }} ({{ formatCurrency(jar.currentAmount) }})
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Đến hũ</label>
                    <select v-model="toJarId" class="form-control">
                        <option value="">Chọn hũ đích</option>
                        <option v-for="jar in jars" :key="jar.id" :value="jar.id" :disabled="jar.id === fromJarId">
                            {{ jar.jarDisplayName }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Số tiền chuyển</label>
                    <input v-model="transferAmount" type="number" class="form-control" :max="availableAmount"
                        :placeholder="`Tối đa: ${formatCurrency(availableAmount)}`">
                    <small class="form-text">Số tiền có sẵn: {{ formatCurrency(availableAmount) }}</small>
                </div>

                <div class="form-group">
                    <label>Ghi chú (tùy chọn)</label>
                    <textarea v-model="note" class="form-control" rows="3"
                        placeholder="Ghi chú về giao dịch chuyển tiền"></textarea>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn btn-outline-secondary" @click="$emit('close')">
                    Hủy
                </button>
                <button class="btn btn-primary" @click="transferMoney" :disabled="!canTransfer">
                    <i class="bi bi-check-lg"></i>
                    Chuyển Tiền
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

const emit = defineEmits(['close', 'transferred'])

const fromJarId = ref('')
const toJarId = ref('')
const transferAmount = ref('')
const note = ref('')
const availableAmount = ref(0)

const canTransfer = computed(() => {
    return fromJarId.value &&
        toJarId.value &&
        transferAmount.value > 0 &&
        transferAmount.value <= availableAmount.value
})

const updateAvailableAmount = () => {
    if (!fromJarId.value) {
        availableAmount.value = 0
        return
    }

    const fromJar = props.jars.find(jar => jar.id === fromJarId.value)
    availableAmount.value = fromJar ? fromJar.currentAmount : 0
}

const transferMoney = async () => {
    try {
        await moneyJarsService.transferBetweenJars(
            fromJarId.value,
            toJarId.value,
            parseFloat(transferAmount.value),
            note.value
        )
        emit('transferred')
        toast.success('Chuyển tiền thành công!')
    } catch (error) {
        toast.error('Lỗi chuyển tiền')
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
    background: white;
    border-radius: 1rem;
    max-width: 500px;
    width: 100%;
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
    font-size: 1.2rem;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #6c757d;
    cursor: pointer;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.5rem;
    font-size: 1rem;
}

.form-text {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
    border-radius: 0 0 1rem 1rem;
}
</style>