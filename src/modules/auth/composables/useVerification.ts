import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export function useVerification() {
    const router = useRouter()
    const isLoading = ref(false)
    const code = ref<string[]>(new Array(6).fill(''))
    const errorMessage = ref('')

    // Validar si los 6 campos están llenos
    const isFormValid = computed(() => code.value.every(digit => digit !== ''))

    const verifyCode = async () => {
        isLoading.value = true
        errorMessage.value = ''

        try {
            // Simulación de API
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Simular éxito (puedes cambiar esto para probar errores)
            const success = true

            if (success) {
                // Redirigir al dashboard
                router.push('/dashboard')
                return { success: true }
            } else {
                throw new Error('Código inválido')
            }
        } catch (e) {
            errorMessage.value = 'El código ingresado es incorrecto o ha expirado.'
            return { success: false }
        } finally {
            isLoading.value = false
        }
    }

    return {
        code,
        isLoading,
        errorMessage,
        isFormValid,
        verifyCode
    }
}