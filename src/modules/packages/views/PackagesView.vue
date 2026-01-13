<script setup lang="ts">
import { ref } from 'vue'
import { 
    PackagePlus, Eye, Edit2, Trash2 
} from 'lucide-vue-next'

// UI Components
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'
import UiInput from '@/shared/components/ui/UiInput.vue'

// Module Components
import PackageForm from '../components/PackageForm.vue'
import PackageDetails from '../components/PackageDetails.vue'

// Logic
import { usePackages } from '../composables/usePackages'
import { packagesService } from '../services/packages.service'
import { useToast } from '@/shared/composables/useToast'
import type { Package } from '../types/package.types'

const { packages, loading, metrics, fetchPackages, deletePackage } = usePackages()
const { addToast } = useToast()
const searchTerm = ref('')

// Modals State
const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const isSubmitting = ref(false)

const selectedPackage = ref<Package | null>(null)

// Columnas
const columns = [
    { header: 'Tracking', key: 'trackingId', class: 'font-mono font-bold text-gray-900' },
    { header: 'Remitente', key: 'senderName' },
    { header: 'Destinatario', key: 'receiverName' },
    { header: 'Estado', key: 'status' },
    { header: 'Peso', key: 'weight', class: 'hidden sm:table-cell' },
    { header: '', key: 'actions', class: 'text-right' }
]

// --- ACTIONS ---

const openCreate = () => {
    selectedPackage.value = null
    showCreateModal.value = true
}

const openEdit = (pkg: Package) => {
    selectedPackage.value = { ...pkg }
    showCreateModal.value = true
}

const openDetails = (pkg: Package) => {
    selectedPackage.value = pkg
    showDetailsModal.value = true
}

const openDelete = (pkg: Package) => {
    selectedPackage.value = pkg
    showDeleteModal.value = true
}

const handleFormSubmit = async (formData: any) => {
    isSubmitting.value = true
    try {
        if (selectedPackage.value?.id) {
            await packagesService.update(selectedPackage.value.id, formData)
            addToast('Paquete actualizado', 'success')
        } else {
            await packagesService.create(formData)
            addToast('Paquete registrado', 'success')
        }
        showCreateModal.value = false
        await fetchPackages()
    } catch (e) {
        addToast('Error al procesar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    if (!selectedPackage.value) return
    const success = await deletePackage(selectedPackage.value.id)
    if (success) {
        addToast('Paquete eliminado', 'success')
        showDeleteModal.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Paquetes</h1>
                <p class="text-sm text-gray-500 mt-1">Control de envíos y rastreo</p>
            </div>
            <UiButton @click="openCreate" class="bg-blue-600 text-white hover:bg-blue-700">
                <PackagePlus class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Nuevo Paquete</span>
            </UiButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard 
                v-for="metric in metrics" 
                :key="metric.label" 
                :label="metric.label"
                :value="metric.value" 
                :icon="metric.icon" 
            />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar tracking..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="packages" :loading="loading">
                
                <template #cell-status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        :class="{
                            'bg-green-50 text-green-700 border-green-200': (row as Package).status === 'Entregado',
                            'bg-yellow-50 text-yellow-700 border-yellow-200': (row as Package).status === 'En Almacén',
                            'bg-blue-50 text-blue-700 border-blue-200': (row as Package).status === 'En Ruta',
                            'bg-red-50 text-red-700 border-red-200': (row as Package).status === 'Retenido',
                        }"
                    >
                        {{ (row as Package).status }}
                    </span>
                </template>

                <template #cell-weight="{ row }">
                    <span class="text-gray-600">{{ (row as Package).weight }} lb</span>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-1">
                        <button @click="openDetails(row as Package)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye class="w-4 h-4" />
                        </button>
                        <button @click="openEdit(row as Package)" class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit2 class="w-4 h-4" />
                        </button>
                        <button @click="openDelete(row as Package)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="showCreateModal" :title="selectedPackage ? 'Editar Paquete' : 'Nuevo Paquete'" @close="showCreateModal = false">
            <PackageForm :initial-data="selectedPackage" :loading="isSubmitting" @submit="handleFormSubmit" @cancel="showCreateModal = false" />
        </UiModal>

        <UiModal :is-open="showDetailsModal" title="Detalles del Envío" @close="showDetailsModal = false">
            <PackageDetails v-if="selectedPackage" :pkg="selectedPackage" />
        </UiModal>

        <UiConfirmModal :is-open="showDeleteModal" title="¿Eliminar Paquete?" description="Esta acción no se puede deshacer." @close="showDeleteModal = false" @confirm="confirmDelete" />
    </div>
</template>