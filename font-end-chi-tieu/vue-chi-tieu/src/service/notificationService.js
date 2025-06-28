import apiClient from './axiosConfig.js';

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
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            const response = await apiClient.get(`/notifications/hien-thi/${userId}`, {
                params: {
                    limit: filters.limit || 50,
                    offset: filters.offset || 0,
                    read: filters.read !== undefined ? filters.read : null
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách thông báo:', error);
            throw error;
        }
    }

    /**
     * Lấy số thông báo chưa đọc
     * @returns {Promise<number>} Số thông báo chưa đọc
     */
    async getUnreadCount() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            const response = await apiClient.get(`/notifications/unread-count/${userId}`);
            return response.data.count;
        } catch (error) {
            console.error('Lỗi lấy số thông báo chưa đọc:', error);
            return 0;
        }
    }

    /**
     * Đánh dấu thông báo đã đọc
     * @param {number} notificationId - ID thông báo
     * @returns {Promise<boolean>} True nếu thành công
     */
    async markAsRead(notificationId) {
        try {
            await apiClient.put(`/notifications/${notificationId}/read`);
            return true;
        } catch (error) {
            console.error('Lỗi đánh dấu đã đọc:', error);
            throw error;
        }
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     * @returns {Promise<boolean>} True nếu thành công
     */
    async markAllAsRead() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            await apiClient.put(`/notifications/mark-all-read/${userId}`);
            return true;
        } catch (error) {
            console.error('Lỗi đánh dấu tất cả đã đọc:', error);
            throw error;
        }
    }

    /**
     * Xóa thông báo
     * @param {number} notificationId - ID thông báo
     * @returns {Promise<boolean>} True nếu thành công
     */
    async deleteNotification(notificationId) {
        try {
            await apiClient.delete(`/notifications/${notificationId}`);
            return true;
        } catch (error) {
            console.error('Lỗi xóa thông báo:', error);
            throw error;
        }
    }

    /**
     * Tạo thông báo mới
     * @param {Object} notificationData - Dữ liệu thông báo
     * @returns {Promise<Object>} Thông báo đã tạo
     */
    async createNotification(notificationData) {
        try {
            const response = await apiClient.post('/notifications', notificationData);
            return response.data;
        } catch (error) {
            console.error('Lỗi tạo thông báo:', error);
            throw error;
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
            message: `Bạn đã vượt ngân sách ${budget.period}! Đã chi ${spentAmount.toLocaleString()}đ / ${budget.amount.toLocaleString()}đ`,
            type: 'warning',
            relatedEntityType: 'budget',
            relatedEntityId: budget.id,
            actionUrl: '/ngan-sach'
        };

        return await this.createNotification(notificationData);
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
            actionUrl: '/muc-tieu'
        };

        return await this.createNotification(notificationData);
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
            message: `Sắp hết ngân sách ${budget.period}! Đã chi ${spentPercentage.toFixed(1)}%`,
            type: 'warning',
            relatedEntityType: 'budget',
            relatedEntityId: budget.id,
            actionUrl: '/ngan-sach'
        };

        return await this.createNotification(notificationData);
    }
}

export default new NotificationService(); 