export interface Route {
    id: string;
    name: string; // nombreRuta
    origin: string; // puntoSalida
    destination: string; // puntoCierre
    type: 'Nacional' | 'Internacional' | 'Local'; // tipoRuta
    description?: string;
    active: boolean; // activa
    createdAt: string;
}

export interface CreateRouteDTO {
    name: string;
    origin: string;
    destination: string;
    type: 'Nacional' | 'Internacional' | 'Local';
    description?: string;
    active: boolean;
}

export interface UpdateRouteDTO extends Partial<CreateRouteDTO> {}