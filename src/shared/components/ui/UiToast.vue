<script setup lang="ts">
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'
import { useToast } from '@shared/composables/useToast'

const { toasts, removeToast } = useToast()

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
}

const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
}
</script>

<template>
    <div class="fixed top-4 right-4 left-4 md:left-auto z-[9999] flex flex-col gap-2 md:w-full md:max-w-sm pointer-events-none">
        <TransitionGroup name="toast">
            <div v-for="toast in toasts" :key="toast.id"
                class="pointer-events-auto flex items-center p-4 rounded-lg border shadow-lg transition-all transform"
                :class="colors[toast.type]">
                <component :is="icons[toast.type]" class="w-5 h-5 mr-3 shrink-0" />

                <p class="text-sm font-medium flex-1">{{ toast.message }}</p>

                <button @click="removeToast(toast.id)" class="ml-3 opacity-70 hover:opacity-100 transition-opacity">
                    <X class="w-4 h-4" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>