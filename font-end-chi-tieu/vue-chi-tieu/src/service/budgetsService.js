// budgetsService.js
import apiClient from './axiosConfig.js';

/**
 * Service để xử lý các thao tác với ngân sách
 * Chứa các function CRUD cho budgets
 */
class BudgetsService {

    /**
     * Lấy danh sách ngân sách của user
     * @returns {Promise<Array>} Danh sách ngân sách
     */
    async getBudgets() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;
            
            const response = await apiClient.get(`/budgets/hien-thi/${userId}`);
            console.log('Danh sách ngân sách:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách ngân sách:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin ngân sách theo ID
     * @param {number} id - ID ngân sách
     * @returns {Promise<Object>} Thông tin ngân sách
     */
    async getBudgetById(id) {
        try {
            const response = await apiClient.get(`/budgets/${id}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin ngân sách:', error);
            throw error;
        }
    }

    /**
     * Tạo ngân sách mới
     * @param {Object} budgetData - Dữ liệu ngân sách
     * @returns {Promise<Object>} Ngân sách đã tạo
     */
    async createBudget(budgetData) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;
            
            const budgetPayload = {
                ...budgetData,
                userId: userId
            };
            
            console.log('Tạo ngân sách với dữ liệu:', budgetPayload);
            const response = await apiClient.post('/budgets/add', budgetPayload);
            console.log('Ngân sách đã tạo:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi tạo ngân sách:', error);
            throw error;
        }
    }

    /**
     * Cập nhật ngân sách
     * @param {number} id - ID ngân sách
     * @param {Object} budgetData - Dữ liệu cập nhật
     * @returns {Promise<Object>} Ngân sách đã cập nhật
     */
    async updateBudget(id, budgetData) {
        try {
            console.log('Cập nhật ngân sách ID:', id, 'với dữ liệu:', budgetData);
            const response = await apiClient.put(`/budgets/${id}`, budgetData);
            console.log('Ngân sách đã cập nhật:', response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi cập nhật ngân sách:', error);
            throw error;
        }
    }

    /**
     * Xóa ngân sách
     * @param {number} id - ID ngân sách
     * @returns {Promise<boolean>} True nếu xóa thành công
     */
    async deleteBudget(id) {
        try {
            console.log('Xóa ngân sách ID:', id);
            await apiClient.delete(`/budgets/delete/${id}`);
            console.log('Ngân sách đã xóa thành công');
            return true;
        } catch (error) {
            console.error('Lỗi xóa ngân sách:', error);
            throw error;
        }
    }

    /**
     * Lấy ngân sách theo danh mục
     * @param {number} categoryId - ID danh mục
     * @returns {Promise<Array>} Danh sách ngân sách
     */
    async getBudgetsByCategory(categoryId) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;
            
            const response = await apiClient.get(`/budgets/category/${categoryId}`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy ngân sách theo danh mục:', error);
            throw error;
        }
    }

    /**
     * Lấy ngân sách theo khoảng thời gian
     * @param {string} startDate - Ngày bắt đầu
     * @param {string} endDate - Ngày kết thúc
     * @returns {Promise<Array>} Danh sách ngân sách
     */
    async getBudgetsByDateRange(startDate, endDate) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;
            
            const response = await apiClient.get(`/budgets/date-range`, {
                params: { 
                    userId,
                    startDate,
                    endDate
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy ngân sách theo khoảng thời gian:', error);
            throw error;
        }
    }

    /**
     * Cập nhật số tiền đã chi của ngân sách
     * @param {number} id - ID ngân sách
     * @param {number} amountSpent - Số tiền đã chi
     * @returns {Promise<Object>} Ngân sách đã cập nhật
     */
    async updateAmountSpent(id, amountSpent) {
        try {
            console.log('Cập nhật số tiền đã chi cho ngân sách ID:', id, 'Số tiền:', amountSpent);
            const response = await apiClient.put(`/budgets/${id}/amount-spent`, {
                amountSpent
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi cập nhật số tiền đã chi:', error);
            throw error;
        }
    }
}

const budgetsService = new BudgetsService();
export default budgetsService;
