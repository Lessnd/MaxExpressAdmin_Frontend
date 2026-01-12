<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import { useToast } from '@/shared/composables/useToast'
import { useTrips } from '../composables/useTrips' // Importamos el composable para usar fetchDependencies
import type { CreateTripDTO, Trip } from '../types/trip.types'

const props = defineProps<{
    initialData?: Trip | null
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { addToast } = useToast()
const { fetchDependencies, availableVehicles, availableDrivers, availablePackages } = useTrips()

const form = ref<CreateTripDTO>({
    type: 'Nacional',
    departureDate: '',
    arrivalDate: '',
    vehicleId: '',
    driverId: '',
    status: 'Programado',
    capacity: 0,
    currentLocation: '',
    notes: '',
    packageIds: []
})

const loadingDeps = ref(true)

// Inicialización
const initForm = async () => {
    loadingDeps.value = true
    await fetchDependencies() // Cargar selects
    loadingDeps.value = false

    if (props.initialData) {
        form.value = { ...props.initialData }
    } else {
        form.value = {
            type: 'Nacional',
            departureDate: new Date().toISOString().split('T')[0] as string, // Hoy
            arrivalDate: '',
            vehicleId: '',
            driverId: '',
            status: 'Programado',
            capacity: 0,
            currentLocation: '',
            notes: '',
            packageIds: []
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

// Helpers para visualización en el select múltiple (simplificado)
// En una UI real usaríamos un componente MultiSelect robusto.
// Aquí usaremos un simple select multiple nativo o checkboxes.
const togglePackage = (pkgId: string) => {
    const index = form.value.packageIds.indexOf(pkgId)
    if (index === -1) {
        form.value.packageIds.push(pkgId)
    } else {
        form.value.packageIds.splice(index, 1)
    }
}

const handleSubmit = () => {
    if (!form.value.vehicleId || !form.value.driverId || !form.value.departureDate) {
        addToast('Vehículo, Conductor y Fecha de Salida son obligatorios', 'error')
        return
    }

    // Enriquecemos el payload con nombres para el mock
    const selectedVehicle = availableVehicles.value.find(v => v.value === form.value.vehicleId)
    const selectedDriver = availableDrivers.value.find(d => d.value === form.value.driverId)

    const payload = {
        ...form.value,
        vehiclePlate: selectedVehicle?.label.split(' - ')[0] || 'Unknown',
        driverName: selectedDriver?.label || 'Unknown'
    }

    emit('submit', payload)
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Tipo de Viaje</label>
                <select v-model="form.type" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Nacional">Nacional</option>
                    <option value="Internacional">Internacional</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Estado</label>
                <select v-model="form.status" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Programado">Programado</option>
                    <option value="En Ruta">En Ruta</option>
                    <option value="Completado">Completado</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.departureDate" type="date" label="Fecha Salida *" />
            <UiInput v-model="form.arrivalDate" type="date" label="Fecha Llegada (Est.)" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Vehículo *</label>
                <select v-model="form.vehicleId" :disabled="loadingDeps" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                    <option value="" disabled>Seleccione Vehículo...</option>
                    <option v-for="v in availableVehicles" :key="v.value" :value="v.value">{{ v.label }}</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Conductor *</label>
                <select v-model="form.driverId" :disabled="loadingDeps" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                    <option value="" disabled>Seleccione Conductor...</option>
                    <option v-for="d in availableDrivers" :key="d.value" :value="d.value">{{ d.label }}</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.currentLocation" label="Ubicación Actual" placeholder="Ej: San Salvador" />
            <UiInput v-model="form.capacity" type="number" label="Capacidad (%)" placeholder="100" />
        </div>

        <UiInput v-model="form.notes" label="Observaciones" placeholder="Notas del viaje..." />

        <div class="border rounded-lg p-4 bg-gray-50 space-y-2">
            <label class="text-sm font-medium text-gray-700">Asignar Paquetes ({{ form.packageIds.length }} seleccionados)</label>
            <div class="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded border border-gray-200">
                <div v-if="loadingDeps" class="text-xs text-gray-500">Cargando paquetes...</div>
                <div v-else-if="availablePackages.length === 0" class="text-xs text-gray-500">No hay paquetes disponibles.</div>
                
                <div v-for="pkg in availablePackages" :key="pkg.id" class="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        :value="pkg.id" 
                        :checked="form.packageIds.includes(pkg.id)"
                        @change="togglePackage(pkg.id)"
                        class="w-4 h-4 text-blue-600 rounded border-gray-300"
                    >
                    <span class="text-sm text-gray-700">{{ pkg.trackingId }} - {{ pkg.description }}</span>
                </div>
            </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</UiButton>
            <UiButton type="submit" :disabled="loading">{{ loading ? 'Guardando...' : 'Guardar Viaje' }}</UiButton>
        </div>
    </form>
</template>