import {
    Home, Users, Briefcase, Package, Map, Truck,
    BarChart3, BookOpen, PackageSearch, Plane
} from 'lucide-vue-next'
import type { DashboardAction } from '../types/dashboard.types'

// Menú del Sidebar (Exportado para usarlo en el Layout más adelante si queremos desacoplar)
export const MENU_ITEMS: DashboardAction[] = [
    { label: 'Inicio', icon: Home, route: '/dashboard' },
    { label: 'Clientes', icon: Users, route: '/dashboard/clients' },
    { label: 'Empleados', icon: Briefcase, route: '/dashboard/employees' },
    { label: 'Paquetes', icon: Package, route: '/dashboard/packages' },
    { label: 'Entregas', icon: PackageSearch, route: '/dashboard/deliveries' },
    { label: 'Rutas', icon: Map, route: '/dashboard/routes' },
    { label: 'Viajes', icon: Plane, route: '/dashboard/trips' },
    { label: 'Vehículos', icon: Truck, route: '/dashboard/vehicles' },
    { label: 'Informes', icon: BarChart3, route: '/dashboard/reports' },
    { label: 'Guía Operativa', icon: BookOpen, route: '/dashboard/guide' }
]

// Filtramos para crear las Quick Actions (excluyendo Inicio)
export const QUICK_ACTIONS: DashboardAction[] = MENU_ITEMS
    .filter(item => item.route !== '/dashboard')
    .map((item, index) => ({ ...item, id: index + 1 }))