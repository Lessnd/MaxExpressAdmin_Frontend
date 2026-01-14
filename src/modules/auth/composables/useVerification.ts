// 📁 src/modules/auth/composables/useVerification.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import { useToast } from '@/shared/composables/useToast'

export function useVerification() {
    const router = useRouter()
    const { addToast } = useToast()
    
    // Array de 6 strings vacíos
    const code = ref<string[]>(new Array(6).fill(''))
    const isLoading = ref(false)
    const errorMessage = ref('')

    const isFormValid = computed(() => {
        // Verifica que todos los campos tengan un dígito
        return code.value.every(digit => digit !== '' && /^\d$/.test(digit))
    })

    const verifyCode = async () => {
        errorMessage.value = ''
        isLoading.value = true
        
        const codeString = code.value.join('')

        try {
            const isValid = await authService.verifyCode(codeString)
            
            if (isValid) {
                addToast('Verificación exitosa', 'success')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 500)
            } else {
                errorMessage.value = 'Código inválido o expirado'
                addToast('Código incorrecto', 'error')
                // Opcional: Limpiar código
                code.value = new Array(6).fill('')
            }
        } catch (error) {
            errorMessage.value = 'Error de conexión'
            addToast('Error al verificar', 'error')
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