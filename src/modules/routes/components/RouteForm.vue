<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import { useToast } from '@/shared/composables/useToast'
import type { CreateRouteDTO, Route } from '../types/route.types'

const props = defineProps<{
    initialData?: Route | null
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { addToast } = useToast()

const form = ref<CreateRouteDTO>({
    name: '',
    origin: '',
    destination: '',
    type: 'Nacional',
    description: '',
    active: true
})

const initForm = () => {
    if (props.initialData) {
        form.value = { ...props.initialData }
    } else {
        form.value = {
            name: '', origin: '', destination: '',
            type: 'Nacional', description: '', active: true
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

const handleSubmit = () => {
    if (!form.value.name || !form.value.origin || !form.value.destination) {
        addToast('Nombre, Origen y Destino son obligatorios', 'error')
        return
    }
    emit('submit', { ...form.value })
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <UiInput v-model="form.name" label="Nombre de la Ruta *" placeholder="Ej: Ruta 1 - Centro" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.origin" label="Punto de Salida *" placeholder="Ej: San Salvador" />
            <UiInput v-model="form.destination" label="Punto de Llegada *" placeholder="Ej: San Miguel" />
        </div>

        <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Tipo de Ruta</label>
            <select v-model="form.type" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="Nacional">Nacional</option>
                <option value="Local">Local</option>
                <option value="Internacional">Internacional</option>
            </select>
        </div>

        <UiInput v-model="form.description" label="Descripción (Opcional)" placeholder="Detalles adicionales..." />

        <div class="flex items-center gap-2">
            <input type="checkbox" id="active" v-model="form.active" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <label for="active" class="text-sm text-gray-700">Ruta Activa</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</UiButton>
            <UiButton type="submit" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar Ruta' }}</UiButton>
        </div>
    </form>
</template>