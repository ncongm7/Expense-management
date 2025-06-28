import transactionService from './transactionService.js';
import budgetsService from './budgetsService.js';
import goalsService from './goalsService.js';
import notificationService from './notificationService.js';
import GiaoDich from '@/view/GiaoDich.vue';

/**
 * Service xử lý logic nghiệp vụ liên quan giữa các module
 * - Cập nhật ngân sách khi có giao dịch
 * - Cập nhật mục tiêu khi có thu nhập
 * - Cảnh báo vượt ngân sách
 * - Tự động phân bổ tiền vào mục tiêu
 * - Tạo thông báo thông minh
 */
class BusinessLogicService {
    /**
     * Format period để hiển thị thân thiện
     * @param {string} period - Period value (month/week)
     * @returns {string} Formatted period
     */
    formatPeriod(period) {
        if (period === 'month') return 'Tháng';
        if (period === 'week') return 'Tuần';
        // Nếu là string dài thì extract
        if (period.includes('Tháng') || period.includes('month')) return 'Tháng';
        if (period.includes('Tuần') || period.includes('week')) return 'Tuần';
        return period; // Fallback
    }

    /**
     * Xử lý khi có giao dịch mới
     * @param {Object} transaction - Giao dịch vừa tạo
     */
    async handleNewTransaction(transaction) {
        try {
            // 1. Cập nhật ngân sách nếu là giao dịch chi tiêu
            if (transaction.type === 'expense') {
                await this.updateBudgetFromTransaction(transaction);
            }

            // 2. Cập nhật mục tiêu nếu là giao dịch thu nhập
            if (transaction.type === 'income') {
                await this.updateGoalsFromIncome(transaction);
            }

            // 3. Kiểm tra và cảnh báo vượt ngân sách
            await this.checkBudgetOverflow(transaction);

        } catch (error) {
            console.error('Lỗi xử lý logic nghiệp vụ:', error);
        }
    }

    /**
     * Cập nhật ngân sách khi có giao dịch chi tiêu
     * @param {Object} transaction - Giao dịch chi tiêu
     */
    async updateBudgetFromTransaction(transaction) {
        try {
            // Lấy danh sách ngân sách
            const budgets = await budgetsService.getBudgets();

            // Tìm ngân sách phù hợp (cùng category và trong khoảng thời gian)
            const matchingBudget = budgets.find(budget =>
                budget.categoryId === transaction.categoryId &&
                new Date(transaction.spentAt) >= new Date(budget.startDate) &&
                new Date(transaction.spentAt) <= new Date(budget.endDate)
            );
            console.log('Tìm thấy:', matchingBudget);

            if (matchingBudget) {
                // Cập nhật số tiền đã chi
                const newAmountSpent = (matchingBudget.amountSpent || 0) + transaction.amount;

                // Gọi API cập nhật ngân sách
                await budgetsService.updateBudget(matchingBudget.id, {
                    ...matchingBudget,
                    amountSpent: newAmountSpent
                });

                console.log(`Đã cập nhật ngân sách ${this.formatPeriod(matchingBudget.period)}: ${newAmountSpent.toLocaleString()}đ`);
            }
            // } else {
            //     const check = confirm('Bạn có muốn tạo ngân sách mới cho giao dịch này không?');
            //     if (check) {
            //         // TODO: Mở form tạo ngân sách mới
            //         console.log('Cần mở form tạo ngân sách mới');
            //     }
            // }

        } catch (error) {
            console.error('Lỗi cập nhật ngân sách:', error);
        }
    }

    /**
     * Cập nhật mục tiêu khi có thu nhập
     * @param {Object} transaction - Giao dịch thu nhập
     */
    async updateGoalsFromIncome(transaction) {
        try {
            // Lấy danh sách mục tiêu
            const goals = await goalsService.getGoals();

            // Tìm mục tiêu chưa hoàn thành
            const activeGoals = goals.filter(goal =>
                goal.currentAmount < goal.targetAmount &&
                new Date() <= new Date(goal.deadline)
            );

            if (activeGoals.length > 0) {
                // Tự động phân bổ 20% thu nhập vào mục tiêu đầu tiên
                const allocationAmount = transaction.amount * 0.2;
                const firstGoal = activeGoals[0];

                const newCurrentAmount = Math.min(
                    firstGoal.currentAmount + allocationAmount,
                    firstGoal.targetAmount
                );

                // Cập nhật mục tiêu
                await goalsService.updateGoal({
                    ...firstGoal,
                    currentAmount: newCurrentAmount
                });

                // Tạo thông báo
                await notificationService.createGoalUpdateNotification(firstGoal, allocationAmount);

                // Emit event để refresh notifications ngay lập tức
                window.dispatchEvent(new CustomEvent('refresh-notifications'));

                console.log(`Đã tự động tiết kiệm ${allocationAmount.toLocaleString()}đ vào mục tiêu "${firstGoal.title}"`);
            }

        } catch (error) {
            console.error('Lỗi cập nhật mục tiêu:', error);
        }
    }

    /**
     * Kiểm tra và cảnh báo vượt ngân sách
     * @param {Object} transaction - Giao dịch vừa tạo
     */
    async checkBudgetOverflow(transaction) {
        try {
            if (transaction.type !== 'expense') return;

            const budgets = await budgetsService.getBudgets();

            const matchingBudget = budgets.find(budget =>
                budget.categoryId === transaction.categoryId &&
                new Date(transaction.spentAt) >= new Date(budget.startDate) &&
                new Date(transaction.spentAt) <= new Date(budget.endDate)
            );

            if (matchingBudget) {
                const spentPercentage = (matchingBudget.amountSpent / matchingBudget.amount) * 100;

                if (spentPercentage >= 100) {
                    // Tạo thông báo vượt ngân sách
                    await notificationService.createBudgetOverflowNotification(
                        matchingBudget,
                        matchingBudget.amountSpent
                    );

                    // Emit event để refresh notifications ngay lập tức
                    window.dispatchEvent(new CustomEvent('refresh-notifications'));

                    console.warn(`⚠️ Vượt ngân sách ${this.formatPeriod(matchingBudget.period)}! Đã chi ${spentPercentage.toFixed(1)}%`);
                } else if (spentPercentage >= 80) {
                    // Tạo thông báo cảnh báo
                    await notificationService.createBudgetWarningNotification(
                        matchingBudget,
                        spentPercentage
                    );

                    // Emit event để refresh notifications ngay lập tức
                    window.dispatchEvent(new CustomEvent('refresh-notifications'));

                    console.warn(`⚠️ Sắp hết ngân sách ${this.formatPeriod(matchingBudget.period)}! Đã chi ${spentPercentage.toFixed(1)}%`);
                }
            }

        } catch (error) {
            console.error('Lỗi kiểm tra vượt ngân sách:', error);
        }
    }

    /**
     * Lấy thống kê tổng hợp
     * @returns {Object} Thống kê tổng hợp
     */
    async getComprehensiveStats() {
        try {
            const [transactions, budgets, goals] = await Promise.all([
                transactionService.getTransactions(),
                budgetsService.getBudgets(),
                goalsService.getGoals()
            ]);

            // Tính toán thống kê
            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.amountSpent || 0), 0);
            const totalBudgetAmount = budgets.reduce((sum, b) => sum + b.amount, 0);

            const totalGoalsProgress = goals.reduce((sum, g) => sum + g.currentAmount, 0);
            const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

            return {
                balance: totalIncome - totalExpense,
                budgetUtilization: totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0,
                goalsProgress: totalGoalsTarget > 0 ? (totalGoalsProgress / totalGoalsTarget) * 100 : 0,
                activeBudgets: budgets.filter(b => b.amountSpent > 0).length,
                activeGoals: goals.filter(g => g.currentAmount < g.targetAmount).length
            };

        } catch (error) {
            console.error('Lỗi lấy thống kê tổng hợp:', error);
            return null;
        }
    }
}

export default new BusinessLogicService(); 