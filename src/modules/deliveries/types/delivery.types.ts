export type DeliveryStatus = 'Pendiente' | 'Entregado' | 'Fallido';

export interface DeliveryTrip {
    id: string; // ID del viaje
    tripCode: string; // Código corto o identificador visual
    vehiclePlate: string;
    driverName: string;
    totalPackages: number;
    deliveredPackages: number;
    pendingPackages: number;
    date: string;
    status: 'En Proceso' | 'Finalizado'; // Estado general del lote de entregas
}

export interface DeliveryPackage {
    id: string; // ID del paquete
    trackingId: string;
    description: string;
    receiverName: string;
    address: string;
    status: DeliveryStatus;
    deliveredAt?: string;
    notes?: string; // Para observaciones de entrega (ej: "Recibido por guardia")
}