import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

// Configuración global (luego esto podría venir de un Store de Pinia 'userPreferences')
const USER_LOCALE = es // O enUS dependiendo del usuario
const DEFAULT_FORMAT = 'dd/MM/yyyy'
const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'

export function useDate() {

    /**
     * Recibe una fecha ISO (UTC) y la devuelve formateada en la zona horaria DEL NAVEGADOR
     */
    const formatDate = (dateString: string | undefined, formatStr: string = DEFAULT_FORMAT) => {
        if (!dateString) return '-'

        const date = parseISO(dateString)
        if (!isValid(date)) return 'Fecha inválida'

        return format(date, formatStr, { locale: USER_LOCALE })
    }

    /**
     * Igual que arriba, pero incluye hora
     */
    const formatDateTime = (dateString: string | undefined) => {
        return formatDate(dateString, DATETIME_FORMAT)
    }

    /**
     * Para mostrar distancias relativas: "hace 2 horas", "en 3 días"
     * Útil para logística
     */
    // Aquí podrías agregar formatDistanceToNow de date-fns

    return {
        formatDate,
        formatDateTime
    }
}