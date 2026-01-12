import { ref, onMounted, computed } from 'vue'
import { tripsService } from '../services/trips.service'
import { vehiclesService } from '../../vehicles/services/vehicles.service'
import { employeesService } from '../../employees/services/employees.service'
import { packagesService } from '../../packages/services/packages.service' // Asumiendo que existe y tiene getAll

import type { Trip } from '../types/trip.types'
import { useToast } from '@/shared/composables/useToast'
import { Truck, Calendar, MapPin, Package } from 'lucide-vue-next'

export const useTrips = () => {
    const trips = ref<Trip[]>([])
    const loading = ref(true)
    const { addToast } = useToast()

    // Datos auxiliares para formularios
    const availableVehicles = ref<{label: string, value: string}[]>([])
    const availableDrivers = ref<{label: string, value: string}[]>([])
    const availablePackages = ref<any[]>([]) // Paquetes crudos para el selector

    const metrics = computed(() => [
        { label: 'Total Viajes', value: trips.value.length, icon: Truck },
        { label: 'En Ruta', value: trips.value.filter(t => t.status === 'En Ruta').length, icon: MapPin },
        { label: 'Pendientes', value: trips.value.filter(t => t.status === 'Pendiente').length, icon: Calendar },
        { label: 'Completados', value: trips.value.filter(t => t.status === 'Completado').length, icon: Package }
    ])

    const fetchTrips = async () => {
        loading.value = true
        try {
            trips.value = await tripsService.getAll()
        } catch (error) {
            addToast('Error al cargar viajes', 'error')
        } finally {
            loading.value = false
        }
    }

    const fetchDependencies = async () => {
        try {
            // Cargar vehículos activos
            const vehicles = await vehiclesService.getAll()
            availableVehicles.value = vehicles
                .filter(v => v.active)
                .map(v => ({ label: `${v.plate} - ${v.brand} ${v.model}`, value: v.id }))

            // Cargar empleados (conductores) - Asumimos que filtramos por rol si fuera real
            const employees = await employeesService.getAll()
            availableDrivers.value = employees
                .filter(e => e.activo) // Solo activos
                .map(e => ({ label: e.nombre_completo, value: e.id }))

            // Cargar paquetes (para selección)
            const packages = await packagesService.getAll()
            // En un caso real filtraríamos los que NO tienen viaje asignado
            availablePackages.value = packages
        } catch (error) {
            console.error('Error cargando dependencias', error)
        }
    }

    const deleteTrip = async (id: string) => {
        try {
            await tripsService.delete(id)
            trips.value = trips.value.filter(t => t.id !== id)
            return true
        } catch (error) {
            addToast('Error al eliminar viaje', 'error')
            return false
        }
    }

    onMounted(() => {
        fetchTrips()
        // No cargamos dependencias automáticamente aquí para no saturar si solo vemos la lista.
        // Se llamará desde el Formulario.
    })

    return {
        trips,
        loading,
        metrics,
        availableVehicles,
        availableDrivers,
        availablePackages,
        fetchTrips,
        fetchDependencies,
        deleteTrip
    }
}