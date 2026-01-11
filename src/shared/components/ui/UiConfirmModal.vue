<script setup lang="ts">
import UiModal from './UiModal.vue'
import UiButton from './UiButton.vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
    isOpen: boolean
    title: string
    description: string
    loading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
    <UiModal 
        :is-open="isOpen" 
        maxWidth="sm" 
        @close="$emit('close')"
        :hide-header="true"
    >
        <div class="flex flex-col items-center text-center p-2">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle class="w-6 h-6" />
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-gray-500 text-sm mb-6">
                {{ description }}
            </p>

            <div class="flex gap-3 w-full">
                <UiButton variant="ghost" class="flex-1 border border-gray-200" @click="$emit('close')"
                    :disabled="loading">
                    Cancelar
                </UiButton>
                <UiButton class="flex-1 bg-red-600 hover:bg-red-700 text-white" @click="$emit('confirm')"
                    :disabled="loading">
                    {{ loading ? 'Eliminando...' : 'Sí, Eliminar' }}
                </UiButton>
            </div>
        </div>
    </UiModal>
</template>