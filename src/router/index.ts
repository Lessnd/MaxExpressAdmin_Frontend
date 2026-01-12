import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@shared/layouts/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        /* -------------------------------------------------------------------------- */
        /* 1. RUTAS PÚBLICAS (AUTH)                           */
        /* -------------------------------------------------------------------------- */
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@modules/auth/views/LoginView.vue')
        },
        {
            path: '/auth/verification',
            name: 'verification',
            component: () => import('@modules/auth/views/VerificationView.vue')
        },

        /* -------------------------------------------------------------------------- */
        /* 2. RUTAS PRIVADAS (DASHBOARD)                         */
        /* -------------------------------------------------------------------------- */
        {
            path: '/',
            component: AppLayout,
            redirect: '/dashboard',
            children: [
                // Dashboard Principal
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    // Verificamos que coincida con tu árbol actual (Views vs Pages)
                    component: () => import('@modules/dashboard/views/DashboardView.vue')
                },

                // NUEVO: Módulo de Clientes
                {
                    // Definimos la ruta completa relativa a la raíz '/'
                    path: 'dashboard/clients',
                    name: 'clients',
                    component: () => import('@modules/clients/views/ClientsView.vue')
                },

                {
                    // Módulo de Empleados
                    path: 'dashboard/employees',
                    name: 'employees',
                    component: () => import('@modules/employees/views/EmployeesView.vue')
                },
                
                {
                    // Módulo de Paquetes
                    path: 'dashboard/packages',
                    name: 'packages',
                    component: () => import('@modules/packages/views/PackagesView.vue')
                },
                
                {
                    // Módulo de Rutas
                    path: 'dashboard/routes',
                    name: 'routes',
                    component: () => import('@modules/routes/views/RoutesView.vue')
                },

                {
                    // Módulo de Vehículos
                    path: 'dashboard/vehicles',
                    name: 'vehicles',
                    component: () => import('@modules/vehicles/views/VehiclesView.vue')
                },

                {
                    // Módulo de Viajes
                    path: 'dashboard/trips',
                    name: 'trips',
                    component: () => import('@modules/trips/views/TripsView.vue')
                },

                // Aquí agregaremos empleados, paquetes, etc. a medida que los migremos
            ]
        },

        /* -------------------------------------------------------------------------- */
        /* 3. CATCH-ALL (404)                                 */
        /* -------------------------------------------------------------------------- */
        // Redirige cualquier ruta desconocida al dashboard para evitar pantallas blancas
        {
            path: '/:pathMatch(.*)*',
            redirect: '/dashboard'
        }
    ]
})

export default router