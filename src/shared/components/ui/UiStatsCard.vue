<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '@/shared/utils/cn'

defineProps<{
    label: string
    value: string | number
    icon: Component
    trend?: string
    class?: string
}>()
</script>

<template>
    <div :class="cn(
        // 1. Reducimos ligeramente padding (p-5 -> p-4) y gap (gap-4 -> gap-3) para ganar espacio vital en móviles
        'flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow',
        $props.class
    )">
        <div class="p-3 rounded-lg bg-blue-50 text-primary shrink-0">
            <component :is="icon" class="w-6 h-6" />
        </div>

        <div class="min-w-0 flex-1">
            <p class="text-2xl font-bold text-gray-900 leading-none truncate">
                {{ value }}
            </p>
            
            <p class="text-xs sm:text-sm text-gray-500 mt-1 font-medium truncate" :title="label">
                {{ label }}
            </p>
        </div>
    </div>
</template>