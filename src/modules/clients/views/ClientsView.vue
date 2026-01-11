<script setup lang="ts">
import { ref, onMounted, computed } from 'vue' // <-- Agregar computed
import { useI18n } from 'vue-i18n'
import { Plus, Trash2, Edit2, Eye, Users, UserCheck, UserX } from 'lucide-vue-next' // <-- Iconos para stats

// Components UI
import UiButton from '@/shared/components/ui/UiButton.vue' // Asegúrate que el alias @ apunte bien
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue' // <--- 1. IMPORTAR STATS CARD

// Modules
import ClientForm from '../components/ClientForm.vue'
import ClientDetails from '../components/ClientDetails.vue'

// Logic
import { clientsService } from '../services/client.service'
import type { Client } from '../types/client.types'
import { useDate } from '@/shared/composables/useDate'
import { useToast } from '@/shared/composables/useToast'

const { t } = useI18n()
const { formatDate } = useDate()
const { addToast } = useToast()

// Data
const clients = ref<Client[]>([])
const loading = ref(true)
const searchTerm = ref('')
const selectedClient = ref<Client | null>(null)

// Modals State
const isFormModalOpen = ref(false)
const isDetailsModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Columns
const columns = [
    { header: 'Cliente', key: 'name', class: 'font-medium text-gray-900 cursor-pointer hover:text-primary hover:underline' },
    { header: 'Estado', key: 'status' },
    { header: 'Ciudad/Ruta', key: 'city', class: 'hidden sm:table-cell' },
    { header: 'Teléfono', key: 'phone', class: 'hidden md:table-cell' },
    { header: 'Registrado', key: 'createdAt', class: 'hidden lg:table-cell text-gray-500' },
    { header: 'Acciones', key: 'actions', class: 'text-right' }
]

// --- MÉTRICAS CALCULADAS ---
// Esto calcula los totales automáticamente basado en el array 'clients'
const clientMetrics = computed(() => [
    {
        label: 'Total Clientes',
        value: clients.value.length,
        icon: Users
    },
    {
        label: 'Activos',
        value: clients.value.filter(c => c.status === 'ACTIVO').length,
        icon: UserCheck
    },
    {
        label: 'Inactivos',
        value: clients.value.filter(c => c.status === 'INACTIVO').length,
        icon: UserX
    }
    // Puedes agregar más métricas aquí si quieres
])

// --- ACTIONS ---

const openCreateModal = () => {
    selectedClient.value = null
    isFormModalOpen.value = true
}

const openEditModal = (client: Client) => {
    selectedClient.value = { ...client }
    isFormModalOpen.value = true
}

const openDetailsModal = (client: Client) => {
    selectedClient.value = client
    isDetailsModalOpen.value = true
}

const handleSaveClient = async (payload: any) => {
    isSubmitting.value = true
    try {
        await new Promise(r => setTimeout(r, 1000))

        if (selectedClient.value?.id) {
            // MODO EDICIÓN
            const index = clients.value.findIndex(c => c.id === selectedClient.value?.id)
            if (index !== -1) {
                // Actualizamos localmente mezclando el cliente existente con el payload nuevo
                clients.value[index] = { ...clients.value[index], ...payload }
            }
            addToast('Cliente actualizado correctamente', 'success')
        } else {
            // MODO CREACIÓN
            // Simulamos creación agregando al array local
            const newClient = { 
                id: Math.random().toString(), 
                status: 'ACTIVO', 
                ...payload 
            }
            clients.value.unshift(newClient)
            addToast('Cliente creado correctamente', 'success')
        }
        isFormModalOpen.value = false
    } catch (e) {
        addToast('Error al guardar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const fetchClients = async () => {
    loading.value = true
    try { 
        clients.value = await clientsService.getAll() 
    } finally { 
        loading.value = false 
    }
}

const openDeleteModal = (c: Client) => { selectedClient.value = c; isDeleteModalOpen.value = true }

const confirmDelete = async () => {
    if (!selectedClient.value) return
    isDeleting.value = true
    try {
        await new Promise(r => setTimeout(r, 1000))
        clients.value = clients.value.filter(c => c.id !== selectedClient.value?.id)
        addToast('Cliente eliminado', 'success')
        isDeleteModalOpen.value = false
    } finally { isDeleting.value = false; selectedClient.value = null }
}

onMounted(fetchClients)
</script>

<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ t('dashboard.menu.clients') }}</h1>
                <p class="text-sm text-gray-500 mt-1">Gestiona tu base de clientes</p>
            </div>
            <UiButton @click="openCreateModal" class="bg-blue-600 text-white hover:bg-blue-700">
                <Plus class="w-4 h-4 mr-2" />Nuevo Cliente
            </UiButton>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UiStatsCard 
                v-for="metric in clientMetrics" 
                :key="metric.label" 
                :label="metric.label"
                :value="metric.value" 
                :icon="metric.icon" 
            />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                <UiInput v-model="searchTerm" placeholder="Buscar clientes..." class="max-w-sm bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="clients" :loading="loading">

                <template #cell-name="{ row }">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                            {{ (row as Client).name.charAt(0).toUpperCase() }}
                        </div>
                        <button @click="openDetailsModal(row as Client)"
                            class="hover:text-blue-600 hover:underline font-medium text-left text-gray-900 transition-colors">
                            {{ (row as Client).name }}
                        </button>
                    </div>
                </template>

                <template #cell-status="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="{
                        'bg-green-50 text-green-700 border-green-200': (row as Client).status === 'ACTIVO',
                        'bg-red-50 text-red-700 border-red-200': (row as Client).status === 'INACTIVO',
                        'bg-yellow-50 text-yellow-700 border-yellow-200': (row as Client).status === 'PENDIENTE'
                    }">
                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                             'bg-green-600': (row as Client).status === 'ACTIVO',
                             'bg-red-600': (row as Client).status === 'INACTIVO',
                             'bg-yellow-600': (row as Client).status === 'PENDIENTE'
                        }"></span>
                        {{ (row as Client).status }}
                    </span>
                </template>

                <template #cell-createdAt="{ row }">
                    <span class="text-gray-500 text-sm font-mono">{{ formatDate((row as Client).createdAt) }}</span>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-1">
                        <button @click="openDetailsModal(row as Client)"
                            class="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Ver Detalles">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEditModal(row as Client)"
                            class="text-gray-400 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                            title="Editar">
                            <Edit2 class="w-4 h-4" />
                        </button>

                        <button @click="openDeleteModal(row as Client)"
                            class="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="isFormModalOpen" :title="selectedClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'"
            @close="isFormModalOpen = false">
            <ClientForm v-if="isFormModalOpen" :initial-data="selectedClient" @submit="handleSaveClient"
                @cancel="isFormModalOpen = false" :loading="isSubmitting" />
        </UiModal>

        <UiModal :is-open="isDetailsModalOpen" title="Detalles del Cliente" @close="isDetailsModalOpen = false">
            <ClientDetails v-if="selectedClient" :client="selectedClient" />
        </UiModal>

        <UiConfirmModal :is-open="isDeleteModalOpen" title="¿Eliminar Cliente?"
            :description="`Se eliminará a ${selectedClient?.name}`" :loading="isDeleting"
            @close="isDeleteModalOpen = false" @confirm="confirmDelete" />
    </div>
</template>