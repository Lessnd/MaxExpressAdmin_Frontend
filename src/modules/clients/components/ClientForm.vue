<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@shared/components/ui/UiInput.vue'
import UiButton from '@shared/components/ui/UiButton.vue'
import { useToast } from '@shared/composables/useToast' // <--- 1. Importar Toast

const props = defineProps<{
    initialData?: any
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { t } = useI18n()
const { addToast } = useToast() // <--- 2. Instanciar

// Helper fecha
const getYYYYMMDD = (isoString?: string) => {
    if (!isoString) return new Date().toISOString().split('T')[0]
    return new Date(isoString).toISOString().split('T')[0]
}

const form = ref({
    name: '',
    email: '',
    phone: '',
    city: '',
    registrationDate: getYYYYMMDD()
})

const initForm = () => {
    if (props.initialData) {
        form.value = {
            name: props.initialData.name,
            email: props.initialData.email,
            phone: props.initialData.phone,
            city: props.initialData.city,
            registrationDate: getYYYYMMDD(props.initialData.createdAt)
        }
    } else {
        form.value = {
            name: '', email: '', phone: '', city: '',
            registrationDate: getYYYYMMDD()
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

const handleSubmit = () => {
    // 3. VALIDACIÓN MANUAL CON FEEDBACK DE ERROR
    // Si el nombre o email están vacíos, mostramos el error visual
    if (!form.value.name.trim() || !form.value.email.trim()) {
        addToast('Error: Todos los campos obligatorios deben completarse', 'error')
        return // Detenemos la ejecución
    }

    // Validación extra de formato de correo (opcional)
    if (!form.value.email.includes('@')) {
        addToast('Error: El formato del correo electrónico es inválido', 'error')
        return
    }

    // Si pasa, preparamos el payload
    const dateValue = form.value.registrationDate || new Date().toISOString()
    const localDate = new Date(dateValue)

    const payload = {
        ...form.value,
        createdAt: localDate.toISOString()
    }

    emit('submit', payload)
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">

        <UiInput v-model="form.name" label="Nombre Completo *" placeholder="Ej: Juan Pérez" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput v-model="form.email" label="Correo *" type="email" placeholder="cliente@empresa.com" />
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

            <UiButton type="submit" :disabled="loading">
                {{ loading ? t('common.loading') : t('common.save') }}
            </UiButton>
        </div>
    </form>
</template>