export type EmployeeRole = 'Admin' | 'Empleado' | 'Conductor';

export interface Employee {
    id: string; // Usaremos UUIDs o strings simples
    nombre_completo: string;
    email: string; // Unificamos 'correo' y 'email' a 'email'
    telefono: string;
    dui: string;
    rol: EmployeeRole;
    activo: boolean;
    createdAt: string; // ISO String
    lastAccess?: string; // ISO String
}

// Para cuando creamos uno nuevo (sin ID ni fechas)
export interface CreateEmployeeDTO {
    nombre_completo: string;
    email: string;
    telefono: string;
    dui: string;
    rol: EmployeeRole;
    password?: string; // Solo necesario al crear
}

export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {}