<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Check, RotateCcw } from 'lucide-vue-next' // Agregamos RotateCcw (Undo)
import type { DeliveryPackage, DeliveryTrip } from '../types/delivery.types'

const props = defineProps<{
    trip: DeliveryTrip
    packages: DeliveryPackage[]
    loading: boolean
}>()

// El evento ahora es genérico 'toggle'
const emit = defineEmits(['toggle'])

const pendingCount = computed(() => props.packages.filter(p => p.status === 'Pendiente').length)
</script>

<template>
    <div class="space-y-6">
        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-bold text-blue-900">{{ trip.tripCode }}</h3>
                <p class="text-sm text-blue-700">{{ trip.driverName }} • {{ trip.vehiclePlate }}</p>
            </div>
            <div class="text-right">
                <p class="text-xs font-bold text-blue-500 uppercase">Pendientes</p>
                <p class="text-2xl font-bold text-blue-900">{{ pendingCount }}</p>
            </div>
        </div>

        <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div v-if="loading" class="text-center py-8 text-gray-400">
                Cargando paquetes...
            </div>

            <div v-else-if="packages.length === 0" class="text-center py-8 text-gray-400">
                No hay paquetes en este viaje.
            </div>

            <div 
                v-for="pkg in packages" 
                :key="pkg.id" 
                class="flex items-center justify-between p-4 rounded-lg border transition-all"
                :class="pkg.status === 'Entregado' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200 shadow-sm'"
            >
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {{ pkg.trackingId }}
                        </span>
                        <span 
                            class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                            :class="{
                                'bg-yellow-100 text-yellow-700': pkg.status === 'Pendiente',
                                'bg-green-100 text-green-700': pkg.status === 'Entregado',
                                'bg-red-100 text-red-700': pkg.status === 'Fallido'
                            }"
                        >
                            {{ pkg.status }}
                        </span>
                    </div>
                    <p class="font-medium text-gray-900">{{ pkg.receiverName }}</p>
                    <p class="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin class="w-3 h-3" /> {{ pkg.address }}
                    </p>
                </div>

                <div class="flex gap-2">
                    
                    <button 
                        v-if="pkg.status === 'Pendiente'"
                        @click="$emit('toggle', pkg)"
                        class="p-2 bg-gray-100 text-gray-400 rounded-full hover:bg-green-500 hover:text-white transition-all shadow-sm"
                        title="Marcar como Entregado"
                    >
                        <Check class="w-5 h-5" />
                    </button>

                    <button 
                        v-if="pkg.status === 'Entregado'"
                        @click="$emit('toggle', pkg)"
                        class="p-2 bg-white text-green-600 border border-green-200 rounded-full hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300 transition-all shadow-sm"
                        title="Revertir a Pendiente"
                    >
                        <RotateCcw class="w-5 h-5" />
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>