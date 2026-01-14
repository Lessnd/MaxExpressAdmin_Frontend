<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthHeader from '../components/AuthHeader.vue'
import VerificationForm from '../components/VerificationForm.vue'
import UiToast from '@/shared/components/ui/UiToast.vue' // <--- IMPORTANTE

const router = useRouter()

const handleBack = () => {
    router.push('/auth/login')
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-bg-app p-4">
        <UiToast /> <div
            class="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl min-h-[500px]">

            <AuthHeader />

            <VerificationForm @back="handleBack" />

        </div>
    </div>
</template>