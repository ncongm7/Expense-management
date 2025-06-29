<template>
    <footer class="footer">
        <!-- Main Footer Content -->
        <div class="footer-main">
            <div class="container">
                <div class="row g-4">
                    <!-- App Info -->
                    <div class="col-lg-4 col-md-6">
                        <div class="footer-section">
                            <div class="footer-logo">
                                <div class="logo-icon">💰</div>
                                <h3 class="logo-text">Quản Lý Chi Tiêu</h3>
                            </div>
                            <p class="footer-description">
                                Ứng dụng quản lý tài chính cá nhân thông minh, giúp bạn kiểm soát chi tiêu và đạt được mục tiêu tài chính một cách hiệu quả.
                            </p>
                            <div class="social-links">
                                <a href="#" class="social-link" title="Facebook">
                                    <i class="bi bi-facebook"></i>
                                </a>
                                <a href="#" class="social-link" title="Twitter">
                                    <i class="bi bi-twitter"></i>
                                </a>
                                <a href="#" class="social-link" title="Instagram">
                                    <i class="bi bi-instagram"></i>
                                </a>
                                <a href="#" class="social-link" title="LinkedIn">
                                    <i class="bi bi-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="col-lg-2 col-md-6">
                        <div class="footer-section">
                            <h4 class="footer-title">Liên Kết Nhanh</h4>
                            <ul class="footer-links">
                                <li><a href="#" class="footer-link">Trang Chủ</a></li>
                                <li><a href="#" class="footer-link">Giao Dịch</a></li>
                                <li><a href="#" class="footer-link">Báo Cáo</a></li>
                                <li><a href="#" class="footer-link">Mục Tiêu</a></li>
                                <li><a href="#" class="footer-link">Ngân Sách</a></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Support -->
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-section">
                            <h4 class="footer-title">Hỗ Trợ</h4>
                            <ul class="footer-links">
                                <li><a href="#" class="footer-link">Hướng Dẫn Sử Dụng</a></li>
                                <li><a href="#" class="footer-link">Câu Hỏi Thường Gặp</a></li>
                                <li><a href="#" class="footer-link">Chính Sách Bảo Mật</a></li>
                                <li><a href="#" class="footer-link">Điều Khoản Sử Dụng</a></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-section">
                            <h4 class="footer-title">Liên Hệ</h4>
                            <div class="contact-info">
                                <div class="contact-item">
                                    <i class="bi bi-envelope-fill contact-icon"></i>
                                    <div class="contact-details">
                                        <span class="contact-label">Email Hỗ Trợ</span>
                                        <a href="mailto:nguyencong21052002@gmail.com" class="contact-link">
                                            nguyencong21052002@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <i class="bi bi-clock-fill contact-icon"></i>
                                    <div class="contact-details">
                                        <span class="contact-label">Thời Gian Làm Việc</span>
                                        <span class="contact-text">8:00 - 18:00 (T2-T6)</span>
                                    </div>
                                </div>
                                <div class="contact-item">
                                    <i class="bi bi-geo-alt-fill contact-icon"></i>
                                    <div class="contact-details">
                                        <span class="contact-label">Địa Chỉ</span>
                                        <span class="contact-text">Việt Nam</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <div class="copyright">
                        <span>&copy; {{ new Date().getFullYear() }} Quản Lý Chi Tiêu. Tất cả quyền được bảo lưu.</span>
                    </div>
                    <div class="footer-stats">
                        <span class="stat-item">
                            <i class="bi bi-people-fill"></i>
                            <span>10,000+</span> Người dùng
                        </span>
                        <span class="stat-item">
                            <i class="bi bi-shield-check"></i>
                            <span>99.9%</span> Bảo mật
                        </span>
                        <span class="stat-item">
                            <i class="bi bi-star-fill"></i>
                            <span>4.8/5</span> Đánh giá
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Decorative Elements -->
        <div class="footer-decoration">
            <div class="decoration-circle decoration-1"></div>
            <div class="decoration-circle decoration-2"></div>
            <div class="decoration-circle decoration-3"></div>
        </div>
    </footer>
</template>

<script setup>
// Footer Component
</script>

<style scoped>
.footer {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    overflow: hidden;
    margin-top: 4rem;
}

.footer-main {
    padding: 3rem 0 2rem;
    position: relative;
    z-index: 2;
}

.footer-section {
    margin-bottom: 1rem;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.logo-icon {
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(45deg, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-description {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.social-links {
    display: flex;
    gap: 0.75rem;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.social-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    color: white;
}

.footer-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white;
    position: relative;
}

.footer-title::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #ffffff, transparent);
    border-radius: 1px;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
}

.footer-link:hover {
    color: white;
    transform: translateX(5px);
}

.footer-link::before {
    content: '→';
    position: absolute;
    left: -15px;
    opacity: 0;
    transition: all 0.3s ease;
}

.footer-link:hover::before {
    opacity: 1;
    left: -20px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.contact-icon {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.1rem;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.contact-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.contact-link, .contact-text {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
}

.contact-link:hover {
    color: white;
    text-decoration: underline;
}

.footer-bottom {
    background: rgba(0, 0, 0, 0.1);
    padding: 1.5rem 0;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(10px);
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.copyright {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

.footer-stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
}

.stat-item i {
    color: #ffd700;
    font-size: 1rem;
}

.stat-item span {
    font-weight: 600;
    color: white;
}

/* Decorative Elements */
.footer-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
}

.decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    animation: float 6s ease-in-out infinite;
}

.decoration-1 {
    width: 100px;
    height: 100px;
    top: 10%;
    right: 10%;
    animation-delay: 0s;
}

.decoration-2 {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 5%;
    animation-delay: 2s;
}

.decoration-3 {
    width: 80px;
    height: 80px;
    top: 50%;
    right: 5%;
    animation-delay: 4s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .footer-main {
        padding: 2rem 0 1rem;
    }

    .footer-bottom-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }

    .footer-stats {
        justify-content: center;
        gap: 1rem;
    }

    .stat-item {
        font-size: 0.8rem;
    }

    .logo-text {
        font-size: 1.2rem;
    }

    .logo-icon {
        width: 40px;
        height: 40px;
        font-size: 1.5rem;
    }

    .footer {
        margin-top: 2rem;
    }
}

@media (max-width: 576px) {
    .footer-stats {
        flex-direction: column;
        gap: 0.5rem;
    }

    .social-links {
        justify-content: center;
    }
}
</style>

