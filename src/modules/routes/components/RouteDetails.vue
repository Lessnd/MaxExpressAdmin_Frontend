<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, ArrowRight, Calendar, Info } from 'lucide-vue-next'
import type { Route } from '../types/route.types'
import { useDate } from '@/shared/composables/useDate'

const props = defineProps<{ route: Route }>()
const { formatDateTime } = useDate()

// Ahora esta función SI se utiliza en el template
const typeClasses = computed(() => {
    switch (props.route.type) {
        case 'Nacional': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'Internacional': return 'bg-purple-100 text-purple-700 border-purple-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
                <h3 class="text-xl font-bold text-gray-900">{{ route.name }}</h3>
                <p class="text-xs text-gray-400 font-mono mt-1">ID: {{ route.id }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full border" 
                :class="route.active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'">
                {{ route.active ? 'ACTIVA' : 'INACTIVA' }}
            </span>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 relative overflow-hidden">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div class="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Punto de Salida</span>
                    <div class="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <MapPin class="w-5 h-5 text-blue-500" />
                        {{ route.origin }}
                    </div>
                </div>

                <div class="text-gray-300 flex flex-col items-center">
                    <span class="px-2 py-0.5 text-xs font-bold rounded-full border mb-1 transition-colors" :class="typeClasses">
                        {{ route.type }}
                    </span>
                    <ArrowRight class="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                <div class="flex flex-col items-center sm:items-end text-center sm:text-right flex-1">
                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Punto de Llegada</span>
                    <div class="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        {{ route.destination }}
                        <MapPin class="w-5 h-5 text-red-500" />
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                    <Info class="w-4 h-4" />
                    <label class="text-xs font-semibold uppercase tracking-wider">Descripción</label>
                </div>
                <p class="text-gray-900 text-sm bg-white p-3 rounded-lg border border-gray-100 min-h-[60px]">
                    {{ route.description || 'Sin descripción disponible.' }}
                </p>
            </div>

            <div class="space-y-1">
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar class="w-4 h-4" />
                    <label class="text-xs font-semibold uppercase tracking-wider">Fecha de Creación</label>
                </div>
                <p class="text-gray-900 font-medium p-3">
                    {{ formatDateTime(route.createdAt) }}
                </p>
            </div>
        </div>
    </div>
</template>