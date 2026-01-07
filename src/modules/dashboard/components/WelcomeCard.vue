<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { SunDim, Sun, Moon } from 'lucide-vue-next'

defineProps<{ userName: string }>()

const timePeriod = ref<'morning' | 'afternoon' | 'night'>('morning')

const updateTimePeriod = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) timePeriod.value = 'morning'
    else if (hour >= 12 && hour < 18) timePeriod.value = 'afternoon'
    else timePeriod.value = 'night'
}

const config = computed(() => {
    switch (timePeriod.value) {
        case 'morning':
            return {
                greeting: '¡Buenos días',
                message: 'Es un gran momento para organizar tus tareas y revisar el progreso del día.',
                bgClass: 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700',
                icon: SunDim
            }
        case 'afternoon':
            return {
                greeting: '¡Buenas tardes',
                message: 'Continúa con tu excelente trabajo, aún hay mucho por hacer.',
                bgClass: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700',
                icon: Sun
            }
        case 'night':
            return {
                greeting: '¡Buenas noches',
                message: 'Excelente jornada. Relájate y revisa los últimos reportes del día.',
                bgClass: 'bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900',
                icon: Moon
            }
    }
})

onMounted(updateTimePeriod)
</script>

<template>
    <div class="relative text-white p-8 rounded-2xl shadow-lg overflow-hidden transition-colors duration-500"
        :class="config.bgClass">
        <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"></div>

        <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
            <div>
                <h2 class="text-3xl font-semibold mb-2">{{ config.greeting }}, {{ userName }}!</h2>
                <p class="text-blue-50 text-sm md:text-base max-w-md leading-relaxed opacity-90">
                    {{ config.message }}
                </p>
            </div>

            <div class="flex justify-center md:justify-end md:w-1/3">
                <component :is="config.icon"
                    class="w-24 h-24 md:w-32 md:h-32 opacity-80 transition-transform duration-700 hover:scale-110 hover:rotate-12" />
            </div>
        </div>
    </div>
</template>