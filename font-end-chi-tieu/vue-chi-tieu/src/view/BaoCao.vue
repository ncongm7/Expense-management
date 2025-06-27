<template>
    <div>
        <h1>Báo Cáo</h1>
        <ReportSummary />
        <div class="charts-row" style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <ReportPieChart />
            <ReportBarChart />
        </div>
        <ReportCategoryTable />
        <ReportTransactionList />
        <ReportBudgetCompare />
        <ReportGoalProgress />
    </div>
</template>

<script setup>
import ReportSummary from '@/components/baocao/ReportSummary.vue'
import ReportPieChart from '@/components/baocao/ReportPieChart.vue'
import ReportBarChart from '@/components/baocao/ReportBarChart.vue'
import ReportCategoryTable from '@/components/baocao/ReportCategoryTable.vue'
import ReportTransactionList from '@/components/baocao/ReportTransactionList.vue'
import ReportBudgetCompare from '@/components/baocao/ReportBudgetCompare.vue'
import ReportGoalProgress from '@/components/baocao/ReportGoalProgress.vue'
</script>

<style scoped>
.charts-row {
    margin-bottom: 2rem;
}
</style>