<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

// 1. Detectamos si estamos en un entorno con ventana (Cliente)
const isClient = typeof window !== 'undefined'

// 2. Inicializamos el estado BASADO en el ancho real inicial, no en valores fijos
const isMobile = ref(isClient ? window.innerWidth < 1024 : false)

// 3. El estado inicial del sidebar depende de si es móvil o no
// Si es móvil (true) -> Sidebar cerrado (false)
// Si es escritorio (false) -> Sidebar abierto (true)
const isSidebarOpen = ref(!isMobile.value)

const isCollapsed = ref(false)

const handleResize = () => {
    const mobile = window.innerWidth < 1024
    
    // Solo actualizamos si hubo un cambio real de breakpoint para evitar reactividad innecesaria
    if (mobile !== isMobile.value) {
        isMobile.value = mobile
        
        // Si pasamos a escritorio, abrimos. Si pasamos a móvil, cerramos.
        if (!mobile) {
            isSidebarOpen.value = true
        } else {
            isSidebarOpen.value = false
        }
    }
}

const toggleSidebar = () => {
    if (isMobile.value) {
        isSidebarOpen.value = !isSidebarOpen.value
    } else {
        isCollapsed.value = !isCollapsed.value
    }
}

onMounted(() => {
    // Ya no necesitamos llamar a handleResize() aquí para inicializar,
    // pero sí necesitamos el listener para cambios futuros.
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
    <div class="flex h-screen bg-bg-app overflow-hidden">
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isCollapsed" 
            :is-mobile="isMobile"
            @close="isSidebarOpen = false" 
        />

        <div class="flex flex-col flex-1 min-w-0">
            <AppHeader @toggle-sidebar="toggleSidebar" user-name="Max User" />

            <main class="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </main>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>