import axios from 'axios';
import authService from './authService.js';

// Tạo instance axios với base URL
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý lỗi authentication
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Nếu lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
        if (error.response && error.response.status === 401) {
            // Xóa thông tin user và token
            authService.logout();
            
            // Emit custom event để Vue app có thể handle
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        
        return Promise.reject(error);
    }
);

export default apiClient; 