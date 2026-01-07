<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n' // 1. Importar librería
import AuthHeader from '../components/AuthHeader.vue'
import UiInput from '@shared/components/ui/UiInput.vue'
import UiButton from '@shared/components/ui/UiButton.vue'

const router = useRouter()
// 2. Extraer 't' (translate) y 'locale' (idioma actual)
const { locale } = useI18n()

const isLoading = ref(false)

const form = ref({
    email: '',
    password: ''
})

const handleLogin = async () => {
    isLoading.value = true
    // Simulación de login
    setTimeout(() => {
        isLoading.value = false
        router.push('/auth/verification')
    }, 1000)
}

// 3. Función temporal para alternar idiomas (Solo para pruebas)
const toggleLanguage = () => {
    locale.value = locale.value === 'es' ? 'en' : 'es'
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-bg-app p-4 relative">

        <button @click="toggleLanguage"
            class="absolute top-5 right-5 px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-md text-sm font-medium hover:bg-gray-50 transition-colors z-50 flex items-center gap-2">
            <span>{{ locale === 'es' ? 'Español' : 'English' }}</span>
        </button>

        <div
            class="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-auto md:min-h-[500px]">

            <AuthHeader />

            <div class="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
                <div class="mb-8 text-center md:text-left">
                    <h2 class="text-2xl font-bold text-gray-900">
                        {{ $t('auth.welcome_back') }}
                    </h2>
                    <p class="text-gray-500 text-sm mt-1">
                        {{ $t('auth.enter_credentials') }}
                    </p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <UiInput v-model="form.email" :label="$t('auth.email')" type="email"
                        placeholder="admin@maxexpress.com" id="email" />

                    <div class="space-y-1">
                        <UiInput v-model="form.password" :label="$t('auth.password')" type="password"
                            placeholder="••••••••" id="password" />
                    </div>

                    <div class="pt-4">
                        <UiButton type="submit" class="w-full bg-primary hover:bg-primary-hover" size="lg"
                            :disabled="isLoading">
                            {{ isLoading ? $t('auth.logging_in') : $t('auth.login_button') }}
                        </UiButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>