<script setup lang="ts">
import { computed } from 'vue'
import type { Client } from '../types/client.types'
import { useDate } from '@shared/composables/useDate'

const props = defineProps<{
    client: Client
}>()

const { formatDateTime } = useDate()

// Helper visual para el estado
const statusClasses = computed(() => {
    switch (props.client.status) {
        case 'ACTIVO': return 'bg-green-100 text-green-700 border-green-200'
        case 'INACTIVO': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-4">
                <div
                    class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                    {{ client.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ client.name }}</h3>
                    <p class="text-sm text-gray-500">ID: {{ client.id }}</p>
                </div>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full border" :class="statusClasses">
                {{ client.status }}
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
                <p class="text-gray-900 font-medium">{{ client.email }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teléfono</label>
                <p class="text-gray-900 font-medium">{{ client.phone || 'No registrado' }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ciudad / Ruta</label>
                <p class="text-gray-900 font-medium">{{ client.city || 'No asignada' }}</p>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha de Registro</label>
                <p class="text-gray-900 font-medium">{{ formatDateTime(client.createdAt) }}</p>
            </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-100">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Notas del Sistema</h4>
            <p class="text-sm text-gray-500">
                Este cliente tiene un historial de pagos excelente. Asignado a la ruta preferencial norte.
            </p>
        </div>
    </div>
</template>