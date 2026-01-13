<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LogOut, X } from 'lucide-vue-next'
import { MENU_ITEMS } from '@/modules/dashboard/constants/menu' // Asegúrate que el alias sea correcto (@ o @/)

// Definimos props visuales
defineProps<{
    isOpen: boolean
    isMobile: boolean
    isCollapsed: boolean
}>()

// Solo emitimos close, el logout lo maneja el router internamente ahora
defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Lógica para determinar si un ítem está activo
const isActive = (path: string) => {
    // 1. Caso especial: Dashboard principal (coincidencia exacta)
    if (path === '/dashboard') {
        return route.path === '/dashboard'
    }

    // 2. Demás módulos: Coincidencia parcial (ej: /dashboard/clients/create activa Clientes)
    return route.path.startsWith(path)
}

// Lógica de Cerrar Sesión
const handleLogout = () => {
    // Aquí podrías limpiar localStorage.removeItem('token')
    router.push('/auth/login')
}

const items = MENU_ITEMS
</script>

<template>
    <div 
        v-if="isMobile && isOpen" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-500"
        @click="$emit('close')"
    ></div>

    <aside
        class="fixed lg:static top-0 left-0 z-40 h-full flex flex-col shadow-2xl lg:shadow-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden bg-slate-900 text-white"
        :class="[
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            !isMobile && isCollapsed ? 'w-20' : 'w-64'
        ]"
    >
        <div class="p-5 flex items-center justify-between border-b border-slate-800 h-20 shrink-0">
            <div class="flex items-center gap-3 overflow-hidden">
                <div class="bg-gradient-to-br from-yellow-400 to-orange-500 min-w-[2.5rem] h-10 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <img 
                        src="@/shared/assets/images/max-express-logo.png" 
                        alt="logo"
                        class="w-full h-full object-cover rounded-full" 
                    />
                </div>

                <div v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300 overflow-hidden">
                    <div class="text-sm font-semibold truncate">MAX EXPRESS</div>
                    <div class="text-xs text-slate-400 truncate">Panel Admin</div>
                </div>
            </div>

            <button 
                v-if="isMobile" 
                @click="$emit('close')" 
                class="text-slate-400 hover:text-white lg:hidden"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            <RouterLink 
                v-for="item in items" 
                :key="item.route" 
                :to="item.route"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                :class="{
                    'bg-blue-600 text-white shadow-md shadow-blue-900/20': isActive(item.route),
                    'text-slate-300 hover:bg-slate-800 hover:text-white': !isActive(item.route)
                }"
                @click="isMobile && $emit('close')"
            >
                <component 
                    :is="item.icon" 
                    class="w-5 h-5 min-w-[1.25rem] transition-colors"
                    :class="isActive(item.route) ? 'text-white' : 'text-slate-400 group-hover:text-white'" 
                />
                
                <span v-if="!isCollapsed" class="whitespace-nowrap transition-opacity duration-200">
                    {{ item.label }}
                </span>
            </RouterLink>
        </nav>

        <div class="p-4 border-t border-slate-800 shrink-0">
            <button 
                @click="handleLogout"
                class="w-full group bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 border border-transparent hover:border-red-500"
                title="Cerrar Sesión"
            >
                <LogOut class="w-5 h-5 min-w-[1.25rem]" />
                
                <span v-if="!isCollapsed" class="whitespace-nowrap font-medium">
                    {{ t('dashboard.menu.logout') }}
                </span>
            </button>
        </div>
    </aside>
</template>