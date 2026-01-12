export interface Vehicle {
    id: string;
    plate: string;        // placa
    model: string;        // modelo
    brand: string;        // marca
    color: string;
    year: number;         // anio
    type: string;         // tipo_vehiculo
    capacity: number;     // capacidad_carga (kg)
    active: boolean;      // activo
    createdAt: string;
}

export interface CreateVehicleDTO {
    plate: string;
    model: string;
    brand: string;
    color: string;
    year: number;
    type: string;
    capacity: number;
    active: boolean;
}

export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {}