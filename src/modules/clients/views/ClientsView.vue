<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Trash2, Edit2, Eye } from 'lucide-vue-next' // Icono Eye agregado

// Components
import UiButton from '@shared/components/ui/UiButton.vue'
import UiInput from '@shared/components/ui/UiInput.vue'
import UiDataTable from '@shared/components/ui/UiDataTable.vue'
import UiModal from '@shared/components/ui/UiModal.vue'
import UiConfirmModal from '@shared/components/ui/UiConfirmModal.vue'

// Modules
import ClientForm from '../components/ClientForm.vue'
import ClientDetails from '../components/ClientDetails.vue' // <--- IMPORTANTE

// Logic
import { clientsService } from '../services/client.service'
import type { Client, ColumnDef } from '../types/client.types'
import { useDate } from '@shared/composables/useDate'
import { useToast } from '@shared/composables/useToast'

const { t } = useI18n()
const { formatDate } = useDate()
const { addToast } = useToast()

// Data
const clients = ref<Client[]>([])
const loading = ref(true)
const searchTerm = ref('')
const selectedClient = ref<Client | null>(null) // Cliente seleccionado para Ver o Editar

// Modals State
const isFormModalOpen = ref(false)   // Un solo modal para Crear/Editar
const isDetailsModalOpen = ref(false) // Nuevo Modal de Detalles
const isDeleteModalOpen = ref(false)

const isSubmitting = ref(false)
const isDeleting = ref(false)

// Columns
const columns: ColumnDef[] = [
    { header: 'Cliente', key: 'name', class: 'font-medium text-gray-900 cursor-pointer hover:text-primary hover:underline' }, // Clase para indicar clic
    { header: 'Estado', key: 'status' },
    { header: 'Ciudad/Ruta', key: 'city', class: 'hidden sm:table-cell' },
    { header: 'Teléfono', key: 'phone', class: 'hidden md:table-cell' },
    { header: 'Registrado', key: 'createdAt', class: 'hidden lg:table-cell text-gray-500' },
    { header: 'Acciones', key: 'actions', class: 'text-right' }
]

// --- ACTIONS ---

// 1. Abrir Modal de Creación
const openCreateModal = () => {
    selectedClient.value = null // Limpiamos selección
    isFormModalOpen.value = true
}

// 2. Abrir Modal de Edición
const openEditModal = (client: Client) => {
    selectedClient.value = { ...client } // Copia para evitar reactividad directa en tabla
    isFormModalOpen.value = true
}

// 3. Abrir Modal de Detalles (View)
const openDetailsModal = (client: Client) => {
    selectedClient.value = client
    isDetailsModalOpen.value = true
}

// 4. Guardar (Crear o Editar)
const handleSaveClient = async (payload: any) => {
    isSubmitting.value = true
    try {
        await new Promise(r => setTimeout(r, 1000)) // Mock delay

        if (selectedClient.value) {
            // MODO EDICIÓN
            console.log('✏️ [MOCK] Actualizando ID:', selectedClient.value.id, payload)
            // Aquí iría: await clientsService.update(selectedClient.value.id, payload)

            // Mock Update Local
            const index = clients.value.findIndex(c => c.id === selectedClient.value?.id)
            if (index !== -1) {
                clients.value[index] = { ...clients.value[index], ...payload }
            }
            addToast('Cliente actualizado correctamente', 'success')
        } else {
            // MODO CREACIÓN
            console.log('✨ [MOCK] Creando:', payload)
            // Mock Create Local
            // await clientsService.create(payload)
            // await fetchClients()
            addToast('Cliente creado correctamente', 'success')
        }

        isFormModalOpen.value = false
        await fetchClients() // Recargar para ver cambios
    } catch (e) {
        addToast('Error al guardar', 'error')
    } finally {
        isSubmitting.value = false
    }
}

// ... Resto de lógica de Delete y Fetch (igual que antes) ...
const fetchClients = async () => {
    loading.value = true
    try { clients.value = await clientsService.getAll() }
    finally { loading.value = false }
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
            <h1 class="text-2xl font-bold">{{ t('dashboard.menu.clients') }}</h1>
            <UiButton @click="openCreateModal">
                <Plus class="w-4 h-4 mr-2" />Nuevo Cliente
            </UiButton>
        </div>

        <div class="space-y-4">
            <UiInput v-model="searchTerm" placeholder="Buscar..." class="max-w-sm bg-white" />

            <UiDataTable :columns="columns" :data="clients" :loading="loading">

                <template #cell-name="{ row }">
                    <button @click="openDetailsModal(row)"
                        class="hover:text-primary hover:underline font-medium text-left">
                        {{ row.name }}
                    </button>
                </template>

                <template #cell-status="{ row }">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="{
                        'bg-green-100 text-green-700': row.status === 'ACTIVO',
                        'bg-red-100 text-red-700': row.status === 'INACTIVO',
                        'bg-yellow-100 text-yellow-700': row.status === 'PENDIENTE'
                    }">{{ row.status }}</span>
                </template>

                <template #cell-createdAt="{ row }">
                    <span class="text-gray-600">{{ formatDate(row.createdAt) }}</span>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex justify-end gap-2">
                        <button @click="openDetailsModal(row)"
                            class="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                            title="Ver Detalles">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEditModal(row)"
                            class="text-blue-600 hover:text-blue-800 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                            title="Editar">
                            <Edit2 class="w-4 h-4" />
                        </button>

                        <button @click="openDeleteModal(row)"
                            class="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-50 transition-colors"
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

            <template #footer>
                <UiButton variant="ghost" @click="isDetailsModalOpen = false">Cerrar</UiButton>
                <UiButton @click="() => { isDetailsModalOpen = false; openEditModal(selectedClient!); }">
                    Editar
                </UiButton>
            </template>
        </UiModal>

        <UiConfirmModal :is-open="isDeleteModalOpen" title="¿Eliminar Cliente?"
            :description="`Se eliminará a ${selectedClient?.name}`" :loading="isDeleting"
            @close="isDeleteModalOpen = false" @confirm="confirmDelete" />
    </div>
</template>