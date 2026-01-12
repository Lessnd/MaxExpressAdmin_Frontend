import type { Vehicle, CreateVehicleDTO, UpdateVehicleDTO } from '../types/vehicle.types';

// Mock DB
let MOCK_VEHICLES: Vehicle[] = [
    {
        id: 'v1',
        plate: 'P123-456',
        brand: 'Toyota',
        model: 'Hilux',
        color: 'Blanco',
        year: 2022,
        type: 'Pickup',
        capacity: 1000,
        active: true,
        createdAt: new Date('2024-01-10').toISOString()
    },
    {
        id: 'v2',
        plate: 'C987-654',
        brand: 'Isuzu',
        model: 'NPR',
        color: 'Blanco',
        year: 2020,
        type: 'Camión',
        capacity: 3500,
        active: true,
        createdAt: new Date('2023-05-15').toISOString()
    },
    {
        id: 'v3',
        plate: 'M444-555',
        brand: 'Honda',
        model: 'Cargo',
        color: 'Rojo',
        year: 2021,
        type: 'Motocicleta',
        capacity: 50,
        active: false,
        createdAt: new Date('2023-11-20').toISOString()
    }
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const vehiclesService = {
    async getAll(): Promise<Vehicle[]> {
        await simulateDelay();
        return [...MOCK_VEHICLES];
    },

    async create(data: CreateVehicleDTO): Promise<Vehicle> {
        await simulateDelay();
        
        // Simular validación de placa única
        if (MOCK_VEHICLES.some(v => v.plate === data.plate)) {
            throw new Error('Ya existe un vehículo con esa placa');
        }

        const newVehicle: Vehicle = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString()
        };
        MOCK_VEHICLES.unshift(newVehicle);
        return newVehicle;
    },

    async update(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
        await simulateDelay();
        const index = MOCK_VEHICLES.findIndex(v => v.id === id);
        if (index === -1) throw new Error('Vehículo no encontrado');
        
        const updated = { ...MOCK_VEHICLES[index], ...data };
        MOCK_VEHICLES[index] = updated as Vehicle;
        return updated as Vehicle;
    },

    async delete(id: string): Promise<void> {
        await simulateDelay();
        MOCK_VEHICLES = MOCK_VEHICLES.filter(v => v.id !== id);
    },

    async toggleActive(id: string): Promise<boolean> {
        await simulateDelay();
        const vehicle = MOCK_VEHICLES.find(v => v.id === id);
        if (!vehicle) throw new Error('Vehículo no encontrado');
        vehicle.active = !vehicle.active;
        return vehicle.active;
    }
};