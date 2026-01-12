import { ref, onMounted, computed } from 'vue'
import { packagesService } from '../services/packages.service'
import type { Package } from '../types/package.types'
import { useToast } from '@/shared/composables/useToast'
import { Package as PackageIcon, AlertTriangle, CheckCircle, Truck } from 'lucide-vue-next'

export const usePackages = () => {
    const packages = ref<Package[]>([])
    const loading = ref(true)
    const { addToast } = useToast()

    // Métricas calculadas
    const metrics = computed(() => [
        { 
            label: 'Total Paquetes', 
            value: packages.value.length, 
            icon: PackageIcon 
        },
        { 
            label: 'En Almacén', 
            value: packages.value.filter(p => p.status === 'En Almacén').length, 
            icon: AlertTriangle 
        },
        { 
            label: 'En Ruta', 
            value: packages.value.filter(p => p.status === 'En Ruta').length, 
            icon: Truck 
        },
        { 
            label: 'Entregados', 
            value: packages.value.filter(p => p.status === 'Entregado').length, 
            icon: CheckCircle 
        }
    ])

    const fetchPackages = async () => {
        loading.value = true
        try {
            packages.value = await packagesService.getAll()
        } catch (error) {
            addToast('Error al cargar paquetes', 'error')
        } finally {
            loading.value = false
        }
    }

    const deletePackage = async (id: string) => {
        try {
            await packagesService.delete(id)
            packages.value = packages.value.filter(p => p.id !== id) // Optimistic update
            return true
        } catch (error) {
            addToast('No se pudo eliminar el paquete', 'error')
            return false
        }
    }

    onMounted(fetchPackages)

    return {
        packages,
        loading,
        metrics,
        fetchPackages,
        deletePackage
    }
}