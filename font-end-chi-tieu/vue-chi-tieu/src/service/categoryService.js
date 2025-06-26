import apiClient from './axiosConfig.js';

/**
 * Service để xử lý các thao tác với danh mục
 * Chứa các function CRUD cho categories
 */
class CategoryService {
    
    /**
     * Lấy danh sách danh mục
     * @param {Object} filters - Bộ lọc (type, search)
     * @returns {Promise<Array>} Danh sách danh mục
     */
    async getCategories(filters = {}) {
        try {
            const response = await apiClient.get('/categories/hien-thi', {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách danh mục:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin danh mục theo ID
     * @param {number} id - ID danh mục
     * @returns {Promise<Object>} Thông tin danh mục
     */
    async getCategoryById(id) {
        try {
            const response = await apiClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin danh mục:', error);
            throw error;
        }
    }

    /**
     * Tạo danh mục mới
     * @param {Object} categoryData - Dữ liệu danh mục
     * @returns {Promise<Object>} Danh mục đã tạo
     */
    async createCategory(categoryData) {
        try {
            const response = await apiClient.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Lỗi tạo danh mục:', error);
            throw error;
        }
    }

    /**
     * Cập nhật danh mục
     * @param {number} id - ID danh mục
     * @param {Object} categoryData - Dữ liệu cập nhật
     * @returns {Promise<Object>} Danh mục đã cập nhật
     */
    async updateCategory(id, categoryData) {
        try {
            const response = await apiClient.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Lỗi cập nhật danh mục:', error);
            throw error;
        }
    }

    /**
     * Xóa danh mục
     * @param {number} id - ID danh mục
     * @returns {Promise<boolean>} True nếu xóa thành công
     */
    async deleteCategory(id) {
        try {
            await apiClient.delete(`/categories/${id}`);
            return true;
        } catch (error) {
            console.error('Lỗi xóa danh mục:', error);
            throw error;
        }
    }

    /**
     * Lấy danh mục theo loại (income/expense)
     * @param {string} type - Loại danh mục (income/expense)
     * @returns {Promise<Array>} Danh sách danh mục
     */
    async getCategoriesByType(type) {
        try {
            const response = await apiClient.get(`/categories/type/${type}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh mục theo loại:', error);
            throw error;
        }
    }
}

// Tạo instance và export
const categoryService = new CategoryService();
export default categoryService; 