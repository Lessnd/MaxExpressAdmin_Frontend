import { ref, onMounted, computed } from 'vue'
import { routesService } from '../services/routes.service'
import type { Route } from '../types/route.types'
import { useToast } from '@/shared/composables/useToast'
import { Map, MapPin, Navigation } from 'lucide-vue-next'

export const useRoutes = () => {
    const routes = ref<Route[]>([])
    const loading = ref(true)
    const { addToast } = useToast()

    const metrics = computed(() => [
        { label: 'Total Rutas', value: routes.value.length, icon: Map },
        { label: 'Activas', value: routes.value.filter(r => r.active).length, icon: Navigation },
        { label: 'Inactivas', value: routes.value.filter(r => !r.active).length, icon: MapPin }
    ])

    const fetchRoutes = async () => {
        loading.value = true
        try {
            routes.value = await routesService.getAll()
        } catch (error) {
            addToast('Error al cargar rutas', 'error')
        } finally {
            loading.value = false
        }
    }

    const deleteRoute = async (id: string) => {
        try {
            await routesService.delete(id)
            routes.value = routes.value.filter(r => r.id !== id)
            return true
        } catch (error) {
            addToast('No se pudo eliminar la ruta', 'error')
            return false
        }
    }

    const toggleRouteStatus = async (route: Route) => {
        const previousState = route.active
        route.active = !previousState // Optimistic
        try {
            await routesService.toggleActive(route.id)
            addToast(`Ruta ${route.active ? 'activada' : 'desactivada'}`, 'success')
        } catch (error) {
            route.active = previousState // Revert
            addToast('Error al cambiar estado', 'error')
        }
    }

    onMounted(fetchRoutes)

    return {
        routes,
        loading,
        metrics,
        fetchRoutes,
        deleteRoute,
        toggleRouteStatus
    }
}