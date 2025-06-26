<template>
    <div class="container-fluid body-container">
        <div class="row flex-md-nowrap">
            <!-- Sidebar luôn hiển thị cho layout chính -->
            <div class="col-12 col-md-3 sidebar-col mb-3 mb-md-0">
                <MenuSide />
            </div>
            <!-- Main content -->
            <div class="col-12 col-md-9 main-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import MenuSide from './MenuSide.vue';
</script>

<style scoped>
.body-container {
    min-height: 80vh;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.sidebar-col {
    padding-right: 0;
    padding-left: 0;
}

.main-content {
    padding: 0 0.5rem;
}

@media (max-width: 768px) {
    .body-container {
        padding: 0;
    }

    .sidebar-col {
        margin-bottom: 1rem;
    }
}
</style>