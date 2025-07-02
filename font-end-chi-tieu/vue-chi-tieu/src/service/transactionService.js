import apiClient from './axiosConfig.js'
import businessLogicService from './businessLogicService.js'

/**
 * Service để xử lý các thao tác với giao dịch
 * Chứa các function CRUD, thống kê, export
 */
class TransactionService {
  /**
   * Lấy danh sách giao dịch
   * @param {Object} filters - Bộ lọc (dateFrom, dateTo, category, type, search)
   * @returns {Promise<Array>} Danh sách giao dịch
   */
  async getTransactions(filters = {}) {
    console.log(filters)

    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const userId = user?.id
      console.log(userId)

      const response = await apiClient.get(`/transactions/hien-thi/${userId}`, {
        params: {
          type: filters?.type || null,
          categoryId: filters?.categoryId || null,
          fromDate: filters?.fromDate || null,
          toDate: filters?.toDate || null,
          search: filters?.search || null,
        },
      })
      console.log(response.data)
      console.log(response.data.length)
      return response.data
    } catch (error) {
      console.error('Lỗi lấy danh sách giao dịch:', error)
      throw error
    }
  }

  /**
   * Lấy thông tin giao dịch theo ID
   * @param {number} id - ID giao dịch
   * @returns {Promise<Object>} Thông tin giao dịch
   */
  async getTransactionById(id) {
    try {
      const response = await apiClient.get(`/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Lỗi lấy thông tin giao dịch:', error)
      throw error
    }
  }

  /**
   * Tạo giao dịch mới với business logic
   * @param {FormData} formData - Dữ liệu giao dịch
   * @returns {Promise<Object>} Giao dịch đã tạo
   */
  async createTransaction(formData) {
    console.log(formData)
    try {
      const response = await apiClient.post('/transactions/post', formData)

      // Xử lý business logic sau khi tạo giao dịch thành công
      if (response.data) {
        // Chuyển FormData thành object để xử lý
        const transactionData = {
          type: formData.get('type'),
          amount: parseFloat(formData.get('amount')),
          categoryId: parseInt(formData.get('categoryId')),
          notes: formData.get('note'),
          spentAt: formData.get('spentAt'),
        }

        // Gọi business logic service
        await businessLogicService.handleNewTransaction(transactionData)
      }

      return response.data
    } catch (error) {
      console.error('Lỗi tạo giao dịch:', error)
      throw error
    }
  }

  /**
   * Cập nhật giao dịch
   * @param {number} id - ID giao dịch
   * @param {Object} transactionData - Dữ liệu cập nhật
   * @returns {Promise<Object>} Giao dịch đã cập nhật
   */
  async updateTransaction(id, transactionData) {
    try {
      const response = await apiClient.put(`/transactions/update/${id}`, transactionData)
      return response.data
    } catch (error) {
      console.error('Lỗi cập nhật giao dịch:', error)
      throw error
    }
  }

  /**
   * Xóa giao dịch
   * @param {number} id - ID giao dịch
   * @returns {Promise<boolean>} True nếu xóa thành công
   */
  async deleteTransaction(id) {
    try {
      await apiClient.delete(`/transactions/delete/${id}`)
      return true
    } catch (error) {
      console.error('Lỗi xóa giao dịch:', error)
      throw error
    }
  }

  /**
   * Lấy thống kê giao dịch
   * @param {Object} filters - Bộ lọc
   * @returns {Promise<Object>} Thống kê
   */
  async getTransactionStats(filters = {}) {
    try {
      const response = await apiClient.get('/transactions/stats', {
        params: filters,
      })
      return response.data
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error)
      throw error
    }
  }

  /**
   * Export giao dịch
   * @param {Object} filters - Bộ lọc
   * @param {string} format - Định dạng (excel, csv, pdf)
   * @returns {Promise<Blob>} File export
   */
  async exportTransactions(filters = {}, format = 'excel') {
    try {
      const response = await apiClient.get('/transactions/export', {
        params: { ...filters, format },
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Lỗi export giao dịch:', error)
      throw error
    }
  }

  /**
   * Xóa nhiều giao dịch
   * @param {Array<number>} ids - Danh sách ID giao dịch
   * @returns {Promise<boolean>} True nếu xóa thành công
   */
  async deleteMultipleTransactions(ids) {
    try {
      await apiClient.delete('/transactions/bulk', {
        data: { ids },
      })
      return true
    } catch (error) {
      console.error('Lỗi xóa nhiều giao dịch:', error)
      throw error
    }
  }
}

// Tạo instance và export
const transactionService = new TransactionService()
export default transactionService
