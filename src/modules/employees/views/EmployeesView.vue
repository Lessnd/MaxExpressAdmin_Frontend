<script setup lang="ts">
import { ref } from 'vue'
import {
    UserPlus,
    UserX,
    Search,
    Briefcase,
    Eye,
    Pencil
} from 'lucide-vue-next'

// Componentes UI Genéricos
import UiStatsCard from '@/shared/components/ui/UiStatsCard.vue'
import UiDataTable from '@/shared/components/ui/UiDataTable.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import UiModal from '@/shared/components/ui/UiModal.vue'
import UiConfirmModal from '@/shared/components/ui/UiConfirmModal.vue'
import UiToast from '@/shared/components/ui/UiToast.vue'

// Componentes del Módulo
import EmployeeForm from '../components/EmployeeForm.vue'
import EmployeeDetails from '../components/EmployeeDetails.vue'

// Lógica y Servicios
import { useEmployees } from '../composables/useEmployees'
import { employeesService } from '../services/employees.service'
import { useToast } from '@/shared/composables/useToast'
import type { Employee, CreateEmployeeDTO } from '../types/employee.types'

// ---------------------------------------------------------------------------
// ESTADO Y COMPOSABLES
// ---------------------------------------------------------------------------
const { employees, loading, metrics, toggleEmployeeStatus, fetchEmployees } = useEmployees()
const { addToast } = useToast()
const searchTerm = ref('')

// Estado de Modales
const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const showConfirmModal = ref(false)

// Estado de Selección
const selectedEmployee = ref<Employee | null>(null)
const employeeToToggle = ref<Employee | null>(null)
const isSubmitting = ref(false)

// ---------------------------------------------------------------------------
// CONFIGURACIÓN DE TABLA
// ---------------------------------------------------------------------------
const columns = [
    { header: 'Empleado', key: 'employee' },
    { header: 'Contacto', key: 'telefono', class: 'hidden sm:table-cell' },
    { header: 'DUI', key: 'dui', class: 'hidden md:table-cell font-mono' },
    { header: 'Rol', key: 'rol' },
    { header: 'Estado', key: 'activo' },
    { header: '', key: 'actions', class: 'w-24 text-right' }
]

// ---------------------------------------------------------------------------
// HANDLERS (Manejadores de Eventos)
// ---------------------------------------------------------------------------

// --- Crear / Editar ---
const openCreateModal = () => {
    selectedEmployee.value = null
    showCreateModal.value = true
}

const openEdit = (employee: Employee) => {
    selectedEmployee.value = employee
    showCreateModal.value = true
}

const handleFormSubmit = async (formData: CreateEmployeeDTO) => {
    isSubmitting.value = true
    try {
        if (selectedEmployee.value) {
            // Modo Edición
            await employeesService.update(selectedEmployee.value.id, formData)
            addToast('Empleado actualizado correctamente', 'success')
        } else {
            // Modo Creación
            await employeesService.create(formData)
            addToast('Empleado creado correctamente', 'success')
        }

        showCreateModal.value = false
        await fetchEmployees() // Recargamos la lista
    } catch (error) {
        // El error ya suele ser manejado por el servicio o el componente form, 
        // pero aquí aseguramos el toast si falla algo inesperado.
        console.error(error)
    } finally {
        isSubmitting.value = false
    }
}

// --- Ver Detalles ---
const openDetails = (employee: Employee) => {
    selectedEmployee.value = employee
    showDetailsModal.value = true
}

// --- Toggle Estado (Con Confirmación) ---
const initiateToggleStatus = (employee: Employee) => {
    employeeToToggle.value = employee
    showConfirmModal.value = true
}

const confirmToggleStatus = async () => {
    if (!employeeToToggle.value) return

    // Usamos la lógica del composable que ya maneja el API y el Toast
    await toggleEmployeeStatus(employeeToToggle.value)

    showConfirmModal.value = false
    employeeToToggle.value = null
}
</script>

<template>
    <div class="space-y-6">
        <UiToast />

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Empleados</h1>
                <p class="text-sm text-gray-500 mt-1">Administra el personal y sus accesos</p>
            </div>

            <UiButton @click="openCreateModal" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Nuevo Empleado</span>
            </UiButton>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <UiStatsCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value"
                :icon="metric.icon === 'Briefcase' ? Briefcase : UserX" />
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                <div class="relative flex-1 max-w-md">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input v-model="searchTerm" type="text" placeholder="Buscar por nombre o DUI..."
                        class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                </div>
            </div>

            <UiDataTable :columns="columns" :data="employees" :loading="loading">
                <template #cell-employee="{ row }">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200 shrink-0">
                            {{ (row as Employee).nombre_completo.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">{{ (row as Employee).nombre_completo }}</div>
                            <div class="text-xs text-gray-500">{{ (row as Employee).email }}</div>
                        </div>
                    </div>
                </template>

                <template #cell-rol="{ row }">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="{
                        'bg-purple-50 text-purple-700 border-purple-200': (row as Employee).rol === 'Admin',
                        'bg-blue-50 text-blue-700 border-blue-200': (row as Employee).rol === 'Empleado',
                        'bg-orange-50 text-orange-700 border-orange-200': (row as Employee).rol === 'Conductor'
                    }">
                        {{ (row as Employee).rol }}
                    </span>
                </template>

                <template #cell-activo="{ row }">
                    <button @click="initiateToggleStatus(row as Employee)"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border hover:shadow-sm"
                        :class="(row as Employee).activo
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'">
                        <span class="w-1.5 h-1.5 rounded-full"
                            :class="(row as Employee).activo ? 'bg-green-600' : 'bg-red-600'"></span>
                        {{ (row as Employee).activo ? 'Activo' : 'Inactivo' }}
                    </button>
                </template>

                <template #cell-actions="{ row }">
                    <div class="flex items-center justify-end gap-1">
                        <button @click="openDetails(row as Employee)"
                            class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver Detalles">
                            <Eye class="w-4 h-4" />
                        </button>

                        <button @click="openEdit(row as Employee)"
                            class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar">
                            <Pencil class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </UiDataTable>
        </div>

        <UiModal :is-open="showCreateModal" :title="selectedEmployee ? 'Editar Empleado' : 'Nuevo Empleado'"
            @close="showCreateModal = false">
            <EmployeeForm :initial-data="selectedEmployee" :loading="isSubmitting" @submit="handleFormSubmit"
                @cancel="showCreateModal = false" />
        </UiModal>

        <UiModal :is-open="showDetailsModal" title="Detalles del Empleado" @close="showDetailsModal = false">
            <EmployeeDetails v-if="selectedEmployee" :employee="selectedEmployee" />
        </UiModal>

        <UiConfirmModal :is-open="showConfirmModal"
            :title="employeeToToggle?.activo ? '¿Desactivar Empleado?' : '¿Activar Empleado?'"
            :description="`Estás a punto de cambiar el estado de ${employeeToToggle?.nombre_completo}. ¿Deseas continuar?`"
            @close="showConfirmModal = false" @confirm="confirmToggleStatus" />

    </div>
</template>