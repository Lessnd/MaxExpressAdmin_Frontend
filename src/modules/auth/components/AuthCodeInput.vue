<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Usamos defineModel para doble enlace automático con el array de strings
const modelValue = defineModel<string[]>({ required: true })

// Referencias a los inputs HTML
const inputRefs = ref<HTMLInputElement[]>([])

const handleInput = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement
    const val = target.value

    // Solo permitir números
    if (!/^\d*$/.test(val)) {
        target.value = ''
        return
    }

    // Actualizamos el modelo con el último caracter ingresado
    modelValue.value[index] = val.slice(-1)

    // LOGICA DE AUTO-FOCO
    // Ahora index es base 0 (0-5). 
    // Si estoy en la casilla 4 (quinta visualmente): 4 < 5 es TRUE -> Salta a la 5 (sexta visualmente)
    if (val && index < modelValue.value.length - 1) {
        nextTick(() => {
            const nextInput = inputRefs.value[index + 1]
            if (nextInput) {
                nextInput.focus()
            }
        })
    }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
    // Si presiona borrar, el campo está vacío, y no es el primero (index 0)
    if (event.key === 'Backspace' && !modelValue.value[index] && index > 0) {
        nextTick(() => {
            const prevInput = inputRefs.value[index - 1]
            if (prevInput) prevInput.focus()
        })
    }
}

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
            maxlength="1" 
            :value="modelValue[index]" 
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)" 
            @paste="handlePaste"
            class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
            :class="{ 'border-primary ring-1 ring-primary/20': modelValue[index] }" 
        />
    </div>
</template>