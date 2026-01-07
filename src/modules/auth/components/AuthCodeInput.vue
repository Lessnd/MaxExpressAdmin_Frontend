<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Usamos defineModel para doble enlace automático con el array de strings
const modelValue = defineModel<string[]>({ required: true })

const inputRefs = ref<HTMLInputElement[]>([])

const handleInput = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement
    const val = target.value

    // 1. DETECCIÓN DE PEGADO MÓVIL (AUTOFILL)
    // Si el valor tiene más de 1 caracter, el usuario pegó o autocompletó
    if (val.length > 1) {
        const numbers = val.replace(/\D/g, '').split('').slice(0, 6)
        
        if (numbers.length > 0) {
            // Distribuimos los números en las casillas
            numbers.forEach((num, i) => {
                // Empezamos a llenar desde el índice 0 para asegurar consistencia
                if (i < 6) modelValue.value[i] = num
            })

            // Enfocamos la casilla correspondiente al final
            const nextIndex = Math.min(numbers.length, 5)
            nextTick(() => inputRefs.value[nextIndex]?.focus())
            
            // Forzamos la actualización visual del input actual para que no se quede con el string largo
            target.value = numbers[index] || '' 
            
            // Importante: Detenemos la ejecución aquí
            return
        }
    }

    // 2. LÓGICA ESTÁNDAR (UN SOLO DÍGITO)
    
    // Si no es número, limpiar
    if (!/^\d*$/.test(val)) {
        target.value = ''
        return
    }

    // Guardamos solo el último caracter digitado
    modelValue.value[index] = val.slice(-1)

    // Auto-foco al siguiente
    if (val && index < modelValue.value.length - 1) {
        nextTick(() => {
            const nextInput = inputRefs.value[index + 1]
            if (nextInput) nextInput.focus()
        })
    }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Backspace' && !modelValue.value[index] && index > 0) {
        nextTick(() => {
            const prevInput = inputRefs.value[index - 1]
            if (prevInput) prevInput.focus()
        })
    }
}

// Mantenemos handlePaste para Desktop (Ctrl+V)
const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const text = event.clipboardData?.getData('text') || ''
    const numbers = text.replace(/\D/g, '').split('').slice(0, 6)

    if (numbers.length > 0) {
        numbers.forEach((num, i) => {
            if (i < 6) modelValue.value[i] = num
        })
        const nextIndex = Math.min(numbers.length, 5)
        nextTick(() => inputRefs.value[nextIndex]?.focus())
    }
}
</script>

<template>
    <div class="flex gap-2 sm:gap-3 justify-center w-full my-6">
        <input 
            v-for="(_, index) in 6" 
            :key="index"
            :ref="(el) => { if (el) inputRefs[index] = el as HTMLInputElement }" 
            type="text" 
            inputmode="numeric"
            maxlength="6" 
            :value="modelValue[index]" 
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)" 
            @paste="handlePaste"
            class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
            :class="{ 'border-primary ring-1 ring-primary/20': modelValue[index] }" 
        />
    </div>
</template>