<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MapPinOff, ArrowLeft, Home } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => router.back()
const goHome = () => router.push('/dashboard')
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div class="text-center max-w-md mx-auto space-y-8 animate-fadeIn">
            
            <div class="relative inline-block">
                <div class="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                    <MapPinOff class="w-16 h-16 text-blue-600" />
                </div>
            </div>

            <div class="space-y-3">
                <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Ruta extraviada</h1>
                <p class="text-lg text-gray-600 leading-relaxed">
                    Lo sentimos, la página que buscas no existe o se encuentra actualmente en mantenimiento operativo.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                    @click="goBack"
                    class="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft class="w-4 h-4" />
                    Regresar
                </button>

                <button 
                    @click="goHome"
                    class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <Home class="w-4 h-4" />
                    Ir al Dashboard
                </button>
            </div>

            <p class="text-xs text-gray-400 mt-12">
                Código de error: 404 • Max Express Admin
            </p>
        </div>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>