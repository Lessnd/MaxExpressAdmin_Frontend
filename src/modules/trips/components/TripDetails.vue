<script setup lang="ts">
import { computed } from 'vue'
import { 
    MapPin, Truck, User, 
    Package, Clock, Info, Globe 
} from 'lucide-vue-next'
import type { Trip } from '../types/trip.types'
import { useDate } from '@/shared/composables/useDate'

const props = defineProps<{ trip: Trip }>()
const { formatDateTime } = useDate()

// Estilos dinámicos para el estado
const statusClasses = computed(() => {
    switch (props.trip.status) {
        case 'Completado': return 'bg-green-100 text-green-700 border-green-200'
        case 'En Ruta': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'Programado': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
})

// Estilos para el tipo de viaje
const typeIcon = computed(() => props.trip.type === 'Internacional' ? Globe : MapPin)
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <component :is="typeIcon" class="w-6 h-6" />
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Viaje {{ trip.type }}</h3>
                    <p class="text-xs text-gray-400 font-mono">ID: {{ trip.id }}</p>
                </div>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full border" :class="statusClasses">
                {{ trip.status.toUpperCase() }}
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                <div class="bg-white p-2 rounded-full shadow-sm text-gray-500">
                    <User class="w-5 h-5" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Conductor</p>
                    <p class="font-medium text-gray-900">{{ trip.driverName }}</p>
                    <p class="text-xs text-gray-500 font-mono">ID: {{ trip.driverId }}</p>
                </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                <div class="bg-white p-2 rounded-full shadow-sm text-gray-500">
                    <Truck class="w-5 h-5" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Vehículo</p>
                    <p class="font-medium text-gray-900">{{ trip.vehiclePlate }}</p>
                    <p class="text-xs text-gray-500 font-mono">ID: {{ trip.vehicleId }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div class="space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Clock class="w-4 h-4 text-gray-400" /> Cronograma
                </h4>
                
                <div class="relative pl-4 border-l-2 border-gray-200 space-y-6">
                    <div class="relative">
                        <div class="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white ring-1 ring-gray-200"></div>
                        <p class="text-xs text-gray-500">Fecha de Salida</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatDateTime(trip.departureDate) }}</p>
                    </div>
                    
                    <div class="relative">
                        <div class="absolute -left-[21px] top-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white ring-1 ring-gray-200"></div>
                        <p class="text-xs text-gray-500">Fecha Estimada Llegada</p>
                        <p class="text-sm font-medium text-gray-900">
                            {{ trip.arrivalDate ? formatDateTime(trip.arrivalDate) : 'No definida' }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Info class="w-4 h-4 text-gray-400" /> Detalles Operativos
                </h4>
                
                <div class="space-y-3">
                    <div>
                        <p class="text-xs text-gray-500">Ubicación Actual</p>
                        <p class="text-sm text-gray-900 font-medium flex items-center gap-1">
                            <MapPin class="w-3 h-3 text-red-500" /> 
                            {{ trip.currentLocation || 'No registrada' }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500">Carga Asignada</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                <Package class="w-3 h-3" />
                                {{ trip.packageIds.length }} Paquetes
                            </span>
                            <span class="text-xs text-gray-400">Capacidad: {{ trip.capacity }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="trip.notes" class="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
            <span class="font-bold block mb-1">Observaciones:</span>
            {{ trip.notes }}
        </div>
        
        <div v-if="trip.packageIds.length > 0" class="pt-2">
            <p class="text-xs font-semibold text-gray-500 mb-2">IDs de Paquetes Asignados:</p>
            <div class="flex flex-wrap gap-2">
                <span v-for="pkgId in trip.packageIds" :key="pkgId" 
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-mono rounded border border-gray-200">
                    {{ pkgId }}
                </span>
            </div>
        </div>
    </div>
</template>