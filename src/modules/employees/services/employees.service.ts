import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '../types/employee.types';

// Simulación de Base de Datos en Memoria
let MOCK_DB: Employee[] = [
    {
        id: '1',
        nombre_completo: 'David Alessandre',
        email: 'david@maxexpress.com',
        telefono: '+503 7000-0001',
        dui: '00000000-1',
        rol: 'Admin',
        activo: true,
        createdAt: new Date('2025-01-01').toISOString(),
        lastAccess: new Date().toISOString()
    },
    {
        id: '2',
        nombre_completo: 'María Empleada',
        email: 'maria@maxexpress.com',
        telefono: '+503 7000-0002',
        dui: '00000000-2',
        rol: 'Empleado',
        activo: true,
        createdAt: new Date('2025-01-05').toISOString(),
        lastAccess: undefined
    },
    {
        id: '3',
        nombre_completo: 'Juan Despedido',
        email: 'juan@maxexpress.com',
        telefono: '+503 7000-0003',
        dui: '00000000-3',
        rol: 'Empleado',
        activo: false,
        createdAt: new Date('2024-12-01').toISOString(),
    }
];

// Utilidad para simular latencia de red (500ms - 1500ms)
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const employeesService = {
    async getAll(): Promise<Employee[]> {
        await simulateDelay();
        return [...MOCK_DB]; 
    },

    async getById(id: string): Promise<Employee | undefined> {
        await simulateDelay();
        return MOCK_DB.find(e => e.id === id);
    },

    async create(data: CreateEmployeeDTO): Promise<Employee> {
        await simulateDelay();
        
        if (MOCK_DB.some(e => e.email === data.email)) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const newEmployee: Employee = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            activo: true,
            createdAt: new Date().toISOString()
        };

        MOCK_DB.unshift(newEmployee);
        return newEmployee;
    },

    // --- AQUÍ ESTÁ LA CORRECCIÓN ---
    async update(id: string, data: UpdateEmployeeDTO): Promise<Employee> {
        await simulateDelay();
        const index = MOCK_DB.findIndex(e => e.id === id);
        
        if (index === -1) throw new Error('Empleado no encontrado');

        const currentEmployee = MOCK_DB[index];

        // FIX: Agregamos 'as Employee' al final para forzar el tipo
        // Esto le dice a TS que la fusión de datos resultará en un Empleado válido
        const updatedEmployee: Employee = { 
            ...currentEmployee, 
            ...data 
        } as Employee;

        MOCK_DB[index] = updatedEmployee;
        return updatedEmployee;
    },
    // -------------------------------

    async toggleStatus(id: string): Promise<boolean> {
        await simulateDelay();
        const employee = MOCK_DB.find(e => e.id === id);
        if (!employee) throw new Error('Empleado no encontrado');

        employee.activo = !employee.activo;
        return employee.activo;
    }
};