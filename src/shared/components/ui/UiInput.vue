<script setup lang="ts">
import { cn } from '@shared/utils/cn'

// defineModel maneja automáticamente el v-model
const modelValue = defineModel<string | number>()

interface Props {
    label?: string
    error?: string
    placeholder?: string
    type?: string
    class?: string
    id?: string
}

// CORRECCIÓN: Asignamos el resultado a la constante 'props'
const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    class: ''
})
</script>

<template>
    <div class="w-full space-y-1">
        <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
            {{ label }}
        </label>

        <div class="relative">
            <input :id="id" v-model="modelValue" :type="type" :placeholder="placeholder" :class="cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                error && 'border-red-500 focus:ring-red-500',
                props.class
            )" />
        </div>

        <span v-if="error" class="text-xs text-red-500 font-medium animate-pulse">
            {{ error }}
        </span>
    </div>
</template>