<script setup lang="ts">
import { computed } from 'vue'
import type { Employee } from '../types/employee.types'
import { useDate } from '@/shared/composables/useDate' // Asegúrate de tener este composable o usa una función helper simple

const props = defineProps<{
    employee: Employee
}>()

const { formatDateTime } = useDate()

// Badge de Rol
const roleClasses = computed(() => {
    switch (props.employee.rol) {
        case 'Admin': return 'bg-purple-100 text-purple-700 border-purple-200'
        case 'Conductor': return 'bg-orange-100 text-orange-700 border-orange-200'
        default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
})

// Badge de Estado
const statusClasses = computed(() => {
    return props.employee.activo
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-red-100 text-red-700 border-red-200'
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600 border border-slate-200">
                    {{ employee.nombre_completo.charAt(0).toUpperCase() }}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ employee.nombre_completo }}</h3>
                    <div class="flex gap-2 mt-1">
                        <span class="px-2 py-0.5 text-xs font-bold rounded-full border" :class="roleClasses">
                            {{ employee.rol }}
                        </span>
                        <span class="px-2 py-0.5 text-xs font-bold rounded-full border" :class="statusClasses">
                            {{ employee.activo ? 'ACTIVO' : 'INACTIVO' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
                <p class="text-gray-900 font-medium">{{ employee.email }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teléfono</label>
                <p class="text-gray-900 font-medium">{{ employee.telefono }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">DUI</label>
                <p class="text-gray-900 font-medium font-mono">{{ employee.dui }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Sistema</label>
                <p class="text-gray-500 font-mono text-sm">{{ employee.id }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha de Creación</label>
                <p class="text-gray-900 font-medium">{{ formatDateTime(employee.createdAt) }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Último Acceso</label>
                <p class="text-gray-900 font-medium">
                    {{ employee.lastAccess ? formatDateTime(employee.lastAccess) : 'Nunca' }}
                </p>
            </div>
        </div>
    </div>
</template>