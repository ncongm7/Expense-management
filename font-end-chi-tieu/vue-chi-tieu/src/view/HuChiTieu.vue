<template>
    <div class="hu-chi-tieu">
        <!-- Header -->
        <div class="page-header">
            <h1 class="page-title">
                <i class="bi bi-piggy-bank"></i>
                Hũ Chi Tiêu
            </h1>
            <p class="page-subtitle">Quản lý tài chính theo phương pháp 5 hũ</p>
        </div>

        <!-- 5 Jars Grid -->
        <div class="jars-section mb-4">
            <div class="section-header">
                <h2 class="d-flex align-items-center gap-2">
                    5 Hũ Chi Tiêu
                    <!-- Nút thông báo giao dịch chưa phân loại -->
                    <button v-if="unclassifiedTransactions.length > 0"
                        class="btn btn-warning position-relative btn-unclassified"
                        @click="showUnclassifiedModal = true">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span class="badge bg-danger position-absolute top-0 start-100 translate-middle">{{
                            unclassifiedTransactions.length }}</span>
                    </button>
                </h2>
                <div class="header-actions">
                    <button class="btn btn-outline-primary btn-sm" @click="showAllocateModal = true">
                        <i class="bi bi-plus-circle"></i>
                        Phân Bổ Thu Nhập
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="showTransferModal = true">
                        <i class="bi bi-arrow-left-right"></i>
                        Chuyển Tiền
                    </button>
                </div>
            </div>

            <div class="jars-grid">
                <JarCard v-for="jar in moneyJars" :key="jar.id" :jar="jar" @click="selectJar(jar)" @edit="editJar(jar)">
                    <template #key>
                        <span class="key-badge">{{ jar.key || '?' }}</span>
                    </template>
                </JarCard>
            </div>
        </div>

        <!-- Summary Cards -->


        <!-- Unclassified Transactions Section -->
        <!-- <div class="unclassified-section">
            <div class="section-header">
                <h2>
                    <i class="bi bi-exclamation-triangle"></i>
                    Giao Dịch Chưa Phân Loại
                    <span v-if="unclassifiedTransactions.length > 0" class="badge bg-warning">
                        {{ unclassifiedTransactions.length }}
                    </span>
                </h2>
                <button class="btn btn-outline-info btn-sm" @click="fetchUnclassifiedTransactions" :disabled="loading">
                    <i class="bi bi-arrow-clockwise"></i>
                    Làm mới
                </button>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p>Đang tải giao dịch chưa phân loại...</p>
            </div>

            <div v-else-if="unclassifiedTransactions.length === 0" class="empty-state">
                <i class="bi bi-check-circle text-success"></i>
                <h4>Tất cả giao dịch đã được phân loại!</h4>
                <p>Không có giao dịch nào cần phân loại thủ công.</p>
            </div>

            <div v-else class="transactions-list">
                <div v-for="transaction in unclassifiedTransactions" :key="transaction.id" class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-amount">
                            {{ formatCurrency(transaction.amount) }}
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-note">{{ transaction.note || 'Không có ghi chú' }}</div>
                            <div class="transaction-date">{{ formatDate(transaction.spentAt) }}</div>
                            <div class="transaction-category">
                                <span class="category-badge">
                                    {{ transaction.category?.name || 'Chưa phân loại' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="transaction-actions">
                        <button class="btn btn-primary btn-sm" @click="openClassifyModal(transaction)">
                            <i class="bi bi-tag"></i>
                            Phân Loại
                        </button>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Jar Details Modal -->
        <JarDetailModal :show="showDetailModal" :jar="selectedJar" @close="showDetailModal = false"
            @refresh="fetchData" />

        <!-- Allocate Income Modal -->
        <AllocateIncomeModal :show="showAllocateModal" :jars="moneyJars" @close="showAllocateModal = false"
            @allocated="onIncomeAllocated" />

        <!-- Transfer Money Modal -->
        <TransferMoneyModal :show="showTransferModal" :jars="moneyJars" @close="showTransferModal = false"
            @transferred="onMoneyTransferred" />

        <!-- Edit Jar Modal -->
        <EditJarModal :show="showEditModal" :jar="editingJar" @close="showEditModal = false" @updated="onJarUpdated" />

        <!-- Classify Transaction Modal -->
        <ClassifyTransactionModal :show="showClassifyModal" :transaction="selectedTransaction" :jars="moneyJars"
            @close="showClassifyModal = false" @classified="onTransactionClassified" />

        <!-- Modal giao dịch chưa phân loại -->
        <template v-if="showUnclassifiedModal">
            <div class="modal-unclassified-overlay" @click.self="showUnclassifiedModal = false">
                <div class="modal-unclassified">
                    <div class="modal-header d-flex align-items-center justify-content-between">
                        <h4 class="mb-0"><i class="bi bi-exclamation-triangle text-warning me-2"></i>Giao Dịch Chưa Phân
                            Loại</h4>
                        <button class="btn-close" @click="showUnclassifiedModal = false"></button>
                    </div>
                    <div v-if="loading" class="loading-state">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <p>Đang tải giao dịch chưa phân loại...</p>
                    </div>
                    <div v-else-if="unclassifiedTransactions.length === 0" class="empty-state">
                        <i class="bi bi-check-circle text-success"></i>
                        <h4>Tất cả giao dịch đã được phân loại!</h4>
                        <p>Không có giao dịch nào cần phân loại thủ công.</p>
                    </div>
                    <div v-else class="transactions-list-modal">
                        <div v-for="transaction in unclassifiedTransactions" :key="transaction.id"
                            class="transaction-item-modal">
                            <div class="transaction-info">
                                <div class="transaction-amount">{{ formatCurrency(transaction.amount) }}</div>
                                <div class="transaction-details">
                                    <div class="transaction-note">{{ transaction.note || 'Không có ghi chú' }}</div>
                                    <div class="transaction-date">{{ formatDate(transaction.spentAt) }}</div>
                                    <div class="transaction-category">
                                        <span class="category-badge">{{ transaction.category?.name || 'Chưa phân loại'
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="transaction-actions">
                                <button class="btn btn-primary btn-sm" @click="openClassifyModal(transaction); showUnclassifiedModal = false" >
                                    <i class="bi bi-tag"></i> Phân Loại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Hướng dẫn sử dụng key (di chuyển xuống dưới cùng) -->
        <div class="key-guide mt-5">
            <div class="key-guide-title">
                <i class="bi bi-keyboard me-2"></i>
                <strong>Phím tắt phân loại giao dịch</strong>
            </div>
            <ul class="key-list">
                <li v-for="jar in moneyJars" :key="jar.id">
                    <span class="key-badge">{{ jar.key || '?' }}</span>
                    <span class="jar-name">{{ jar.jarDisplayName }}</span>
                </li>
            </ul>
            <div class="key-guide-desc text-muted">
                Bạn có thể gán phím tắt (số, chữ cái) cho từng hũ để phân loại nhanh.<br>
                Khi phân loại giao dịch, chỉ cần nhấn phím tương ứng để chọn hũ.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import moneyJarsService from '@/service/moneyJarsService.js'
import JarCard from '@/components/huchitieu/JarCard.vue'
import JarDetailModal from '@/components/huchitieu/JarDetailModal.vue'
import AllocateIncomeModal from '@/components/huchitieu/AllocateIncomeModal.vue'
import TransferMoneyModal from '@/components/huchitieu/TransferMoneyModal.vue'
import EditJarModal from '@/components/huchitieu/EditJarModal.vue'
import ClassifyTransactionModal from '@/components/huchitieu/ClassifyTransactionModal.vue'

const toast = useToast()

// Data
const moneyJars = ref([])
const summary = ref({
    totalAmount: 0,
    totalTarget: 0,
    progressPercentage: 0,
    remainingAmount: 0
})
const unclassifiedTransactions = ref([])
const loading = ref(false)

// Modal states
const showDetailModal = ref(false)
const showAllocateModal = ref(false)
const showTransferModal = ref(false)
const showEditModal = ref(false)
const showClassifyModal = ref(false)
const selectedJar = ref(null)
const editingJar = ref(null)
const selectedTransaction = ref(null)
const showUnclassifiedModal = ref(false)

// Computed summary
const calculatedSummary = computed(() => {
    const totalAmount = moneyJars.value.reduce((sum, jar) => sum + (jar.currentAmount || 0), 0)
    const totalTarget = moneyJars.value.reduce((sum, jar) => sum + (jar.targetAmount || 0), 0)
    const progressPercentage = totalTarget > 0 ? Math.min(Math.round((totalAmount / totalTarget) * 100), 100) : 0
    const remainingAmount = Math.max(totalTarget - totalAmount, 0)

    return {
        totalAmount,
        totalTarget,
        progressPercentage,
        remainingAmount
    }
})

// Fetch data
const fetchData = async () => {
    try {
        console.log('Đang tải dữ liệu hũ chi tiêu...')
        const [jarsData, summaryData] = await Promise.all([
            moneyJarsService.getMoneyJars(),
            moneyJarsService.getJarsSummary()
        ])

        moneyJars.value = jarsData
        summary.value = summaryData

        console.log('Dữ liệu hũ chi tiêu:', jarsData)
        console.log('Thống kê:', summaryData)
    } catch (error) {
        console.error('Lỗi tải dữ liệu hũ chi tiêu:', error)
        toast.error('Không thể tải dữ liệu hũ chi tiêu')
    }
}

const fetchUnclassifiedTransactions = async () => {
    try {
        loading.value = true
        const transactions = await moneyJarsService.getUnclassifiedTransactions()
        unclassifiedTransactions.value = transactions
        console.log('Giao dịch chưa phân loại:', transactions)
    } catch (error) {
        console.error('Lỗi tải giao dịch chưa phân loại:', error)
        toast.error('Không thể tải giao dịch chưa phân loại')
    } finally {
        loading.value = false
    }
}

// Actions
const selectJar = (jar) => {
    selectedJar.value = jar
    showDetailModal.value = true
}

const editJar = (jar) => {
    editingJar.value = jar
    showEditModal.value = true
}

const openClassifyModal = (transaction) => {
    selectedTransaction.value = transaction
    showClassifyModal.value = true
}

const onIncomeAllocated = async () => {
    showAllocateModal.value = false
    await fetchData()
    toast.success('Phân bổ thu nhập thành công!')
}

const onMoneyTransferred = async () => {
    showTransferModal.value = false
    await fetchData()
    toast.success('Chuyển tiền thành công!')
}

const onJarUpdated = async () => {
    showEditModal.value = false
    await fetchData()
    toast.success('Cập nhật hũ thành công!')
}

const onTransactionClassified = async () => {
    showClassifyModal.value = false
    selectedTransaction.value = null
    await fetchUnclassifiedTransactions()
    await fetchData()
    toast.success('Phân loại giao dịch thành công!')
}

// Utils
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount || 0)
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

onMounted(() => {
    fetchData()
    fetchUnclassifiedTransactions()
})
</script>

<style scoped>
.hu-chi-tieu {
    padding: 2rem;
    background: #f8f9fa;
    min-height: 100vh;
}

.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #6c757d;
    margin: 0;
}

.jars-section {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.section-header h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.jars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.summary-section {
    margin-bottom: 3rem;
}

.summary-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;
}

.summary-card:hover {
    transform: translateY(-2px);
}

.card-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.summary-card.total .card-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.summary-card.target .card-icon {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.summary-card.progress .card-icon {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
}

.summary-card.remaining .card-icon {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
}

.card-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #2c3e50;
}

.card-content p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
}

.unclassified-section {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
}

.loading-state p {
    margin-top: 1rem;
    font-size: 1.1rem;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.empty-state h4 {
    color: #28a745;
    margin-bottom: 0.5rem;
}

.transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.75rem;
    background: #f8f9fa;
    transition: all 0.2s;
}

.transaction-item:hover {
    border-color: #007bff;
    background: #f0f8ff;
}

.transaction-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.transaction-amount {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    min-width: 120px;
}

.transaction-details {
    flex: 1;
}

.transaction-note {
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 0.25rem;
}

.transaction-date {
    font-size: 0.8rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.category-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #e9ecef;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #495057;
}

.transaction-actions {
    display: flex;
    gap: 0.5rem;
}

.key-guide {
    background: #fffbe6;
    border: 1.5px solid #ffe58f;
    border-radius: 1.2rem;
    padding: 2rem 2.5rem 1.5rem 2.5rem;
    margin: 3rem auto 0 auto;
    max-width: 480px;
    box-shadow: 0 4px 24px 0 rgba(255, 215, 64, 0.10);
    text-align: center;
    font-size: 1.08rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.key-guide-title {
    font-size: 1.2rem;
    color: #b8860b;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.key-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    justify-content: center;
}

.key-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.08rem;
    background: #fff;
    border-radius: 0.7rem;
    box-shadow: 0 2px 8px 0 rgba(255, 215, 64, 0.07);
    padding: 0.4rem 1.1rem;
    margin-bottom: 0.2rem;
}

.key-badge {
    display: inline-block;
    min-width: 1.8em;
    padding: 2px 10px;
    background: #ffe58f;
    border-radius: 8px;
    color: #b8860b;
    font-weight: 700;
    font-family: monospace;
    border: 1px solid #ffe58f;
    text-align: center;
    font-size: 1.1rem;
}

.jar-name {
    color: #2c3e50;
    font-weight: 500;
}

.key-guide-desc {
    font-size: 0.98rem;
    margin-top: 0.7rem;
    color: #b8860b;
}

@media (max-width: 600px) {
    .key-guide {
        padding: 1.2rem 0.5rem 1rem 0.5rem;
        max-width: 98vw;
    }

    .key-list {
        gap: 0.5rem;
    }

    .key-list li {
        padding: 0.3rem 0.7rem;
        font-size: 0.98rem;
    }
}

.btn-unclassified {
    position: relative;
    padding: 0.3rem 0.7rem 0.3rem 0.7rem;
    font-size: 1.1rem;
    border-radius: 1.2rem;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.btn-unclassified .badge {
    font-size: 0.85rem;
    padding: 0.2em 0.5em;
}

.modal-unclassified-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-unclassified {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
    max-width: 480px;
    width: 98vw;
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    position: relative;
    animation: fadeIn 0.18s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.modal-header {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
}

.transactions-list-modal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 60vh;
    overflow-y: auto;
}

.transaction-item-modal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 0.75rem;
    background: #f8f9fa;
    transition: all 0.2s;
}

.transaction-item-modal:hover {
    border-color: #007bff;
    background: #f0f8ff;
}
</style>