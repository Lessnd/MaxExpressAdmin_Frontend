<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { DashboardAction } from '../types/dashboard.types'

defineProps<{ actions: DashboardAction[] }>()
</script>

<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Acceso Rápido
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <RouterLink v-for="action in actions" :key="action.id" :to="action.route"
                class="group flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200 hover:-translate-y-1">
                <div
                    class="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <component :is="action.icon" class="w-6 h-6" />
                </div>

                <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900 text-center">
                    {{ action.label }}
                </span>
            </RouterLink>
        </div>
    </div>
</template>