<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

defineProps<{ userName?: string }>()
defineEmits(['toggleSidebar'])
</script>

<template>
    <header
        class="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-8 h-16 shadow-sm">
        <button @click="$emit('toggleSidebar')"
            class="p-2 rounded-md hover:bg-gray-100 text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100">
            <Menu class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-3">
            <span class="text-sm text-slate-600 hidden sm:block font-medium">
                {{ userName || 'Administrador' }}
            </span>
            <div
                class="w-9 h-9 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center text-yellow-700 font-bold shadow-sm">
                {{ userName?.charAt(0).toUpperCase() || 'A' }}
            </div>
        </div>
    </header>
</template>