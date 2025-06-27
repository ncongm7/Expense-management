import axios from './axiosConfig'
export default {
    async getGoals() {
        const user = JSON.parse(localStorage.getItem('user'))
        const userId = user?.id 
        const res = await axios.get(`/goals/hien-thi/${userId}`)
        return res.data
    },
    async addGoal(goal) {
        return axios.post('/goals', goal)
    },
    async updateGoal(goal) {
        return axios.put(`/goals/${goal.id}`, goal)
    },
    async deleteGoal(id) {
        return axios.delete(`/goals/delete/${id}`)
    }
} 