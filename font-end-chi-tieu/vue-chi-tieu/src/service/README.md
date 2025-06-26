# Service Layer

Thư mục này chứa các service để gọi API, giúp tách biệt logic gọi API ra khỏi component.

## Cấu trúc

### 1. transactionService.js
Service để gọi API giao dịch:

```javascript
import transactionService from '../service/transactionService.js';

// Lấy danh sách giao dịch
const transactions = await transactionService.getTransactions(filters);

// Tạo giao dịch mới
await transactionService.createTransaction(formData);

// Cập nhật giao dịch
await transactionService.updateTransaction(id, formData);

// Xóa giao dịch
await transactionService.deleteTransaction(id);
```

### 2. categoryService.js
Service để gọi API danh mục:

```javascript
import categoryService from '../service/categoryService.js';

// Lấy danh sách danh mục
const categories = await categoryService.getCategories();

// Tạo danh mục mới
await categoryService.createCategory(categoryData);

// Cập nhật danh mục
await categoryService.updateCategory(id, categoryData);

// Xóa danh mục
await categoryService.deleteCategory(id);
```

## Lợi ích

1. **Code sạch hơn**: Component không cần import axios và xử lý API
2. **Dễ bảo trì**: Nếu thay đổi API, chỉ cần sửa trong service
3. **Tái sử dụng**: Có thể dùng service ở nhiều component khác nhau
4. **Xử lý lỗi tập trung**: Toast message được xử lý trong service

## Cách sử dụng

1. Import service cần dùng
2. Gọi method của service
3. Xử lý kết quả trả về

## Ví dụ

```javascript
// Trong component
import transactionService from '../service/transactionService.js';

const fetchData = async () => {
    try {
        const data = await transactionService.getTransactions();
        // Xử lý dữ liệu
    } catch (error) {
        // Lỗi đã được xử lý trong service
        console.error('Lỗi:', error);
    }
};
``` 