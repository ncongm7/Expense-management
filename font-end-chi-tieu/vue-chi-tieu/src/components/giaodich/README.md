# Components Giao Dịch

Thư mục này chứa các component con được tách ra từ file `GiaoDich.vue` chính để dễ quản lý và tái sử dụng.

## Cấu trúc Component

### 1. TransactionForm.vue
**Chức năng:** Form thêm giao dịch mới
**Props:**
- `categories` (Array): Danh sách danh mục
**Events:**
- `transaction-added` (FormData): Emit khi submit form

### 2. TransactionFilter.vue
**Chức năng:** Bộ lọc và tìm kiếm giao dịch
**Props:**
- `categories` (Array): Danh sách danh mục
- `filters` (Object): Trạng thái bộ lọc hiện tại
**Events:**
- `filter-changed` (Object): Emit khi thay đổi bộ lọc
- `reset-filters`: Emit khi reset bộ lọc
- `refresh-data`: Emit khi refresh dữ liệu

### 3. TransactionChart.vue
**Chức năng:** Biểu đồ phân tích chi tiêu
**Props:**
- `transactions` (Array): Danh sách giao dịch

### 4. TransactionSummary.vue
**Chức năng:** Hiển thị tổng hợp số tiền
**Props:**
- `transactions` (Array): Danh sách giao dịch

### 5. TransactionTable.vue
**Chức năng:** Bảng danh sách giao dịch với phân trang
**Props:**
- `transactions` (Array): Danh sách giao dịch
- `pageSize` (Number): Số item trên mỗi trang
**Events:**
- `show-detail` (Object): Emit khi click vào row
- `show-receipt` (String): Emit khi click vào ảnh hóa đơn
- `edit-transaction` (Object): Emit khi click nút sửa
- `delete-transaction` (Object): Emit khi click nút xóa
- `download-excel`: Emit khi click nút tải Excel

### 6. TransactionDetailModal.vue
**Chức năng:** Modal hiển thị chi tiết giao dịch
**Props:**
- `transaction` (Object): Giao dịch cần hiển thị
- `show` (Boolean): Trạng thái hiển thị modal
**Events:**
- `show-receipt` (String): Emit khi click vào ảnh hóa đơn

### 7. TransactionEditModal.vue
**Chức năng:** Modal sửa giao dịch
**Props:**
- `transaction` (Object): Giao dịch cần sửa
- `categories` (Array): Danh sách danh mục
- `show` (Boolean): Trạng thái hiển thị modal
**Events:**
- `transaction-updated` (Object): Emit khi submit form sửa

### 8. TransactionDeleteModal.vue
**Chức năng:** Modal xác nhận xóa giao dịch
**Props:**
- `transaction` (Object): Giao dịch cần xóa
- `show` (Boolean): Trạng thái hiển thị modal
**Events:**
- `transaction-deleted` (Object): Emit khi xác nhận xóa

### 9. ReceiptViewModal.vue
**Chức năng:** Modal xem ảnh hóa đơn
**Props:**
- `receiptUrl` (String): URL ảnh hóa đơn
- `show` (Boolean): Trạng thái hiển thị modal

## Luồng Dữ Liệu

### Từ Parent xuống Child (Props)
- `categories`: Danh sách danh mục từ API
- `transactions`: Danh sách giao dịch từ API
- `filters`: Trạng thái bộ lọc hiện tại
- `pageSize`: Cấu hình phân trang

### Từ Child lên Parent (Events)
- Các event CRUD: `transaction-added`, `transaction-updated`, `transaction-deleted`
- Các event UI: `show-detail`, `show-receipt`, `edit-transaction`, `delete-transaction`
- Các event filter: `filter-changed`, `reset-filters`, `refresh-data`

## Lợi ích của việc tách component

1. **Dễ bảo trì:** Mỗi component có trách nhiệm riêng biệt
2. **Tái sử dụng:** Có thể sử dụng lại các component ở nơi khác
3. **Dễ test:** Có thể test từng component độc lập
4. **Code sạch:** File chính ngắn gọn, dễ đọc
5. **Team work:** Nhiều người có thể làm việc trên các component khác nhau

## Cách sử dụng

1. Import các component cần thiết
2. Truyền props từ parent component
3. Lắng nghe events từ child component
4. Xử lý logic trong parent component

## Lưu ý

- Tất cả API calls được thực hiện trong parent component (`GiaoDich.vue`)
- Child components chỉ emit events, không gọi API trực tiếp
- Sử dụng Bootstrap Modal cho các modal components
- Responsive design với Bootstrap classes 