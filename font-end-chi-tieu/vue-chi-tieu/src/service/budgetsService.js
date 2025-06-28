// budgetsService.js
import apiClient from './axiosConfig.js';
 class BudgetsService {

    async getBudgets() {
        try {
            const response = await apiClient.get('/budgets/hien-thi/' + JSON.parse(localStorage.getItem('user')).id);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách ngân sách:', error);
            throw error;
        }

}

 }
 const budgetsService = new BudgetsService()
 export default budgetsService
