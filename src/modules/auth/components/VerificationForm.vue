<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import UiButton from '@/shared/components/ui/UiButton.vue' // Ajusta el alias según tu proyecto (@ o @shared)
import AuthCodeInput from './AuthCodeInput.vue'
import { useVerification } from '../composables/useVerification'

const emit = defineEmits(['back'])
const { code, isLoading, isFormValid, verifyCode, errorMessage } = useVerification()

const handleSubmit = async () => {
    if (!isFormValid.value) return
    await verifyCode()
}
</script>

<template>
    <div class="p-6 md:p-12 w-full md:w-1/2 flex flex-col justify-center relative">
        
        <button @click="$emit('back')"
            class="mb-6 md:mb-0 md:absolute md:top-8 md:left-8 flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors self-start">
            <ArrowLeft class="w-4 h-4 mr-1" />
            Volver
        </button>

        <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 md:mt-8">Verificación</h2>
            <p class="text-gray-500 text-sm mt-2 px-2 md:px-4">
                Hemos enviado un código de 6 dígitos a tu correo electrónico.
            </p>
        </div>

        <AuthCodeInput v-model="code" />

        <div v-if="errorMessage" class="mb-4 text-center">
            <p class="text-xs text-red-500 font-medium bg-red-50 py-2 px-3 rounded-md inline-block">
                {{ errorMessage }}
            </p>
        </div>

        <UiButton class="w-full bg-primary hover:bg-primary-hover shadow-md" size="lg"
            :disabled="!isFormValid || isLoading" @click="handleSubmit">
            {{ isLoading ? 'Verificando...' : 'Verificar Cuenta' }}
        </UiButton>

        <div class="mt-6 text-center">
            <button class="text-xs text-gray-400 hover:text-primary transition-colors underline">
                ¿No recibiste el código? Reenviar
            </button>
        </div>
    </div>
</template>