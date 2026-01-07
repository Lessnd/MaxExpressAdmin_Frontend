import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

// Tipo para el esquema de mensajes (ayuda al autocompletado si lo configuramos bien)
type MessageSchema = typeof es

const i18n = createI18n<[MessageSchema], 'es' | 'en'>({
    legacy: false, // Importante para usar Composition API
    locale: 'es', // Idioma por defecto
    fallbackLocale: 'en', // Si falta una traducción en ES, usa EN
    globalInjection: true, // Permite usar $t en templates sin importar nada
    messages: {
        es,
        en
    }
})

export default i18n