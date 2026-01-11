<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@shared/utils/cn'

const props = defineProps<{
    isOpen: boolean
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    hideHeader?: boolean // <--- NUEVA PROP
}>()

const emit = defineEmits(['close'])

// Cerrar con ESC
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) emit('close')
}

// Bloquear scroll
watch(() => props.isOpen, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})

const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
}[props.maxWidth || 'md']
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

                <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')">
                </div>

                <div :class="cn(
                    'relative w-full bg-white rounded-xl shadow-2xl ring-1 ring-gray-200 transform transition-all flex flex-col max-h-[90vh]',
                    maxWidthClass
                )">
                    <div v-if="!hideHeader" class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                        <button @click="$emit('close')"
                            class="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-md transition-colors">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="px-6 py-4 overflow-y-auto">
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
    transition: transform 0.2s ease-out;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
    transform: scale(0.95) translateY(10px);
}
</style>