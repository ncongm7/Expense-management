<template>
    <div class="comprehensive-stats">
        <h4>📊 Tổng quan tài chính</h4>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                    <div class="stat-label">Số dư hiện tại</div>
                    <div class="stat-value" :class="stats.balance >= 0 ? 'text-success' : 'text-danger'">
                        {{ stats.balance?.toLocaleString() || 0 }} ₫
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-content">
                    <div class="stat-label">Sử dụng ngân sách</div>
                    <div class="stat-value" :class="getBudgetColor(stats.budgetUtilization)">
                        {{ stats.budgetUtilization?.toFixed(1) || 0 }}%
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                    <div class="stat-label">Tiến độ mục tiêu</div>
                    <div class="stat-value" :class="getGoalColor(stats.goalsProgress)">
                        {{ stats.goalsProgress?.toFixed(1) || 0 }}%
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-content">
                    <div class="stat-label">Ngân sách đang hoạt động</div>
                    <div class="stat-value">{{ stats.activeBudgets || 0 }}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                    <div class="stat-label">Mục tiêu đang theo dõi</div>
                    <div class="stat-value">{{ stats.activeGoals || 0 }}</div>
                </div>
            </div>
        </div>

        <div class="insights" v-if="insights.length > 0">
            <h5>💡 Gợi ý</h5>
            <ul>
                <li v-for="insight in insights" :key="insight.id" :class="insight.type">
                    {{ insight.message }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import businessLogicService from '@/service/businessLogicService.js';

const stats = ref({
    balance: 0,
    budgetUtilization: 0,
    goalsProgress: 0,
    activeBudgets: 0,
    activeGoals: 0
});

const insights = ref([]);

async function fetchStats() {
    try {
        const data = await businessLogicService.getComprehensiveStats();
        if (data) {
            stats.value = data;
            generateInsights();
        }
    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
    }
}

function generateInsights() {
    insights.value = [];

    // Kiểm tra ngân sách
    if (stats.value.budgetUtilization > 100) {
        insights.value.push({
            id: 1,
            type: 'warning',
            message: '⚠️ Bạn đang vượt ngân sách! Hãy kiểm soát chi tiêu tốt hơn.'
        });
    } else if (stats.value.budgetUtilization > 80) {
        insights.value.push({
            id: 2,
            type: 'info',
            message: '💡 Sắp hết ngân sách tháng này. Hãy chi tiêu cẩn thận hơn.'
        });
    }

    // Kiểm tra mục tiêu
    if (stats.value.goalsProgress < 50) {
        insights.value.push({
            id: 3,
            type: 'warning',
            message: '🎯 Tiến độ mục tiêu chậm. Hãy tăng cường tiết kiệm!'
        });
    } else if (stats.value.goalsProgress > 80) {
        insights.value.push({
            id: 4,
            type: 'success',
            message: '🎉 Tuyệt vời! Bạn đang tiến gần đến mục tiêu.'
        });
    }

    // Kiểm tra số dư
    if (stats.value.balance < 0) {
        insights.value.push({
            id: 5,
            type: 'danger',
            message: '🚨 Số dư âm! Hãy giảm chi tiêu hoặc tăng thu nhập.'
        });
    }
}

function getBudgetColor(percentage) {
    if (percentage >= 100) return 'text-danger';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
}

function getGoalColor(percentage) {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-danger';
}

onMounted(fetchStats);
</script>

<style scoped>
.comprehensive-stats {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(80, 80, 180, 0.06);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.stat-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    border-left: 4px solid #3b82f6;
}

.stat-icon {
    font-size: 2rem;
    margin-right: 1rem;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 700;
}

.insights {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
}

.insights h5 {
    margin-bottom: 1rem;
    color: #1f2937;
}

.insights ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.insights li {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid;
}

.insights li.warning {
    background: #fef3c7;
    border-left-color: #f59e0b;
    color: #92400e;
}

.insights li.info {
    background: #dbeafe;
    border-left-color: #3b82f6;
    color: #1e40af;
}

.insights li.success {
    background: #d1fae5;
    border-left-color: #10b981;
    color: #065f46;
}

.insights li.danger {
    background: #fee2e2;
    border-left-color: #ef4444;
    color: #991b1b;
}

.text-success {
    color: #10b981;
}

.text-danger {
    color: #ef4444;
}

.text-warning {
    color: #f59e0b;
}
</style>