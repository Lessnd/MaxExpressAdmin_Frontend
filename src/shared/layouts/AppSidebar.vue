<script setup lang="ts">
import { LogOut, X } from 'lucide-vue-next' // Usamos Lucide
import { useRoute } from 'vue-router'
import { MENU_ITEMS } from '@modules/dashboard/constants/menu' // <--- Importamos la verdad

// Definimos props visuales
defineProps<{
    isOpen: boolean
    isMobile: boolean
    isCollapsed: boolean
}>()

defineEmits(['close', 'logout'])

const route = useRoute()

// Lógica visual simple
// En src/shared/layouts/AppSidebar.vue

const isActive = (path: string) => {
    // Caso especial: Si es el Dashboard principal, exigimos igualdad exacta
    if (path === '/dashboard') {
        return route.path === '/dashboard'
    }

    // Para los demás módulos, permitimos sub-rutas (ej: /dashboard/clients/create)
    return route.path.startsWith(path)
}

// ITEMS TEMPORALES (Para visualizar el diseño sin romper nada)
const items = MENU_ITEMS
</script>

<template>
    <div v-if="isMobile && isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
        @click="$emit('close')"></div>

    <aside
        class="fixed lg:static top-0 left-0 z-40 h-full flex flex-col shadow-xl lg:shadow-none transition-all duration-300 overflow-hidden bg-slate-900 text-white"
        :class="[
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            !isMobile && isCollapsed ? 'w-20' : 'w-64'
        ]">
        <div class="p-5 flex items-center justify-between border-b border-slate-800 h-20">
            <div class="flex items-center gap-3 overflow-hidden">
                <div
                    class="bg-gradient-to-br from-yellow-400 to-orange-500 min-w-[2.5rem] h-10 rounded-full flex items-center justify-center shadow-md">
                    <img src="@shared/assets/images/max-express-logo.png" alt="logo"
                        class="w-full h-full object-cover rounded-full" />
                </div>

                <div v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">
                    <div class="text-sm font-semibold">MAX EXPRESS</div>
                    <div class="text-xs text-slate-400">Panel Admin</div>
                </div>
            </div>

            <button v-if="isMobile" @click="$emit('close')" class="text-slate-400 hover:text-white lg:hidden">
                <X class="w-5 h-5" />
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
            <RouterLink v-for="item in items" :key="item.route" :to="item.route"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                :class="{
                    'bg-slate-800 text-white border-l-4 border-blue-500 shadow-sm': isActive(item.route),
                    'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1': !isActive(item.route)
                }">
                <component :is="item.icon" class="w-5 h-5 min-w-[1.25rem] transition-colors"
                    :class="isActive(item.route) ? 'text-white' : 'text-slate-400 group-hover:text-white'" />
                <span v-if="!isCollapsed" class="whitespace-nowrap">{{ item.label }}</span>
            </RouterLink>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <button @click="$emit('logout')"
                class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm">
                <LogOut class="w-5 h-5" />
                <span v-if="!isCollapsed">Salir</span>
            </button>
        </div>
    </aside>
</template>