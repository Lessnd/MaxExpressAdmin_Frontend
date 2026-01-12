import { ref, onMounted, computed } from 'vue'
import { vehiclesService } from '../services/vehicles.service'
import type { Vehicle } from '../types/vehicle.types'
import { useToast } from '@/shared/composables/useToast'
import { Truck, CheckCircle, AlertTriangle } from 'lucide-vue-next'

export const useVehicles = () => {
    const vehicles = ref<Vehicle[]>([])
    const loading = ref(true)
    const { addToast } = useToast()

    const metrics = computed(() => [
        { label: 'Flota Total', value: vehicles.value.length, icon: Truck },
        { label: 'Operativos', value: vehicles.value.filter(v => v.active).length, icon: CheckCircle },
        { label: 'En Mantenimiento', value: vehicles.value.filter(v => !v.active).length, icon: AlertTriangle }
    ])

    const fetchVehicles = async () => {
        loading.value = true
        try {
            vehicles.value = await vehiclesService.getAll()
        } catch (error) {
            addToast('Error al cargar la flota', 'error')
        } finally {
            loading.value = false
        }
    }

    const deleteVehicle = async (id: string) => {
        try {
            await vehiclesService.delete(id)
            vehicles.value = vehicles.value.filter(v => v.id !== id)
            return true
        } catch (error) {
            addToast('No se pudo eliminar el vehículo', 'error')
            return false
        }
    }

    const toggleVehicleStatus = async (vehicle: Vehicle) => {
        const previousState = vehicle.active
        vehicle.active = !previousState
        try {
            await vehiclesService.toggleActive(vehicle.id)
            addToast(`Vehículo ${vehicle.active ? 'activado' : 'desactivado'}`, 'success')
        } catch (error) {
            vehicle.active = previousState
            addToast('Error al cambiar estado', 'error')
        }
    }

    onMounted(fetchVehicles)

    return {
        vehicles,
        loading,
        metrics,
        fetchVehicles,
        deleteVehicle,
        toggleVehicleStatus
    }
}