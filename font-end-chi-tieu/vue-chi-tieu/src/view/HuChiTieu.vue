<template>
    <div class="hu-chi-tieu">
        <!-- Tiêu đề trang -->
        <div class="page-header">
            <h1 class="page-title">
                <i class="bi bi-box-seam me-3 fs-4"></i>
                5 Hũ Chi Tiêu
            </h1>
            <p class="page-subtitle">Quản lý tài chính theo phương pháp 5 hũ</p>
        </div>

        <!-- Thẻ thống kê tổng quan -->
        <div class="summary-section mb-4">
            <div class="summary-container">
                <div class="summary-card total">
                    <div class="card-icon">💰</div>
                    <div class="card-content">
                        <h3>{{ formatCurrency(summary.totalAmount) }}</h3>
                        <p>Tổng tiền trong hũ</p>
                    </div>
                </div>
                <div class="summary-card target">
                    <div class="card-icon">🎯</div>
                    <div class="card-content">
                        <h3>{{ formatCurrency(summary.totalTarget) }}</h3>
                        <p>Mục tiêu tháng</p>
                    </div>
                </div>
                <div class="summary-card progress">
                    <div class="card-icon">📊</div>
                    <div class="card-content">
                        <h3>{{ summary.progressPercentage }}%</h3>
                        <p>Tiến độ hoàn thành</p>
                    </div>
                </div>
                <div class="summary-card remaining">
                    <div class="card-icon">⏳</div>
                    <div class="card-content">
                        <h3>{{ formatCurrency(summary.remainingAmount) }}</h3>
                        <p>Còn lại</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lưới 5 hũ chi tiêu -->
        <div class="jars-section">
            <div class="section-header">
                <h2>
                    <i class="bi bi-box-seam me-3 fs-4"></i>
                    5 Hũ Chi Tiêu
                </h2>
                <div class="header-actions">
                    <button class="btn btn-outline-primary btn-sm" @click="showAllocateModal = true">
                        <span class="me-1">💰</span>
                        Phân Bổ Thu Nhập
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="showTransferModal = true">
                        <span class="me-1">↔️</span>
                        Chuyển Tiền
                    </button>
                </div>
            </div>

            <div class="jars-grid">
                <JarCard v-for="jar in moneyJars" :key="jar.id" :jar="jar" @click="selectJar(jar)"
                    @edit="editJar(jar)" />
            </div>
        </div>

        <!-- Modal chi tiết hũ -->
        <JarDetailModal :show="showDetailModal" :jar="selectedJar" @close="showDetailModal = false"
            @refresh="fetchData" />

        <!-- Modal phân bổ thu nhập -->
        <AllocateIncomeModal :show="showAllocateModal" :jars="moneyJars" @close="showAllocateModal = false"
            @allocated="onIncomeAllocated" />

        <!-- Modal chuyển tiền -->
        <TransferMoneyModal :show="showTransferModal" :jars="moneyJars" @close="showTransferModal = false"
            @transferred="onMoneyTransferred" />

        <!-- Modal chỉnh sửa hũ -->
        <EditJarModal :show="showEditModal" :jar="editingJar" @close="showEditModal = false" @updated="onJarUpdated" />
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

const toast = useToast()

// Data
const moneyJars = ref([])
const summary = ref({
    totalAmount: 0,
    totalTarget: 0,
    progressPercentage: 0,
    remainingAmount: 0
})

// Modal states
const showDetailModal = ref(false)
const showAllocateModal = ref(false)
const showTransferModal = ref(false)
const showEditModal = ref(false)
const selectedJar = ref(null)
const editingJar = ref(null)

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

        console.log('Dữ liệu hũ nhận được:', jarsData)
        console.log('Thống kê nhận được:', summaryData)

        if (!jarsData || jarsData.length === 0) {
            console.log('Không có dữ liệu hũ, tạo dữ liệu mẫu...')
            moneyJars.value = [
                { id: 1, jarDisplayName: 'Hũ Nhu Cầu Thiết Yếu', currentAmount: 5000000, targetAmount: 10000000, color: '#FF6B6B' },
                { id: 2, jarDisplayName: 'Hũ Tiết Kiệm', currentAmount: 2000000, targetAmount: 4000000, color: '#4ECDC4' },
                { id: 3, jarDisplayName: 'Hũ Đầu Tư', currentAmount: 1000000, targetAmount: 2000000, color: '#45B7D1' },
                { id: 4, jarDisplayName: 'Hũ Chi Tiêu Cá Nhân', currentAmount: 800000, targetAmount: 2000000, color: '#96CEB4' },
                { id: 5, jarDisplayName: 'Hũ Cho Đi', currentAmount: 500000, targetAmount: 2000000, color: '#FFEAA7' }
            ]
        } else {
            moneyJars.value = jarsData
        }

        // Cập nhật summary từ computed
        summary.value = calculatedSummary.value
    } catch (error) {
        console.error('Lỗi tải dữ liệu hũ chi tiêu:', error)
        toast.error('Không thể tải dữ liệu hũ chi tiêu')
        moneyJars.value = [
            { id: 1, jarDisplayName: 'Hũ Nhu Cầu Thiết Yếu', currentAmount: 5000000, targetAmount: 10000000, color: '#FF6B6B' },
            { id: 2, jarDisplayName: 'Hũ Tiết Kiệm', currentAmount: 2000000, targetAmount: 4000000, color: '#4ECDC4' },
            { id: 3, jarDisplayName: 'Hũ Đầu Tư', currentAmount: 1000000, targetAmount: 2000000, color: '#45B7D1' },
            { id: 4, jarDisplayName: 'Hũ Chi Tiêu Cá Nhân', currentAmount: 800000, targetAmount: 2000000, color: '#96CEB4' },
            { id: 5, jarDisplayName: 'Hũ Cho Đi', currentAmount: 500000, targetAmount: 2000000, color: '#FFEAA7' }
        ]
        summary.value = calculatedSummary.value
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

// Utils
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount || 0)
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.hu-chi-tieu {
    padding: 1.5rem;
    background: #f8f9fa;
    min-height: 100vh;
}

.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.page-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: #6c757d;
    margin: 0;
}

.summary-section {
    margin-bottom: 2rem;
}

.summary-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    /* Căn giữa các card */
}

.summary-card {
    flex: 1;
    min-width: 200px;
    max-width: 250px;
    /* Giới hạn chiều rộng tối đa */
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 120px;
    /* Chiều cao đồng đều */
    transition: transform 0.2s;
}

.summary-card:hover {
    transform: translateY(-2px);
}

.card-icon {
    font-size: clamp(1.5rem, 4vw, 2rem);
    width: 50px;
    height: 50px;
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

.card-content {
    flex-grow: 1;
    text-align: center;
    /* Căn giữa nội dung */
}

.card-content h3 {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 700;
    margin: 0;
    color: #2c3e50;
    line-height: 1.2;
    /* Điều chỉnh dòng để tránh lệch */
}

.card-content p {
    margin: 0;
    color: #6c757d;
    font-size: clamp(0.7rem, 2vw, 0.9rem);
    line-height: 1.2;
}

.jars-section {
    background: white;
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.section-header h2 {
    font-size: clamp(1.5rem, 4vw, 1.8rem);
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.jars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 576px) {
    .hu-chi-tieu {
        padding: 1rem;
    }

    .summary-container {
        flex-direction: column;
        align-items: stretch;
    }

    .summary-card {
        width: 100%;
        max-width: none;
    }

    .section-header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-actions {
        justify-content: center;
    }

    .jars-grid {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 577px) and (max-width: 768px) {
    .summary-container {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .summary-card {
        flex: 1 1 calc(50% - 0.75rem);
        max-width: none;
    }

    .jars-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 769px) {
    .summary-container {
        justify-content: space-around;
    }
}
</style>