export type TripStatus = 'Pendiente' | 'Programado' | 'En Ruta' | 'Completado';

export interface Trip {
    id: string;
    type: 'Nacional' | 'Internacional';
    departureDate: string; // fecha_recogida
    arrivalDate?: string;  // fecha_estimada_entrega
    
    // Relaciones (Guardamos nombres para facilitar la vista sin joins complejos)
    vehicleId: string;
    vehiclePlate: string;
    driverId: string;
    driverName: string;
    
    status: TripStatus;
    capacity: number; // Capacidad DISPONIBLE o TOTAL, definiremos TOTAL
    currentLocation: string;
    notes?: string;
    
    // Paquetes asignados (Array de IDs o objetos simples)
    packageIds: string[];
    
    createdAt: string;
}

export interface CreateTripDTO {
    type: 'Nacional' | 'Internacional';
    departureDate: string;
    arrivalDate?: string;
    vehicleId: string;
    driverId: string;
    status: TripStatus;
    capacity: number;
    currentLocation: string;
    notes?: string;
    packageIds: string[];
}

export interface UpdateTripDTO extends Partial<CreateTripDTO> {}