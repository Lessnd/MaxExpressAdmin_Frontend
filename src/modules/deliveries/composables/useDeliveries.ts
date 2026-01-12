import { ref, onMounted, computed } from 'vue'
import { deliveriesService } from '../services/deliveries.service'
import type { DeliveryTrip, DeliveryPackage } from '../types/delivery.types'
import { useToast } from '@/shared/composables/useToast'
import { Truck, CheckCircle, Clock } from 'lucide-vue-next'

export const useDeliveries = () => {
    const trips = ref<DeliveryTrip[]>([])
    const currentPackages = ref<DeliveryPackage[]>([])
    const loading = ref(true)
    const loadingPackages = ref(false)
    const { addToast } = useToast()

    const metrics = computed(() => [
        { label: 'Viajes Activos', value: trips.value.filter(t => t.status === 'En Proceso').length, icon: Truck },
        { label: 'Entregas Completadas', value: trips.value.reduce((acc, t) => acc + t.deliveredPackages, 0), icon: CheckCircle },
        { label: 'Pendientes Totales', value: trips.value.reduce((acc, t) => acc + t.pendingPackages, 0), icon: Clock }
    ])

    const fetchTrips = async () => {
        loading.value = true
        try {
            trips.value = await deliveriesService.getTrips()
        } catch (error) {
            addToast('Error al cargar entregas', 'error')
        } finally {
            loading.value = false
        }
    }

    const fetchPackages = async (tripId: string) => {
        loadingPackages.value = true
        currentPackages.value = [] 
        try {
            currentPackages.value = await deliveriesService.getPackagesByTripId(tripId)
        } catch (error) {
            addToast('Error al cargar paquetes del viaje', 'error')
        } finally {
            loadingPackages.value = false
        }
    }

    // 🔄 LÓGICA DE TOGGLE (Cambio de estado)
    const togglePackageStatus = async (tripId: string, pkg: DeliveryPackage) => {
        // Determinamos el nuevo estado opuesto al actual
        const newStatus = pkg.status === 'Pendiente' ? 'Entregado' : 'Pendiente';
        
        try {
            await deliveriesService.togglePackageStatus(tripId, pkg.id, newStatus)
            
            // Feedback visual
            const action = newStatus === 'Entregado' ? 'marcado como entregado' : 'revertido a pendiente';
            addToast(`Paquete ${action}`, 'success')

            // Actualizar localmente la lista de paquetes
            const localPkg = currentPackages.value.find(p => p.id === pkg.id)
            if (localPkg) localPkg.status = newStatus
            
            // Actualizar métricas del viaje en la lista principal (Optimistic UI update)
            const trip = trips.value.find(t => t.id === tripId)
            if (trip) {
                if (newStatus === 'Entregado') {
                    trip.deliveredPackages++;
                    trip.pendingPackages--;
                } else {
                    trip.deliveredPackages--;
                    trip.pendingPackages++;
                }
                // Actualizar estado general del viaje visualmente
                trip.status = trip.pendingPackages === 0 ? 'Finalizado' : 'En Proceso';
            }

        } catch (error) {
            addToast('Error al cambiar estado del paquete', 'error')
        }
    }

    onMounted(fetchTrips)

    return {
        trips,
        currentPackages,
        loading,
        loadingPackages,
        metrics,
        fetchTrips,
        fetchPackages,
        togglePackageStatus // <--- Exponemos la nueva función
    }
}