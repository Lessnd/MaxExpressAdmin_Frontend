<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import UiInput from '@/shared/components/ui/UiInput.vue'
import UiButton from '@/shared/components/ui/UiButton.vue'
import { useToast } from '@/shared/composables/useToast'
import type { CreateEmployeeDTO, Employee } from '../types/employee.types'

const props = defineProps<{
    initialData?: Employee | null
    loading?: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])
const { addToast } = useToast()

// Estado del formulario
const form = ref<CreateEmployeeDTO>({
    nombre_completo: '',
    email: '',
    telefono: '',
    dui: '',
    rol: 'Empleado', // Valor por defecto
    password: '' // Solo relevante en creación
})

const isEditMode = ref(false)

const initForm = () => {
    if (props.initialData) {
        isEditMode.value = true
        form.value = {
            nombre_completo: props.initialData.nombre_completo,
            email: props.initialData.email,
            telefono: props.initialData.telefono,
            dui: props.initialData.dui,
            rol: props.initialData.rol,
            password: '' // No rellenamos password al editar por seguridad
        }
    } else {
        isEditMode.value = false
        form.value = {
            nombre_completo: '',
            email: '',
            telefono: '',
            dui: '',
            rol: 'Empleado',
            password: ''
        }
    }
}

onMounted(initForm)
watch(() => props.initialData, initForm)

const handleSubmit = () => {
    // 1. Validación de campos obligatorios
    if (!form.value.nombre_completo.trim() || !form.value.email.trim() || !form.value.dui.trim()) {
        addToast('Error: Nombre, Email y DUI son obligatorios', 'error')
        return
    }

    // 2. Validación de formato Email
    if (!form.value.email.includes('@')) {
        addToast('Error: El formato del correo electrónico es inválido', 'error')
        return
    }

    // 3. Validación Password (Solo si es creación)
    if (!isEditMode.value && (!form.value.password || form.value.password.length < 6)) {
        addToast('Error: La contraseña es obligatoria y debe tener al menos 6 caracteres', 'error')
        return
    }

    // Emitimos el payload limpio
    emit('submit', { ...form.value })
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <UiInput 
            v-model="form.nombre_completo" 
            label="Nombre Completo *" 
            placeholder="Ej: David Rivera" 
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput 
                v-model="form.email" 
                label="Correo Electrónico *" 
                type="email" 
                placeholder="empleado@empresa.com" 
            />
            <UiInput 
                v-model="form.telefono" 
                label="Teléfono" 
                placeholder="Ej: 7000-0000" 
            />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UiInput 
                v-model="form.dui" 
                label="DUI *" 
                placeholder="00000000-0" 
            />
            
            <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Rol *</label>
                <select 
                    v-model="form.rol"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                >
                    <option value="Empleado">Empleado</option>
                    <option value="Conductor">Conductor</option>
                    <option value="Admin">Administrador</option>
                </select>
            </div>
        </div>

        <div v-if="!isEditMode">
            <UiInput 
                v-model="form.password" 
                type="password" 
                label="Contraseña Inicial *" 
                placeholder="********" 
            />
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres.</p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-4">
            <UiButton type="button" variant="ghost" @click="$emit('cancel')">
                Cancelar
            </UiButton>

            <UiButton type="submit" :disabled="loading">
                {{ loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear Empleado') }}
            </UiButton>
        </div>
    </form>
</template>