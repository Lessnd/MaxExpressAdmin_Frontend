export type PackageStatus = 'En Almacén' | 'En Ruta' | 'Entregado' | 'Retenido';

export interface Package {
    id: string;
    trackingId: string;
    
    // Relaciones (En un backend real solo guardarías IDs, aquí guardamos nombres para facilitar el mock)
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;

    description: string;
    weight: number; // en libras o kg
    bultos: number;
    totalValue: number;
    
    status: PackageStatus;
    createdAt: string;
}

export interface CreatePackageDTO {
    senderId: string; // ID del cliente remitente
    receiverId: string; // ID del cliente destinatario
    description: string;
    weight: number;
    bultos: number;
    totalValue: number;
    trackingId: string;
}

export interface UpdatePackageDTO extends Partial<CreatePackageDTO> {
    status?: PackageStatus;
}