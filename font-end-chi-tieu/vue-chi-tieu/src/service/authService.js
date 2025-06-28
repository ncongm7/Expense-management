import apiClient from './axiosConfig.js';

/**
 * Service để xử lý authentication
 * Chứa các function đăng nhập, đăng ký, logout
 */
class AuthService {

    /**
     * Đăng nhập user
     * @param {Object} credentials - Thông tin đăng nhập (email, password)
     * @param {boolean} rememberMe - Có ghi nhớ đăng nhập không
     * @returns {Promise<Object>} Thông tin user và token
     */
    async login(credentials, rememberMe = false) {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            // Lưu thông tin user và token
            const userData = {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.name,
                token: response.data.token
            };

            // Lưu user data vào localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            // Lưu token vào localStorage hoặc sessionStorage tùy theo remember me
            if (rememberMe) {
                localStorage.setItem('token', response.data.token);
            } else {
                sessionStorage.setItem('token', response.data.token);
            }

            return userData;
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error;
        }
    }

    /**
     * Đăng ký user mới
     * @param {Object} userData - Thông tin đăng ký (name, email, password)
     * @returns {Promise<Object>} Thông tin user đã tạo
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            throw error;
        }
    }

    /**
     * Đăng xuất user
     * Xóa thông tin user và token khỏi localStorage
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }

    /**
     * Kiểm tra xem user đã đăng nhập chưa
     * @returns {boolean} True nếu đã đăng nhập
     */
    isLoggedIn() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return !!(user && token);
    }

    /**
     * Lấy thông tin user hiện tại
     * @returns {Object|null} Thông tin user hoặc null
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Lấy token hiện tại
     * @returns {string|null} Token hoặc null
     */
    getToken() {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    /**
     * Kiểm tra token có hợp lệ không
     * @returns {Promise<boolean>} True nếu token hợp lệ
     */
    async validateToken() {
        try {
            const token = this.getToken();
            if (!token) return false;

            // Sử dụng axios trực tiếp thay vì apiClient để tránh circular dependency
            const axios = (await import('axios')).default;
            const response = await axios.get('http://localhost:8080/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.status === 200;
        } catch (error) {
            console.error('Token không hợp lệ:', error);
            this.logout();
            return false;
        }
    }
}

// Tạo instance và export
const authService = new AuthService();
export default authService; 