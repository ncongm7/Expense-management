<template>
    <footer class="footer bg-light text-center py-3 mt-auto border-top">
        <div class="container">
            <span class="fw-semibold">Quản Lí Chi Tiêu</span> &copy; {{ new Date().getFullYear() }}
            <span class="d-block d-md-inline ms-md-3 text-muted" style="font-size: 0.95rem;">
                Liên hệ: <a href="mailto:support@quanlichitieu.vn"
                    class="text-decoration-none">support@quanlichitieu.vn</a>
            </span>
        </div>
    </footer>
</template>

<script setup>
// Tên component: Footer
</script>

<style scoped>
.footer {
    font-size: 1rem;
}

@media (max-width: 768px) {
    .footer {
        font-size: 0.95rem;
        padding-bottom: 60px;
    }
}
</style>
