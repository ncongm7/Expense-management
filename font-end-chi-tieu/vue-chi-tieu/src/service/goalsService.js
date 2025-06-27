import axios from './axiosConfig'
export default {
    async getGoals() {
        const res = await axios.get('/goals')
        return res.data
    },
    async addGoal(goal) {
        return axios.post('/goals', goal)
    },
    async updateGoal(goal) {
        return axios.put(`/goals/${goal.id}`, goal)
    },
    async deleteGoal(id) {
        return axios.delete(`/goals/${id}`)
    }
} 