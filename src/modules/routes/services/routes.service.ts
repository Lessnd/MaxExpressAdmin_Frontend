import type { Route, CreateRouteDTO, UpdateRouteDTO } from '../types/route.types';

// Mock DB
let MOCK_ROUTES: Route[] = [
    {
        id: 'r1',
        name: 'Ruta San Salvador - San Miguel',
        origin: 'San Salvador',
        destination: 'San Miguel',
        type: 'Nacional',
        description: 'Ruta principal de oriente',
        active: true,
        createdAt: new Date('2024-01-15').toISOString()
    },
    {
        id: 'r2',
        name: 'Ruta Santa Ana - Metapán',
        origin: 'Santa Ana',
        destination: 'Metapán',
        type: 'Local',
        description: 'Entregas zona norte',
        active: true,
        createdAt: new Date('2024-02-10').toISOString()
    },
    {
        id: 'r3',
        name: 'Ruta Costera',
        origin: 'La Libertad',
        destination: 'Sonsonate',
        type: 'Nacional',
        active: false,
        createdAt: new Date('2023-11-20').toISOString()
    }
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const routesService = {
    async getAll(): Promise<Route[]> {
        await simulateDelay();
        return [...MOCK_ROUTES];
    },

    async create(data: CreateRouteDTO): Promise<Route> {
        await simulateDelay();
        const newRoute: Route = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString()
        };
        MOCK_ROUTES.unshift(newRoute);
        return newRoute;
    },

    async update(id: string, data: UpdateRouteDTO): Promise<Route> {
        await simulateDelay();
        const index = MOCK_ROUTES.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Ruta no encontrada');
        
        const updated = { ...MOCK_ROUTES[index], ...data };
        MOCK_ROUTES[index] = updated as Route;
        return updated as Route;
    },

    async delete(id: string): Promise<void> {
        await simulateDelay();
        MOCK_ROUTES = MOCK_ROUTES.filter(r => r.id !== id);
    },

    async toggleActive(id: string): Promise<boolean> {
        await simulateDelay();
        const route = MOCK_ROUTES.find(r => r.id === id);
        if (!route) throw new Error('Ruta no encontrada');
        route.active = !route.active;
        return route.active;
    }
};