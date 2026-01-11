import { ref, onMounted, computed } from 'vue'
//import { useRouter } from 'vue-router'
import { employeesService } from '../services/employees.service'
import type { Employee } from '../types/employee.types'
import { useToast } from '@/shared/composables/useToast' // Asumo que ya tienes esto

export const useEmployees = () => {
    //const router = useRouter()
    const { addToast } = useToast() // Usamos tu sistema de toast, no alerts feos

    const employees = ref<Employee[]>([])
    const loading = ref(true)

    // Métricas calculadas en tiempo real (No hardcodeadas)
    const metrics = computed(() => [
        {
            label: 'Empleados activos',
            value: employees.value.filter(e => e.activo).length,
            icon: 'Briefcase'
        },
        {
            label: 'Empleados inactivos',
            value: employees.value.filter(e => !e.activo).length,
            icon: 'UserX'
        }
    ])

    const fetchEmployees = async () => {
        loading.value = true
        try {
            employees.value = await employeesService.getAll()
        } catch (error) {
            console.error(error)
            addToast('Error al cargar empleados', 'error')
        } finally {
            loading.value = false
        }
    }

    const toggleEmployeeStatus = async (employee: Employee) => {
        // Optimistic UI Update (Actualizamos visualmente antes de esperar a la API)
        const previousState = employee.activo
        employee.activo = !previousState

        try {
            await employeesService.toggleStatus(employee.id)
            // ... dentro del try
            addToast(
                `Empleado ${employee.activo ? 'activado' : 'desactivado'} correctamente`,
                'success'
            )

            // ... dentro del catch
            addToast('No se pudo cambiar el estado', 'error')
        } catch (error) {
            // Revertimos si falla
            employee.activo = previousState
            addToast('No se pudo cambiar el estado', 'error')
        }
    }

    onMounted(fetchEmployees)

    return {
        employees,
        loading,
        metrics,
        fetchEmployees,
        toggleEmployeeStatus
    }
}