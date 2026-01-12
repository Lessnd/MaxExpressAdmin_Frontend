import type { Package, CreatePackageDTO, UpdatePackageDTO } from '../types/package.types';

// Simulación de DB
let MOCK_PACKAGES: Package[] = [
    {
        id: '1',
        trackingId: 'MX-789012',
        senderId: 'c1',
        senderName: 'David Alessandre',
        receiverId: 'c2',
        receiverName: 'Sandra Aguilar',
        receiverAddress: 'Colonia Escalon, San Salvador',
        receiverPhone: '7000-0000',
        description: 'Ropa y Accesorios',
        weight: 7.5,
        bultos: 1,
        totalValue: 150.00,
        status: 'En Almacén',
        createdAt: new Date('2025-01-10').toISOString()
    },
    {
        id: '2',
        trackingId: 'MX-123456',
        senderId: 'c3',
        senderName: 'Juan Pérez',
        receiverId: 'c4',
        receiverName: 'Maria López',
        receiverAddress: 'San Miguel Centro',
        receiverPhone: '7777-1111',
        description: 'Repuestos de Computadora',
        weight: 2.0,
        bultos: 1,
        totalValue: 450.00,
        status: 'Entregado',
        createdAt: new Date('2025-01-08').toISOString()
    }
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 600));

export const packagesService = {
    async getAll(): Promise<Package[]> {
        await simulateDelay();
        return [...MOCK_PACKAGES];
    },

    async getById(id: string): Promise<Package | undefined> {
        await simulateDelay();
        return MOCK_PACKAGES.find(p => p.id === id);
    },

    async create(data: CreatePackageDTO): Promise<Package> {
        await simulateDelay();
        
        // En un caso real, buscaríamos el cliente por ID para sacar su nombre.
        // Aquí simulamos nombres genéricos si no los tenemos.
        const newPackage: Package = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            senderName: 'Cliente Mock Remitente', // Simplificación para el mock
            receiverName: 'Cliente Mock Destinatario',
            receiverAddress: 'Dirección Mock',
            receiverPhone: '0000-0000',
            status: 'En Almacén',
            createdAt: new Date().toISOString()
        };

        MOCK_PACKAGES.unshift(newPackage);
        return newPackage;
    },

    async update(id: string, data: UpdatePackageDTO): Promise<Package> {
        await simulateDelay();
        const index = MOCK_PACKAGES.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Paquete no encontrado');

        const updated = { ...MOCK_PACKAGES[index], ...data };
        MOCK_PACKAGES[index] = updated as Package;
        return updated as Package;
    },

    async delete(id: string): Promise<void> {
        await simulateDelay();
        MOCK_PACKAGES = MOCK_PACKAGES.filter(p => p.id !== id);
    }
};