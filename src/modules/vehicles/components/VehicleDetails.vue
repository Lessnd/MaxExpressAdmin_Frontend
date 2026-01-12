<script setup lang="ts">
import { computed } from 'vue'
import { Truck, Calendar, Palette, Weight, Info } from 'lucide-vue-next'
import type { Vehicle } from '../types/vehicle.types'
import { useDate } from '@/shared/composables/useDate'

const props = defineProps<{ vehicle: Vehicle }>()
const { formatDateTime } = useDate()

const statusClasses = computed(() => {
    return props.vehicle.active
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-red-100 text-red-700 border-red-200'
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Truck class="w-8 h-8" />
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-mono text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-700 border border-gray-200">
                            {{ vehicle.plate }}
                        </span>
                        <span class="text-xs text-gray-400">ID: {{ vehicle.id }}</span>
                    </div>
                </div>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full border" :class="statusClasses">
                {{ vehicle.active ? 'OPERATIVO' : 'INACTIVO' }}
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-md text-gray-400 shadow-sm">
                    <Info class="w-4 h-4" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Tipo</p>
                    <p class="font-medium text-gray-900">{{ vehicle.type }}</p>
                </div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-md text-gray-400 shadow-sm">
                    <Calendar class="w-4 h-4" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Año</p>
                    <p class="font-medium text-gray-900">{{ vehicle.year }}</p>
                </div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-md text-gray-400 shadow-sm">
                    <Palette class="w-4 h-4" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Color</p>
                    <p class="font-medium text-gray-900">{{ vehicle.color }}</p>
                </div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                <div class="p-2 bg-white rounded-md text-gray-400 shadow-sm">
                    <Weight class="w-4 h-4" />
                </div>
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Capacidad de Carga</p>
                    <p class="font-medium text-gray-900">{{ vehicle.capacity }} kg</p>
                </div>
            </div>
        </div>

        <div class="pt-4 border-t border-gray-50 text-right">
            <p class="text-xs text-gray-400">
                Registrado en sistema: <span class="font-medium text-gray-600">{{ formatDateTime(vehicle.createdAt) }}</span>
            </p>
        </div>
    </div>
</template>