import type { DeliveryTrip, DeliveryPackage, DeliveryStatus } from '../types/delivery.types';

// ... (MOCK_DELIVERY_TRIPS y MOCK_PACKAGES_DB se mantienen igual que antes) ...
// Asegúrate de incluir las definiciones de datos mock anteriores aquí si copias el archivo completo.
// Para ahorrar espacio, muestro el cambio lógico en el objeto `deliveriesService`.

// MOCK DATA (Necesaria para que funcione el ejemplo)
let MOCK_DELIVERY_TRIPS: DeliveryTrip[] = [
    { id: 't1', tripCode: 'TRIP-001', vehiclePlate: 'P123-456', driverName: 'Juan Pérez', totalPackages: 10, deliveredPackages: 4, pendingPackages: 6, date: '2025-01-20', status: 'En Proceso' },
    { id: 't2', tripCode: 'TRIP-002', vehiclePlate: 'C987-654', driverName: 'Maria Rodriguez', totalPackages: 5, deliveredPackages: 5, pendingPackages: 0, date: '2025-01-18', status: 'Finalizado' }
];

const MOCK_PACKAGES_DB: Record<string, DeliveryPackage[]> = {
    't1': Array.from({ length: 10 }, (_, i) => ({
        id: `pkg-t1-${i}`, trackingId: `MX-${1000 + i}`, description: 'Paquete Mock', receiverName: `Cliente ${i}`, address: 'San Salvador',
        status: i < 4 ? 'Entregado' : 'Pendiente', deliveredAt: i < 4 ? new Date().toISOString() : undefined
    })),
    't2': Array.from({ length: 5 }, (_, i) => ({
        id: `pkg-t2-${i}`, trackingId: `MX-${2000 + i}`, description: 'Paquete Mock', receiverName: `Cliente ${i}`, address: 'San Miguel',
        status: 'Entregado', deliveredAt: new Date().toISOString()
    }))
};

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const deliveriesService = {
    async getTrips(): Promise<DeliveryTrip[]> {
        await simulateDelay();
        return [...MOCK_DELIVERY_TRIPS];
    },

    async getPackagesByTripId(tripId: string): Promise<DeliveryPackage[]> {
        await simulateDelay();
        return MOCK_PACKAGES_DB[tripId] || [];
    },

    // 🔄 MÉTODO ACTUALIZADO: Bidireccional
    async togglePackageStatus(tripId: string, packageId: string, newStatus: DeliveryStatus): Promise<DeliveryPackage> {
        await simulateDelay();
        const packages = MOCK_PACKAGES_DB[tripId];
        const pkg = packages?.find(p => p.id === packageId);

        if (!pkg) throw new Error('Paquete no encontrado');

        const oldStatus = pkg.status;
        pkg.status = newStatus;

        // Lógica de contadores del viaje (Mock)
        const trip = MOCK_DELIVERY_TRIPS.find(t => t.id === tripId);

        if (trip && oldStatus !== newStatus) {
            if (newStatus === 'Entregado' && oldStatus === 'Pendiente') {
                // Sumar entrega
                trip.deliveredPackages++;
                trip.pendingPackages--;
            } else if (newStatus === 'Pendiente' && oldStatus === 'Entregado') {
                // Revertir entrega
                trip.deliveredPackages--;
                trip.pendingPackages++;
            }

            // Recalcular estado del viaje
            trip.status = trip.pendingPackages === 0 ? 'Finalizado' : 'En Proceso';
        }

        if (newStatus === 'Entregado') {
            pkg.deliveredAt = new Date().toISOString();
        } else {
            pkg.deliveredAt = undefined; // Limpiar fecha si se revierte
        }

        return pkg;
    }
};