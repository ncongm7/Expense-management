<template>
    <div class="container-fluid body-container">
        <div class="row flex-md-nowrap">
            <!-- Sidebar: responsive -->
            <div class="col-12 col-md-3 sidebar-col mb-3 mb-md-0">
                <!-- Desktop: luôn hiển thị -->
                <MenuSide v-if="!isMobile" />
                <!-- Mobile: overlay -->
                <transition name="fade">
                    <div v-if="isMobile && showMenuSide" class="overlay-menu">
                        <div class="backdrop" @click="$emit('close-menu')"></div>
                        <div class="menu-content">
                            <MenuSide @menu-selected="$emit('close-menu')" />
                        </div>
                    </div>
                </transition>
            </div>
            <!-- Main content -->
            <div class="col-12 col-md-9 main-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MenuSide from './MenuSide.vue';

const props = defineProps({
    showMenuSide: Boolean
});

const isMobile = ref(window.innerWidth <= 768);

function handleResize() {
    isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
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
    position: relative;
}

.main-content {
    padding: 0 0.5rem;
}

.overlay-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    display: flex;
    align-items: flex-start;
}

.backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1;
}

.menu-content {
    position: relative;
    z-index: 2;
    width: 80vw;
    max-width: 320px;
    min-height: 100vh;
    background: #fff;
    border-radius: 0 2rem 2rem 0;
    box-shadow: 2px 0 16px 0 rgba(0, 0, 0, 0.08);
    animation: slideInLeft 0.2s;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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