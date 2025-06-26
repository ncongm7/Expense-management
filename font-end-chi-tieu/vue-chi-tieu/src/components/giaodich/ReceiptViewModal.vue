<template>
    <div class="modal fade" id="receiptModal" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <img :src="receiptUrl" alt="Hóa đơn" class="img-fluid rounded" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, nextTick, watch, onUnmounted } from 'vue';

const props = defineProps({
    receiptUrl: {
        type: String,
        default: ''
    },
    show: {
        type: Boolean,
        default: false
    }
});

const modalRef = ref(null);
let modalInstance = null;

watch(() => props.show, (newShow) => {
    if (modalRef.value) {
        if (newShow) {
            nextTick(() => {
                if (!modalInstance) {
                    modalInstance = new window.bootstrap.Modal(modalRef.value, { backdrop: 'static' });
                }
                modalInstance.show();
            });
        } else {
            if (modalInstance) {
                modalInstance.hide();
                if (document.activeElement) document.activeElement.blur();
            }
        }
    }
});

onUnmounted(() => {
    if (modalInstance) {
        modalInstance.dispose();
        modalInstance = null;
    }
});
</script>