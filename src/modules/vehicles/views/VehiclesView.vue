<script setup lang="ts">
import { ref } from 'vue'
import { Truck, Edit2, Trash2, Eye } from 'lucide-vue-next' // <--- 1. Agregado Eye

// UI Components
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'
import UiInput from '@/shared/components/ui/UiInput.vue'

// Module Components
import VehicleForm from '../components/VehicleForm.vue'
import VehicleDetails from '../components/VehicleDetails.vue' // <--- 2. Importado
import { useVehicles } from '../composables/useVehicles'
import { vehiclesService } from '../services/vehicles.service'
import { useToast } from '@/shared/composables/useToast'
import type { Vehicle } from '../types/vehicle.types'

const { vehicles, loading, metrics, fetchVehicles, deleteVehicle, toggleVehicleStatus } = useVehicles()
const { addToast } = useToast()
const searchTerm = ref('')

// Modal States
const showCreateModal = ref(false)
const showDetailsModal = ref(false) // <--- 3. Nuevo estado
const showDeleteModal = ref(false)
const isSubmitting = ref(false)

const selectedVehicle = ref<Vehicle | null>(null)

const columns = [
    { header: 'Vehículo', key: 'vehicle' },
    { header: 'Tipo', key: 'type', class: 'hidden sm:table-cell' },
    { header: 'Año', key: 'year', class: 'hidden md:table-cell' },
    { header: 'Capacidad', key: 'capacity', class: 'hidden md:table-cell' },
    { header: 'Estado', key: 'active' },
    { header: '', key: 'actions', class: 'text-right' }
]

// Actions
const openCreate = () => { selectedVehicle.value = null; showCreateModal.value = true }
const openEdit = (vehicle: Vehicle) => { selectedVehicle.value = { ...vehicle }; showCreateModal.value = true }
const openDelete = (vehicle: Vehicle) => { selectedVehicle.value = vehicle; showDeleteModal.value = true }

// <--- 4. Acción Ver Detalles
const openDetails = (vehicle: Vehicle) => { 
    selectedVehicle.value = vehicle
    showDetailsModal.value = true 
}

const handleFormSubmit = async (formData: any) => {
    isSubmitting.value = true
    try {
        if (selectedVehicle.value?.id) {
            await vehiclesService.update(selectedVehicle.value.id, formData)
            addToast('Vehículo actualizado', 'success')
        } else {
            await vehiclesService.create(formData)
            addToast('Vehículo registrado', 'success')
        }
        showCreateModal.value = false
        await fetchVehicles()
    } catch (e) {
        addToast('Error al guardar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    if (!selectedVehicle.value) return
    const success = await deleteVehicle(selectedVehicle.value.id)
    if (success) {
        addToast('Vehículo eliminado', 'success')
        showDeleteModal.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Flota</h1>
                <p class="text-sm text-gray-500 mt-1">Control de vehículos y mantenimiento</p>
            </div>
            <UiButton @click="openCreate" class="bg-blue-600 text-white hover:bg-blue-700">
                <Truck class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Nuevo Vehículo</span>
            </UiButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value" :icon="metric.icon" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar por placa o marca..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="vehicles" :loading="loading">
                
                <template #cell-vehicle="{ row }">
                    <div>
                        <div class="font-medium text-gray-900">{{ (row as Vehicle).brand }} {{ (row as Vehicle).model }}</div>
                        <div class="text-xs text-gray-500 font-mono">{{ (row as Vehicle).plate }}</div>
                    </div>
                </template>

                <template #cell-capacity="{ row }">
                    <span class="text-gray-600">{{ (row as Vehicle).capacity }} kg</span>
                </template>

                <template #cell-active="{ row }">
                    <button 
                        @click="toggleVehicleStatus(row as Vehicle)"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border hover:shadow-sm"
                        :class="(row as Vehicle).active 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'"
                    >
                        <span class="w-1.5 h-1.5 rounded-full" :class="(row as Vehicle).active ? 'bg-green-600' : 'bg-red-600'"></span>
                        {{ (row as Vehicle).active ? 'Operativo' : 'Inactivo' }}
                    </button>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-1">
                        <button @click="openDetails(row as Vehicle)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEdit(row as Vehicle)" class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit2 class="w-4 h-4" />
                        </button>
                        <button @click="openDelete(row as Vehicle)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="showCreateModal" :title="selectedVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'" @close="showCreateModal = false">
            <VehicleForm :initial-data="selectedVehicle" :loading="isSubmitting" @submit="handleFormSubmit" @cancel="showCreateModal = false" />
        </UiModal>

        <UiModal :is-open="showDetailsModal" title="Ficha Técnica" @close="showDetailsModal = false">
            <VehicleDetails v-if="selectedVehicle" :vehicle="selectedVehicle" />
        </UiModal>

        <UiConfirmModal :is-open="showDeleteModal" title="¿Eliminar Vehículo?" description="Esta acción no se puede deshacer." @close="showDeleteModal = false" @confirm="confirmDelete" />
    </div>
</template>