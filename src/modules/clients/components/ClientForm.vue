<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@shared/components/ui/UiInput.vue'
import UiButton from '@shared/components/ui/UiButton.vue'

const emit = defineEmits(['submit', 'cancel'])
const { t } = useI18n()

// Simulamos carga
defineProps<{ loading?: boolean }>()

const form = ref({
    name: '',
    email: '',
    phone: '',
    city: '',
    // Inicializamos con la fecha de hoy (formato YYYY-MM-DD para el input HTML)
    registrationDate: new Date().toISOString().split('T')[0]
})

// Validación simple
const isValid = computed(() => form.value.name.length > 2 && form.value.email.includes('@'))

const handleSubmit = () => {
    // SOLUCIÓN: Usamos "|| ''" (fallback) para asegurar que nunca sea undefined.
    // Si por alguna razón es undefined, new Date('') dará "Invalid Date", 
    // pero new Date().toISOString() es más seguro como fallback final.

    const dateValue = form.value.registrationDate || new Date().toISOString()
    const localDate = new Date(dateValue)

    // Verificamos que sea una fecha válida antes de enviar (Buenas prácticas)
    if (isNaN(localDate.getTime())) {
        console.error("Fecha inválida")
        return
    }

    const payload = {
        ...form.value,
        createdAt: localDate.toISOString()
    }

    emit('submit', payload)
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput v-model="form.name" label="Nombre Completo" placeholder="Ej: Juan Pérez" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.email" label="Correo" type="email" placeholder="cliente@empresa.com" />
            <UiInput v-model="form.phone" label="Teléfono" placeholder="Ej: 7000-0000" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.city" label="Ciudad" placeholder="Ej: San Salvador" />
            <UiInput v-model="form.registrationDate" type="date" label="Fecha Registro" />
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">
                {{ t('common.cancel') }}
            </UiButton>
            <UiButton type="submit" :disabled="!isValid || loading">
                {{ loading ? t('common.loading') : t('common.save') }}
            </UiButton>
        </div>
    </form>
</template>