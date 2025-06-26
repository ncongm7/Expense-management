# Hướng Dẫn Setup Authentication

## 🎯 Mục tiêu
Tạo hệ thống đăng nhập để lưu userId khi thêm giao dịch mới.

## 📋 Các bước thực hiện

### 1. Backend API (Cần tạo)

#### 1.1 Tạo User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    // getters, setters, constructors
}
```

#### 1.2 Tạo AuthController
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate email/password
        // Generate JWT token
        // Return user info + token
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check email exists
        // Hash password
        // Save user
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        // Validate JWT token
    }
}
```

#### 1.3 Cập nhật Transaction Entity
```java
@Entity
@Table(name = "transactions")
public class Transaction {
    // ... existing fields
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // getter, setter for user
}
```

#### 1.4 Cập nhật TransactionController
```java
@PostMapping
public ResponseEntity<?> createTransaction(
    @RequestParam("userId") Long userId,
    // ... other params
) {
    User user = userService.findById(userId);
    transaction.setUser(user);
    // save transaction
}
```

### 2. Frontend (Đã tạo xong)

#### 2.1 Files đã tạo:
- ✅ `src/components/auth/LoginForm.vue` - Form đăng nhập
- ✅ `src/service/authService.js` - Service xử lý auth
- ✅ `src/view/Login.vue` - Trang đăng nhập
- ✅ `src/router/router.js` - Cập nhật routes

#### 2.2 Files đã cập nhật:
- ✅ `src/components/giaodich/TransactionForm.vue` - Thêm userId
- ✅ `src/service/transactionService.js` - Thêm token headers

## 🔧 Các bước test

### Bước 1: Tạo user trong database
```sql
INSERT INTO users (email, password, name) 
VALUES ('test@example.com', 'password123', 'Test User');
```

### Bước 2: Test đăng nhập
1. Truy cập `http://localhost:3000/login`
2. Nhập email: `test@example.com`
3. Nhập password: `password123`
4. Click "Đăng nhập"

### Bước 3: Test thêm giao dịch
1. Sau khi đăng nhập thành công, chuyển đến `/giaodich`
2. Thử thêm giao dịch mới
3. Kiểm tra trong database có userId không

## 🚨 Lưu ý quan trọng

### 1. Backend cần implement:
- ✅ User Entity và Repository
- ✅ AuthController với login/register
- ✅ JWT token generation và validation
- ✅ Cập nhật Transaction để có userId
- ✅ Security config để bảo vệ API

### 2. Frontend đã sẵn sàng:
- ✅ Form đăng nhập với validation
- ✅ Lưu token vào localStorage
- ✅ Thêm userId vào form giao dịch
- ✅ Thêm token vào API headers

### 3. API Endpoints cần có:
```
POST /auth/login - Đăng nhập
POST /auth/register - Đăng ký
GET /auth/validate - Validate token
POST /api/transactions - Tạo giao dịch (có userId)
GET /api/transactions - Lấy giao dịch (theo userId)
```

## 🎉 Kết quả mong đợi

Sau khi hoàn thành:
1. User phải đăng nhập trước khi sử dụng
2. Mỗi giao dịch sẽ được gắn với user đã đăng nhập
3. User chỉ thấy giao dịch của mình
4. Token được tự động gửi trong mọi API request

## 🔍 Debug

Nếu gặp lỗi:
1. Kiểm tra console browser xem có lỗi gì
2. Kiểm tra Network tab xem API call có thành công không
3. Kiểm tra localStorage có lưu user và token không
4. Kiểm tra backend logs xem có lỗi gì không 