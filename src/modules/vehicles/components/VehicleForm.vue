<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import { useToast } from '@/shared/composables/useToast'
import type { CreateVehicleDTO, Vehicle } from '../types/vehicle.types'

const props = defineProps<{
    initialData?: Vehicle | null
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { addToast } = useToast()

const form = ref<CreateVehicleDTO>({
    plate: '',
    brand: '',
    model: '',
    color: '',
    year: new Date().getFullYear(),
    type: 'Camión',
    capacity: 0,
    active: true
})

const initForm = () => {
    if (props.initialData) {
        form.value = { ...props.initialData }
    } else {
        form.value = {
            plate: '', brand: '', model: '', color: '',
            year: new Date().getFullYear(), type: 'Camión', capacity: 0, active: true
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

const handleSubmit = () => {
    if (!form.value.plate || !form.value.brand || !form.value.model) {
        addToast('Placa, Marca y Modelo son obligatorios', 'error')
        return
    }
    emit('submit', { ...form.value })
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.plate" label="Número de Placa *" placeholder="P123-456" />
            
            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Tipo de Vehículo</label>
                <select v-model="form.type" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Camión">Camión</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Panel">Panel</option>
                    <option value="Motocicleta">Motocicleta</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UiInput v-model="form.brand" label="Marca *" placeholder="Toyota" />
            <UiInput v-model="form.model" label="Modelo *" placeholder="Hilux" />
            <UiInput v-model="form.color" label="Color" placeholder="Blanco" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.year" type="number" label="Año" />
            <UiInput v-model="form.capacity" type="number" label="Capacidad (kg)" />
        </div>

        <div class="flex items-center gap-2">
            <input type="checkbox" id="active" v-model="form.active" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <label for="active" class="text-sm text-gray-700">Vehículo Operativo</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</UiButton>
            <UiButton type="submit" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar Vehículo' }}</UiButton>
        </div>
    </form>
</template>