<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '@shared/utils/cn'

defineProps<{
    label: string
    value: string | number
    icon: Component
    trend?: string // Opcional: para mostrar "+5%" en el futuro
    class?: string
}>()
</script>

<template>
    <div
        :class="cn('flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow', $props.class)">
        <div class="p-3 rounded-lg bg-blue-50 text-primary">
            <component :is="icon" class="w-6 h-6" />
        </div>
        <div>
            <p class="text-2xl font-bold text-gray-900 leading-none">{{ value }}</p>
            <p class="text-sm text-gray-500 mt-1 font-medium">{{ label }}</p>
        </div>
    </div>
</template>