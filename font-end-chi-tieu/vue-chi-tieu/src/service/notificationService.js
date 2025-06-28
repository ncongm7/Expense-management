import apiClient from './axiosConfig.js'

/**
 * Service để xử lý các thao tác với thông báo
 */
class NotificationService {
    /**
     * Lấy danh sách thông báo của user
     * @param {Object} filters - Bộ lọc (limit, offset, read)
     * @returns {Promise<Array>} Danh sách thông báo
     */
    async getNotifications(filters = {}) {
        try {
            const userStr = localStorage.getItem('user')
            if (!userStr) {
                console.log('Không có user data trong localStorage')
                return []
            }

            const user = JSON.parse(userStr)
            const userId = user?.id
            console.log('User ID từ localStorage:', userId)

            if (!userId) {
                console.log('Không có user ID')
                return []
            }

            const response = await apiClient.get(`/notifications/hien-thi/${userId}`, {
                params: {
                    limit: filters.limit || 50,
                    offset: filters.offset || 0,
                    read: filters.read !== undefined ? filters.read : null,
                },
            })
            console.log('API Response:', response)
            console.log('Lấy danh sách thông báo:', response.data)
            return response.data
        } catch (error) {
            console.error('Lỗi lấy danh sách thông báo:', error)
            console.error('Error details:', error.response?.data)
            return []
        }
    }

    /**
     * Lấy số thông báo chưa đọc
     * @returns {Promise<number>} Số thông báo chưa đọc
     */
    async getUnreadCount() {
        try {
            const userStr = localStorage.getItem('user')
            if (!userStr) {
                console.log('Không có user data trong localStorage')
                return 0
            }

            const user = JSON.parse(userStr)
            const userId = user?.id

            if (!userId) {
                console.log('Không có user ID')
                return 0
            }

            const response = await apiClient.get(`/notifications/count-unread/${userId}`)
            return response.data || 0
        } catch (error) {
            console.error('Lỗi lấy số thông báo chưa đọc:', error)
            return 0
        }
    }

    /**
     * Đánh dấu thông báo đã đọc
     * @param {number} notificationId - ID thông báo
     * @returns {Promise<boolean>} True nếu thành công
     */
    async markAsRead(notificationId) {
        try {
            await apiClient.put(`/notifications/${notificationId}/read`)
            return true
        } catch (error) {
            console.error('Lỗi đánh dấu đã đọc:', error)
            throw error
        }
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     * @returns {Promise<boolean>} True nếu thành công
     */
    async markAllAsRead() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            await apiClient.put(`/notifications/mark-all-read/${userId}`)
            return true
        } catch (error) {
            console.error('Lỗi đánh dấu tất cả đã đọc:', error)
            throw error
        }
    }

    /**
     * Xóa thông báo
     * @param {number} notificationId - ID thông báo
     * @returns {Promise<boolean>} True nếu thành công
     */
    async deleteNotification(notificationId) {
        try {
            await apiClient.delete(`/notifications/${notificationId}`)
            return true
        } catch (error) {
            console.error('Lỗi xóa thông báo:', error)
            throw error
        }
    }

    /**
     * Tạo thông báo mới
     * @param {Object} notificationData - Dữ liệu thông báo
     * @returns {Promise<Object>} Thông báo đã tạo
     */
    async createNotification(notificationData) {
        try {
            const response = await apiClient.post('/notifications', notificationData)
            return response.data
        } catch (error) {
            console.error('Lỗi tạo thông báo:', error)
            throw error
        }
    }

    /**
     * Tạo thông báo vượt ngân sách
     * @param {Object} budget - Thông tin ngân sách
     * @param {number} spentAmount - Số tiền đã chi
     * @returns {Promise<Object>} Thông báo đã tạo
     */
    async createBudgetOverflowNotification(budget, spentAmount) {
        const notificationData = {
            userId: budget.userId,
            title: 'Vượt ngân sách',
            message: `Bạn đã vượt ngân sách ${this.formatPeriod(budget.period)}! Đã chi ${spentAmount.toLocaleString()}đ / ${budget.amount.toLocaleString()}đ`,
            type: 'warning',
            relatedEntityType: 'budget',
            relatedEntityId: budget.id,
            actionUrl: '/ngan-sach',
        }

        return await this.createNotification(notificationData)
    }

    /**
     * Tạo thông báo cập nhật mục tiêu
     * @param {Object} goal - Thông tin mục tiêu
     * @param {number} savedAmount - Số tiền đã tiết kiệm
     * @returns {Promise<Object>} Thông báo đã tạo
     */
    async createGoalUpdateNotification(goal, savedAmount) {
        const notificationData = {
            userId: goal.userId,
            title: 'Cập nhật mục tiêu',
            message: `Đã tự động tiết kiệm ${savedAmount.toLocaleString()}đ vào mục tiêu "${goal.title}"`,
            type: 'success',
            relatedEntityType: 'goal',
            relatedEntityId: goal.id,
            actionUrl: '/muc-tieu',
        }

        return await this.createNotification(notificationData)
    }

    /**
     * Tạo thông báo sắp hết ngân sách
     * @param {Object} budget - Thông tin ngân sách
     * @param {number} spentPercentage - Phần trăm đã chi
     * @returns {Promise<Object>} Thông báo đã tạo
     */
    async createBudgetWarningNotification(budget, spentPercentage) {
        const notificationData = {
            userId: budget.userId,
            title: 'Cảnh báo ngân sách',
            message: `Sắp hết ngân sách ${this.formatPeriod(budget.period)}! Đã chi ${spentPercentage.toFixed(1)}%`,
            type: 'warning',
            relatedEntityType: 'budget',
            relatedEntityId: budget.id,
            actionUrl: '/ngan-sach',
        }

        return await this.createNotification(notificationData)
    }

    /**
     * Test API connection
     * @returns {Promise<Object>} Test response
     */
    async testAPI() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id
            console.log('Test API - User ID:', userId)

            const response = await apiClient.get(`/notifications/hien-thi/${userId}`)
            console.log('Test API Response:', response)
            return response.data
        } catch (error) {
            console.error('Test API Error:', error)
            throw error
        }
    }

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
}

export default new NotificationService()
