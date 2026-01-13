<script setup lang="ts">
import { ref } from 'vue'
import { Map, Edit2, Trash2, Eye } from 'lucide-vue-next' // <--- 1. Agregado Eye

// UI
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'
import UiInput from '@/shared/components/ui/UiInput.vue'

// Module
import RouteForm from '../components/RouteForm.vue'
import RouteDetails from '../components/RouteDetails.vue' // <--- 2. Importado
import { useRoutes } from '../composables/useRoutes'
import { routesService } from '../services/routes.service'
import { useToast } from '@/shared/composables/useToast'
import type { Route } from '../types/route.types'

const { routes, loading, metrics, fetchRoutes, deleteRoute, toggleRouteStatus } = useRoutes()
const { addToast } = useToast()
const searchTerm = ref('')

// Modals State
const showCreateModal = ref(false)
const showDetailsModal = ref(false) // <--- 3. Nuevo estado
const showDeleteModal = ref(false)
const isSubmitting = ref(false)

const selectedRoute = ref<Route | null>(null)

const columns = [
    { header: 'Nombre Ruta', key: 'name', class: 'font-medium text-gray-900' },
    { header: 'Origen', key: 'origin' },
    { header: 'Destino', key: 'destination' },
    { header: 'Tipo', key: 'type', class: 'hidden sm:table-cell' },
    { header: 'Estado', key: 'active' },
    { header: '', key: 'actions', class: 'text-right' }
]

// Actions
const openCreate = () => { selectedRoute.value = null; showCreateModal.value = true }
const openEdit = (route: Route) => { selectedRoute.value = { ...route }; showCreateModal.value = true }
const openDelete = (route: Route) => { selectedRoute.value = route; showDeleteModal.value = true }

// <--- 4. Nueva función Open Details
const openDetails = (route: Route) => { 
    selectedRoute.value = route
    showDetailsModal.value = true 
}

const handleFormSubmit = async (formData: any) => {
    isSubmitting.value = true
    try {
        if (selectedRoute.value?.id) {
            await routesService.update(selectedRoute.value.id, formData)
            addToast('Ruta actualizada', 'success')
        } else {
            await routesService.create(formData)
            addToast('Ruta creada', 'success')
        }
        showCreateModal.value = false
        await fetchRoutes()
    } catch (e) {
        addToast('Error al guardar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    if (!selectedRoute.value) return
    const success = await deleteRoute(selectedRoute.value.id)
    if (success) {
        addToast('Ruta eliminada', 'success')
        showDeleteModal.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Rutas</h1>
                <p class="text-sm text-gray-500 mt-1">Configuración de trayectos logísticos</p>
            </div>
            <UiButton @click="openCreate" class="bg-blue-600 text-white hover:bg-blue-700">
                <Map class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Nueva Ruta</span>
            </UiButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value" :icon="metric.icon" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar rutas..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="routes" :loading="loading">
                
                <template #cell-active="{ row }">
                    <button 
                        @click="toggleRouteStatus(row as Route)"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border hover:shadow-sm"
                        :class="(row as Route).active 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
                    >
                        <span class="w-1.5 h-1.5 rounded-full" :class="(row as Route).active ? 'bg-green-600' : 'bg-gray-400'"></span>
                        {{ (row as Route).active ? 'Activa' : 'Inactiva' }}
                    </button>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-1">
                        <button @click="openDetails(row as Route)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEdit(row as Route)" class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit2 class="w-4 h-4" />
                        </button>
                        <button @click="openDelete(row as Route)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="showCreateModal" :title="selectedRoute ? 'Editar Ruta' : 'Nueva Ruta'" @close="showCreateModal = false">
            <RouteForm :initial-data="selectedRoute" :loading="isSubmitting" @submit="handleFormSubmit" @cancel="showCreateModal = false" />
        </UiModal>

        <UiModal :is-open="showDetailsModal" title="Detalles de Ruta" @close="showDetailsModal = false">
            <RouteDetails v-if="selectedRoute" :route="selectedRoute" />
        </UiModal>

        <UiConfirmModal :is-open="showDeleteModal" title="¿Eliminar Ruta?" description="Esta acción no se puede deshacer." @close="showDeleteModal = false" @confirm="confirmDelete" />
    </div>
</template>