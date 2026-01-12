import type { Trip, CreateTripDTO, UpdateTripDTO } from '../types/trip.types';

// Mock DB
let MOCK_TRIPS: Trip[] = [
    {
        id: 't1',
        type: 'Nacional',
        departureDate: '2025-01-20',
        vehicleId: 'v1',
        vehiclePlate: 'P123-456',
        driverId: 'e1',
        driverName: 'Juan Pérez',
        status: 'Programado',
        capacity: 100,
        currentLocation: 'San Salvador',
        notes: 'Viaje matutino',
        packageIds: ['p1', 'p2'],
        createdAt: new Date().toISOString()
    },
    {
        id: 't2',
        type: 'Internacional',
        departureDate: '2025-01-22',
        vehicleId: 'v2',
        vehiclePlate: 'C987-654',
        driverId: 'e2',
        driverName: 'Maria Rodriguez',
        status: 'En Ruta',
        capacity: 50,
        currentLocation: 'Frontera El Amatillo',
        notes: 'Carga prioritaria',
        packageIds: [],
        createdAt: new Date().toISOString()
    }
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 600));

export const tripsService = {
    async getAll(): Promise<Trip[]> {
        await simulateDelay();
        return [...MOCK_TRIPS];
    },

    async getById(id: string): Promise<Trip | undefined> {
        await simulateDelay();
        return MOCK_TRIPS.find(t => t.id === id);
    },

    async create(data: CreateTripDTO & { vehiclePlate: string, driverName: string }): Promise<Trip> {
        await simulateDelay();
        const newTrip: Trip = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString()
        };
        MOCK_TRIPS.unshift(newTrip);
        return newTrip;
    },

    async update(id: string, data: UpdateTripDTO): Promise<Trip> {
        await simulateDelay();
        const index = MOCK_TRIPS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Viaje no encontrado');
        
        const current = MOCK_TRIPS[index];
        const updated = { ...current, ...data };
        
        // Si se actualizan relaciones, idealmente deberíamos actualizar nombres también,
        // pero por simplicidad del mock asumimos que vienen en el DTO o se mantienen.
        
        MOCK_TRIPS[index] = updated as Trip;
        return updated as Trip;
    },

    async delete(id: string): Promise<void> {
        await simulateDelay();
        MOCK_TRIPS = MOCK_TRIPS.filter(t => t.id !== id);
    },

    // Métodos especiales para gestión de paquetes
    async assignPackages(tripId: string, packageIds: string[]): Promise<void> {
        await simulateDelay();
        const trip = MOCK_TRIPS.find(t => t.id === tripId);
        if (!trip) throw new Error('Viaje no encontrado');
        // Unir sin duplicados
        trip.packageIds = [...new Set([...trip.packageIds, ...packageIds])];
    },

    async removePackage(tripId: string, packageId: string): Promise<void> {
        await simulateDelay();
        const trip = MOCK_TRIPS.find(t => t.id === tripId);
        if (!trip) throw new Error('Viaje no encontrado');
        trip.packageIds = trip.packageIds.filter(id => id !== packageId);
    }
};