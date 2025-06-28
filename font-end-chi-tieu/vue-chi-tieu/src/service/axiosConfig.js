import axios from 'axios';

// Tạo instance axios với base URL
const apiClient = axios.create({
    // baseURL: 'https://expense-backend.up.railway.app',
    baseURL: 'http://localhost:8080',

    timeout: 10000,

});

// Request interceptor - tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Axios request interceptor - Token:', token ? 'Có token' : 'Không có token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Axios request interceptor error:', error);
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
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');

            // Emit custom event để Vue app có thể handle
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        return Promise.reject(error);
    }
);

export default apiClient; 