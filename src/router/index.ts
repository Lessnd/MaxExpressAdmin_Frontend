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
                    component: () => import('@modules/dashboard/views/DashboardView.vue')
                },

                // Módulo de Clientes
                {
                    path: 'dashboard/clients',
                    name: 'clients',
                    component: () => import('@modules/clients/views/ClientsView.vue')
                },

                // Módulo de Empleados
                {
                    path: 'dashboard/employees',
                    name: 'employees',
                    component: () => import('@modules/employees/views/EmployeesView.vue')
                },
                
                // Módulo de Paquetes
                {
                    path: 'dashboard/packages',
                    name: 'packages',
                    component: () => import('@modules/packages/views/PackagesView.vue')
                },
                
                // Módulo de Rutas
                {
                    path: 'dashboard/routes',
                    name: 'routes',
                    component: () => import('@modules/routes/views/RoutesView.vue')
                },

                // Módulo de Vehículos
                {
                    path: 'dashboard/vehicles',
                    name: 'vehicles',
                    component: () => import('@modules/vehicles/views/VehiclesView.vue')
                },

                // Módulo de Viajes
                {
                    path: 'dashboard/trips',
                    name: 'trips',
                    component: () => import('@modules/trips/views/TripsView.vue')
                },

                // Módulo de Entregas
                {
                    path: 'dashboard/deliveries',
                    name: 'deliveries',
                    component: () => import('@modules/deliveries/views/DeliveriesView.vue')
                },

                // Módulo de Guía Operativa
                {
                    path: 'dashboard/guide',
                    name: 'guide',
                    component: () => import('@modules/guide/views/OperationalGuideView.vue')
                },
            ]
        },

        /* -------------------------------------------------------------------------- */
        /* 3. CATCH-ALL (404)                                 */
        /* -------------------------------------------------------------------------- */
        // Captura cualquier ruta no definida y muestra la vista de error
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFoundView.vue')
        }
    ]
})

export default router