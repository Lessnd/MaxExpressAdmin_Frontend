<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import { useToast } from '@/shared/composables/useToast'
import type { CreatePackageDTO, Package } from '../types/package.types'

const props = defineProps<{
    initialData?: Package | null
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { addToast } = useToast()

// Lista Mock de Clientes para el Select
const mockClients = [
    { id: 'c1', name: 'David Alessandre' },
    { id: 'c2', name: 'Nicky Nicole' },
    { id: 'c3', name: 'Juan Pérez' },
    { id: 'c4', name: 'Maria López' }
]

const form = ref<CreatePackageDTO>({
    trackingId: '',
    senderId: '',
    receiverId: '',
    description: '',
    weight: 0,
    bultos: 1,
    totalValue: 0
})

const initForm = () => {
    if (props.initialData) {
        form.value = {
            trackingId: props.initialData.trackingId,
            senderId: props.initialData.senderId,
            receiverId: props.initialData.receiverId,
            description: props.initialData.description,
            weight: props.initialData.weight,
            bultos: props.initialData.bultos,
            totalValue: props.initialData.totalValue
        }
    } else {
        // Reset
        form.value = {
            trackingId: '', senderId: '', receiverId: '',
            description: '', weight: 0, bultos: 1, totalValue: 0
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

const handleSubmit = () => {
    // Validaciones básicas
    if (!form.value.trackingId || !form.value.senderId || !form.value.receiverId) {
        addToast('Complete los campos obligatorios (Tracking, Remitente, Destinatario)', 'error')
        return
    }
    
    emit('submit', { ...form.value })
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <UiInput 
            v-model="form.trackingId" 
            label="Tracking ID *" 
            placeholder="Ej: MX-000000" 
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Remitente *</label>
                <select v-model="form.senderId" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Seleccione...</option>
                    <option v-for="c in mockClients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Destinatario *</label>
                <select v-model="form.receiverId" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Seleccione...</option>
                    <option v-for="c in mockClients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
            </div>
        </div>

        <UiInput 
            v-model="form.description" 
            label="Descripción del Contenido" 
            placeholder="Ej: Ropa, Electrónicos..." 
        />

        <div class="grid grid-cols-3 gap-4">
            <UiInput v-model="form.weight" type="number" label="Peso (lb)" placeholder="0.0" />
            <UiInput v-model="form.bultos" type="number" label="Bultos" placeholder="1" />
            <UiInput v-model="form.totalValue" type="number" label="Valor ($)" placeholder="0.00" />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</UiButton>
            <UiButton type="submit" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar Paquete' }}</UiButton>
        </div>
    </form>
</template>