<script setup lang="ts">
import { useGuide } from '../composables/useGuide'

const { protocols, rules, fees, contacts } = useGuide()
</script>

<template>
    <div class="space-y-10 animate-fadeIn pb-10">
        <section class="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-6 rounded-2xl shadow-lg">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl font-bold mb-3 tracking-tight">Guía Operativa MAX EXPRESS</h1>
                <p class="text-blue-100 text-lg max-w-2xl mx-auto">
                    Información esencial para el personal de campo.
                    Consulta protocolos, normas de seguridad y lineamientos de trabajo.
                </p>
            </div>
        </section>

        <section class="px-2 sm:px-6 max-w-6xl mx-auto">
            <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Protocolos de Servicio</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div v-for="item in protocols" :key="item.title"
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <component :is="item.icon" class="w-6 h-6" />
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 leading-tight">{{ item.title }}</h3>
                    </div>
                    <p class="text-gray-600 text-sm leading-relaxed">{{ item.text }}</p>
                </div>
            </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-2xl py-10 px-6 shadow-sm max-w-6xl mx-auto">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">Reglamento Interno</h2>
                <ul class="space-y-4">
                    <li v-for="(rule, i) in rules" :key="i" class="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                            {{ i + 1 }}
                        </span>
                        <p class="text-gray-700 pt-1">{{ rule }}</p>
                    </li>
                </ul>
            </div>
        </section>

        <section class="px-2 sm:px-6 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Tarifas Internas (Extra)</h2>
            <div class="overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th scope="col" class="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Monto Adicional</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 bg-white">
                        <tr v-for="fee in fees" :key="fee.category" class="hover:bg-blue-50/30 transition-colors">
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">{{ fee.category }}</td>
                            <td class="py-4 px-6 text-sm text-right text-blue-600 font-bold">{{ fee.price }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="bg-gradient-to-b from-blue-50 to-white py-12 px-6 rounded-2xl border border-blue-100 max-w-6xl mx-auto">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Directorio de Soporte</h2>
                <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                    En caso de incidentes, retrasos o emergencias, contacta inmediatamente al área correspondiente.
                </p>
                <div class="grid sm:grid-cols-3 gap-6 text-left">
                    <div v-for="contact in contacts" :key="contact.area" 
                        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                        <h3 class="font-bold text-blue-700 mb-1">{{ contact.area }}</h3>
                        <p class="text-gray-900 font-medium text-sm">{{ contact.name }}</p>
                        <a :href="`tel:${contact.phone}`" class="text-gray-500 text-sm mt-2 block hover:text-blue-600 transition-colors">
                            📞 {{ contact.phone }}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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