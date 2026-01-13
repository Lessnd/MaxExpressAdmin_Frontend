<script setup lang="ts">
import { ref } from 'vue'
import { Eye } from 'lucide-vue-next'

// UI Components
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'
import UiInput from '@/shared/components/ui/UiInput.vue'

// Module
import DeliveryTripDetails from '../components/DeliveryTripDetails.vue'
import { useDeliveries } from '../composables/useDeliveries'
import type { DeliveryTrip } from '../types/delivery.types'

// Desestructuramos togglePackageStatus
const { 
    trips, 
    loading, 
    metrics, 
    fetchPackages, 
    currentPackages, 
    loadingPackages, 
    togglePackageStatus // <--- IMPORTANTE: Usamos la nueva función
} = useDeliveries()

const searchTerm = ref('')
const showDetailsModal = ref(false)
const selectedTrip = ref<DeliveryTrip | null>(null)

const columns = [
    { header: 'Código Viaje', key: 'tripCode', class: 'font-mono font-bold' },
    { header: 'Conductor', key: 'driverName' },
    { header: 'Placa', key: 'vehiclePlate' },
    { header: 'Fecha', key: 'date', class: 'hidden sm:table-cell' },
    { header: 'Progreso', key: 'progress' },
    { header: 'Estado', key: 'status' },
    { header: '', key: 'actions', class: 'text-right' }
]

const openDetails = async (trip: DeliveryTrip) => {
    selectedTrip.value = trip
    showDetailsModal.value = true
    await fetchPackages(trip.id)
}

// Manejador del evento Toggle (bidireccional)
const handleToggleStatus = async (pkg: any) => {
    if (selectedTrip.value) {
        await togglePackageStatus(selectedTrip.value.id, pkg)
    }
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Entregas Pendientes</h1>
                <p class="text-sm text-gray-500 mt-1">Validación y cierre de paquetes</p>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value" :icon="metric.icon" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar viajes..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="trips" :loading="loading">
                
                <template #cell-progress="{ row }">
                    <div class="w-full max-w-[140px]">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="font-medium text-gray-700">{{ (row as DeliveryTrip).deliveredPackages }}/{{ (row as DeliveryTrip).totalPackages }}</span>
                            <span class="text-gray-500">{{ Math.round(((row as DeliveryTrip).deliveredPackages / (row as DeliveryTrip).totalPackages) * 100) }}%</span>
                        </div>
                        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                class="h-full bg-blue-500 rounded-full transition-all duration-500"
                                :style="{ width: `${((row as DeliveryTrip).deliveredPackages / (row as DeliveryTrip).totalPackages) * 100}%` }"
                            ></div>
                        </div>
                    </div>
                </template>

                <template #cell-status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="{
                            'bg-blue-50 text-blue-700 border-blue-200': (row as DeliveryTrip).status === 'En Proceso',
                            'bg-green-50 text-green-700 border-green-200': (row as DeliveryTrip).status === 'Finalizado'
                        }"
                    >
                        {{ (row as DeliveryTrip).status }}
                    </span>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end">
                        <button 
                            @click="openDetails(row as DeliveryTrip)" 
                            class="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                        >
                            <Eye class="w-4 h-4" />
                            Gestionar
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal 
            :is-open="showDetailsModal" 
            title="Gestión de Entregas" 
            @close="showDetailsModal = false"
            maxWidth="2xl"
        >
            <DeliveryTripDetails 
                v-if="selectedTrip" 
                :trip="selectedTrip"
                :packages="currentPackages"
                :loading="loadingPackages"
                @toggle="handleToggleStatus" 
            />
        </UiModal>
    </div>
</template>