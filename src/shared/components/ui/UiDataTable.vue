<script setup lang="ts" generic="T">
import { cn } from '@shared/utils/cn'
import UiSkeleton from './UiSkeleton.vue'
interface Column {
    header: string
    key: string
    class?: string // Clases para ocultar en móvil (ej: 'hidden md:table-cell')
}

defineProps<{
    columns: Column[]
    data: T[]
    loading?: boolean
}>()
</script>

<template>
    <div class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th v-for="col in columns" :key="col.key" :class="cn('px-4 py-3 whitespace-nowrap', col.class)">
                            {{ col.header }}
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">

                    <template v-if="loading">
                        <tr v-for="i in 5" :key="i" class="animate-pulse">
                            <td v-for="col in columns" :key="col.key"
                                :class="cn('px-4 py-4 whitespace-nowrap', col.class)">
                                <UiSkeleton class="h-4 rounded"
                                    :class="col.key === 'actions' ? 'w-8 ml-auto' : 'w-3/4'" />
                            </td>
                        </tr>
                    </template>

                    <tr v-else-if="data.length === 0">
                        <td :colspan="columns.length" class="px-4 py-12 text-center text-gray-500">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <div class="p-3 bg-gray-50 rounded-full">
                                    <span class="text-2xl">🔍</span>
                                </div>
                                <p class="text-sm font-medium">No se encontraron registros</p>
                                <p class="text-xs text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                        </td>
                    </tr>

                    <tr v-else v-for="(row, rowIndex) in data" :key="rowIndex"
                        class="hover:bg-gray-50 transition-colors group">
                        <td v-for="col in columns" :key="col.key"
                            :class="cn('px-4 py-3 align-middle text-gray-700', col.class)">
                            <slot :name="`cell-${col.key}`" :row="row">
                                {{ (row as any)[col.key] }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>