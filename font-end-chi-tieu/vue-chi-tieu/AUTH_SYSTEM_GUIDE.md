# 🚀 Hệ Thống Authentication - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Hệ thống authentication đã được cải tiến với giao diện đẹp mắt và trải nghiệm người dùng tốt hơn. Bao gồm:

- ✅ **Form đăng nhập** với thiết kế hiện đại
- ✅ **Form đăng ký** với validation đầy đủ
- ✅ **Chuyển đổi mượt mà** giữa login và register
- ✅ **Service layer** để quản lý API calls
- ✅ **Toast notifications** cho feedback
- ✅ **Responsive design** cho mọi thiết bị

## 🎨 Thiết Kế UI/UX

### ✨ Tính Năng Thiết Kế:
- **Gradient background** với animation floating shapes
- **Glassmorphism effect** với backdrop-filter blur
- **Smooth transitions** và hover effects
- **Custom form elements** (checkbox, input fields)
- **Loading states** với spinner animations
- **Error handling** với visual feedback
- **Social login buttons** (Google, Facebook)

### 🎯 Components:
1. **LoginForm.vue** - Form đăng nhập
2. **RegisterForm.vue** - Form đăng ký  
3. **Login.vue** - Container chuyển đổi giữa 2 form
4. **authService.js** - Service layer cho API calls

## 🔧 Cài Đặt Backend

### 1. Entity User (Đã có sẵn):
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotNull
    private String username;
    
    private String email;
    private String password;
    private Instant createdAt;
}
```

### 2. Controller Endpoints Cần Thiết:

#### Login Endpoint:
```java
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Validate credentials
    // Return user data + JWT token
    return ResponseEntity.ok(new LoginResponse(user, token));
}
```

#### Register Endpoint:
```java
@PostMapping("/auth/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // Validate input
    // Check if username/email exists
    // Hash password
    // Save user
    // Return success message
    return ResponseEntity.ok(new RegisterResponse("Đăng ký thành công"));
}
```

### 3. Request/Response Models:

#### LoginRequest:
```java
public class LoginRequest {
    private String email;
    private String password;
}
```

#### RegisterRequest:
```java
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
```

## 🚀 Sử Dụng Frontend

### 1. Truy Cập:
- URL: `http://localhost:3000/login`
- Form đăng nhập sẽ hiển thị mặc định

### 2. Chuyển Đổi Form:
- Click "Đăng ký ngay" để chuyển sang form đăng ký
- Click "Đăng nhập ngay" để quay về form đăng nhập
- Animation mượt mà khi chuyển đổi

### 3. Validation Rules:

#### Đăng Nhập:
- Email: Required, valid format
- Password: Required, min 6 characters

#### Đăng Ký:
- Username: Required, min 3 chars, alphanumeric + underscore
- Email: Required, valid format
- Password: Required, min 6 chars, contains uppercase, lowercase, number
- Confirm Password: Must match password
- Terms: Must be accepted

### 4. Features:
- **Remember Me**: Lưu token vào localStorage
- **Show/Hide Password**: Toggle visibility
- **Social Login**: Buttons cho Google/Facebook (cần implement)
- **Forgot Password**: Link (cần implement)

## 🔐 Security Features

### 1. Token Management:
- JWT token được lưu trong localStorage/sessionStorage
- Auto-logout khi token hết hạn
- Token validation endpoint

### 2. Password Security:
- Password hashing ở backend
- Password strength validation
- Confirm password check

### 3. Input Validation:
- Client-side validation với visual feedback
- Server-side validation
- XSS protection

## 📱 Responsive Design

### Breakpoints:
- **Desktop**: > 768px - Full layout
- **Tablet**: 480px - 768px - Adjusted spacing
- **Mobile**: < 480px - Compact layout

### Features:
- Touch-friendly buttons
- Optimized input fields
- Readable typography
- Proper spacing

## 🎯 API Integration

### 1. Base URL:
```javascript
const API_URL = 'http://localhost:8080';
```

### 2. Endpoints:
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/validate` - Validate token (optional)

### 3. Headers:
```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // For protected routes
}
```

## 🚀 Deployment

### 1. Build Production:
```bash
npm run build
```

### 2. Environment Variables:
```env
VITE_API_URL=http://localhost:8080
```

### 3. CORS Configuration (Backend):
```java
@CrossOrigin(origins = "http://localhost:3000")
```

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Error**:
   - Kiểm tra CORS configuration ở backend
   - Đảm bảo frontend URL được allow

2. **Token Not Saved**:
   - Kiểm tra localStorage/sessionStorage
   - Verify token format từ backend

3. **Validation Errors**:
   - Kiểm tra validation rules
   - Verify input format

4. **API Connection**:
   - Kiểm tra backend server running
   - Verify API endpoints

## 📈 Future Enhancements

### Planned Features:
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login integration
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Session management
- [ ] Remember device functionality

### Performance Optimizations:
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] Caching strategies

---

## 🎉 Kết Luận

Hệ thống authentication mới cung cấp:
- ✅ Giao diện đẹp mắt và hiện đại
- ✅ Trải nghiệm người dùng tốt
- ✅ Bảo mật cao
- ✅ Dễ dàng mở rộng
- ✅ Responsive design

Hãy test kỹ lưỡng trước khi deploy production! 🚀 