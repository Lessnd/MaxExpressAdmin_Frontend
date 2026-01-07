export type ClientStatus = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE'

export interface Client {
    id: string
    name: string
    email: string
    phone: string
    address: string
    city: string // 'Ruta' en tu data original, pero 'city' es más estándar
    status: ClientStatus
    createdAt: string
}

// Definición para configurar las columnas de la tabla nueva
export interface ColumnDef {
    header: string
    key: string
    class?: string // Aquí es donde ocurre la magia responsive (hidden md:block)
}