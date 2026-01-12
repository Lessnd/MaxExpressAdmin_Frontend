import { ref } from 'vue'
import { ShieldCheck, Truck, ClipboardList } from 'lucide-vue-next'
import type { Protocol, Fee, Contact } from '../types/guide.types'

export function useGuide() {
    
    const protocols = ref<Protocol[]>([
        { 
            title: 'Revisión de carga', 
            text: 'Antes de iniciar ruta, verifica que la carga coincida con la guía de envío y esté correctamente sellada.', 
            icon: ClipboardList 
        },
        { 
            title: 'Cumplimiento de rutas', 
            text: 'Sigue estrictamente la ruta asignada. En caso de desvío, reporta inmediatamente a tu supervisor.', 
            icon: Truck 
        },
        { 
            title: 'Seguridad personal y vial', 
            text: 'Usa casco o cinturón de seguridad según el tipo de vehículo. No uses el móvil mientras conduces.', 
            icon: ShieldCheck 
        },
    ])

    const rules = ref<string[]>([
        'Usar uniforme y gafete de identificación durante toda la jornada.',
        'Tratar a los clientes y compañeros con respeto y cortesía.',
        'Reportar incidencias o retrasos de inmediato al supervisor de ruta.',
        'Mantener los vehículos limpios y en condiciones óptimas de operación.',
        'Cumplir con los horarios establecidos para salida y llegada de rutas.',
        'Evitar transportar personas ajenas al servicio.',
    ])

    const fees = ref<Fee[]>([
        { category: 'Medicamentos', price: '$3.00' },
        { category: 'Documentos', price: '$6.00' },
        { category: 'Artículos Tecnológicos', price: '$10.00' },
    ])

    const contacts = ref<Contact[]>([
        { area: 'Administrador', name: 'Ludwin Meráz', phone: '(503) 2244-5678' },
        { area: 'Secretaria', name: 'Blazen', phone: '(503) 2255-4821' },
        { area: 'Soporte Técnico', name: 'Alessandre Rivera', phone: '(503) 2233-9900' },
    ])

    return {
        protocols,
        rules,
        fees,
        contacts
    }
}