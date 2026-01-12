<script setup lang="ts">
import { computed } from 'vue'
import type { Package } from '../types/package.types'
import { useDate } from '@/shared/composables/useDate'

const props = defineProps<{ pkg: Package }>() // 'package' es palabra reservada a veces, uso 'pkg'
const { formatDateTime } = useDate()

const statusClasses = computed(() => {
    switch (props.pkg.status) {
        case 'Entregado': return 'bg-green-100 text-green-700 border-green-200'
        case 'En Ruta': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'Retenido': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
                <h3 class="text-xl font-bold text-gray-900">{{ pkg.trackingId }}</h3>
                <p class="text-sm text-gray-500">{{ pkg.description }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full border" :class="statusClasses">
                {{ pkg.status }}
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Remitente</label>
                <p class="font-medium text-gray-900">{{ pkg.senderName }}</p>
            </div>
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Destinatario</label>
                <p class="font-medium text-gray-900">{{ pkg.receiverName }}</p>
                <p class="text-sm text-gray-500">{{ pkg.receiverAddress }}</p>
                <p class="text-sm text-gray-500">{{ pkg.receiverPhone }}</p>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Peso</label>
                <p class="font-medium text-gray-900">{{ pkg.weight }} lb</p>
            </div>
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Bultos</label>
                <p class="font-medium text-gray-900">{{ pkg.bultos }}</p>
            </div>
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Valor</label>
                <p class="font-medium text-gray-900">${{ pkg.totalValue }}</p>
            </div>
            <div>
                <label class="text-xs font-semibold text-gray-400 uppercase">Fecha</label>
                <p class="font-medium text-gray-900 text-sm">{{ formatDateTime(pkg.createdAt) }}</p>
            </div>
        </div>
    </div>
</template>