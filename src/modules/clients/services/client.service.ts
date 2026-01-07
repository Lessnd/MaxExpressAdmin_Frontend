import type { Client } from '../types/client.types'

// Datos falsos para desarrollo UI
const MOCK_DATA: Client[] = [
    {
        id: '1',
        name: 'David Alessandre',
        email: 'david@example.com',
        phone: '7470 7208',
        address: 'Barrio El Calvario',
        city: 'Jiquilisco',
        status: 'ACTIVO',
        createdAt: '2025-07-08T10:00:00'
    },
    {
        id: '2',
        name: 'Maria Fernanda',
        email: 'maria@example.com',
        phone: '7000 1234',
        address: 'Colonia Médica',
        city: 'San Salvador',
        status: 'INACTIVO',
        createdAt: '2025-08-15T14:30:00'
    },
    // Agrega más si quieres probar el scroll
]

export const clientsService = {
    async getAll(): Promise<Client[]> {
        // Simulamos latencia de red (500ms)
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_DATA), 1200)
        })
    },

    async create(client: Partial<Client>): Promise<void> {
        console.log('Mock Create:', client)
    },

    async delete(id: string): Promise<void> {
        console.log('Mock Delete:', id)
    }
}