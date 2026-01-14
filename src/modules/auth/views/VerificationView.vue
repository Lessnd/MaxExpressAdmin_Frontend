<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthHeader from '../components/AuthHeader.vue'
import VerificationForm from '../components/VerificationForm.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'

const router = useRouter()

const handleBack = () => {
    router.push('/auth/login')
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-bg-app p-4">
        <UiToast />

        <div
            class="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-auto md:min-h-[500px] animate-card-entry">

            <AuthHeader />

            <VerificationForm @back="handleBack" />

        </div>
    </div>
</template>

<style scoped>
/* Misma animación para coherencia visual */
.animate-card-entry {
    animation: cardEntry 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes cardEntry {
    from {
        opacity: 0;
        transform: translateY(20px); /* Puedes cambiar a translateX(20px) si prefieres que entre de lado */
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>