<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

// Estado UI
const isSidebarOpen = ref(true)
const isCollapsed = ref(false)
const isMobile = ref(false)

const handleResize = () => {
    isMobile.value = window.innerWidth < 1024
    if (!isMobile.value) {
        isSidebarOpen.value = true
    } else {
        isSidebarOpen.value = false
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
    handleResize()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
    <div class="flex h-screen bg-bg-app overflow-hidden">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isCollapsed" :is-mobile="isMobile"
            @close="isSidebarOpen = false" @logout="() => console.log('Logout click')" />

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