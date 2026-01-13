<script setup lang="ts">
import { ref } from 'vue'
import { PlaneIcon, Edit2, Trash2,Eye } from 'lucide-vue-next' 

// UI
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'
import UiInput from '@/shared/components/ui/UiInput.vue'

// Module
import TripForm from '../components/TripForm.vue'
import TripDetails from '../components/TripDetails.vue' 
import { useTrips } from '../composables/useTrips'
import { tripsService } from '../services/trips.service'
import { useToast } from '@/shared/composables/useToast'
import type { Trip } from '../types/trip.types'

const { trips, loading, metrics, fetchTrips, deleteTrip } = useTrips()
const { addToast } = useToast()
const searchTerm = ref('')

// Estados de Modales
const showCreateModal = ref(false)
const showDetailsModal = ref(false) 
const showDeleteModal = ref(false)
const isSubmitting = ref(false)

const selectedTrip = ref<Trip | null>(null)

const columns = [
    { header: 'Tipo', key: 'type' },
    { header: 'Salida', key: 'departureDate' },
    { header: 'Vehículo', key: 'vehiclePlate' },
    { header: 'Conductor', key: 'driverName' },
    { header: 'Estado', key: 'status' },
    { header: 'Paquetes', key: 'packages', class: 'text-center' },
    { header: '', key: 'actions', class: 'text-right' }
]

// Acciones
const openCreate = () => { selectedTrip.value = null; showCreateModal.value = true }
const openEdit = (trip: Trip) => { selectedTrip.value = { ...trip }; showCreateModal.value = true }
const openDelete = (trip: Trip) => { selectedTrip.value = trip; showDeleteModal.value = true }

// <--- 4. Nueva acción Open Details
const openDetails = (trip: Trip) => { 
    selectedTrip.value = trip
    showDetailsModal.value = true 
}

const handleFormSubmit = async (formData: any) => {
    isSubmitting.value = true
    try {
        if (selectedTrip.value?.id) {
            await tripsService.update(selectedTrip.value.id, formData)
            addToast('Viaje actualizado', 'success')
        } else {
            await tripsService.create(formData)
            addToast('Viaje programado', 'success')
        }
        showCreateModal.value = false
        await fetchTrips()
    } catch (e) {
        addToast('Error al procesar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    if (!selectedTrip.value) return
    const success = await deleteTrip(selectedTrip.value.id)
    if (success) {
        addToast('Viaje eliminado', 'success')
        showDeleteModal.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Viajes</h1>
                <p class="text-sm text-gray-500 mt-1">Programación y seguimiento operativo</p>
            </div>
            <UiButton @click="openCreate" class="bg-blue-600 text-white hover:bg-blue-700">
                <PlaneIcon class="w-4 h-4 sm:mr-2"/>
                <span class="hidden sm:inline">Programar Viaje</span>
            </UiButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value" :icon="metric.icon" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar viajes..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="trips" :loading="loading">
                
                <template #cell-status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="{
                            'bg-yellow-50 text-yellow-700 border-yellow-200': (row as Trip).status === 'Programado' || (row as Trip).status === 'Pendiente',
                            'bg-blue-50 text-blue-700 border-blue-200': (row as Trip).status === 'En Ruta',
                            'bg-green-50 text-green-700 border-green-200': (row as Trip).status === 'Completado',
                        }"
                    >
                        {{ (row as Trip).status }}
                    </span>
                </template>

                <template #cell-packages="{ row }">
                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {{ (row as Trip).packageIds.length }}
                    </span>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-1">
                        <button @click="openDetails(row as Trip)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEdit(row as Trip)" class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit2 class="w-4 h-4" />
                        </button>
                        <button @click="openDelete(row as Trip)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="showCreateModal" :title="selectedTrip ? 'Editar Viaje' : 'Programar Viaje'" @close="showCreateModal = false">
            <TripForm :initial-data="selectedTrip" :loading="isSubmitting" @submit="handleFormSubmit" @cancel="showCreateModal = false" />
        </UiModal>

        <UiModal :is-open="showDetailsModal" title="Logística del Viaje" @close="showDetailsModal = false">
            <TripDetails v-if="selectedTrip" :trip="selectedTrip" />
        </UiModal>

        <UiConfirmModal :is-open="showDeleteModal" title="¿Eliminar Viaje?" description="Esta acción no se puede deshacer." @close="showDeleteModal = false" @confirm="confirmDelete" />
    </div>
</template>