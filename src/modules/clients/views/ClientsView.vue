<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n' // 1. i18n
import { Users, UserCheck, Plus } from 'lucide-vue-next'
import UiButton from '@shared/components/ui/UiButton.vue'
import UiInput from '@shared/components/ui/UiInput.vue'
import UiStatsCard from '@shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@shared/components/ui/UiDataTable.vue'
import UiModal from '@shared/components/ui/UiModal.vue' // 2. Modal
import ClientForm from '../components/ClientForm.vue'   // 3. Formulario
import { clientsService } from '../services/client.service'
import type { Client, ColumnDef } from '../types/client.types'
import { useDate } from '@shared/composables/useDate'

// Estado y Composables
const { t } = useI18n()
const { formatDate } = useDate()

const clients = ref<Client[]>([])
const loading = ref(true)
const searchTerm = ref('')

// Estado para el Modal de Creación
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

// Configuración de Columnas
const columns: ColumnDef[] = [
    { header: 'Cliente', key: 'name', class: 'font-medium text-gray-900' },
    { header: 'Estado', key: 'status' },
    { header: 'Ciudad/Ruta', key: 'city', class: 'hidden sm:table-cell' },
    { header: 'Teléfono', key: 'phone', class: 'hidden md:table-cell' },
    { header: 'Registrado', key: 'createdAt', class: 'hidden lg:table-cell text-gray-500' },
    { header: 'Acciones', key: 'actions', class: 'text-right' }
]

// Cargar Datos (Read)
const fetchClients = async () => {
    loading.value = true
    try {
        clients.value = await clientsService.getAll()
    } finally {
        loading.value = false
    }
}

// Crear Cliente (Write - Mock)
const handleCreateClient = async (payload: any) => {
    isSubmitting.value = true
    try {
        console.log('📦 [MOCK] Payload recibido en Page (ISO UTC):', payload)
        
        // Simulamos llamada al servicio
        await clientsService.create(payload)
        
        // Cerramos modal y recargamos tabla
        isCreateModalOpen.value = false
        await fetchClients() 
        
        // Opcional: Toast de éxito aquí
    } catch (error) {
        console.error(error)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(fetchClients)
</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    {{ t('dashboard.menu.clients') }}
                </h1>
                <p class="text-sm text-gray-500">Administra tu base de datos de clientes</p>
            </div>
            
            <UiButton @click="isCreateModalOpen = true">
                <Plus class="w-4 h-4 mr-2" />
                Nuevo Cliente
            </UiButton>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <UiStatsCard label="Total Clientes" :value="1250" :icon="UserCheck" />
            <UiStatsCard label="Nuevos este mes" :value="90" :icon="Users" />
        </div>

        <div class="space-y-4">
            <div class="max-w-sm">
                <UiInput v-model="searchTerm" placeholder="Buscar cliente..." class="bg-white" />
            </div>

            <UiDataTable :columns="columns" :data="clients" :loading="loading">
                
                <template #cell-status="{ row }">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="{
                        'bg-green-100 text-green-700': row.status === 'ACTIVO',
                        'bg-red-100 text-red-700': row.status === 'INACTIVO',
                        'bg-yellow-100 text-yellow-700': row.status === 'PENDIENTE'
                    }">
                        {{ row.status }}
                    </span>
                </template>

                <template #cell-createdAt="{ row }">
                    <span class="text-gray-600">
                        {{ formatDate(row.createdAt) }}
                    </span>
                </template>

                <template #cell-actions>
                    <div class="flex justify-end gap-2">
                        <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Editar
                        </button>
                    </div>
                </template>

            </UiDataTable>
        </div>

        <UiModal 
            :is-open="isCreateModalOpen" 
            title="Registrar Nuevo Cliente"
            @close="isCreateModalOpen = false"
        >
            <ClientForm 
                @submit="handleCreateClient"
                @cancel="isCreateModalOpen = false"
                :loading="isSubmitting"
            />
        </UiModal>

    </div>
</template>