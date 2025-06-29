import apiClient from './axiosConfig.js'

/**
 * Service để xử lý logic 5 hũ chi tiêu (5 Jars Money Management)
 */
class MoneyJarsService {
    /**
     * Lấy danh sách 5 hũ chi tiêu của user
     * @returns {Promise<Array>} Danh sách 5 hũ
     */
    async getMoneyJars() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            if (!userId) {
                console.log('Không có user ID')
                return []
            }

            const response = await apiClient.get(`/money-jars/hien-thi/${userId}`)
            console.log('Lấy danh sách 5 hũ:', response.data)
            return response.data
        } catch (error) {
            console.error('Lỗi lấy danh sách 5 hũ:', error)
            return []
        }
    }

    /**
     * Cập nhật số tiền trong hũ
     * @param {number} jarId - ID hũ
     * @param {number} amount - Số tiền
     * @returns {Promise<Object>} Hũ đã cập nhật
     */
    async updateJarAmount(jarId, amount) {
        try {
            const response = await apiClient.put(`/money-jars/${jarId}/amount`, { amount })
            return response.data
        } catch (error) {
            console.error('Lỗi cập nhật số tiền hũ:', error)
            throw error
        }
    }

    /**
     * Phân bổ thu nhập vào 5 hũ theo tỷ lệ
     * @param {number} incomeAmount - Số tiền thu nhập
     * @returns {Promise<Array>} Danh sách hũ đã được phân bổ
     */
    async allocateIncome(incomeAmount) {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            const response = await apiClient.post(`/money-jars/${userId}/allocate`, {
                incomeAmount: incomeAmount
            })
            console.log('Phân bổ thu nhập:', response.data)
            return response.data
        } catch (error) {
            console.error('Lỗi phân bổ thu nhập:', error)
            throw error
        }
    }

    /**
     * Chuyển tiền giữa các hũ
     * @param {number} fromJarId - ID hũ nguồn
     * @param {number} toJarId - ID hũ đích
     * @param {number} amount - Số tiền chuyển
     * @returns {Promise<Object>} Kết quả chuyển tiền
     */
    async transferBetweenJars(fromJarId, toJarId, amount) {
        try {
            const response = await apiClient.post('/money-jars/transfer', {
                fromJarId,
                toJarId,
                amount
            })
            return response.data
        } catch (error) {
            console.error('Lỗi chuyển tiền giữa hũ:', error)
            throw error
        }
    }

    /**
     * Lấy lịch sử giao dịch của hũ
     * @param {number} jarId - ID hũ
     * @returns {Promise<Array>} Lịch sử giao dịch
     */
    async getJarTransactions(jarId) {
        try {
            const response = await apiClient.get(`/money-jars/${jarId}/transactions`)
            return response.data
        } catch (error) {
            console.error('Lỗi lấy lịch sử hũ:', error)
            return []
        }
    }

    /**
     * Tính toán phân bổ tự động cho thu nhập mới
     * @param {number} incomeAmount - Số tiền thu nhập
     * @returns {Object} Phân bổ theo tỷ lệ
     */
    calculateAllocation(incomeAmount) {
        const allocation = {
            needs: Math.round(incomeAmount * 0.5), // 50%
            savings: Math.round(incomeAmount * 0.2), // 20%
            investments: Math.round(incomeAmount * 0.1), // 10%
            wants: Math.round(incomeAmount * 0.1), // 10%
            giving: Math.round(incomeAmount * 0.1) // 10%
        }

        // Điều chỉnh để tổng = incomeAmount
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0)
        const difference = incomeAmount - total

        if (difference !== 0) {
            // Thêm phần dư vào hũ needs
            allocation.needs += difference
        }

        return allocation
    }

    /**
     * Tự động phân bổ giao dịch thu nhập vào 5 hũ
     * @param {Object} transaction - Giao dịch thu nhập
     * @returns {Promise<boolean>} True nếu thành công
     */
    async autoAllocateIncome(transaction) {
        try {
            if (transaction.type !== 'income') {
                console.log('Không phải giao dịch thu nhập')
                return false
            }

            const allocation = this.calculateAllocation(transaction.amount)
            console.log('Phân bổ tự động:', allocation)

            // Gọi API để phân bổ
            await this.allocateIncome(transaction.amount)
            return true
        } catch (error) {
            console.error('Lỗi phân bổ tự động:', error)
            return false
        }
    }

    /**
     * Lấy thống kê tổng quan 5 hũ
     * @returns {Promise<Object>} Thống kê
     */
    async getJarsSummary() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            const response = await apiClient.get(`/money-jars/summary/${userId}`)
            return response.data
        } catch (error) {
            console.error('Lỗi lấy thống kê hũ:', error)
            return {
                totalAmount: 0,
                totalTarget: 0,
                jars: []
            }
        }
    }

    /**
     * Reset tất cả hũ về 0
     * @returns {Promise<boolean>} True nếu thành công
     */
    async resetAllJars() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            await apiClient.post(`/money-jars/${userId}/reset`)
            return true
        } catch (error) {
            console.error('Lỗi reset hũ:', error)
            return false
        }
    }

    /**
     * Cập nhật tỷ lệ phân bổ của hũ
     * @param {number} jarId - ID hũ
     * @param {number} percentage - Tỷ lệ mới
     * @returns {Promise<Object>} Hũ đã cập nhật
     */
    async updateJarPercentage(jarId, percentage) {
        try {
            const response = await apiClient.put(`/money-jars/${jarId}/percentage`, { percentage })
            return response.data
        } catch (error) {
            console.error('Lỗi cập nhật tỷ lệ hũ:', error)
            throw error
        }
    }

    /**
     * Tạo dữ liệu mẫu cho 5 hũ (khi user mới đăng ký)
     * @returns {Promise<Array>} Danh sách hũ đã tạo
     */
    async createDefaultJars() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const userId = user?.id

            const response = await apiClient.post(`/money-jars/${userId}/create-default`)
            return response.data
        } catch (error) {
            console.error('Lỗi tạo hũ mặc định:', error)
            return []
        }
    }
}

export default new MoneyJarsService() 