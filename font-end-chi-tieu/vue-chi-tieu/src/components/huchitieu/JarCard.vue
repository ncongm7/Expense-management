<template>
    <div class="jar-card" @click="$emit('click')">
        <div class="jar-container">
            <!-- Thân bình với hiệu ứng thủy tinh -->
            <div class="jar-body">
                <!-- Cổ bình -->
                <div class="jar-neck"></div>

                <!-- Thân chính của bình -->
                <div class="jar-main">
                    <!-- Hiệu ứng thủy tinh trong suốt -->
                    <div class="glass-effect"></div>
                    <div class="water-level" ref="waterLevelRef" :style="{
                        height: `${waterLevel}%`,
                        background: `linear-gradient(180deg, ${jar.color}30 0%, ${jar.color}60 50%, ${jar.color}90 100%)`,
                        borderBottomLeftRadius: waterLevel >= 90 ? '50% 80%' : '0',
                        borderBottomRightRadius: waterLevel >= 90 ? '50% 80%' : '0'
                    }">
                        <!-- Bề mặt nước -->
                        <div class="water-surface" :style="{ backgroundColor: jar.color }"></div>

                        <!-- Bong bóng nổi -->
                        <div class="bubble bubble-1" :style="{ backgroundColor: jar.color }"></div>
                        <div class="bubble bubble-2" :style="{ backgroundColor: jar.color }"></div>
                        <div class="bubble bubble-3" :style="{ backgroundColor: jar.color }"></div>

                        <!-- Hiệu ứng lấp lánh -->
                        <div class="sparkle sparkle-1" :style="{ backgroundColor: jar.color }"></div>
                        <div class="sparkle sparkle-2" :style="{ backgroundColor: jar.color }"></div>
                        <div class="sparkle sparkle-3" :style="{ backgroundColor: jar.color }"></div>
                    </div>

                    <!-- Hiệu ứng giọt nước rơi -->
                    <div class="water-drop" :style="{ backgroundColor: jar.color }"></div>

                    <!-- Đáy bình -->
                    <div class="jar-base"></div>
                </div>
            </div>

            <!-- Thông tin hũ -->
            <div class="jar-info">
                <h3 class="jar-name">{{ jar.jarDisplayName }}</h3>
                <div class="jar-amount">{{ formatCurrency(jar.currentAmount) }} / {{ formatCurrency(jar.targetAmount) }}
                </div>
                <div class="jar-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{
                            width: `${progressPercentage}%`,
                            background: `linear-gradient(90deg, ${jar.color}40, ${jar.color})`
                        }"></div>
                    </div>
                    <span class="progress-text">{{ progressPercentage }}%</span>
                </div>
                <div class="jar-target">
                    Mục tiêu: {{ formatCurrency(jar.targetAmount) }}
                </div>
            </div>

            <!-- Nút thao tác -->
            <div class="jar-actions">
                <button class="btn btn-sm btn-outline-primary" @click.stop="$emit('edit')" title="Chỉnh sửa hũ">
                    <i class="bi bi-pencil"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
    jar: {
        type: Object,
        required: true
    }
})

defineEmits(['click', 'edit'])

// Debug logging
console.log('JarCard rendering with jar:', props.jar)

// Tính toán các thuộc tính
const progressPercentage = computed(() => {
    if (!props.jar.targetAmount || props.jar.targetAmount === 0) return 0
    const percentage = (props.jar.currentAmount / props.jar.targetAmount) * 100
    return Math.min(Math.round(percentage), 100)
})

const waterLevel = computed(() => {
    return Math.min(progressPercentage.value, 85) // Tối đa 85% để không tràn
})

const waterLevelRef = ref(null)

onMounted(() => {
    console.log('JarCard mounted, waterLevel:', waterLevel.value, 'progressPercentage:', progressPercentage.value)

    // Animation cho mực nước khi component mount
    if (waterLevelRef.value) {
        gsap.from(waterLevelRef.value, {
            height: 0,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => {
                console.log('Water animation completed')
                // Animation bong bóng và lấp lánh sau khi nước đầy
                gsap.from('.bubble', {
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    stagger: 0.3,
                    repeat: -1,
                    yoyo: true
                })
                gsap.from('.sparkle', {
                    opacity: 0,
                    scale: 0,
                    duration: 1.2,
                    stagger: 0.4,
                    repeat: -1,
                    yoyo: true
                })
            }
        })
    }

    // Hiệu ứng giọt nước khi click
    const jarCard = document.querySelector('.jar-card')
    if (jarCard) {
        jarCard.addEventListener('click', () => {
            gsap.fromTo('.water-drop',
                { opacity: 0, y: -10 },
                { opacity: 1, y: 5, duration: 0.6, ease: 'power1.out', onComplete: () => gsap.set('.water-drop', { opacity: 0, y: -10 }) }
            )
        })
    }
})

// Hàm tiện ích
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0)
}
</script>

<style scoped>
/* Giữ nguyên các style hiện tại và thêm hiệu ứng mới */
.jar-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.jar-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
}

.jar-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 1.5rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.jar-card:hover::before {
    opacity: 1;
}

.jar-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.jar-body {
    position: relative;
    width: 100%;
    height: 140px;
    margin-bottom: 1rem;
}

.jar-neck {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 15px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 3px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.jar-main {
    position: relative;
    width: 90%;
    height: 120px;
    margin: 0 auto;
    background: rgba(200, 200, 200, 0.08);
    border-radius: 50% 50% 40% 40% / 60% 60% 80% 80%;
    /* Bầu ở dưới */
    border: 2.5px solid #b0b0b0;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
    z-index: 2;
}

.glass-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 30%,
            rgba(255, 255, 255, 0.2) 70%,
            rgba(255, 255, 255, 0.5) 100%);
    border-radius: 1.5rem;
    pointer-events: none;
    z-index: 1;
}

.jar-belly {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 70%;
    background: transparent;
    border-radius: 0 0 50% 50% / 0 0 100% 100%;
    box-shadow: 0 16px 32px 8px rgba(0, 0, 0, 0.1);
}

.water-container {
    position: absolute;
    bottom: 20px;
    left: 10px;
    right: 10px;
    width: calc(100% - 20px);
    height: 120px;
    border-radius: 1rem 1rem 0 0;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.4);
    overflow: hidden;
    backdrop-filter: blur(2px);
}

.water-level {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: height 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    /* border-radius sẽ được điều khiển động qua style binding */
}

.water-surface {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 1rem 1rem 0 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    animation: waterSurface 3s infinite ease-in-out;
}

.bubble {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.7;
    animation: bubbleFloat 3s infinite ease-in-out;
}

.bubble-1 {
    top: 15px;
    left: 15px;
    animation-delay: 0s;
}

.bubble-2 {
    top: 20px;
    right: 20px;
    animation-delay: 1s;
}

.bubble-3 {
    bottom: 15px;
    left: 20px;
    animation-delay: 2s;
}

@keyframes bubbleFloat {
    0% {
        transform: translateY(0) scale(0.8);
        opacity: 0;
    }

    20% {
        opacity: 0.7;
    }

    80% {
        opacity: 0.7;
    }

    100% {
        transform: translateY(-20px) scale(1.2);
        opacity: 0;
    }
}

.sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    opacity: 0.9;
    animation: sparkleTwinkle 2s infinite ease-in-out;
}

.sparkle-1 {
    top: 20px;
    left: 20px;
    animation-delay: 0s;
}

.sparkle-2 {
    top: 30px;
    right: 25px;
    animation-delay: 0.7s;
}

.sparkle-3 {
    bottom: 20px;
    left: 25px;
    animation-delay: 1.4s;
}

@keyframes sparkleTwinkle {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(0.5);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

.jar-base {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 20px;
    border-radius: 0 0 1.5rem 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-top: 3px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.water-drop {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 12px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    opacity: 0;
    animation: waterDrop 0.6s ease-out;
}

.jar-card:active .water-drop {
    animation-play-state: running;
}

@keyframes waterDrop {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(-5px) scale(0.5);
    }

    50% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(5px) scale(0.8);
    }
}

.jar-info {
    text-align: center;
    width: 100%;
}

.jar-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
}

.jar-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.jar-progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.8s ease-in-out;
    border-radius: 3px;
}

.progress-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: #6c757d;
    min-width: 40px;
}

.jar-target {
    font-size: 0.8rem;
    color: #6c757d;
}

.jar-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.jar-card:hover .jar-actions {
    opacity: 1;
}

@media (max-width: 768px) {
    .jar-card {
        padding: 1rem;
    }

    .jar-body {
        width: 100%;
        height: 100px;
        /* Giảm chiều cao trên mobile */
    }

    .jar-neck {
        width: 15px;
        height: 10px;
    }

    .water-container {
        width: 100%;
        height: 80px;
    }

    .jar-name {
        font-size: 1rem;
    }

    .jar-amount {
        font-size: 1.2rem;
    }
}

@keyframes waterSurface {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(1px);
    }
}
</style>