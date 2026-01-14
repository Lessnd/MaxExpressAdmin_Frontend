<script setup lang="ts">
import { ref, nextTick } from 'vue'

const modelValue = defineModel<string[]>({ required: true })
const inputRefs = ref<HTMLInputElement[]>([])

/**
 * 1. AUTO-SELECCIÓN: Al enfocar, seleccionamos el texto.
 * Esto es clave: al estar seleccionado, escribir un número REEMPLAZA
 * automáticamente al anterior, evitando que se concatenen visualmente.
 */
const handleFocus = (event: Event) => {
    const target = event.target as HTMLInputElement
    target.select()
}

const handleInput = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement
    let val = target.value

    // --- A. MANEJO DE AUTOCOMPLETE / PEGADO (Longitud > 1) ---
    if (val.length > 1) {
        const numbers = val.replace(/\D/g, '').split('').slice(0, 6)
        
        if (numbers.length > 0) {
            numbers.forEach((num, i) => {
                // Solo llenamos si estamos dentro del rango 0-5
                if (index + i < 6) {
                    modelValue.value[index + i] = num
                }
            })

            // Calculamos dónde debe quedar el foco
            const nextIndex = Math.min(index + numbers.length, 5)
            nextTick(() => inputRefs.value[nextIndex]?.focus())
            
            // Forzamos visualmente el valor de ESTA casilla al número que le corresponde
            target.value = modelValue.value[index] || ''
            return
        }
    }

    // --- B. MANEJO DE ESCRITURA NORMAL (1 Dígito) ---

    // 1. Si no es un número, rechazamos el cambio inmediatamente
    if (!/^\d*$/.test(val)) {
        target.value = modelValue.value[index] || ''
        return
    }

    // 2. Si hay valor, aplicamos REEMPLAZO ESTRICTO
    if (val) {
        // Tomamos el ÚLTIMO caracter escrito (por si el navegador concatenó "12")
        const digit = val.slice(-1)
        
        // Actualizamos modelo y vista
        modelValue.value[index] = digit
        target.value = digit

        // Avanzamos el foco si no estamos en el último
        if (index < 5) {
            nextTick(() => inputRefs.value[index + 1]?.focus())
        }
    } else {
        // Si el usuario borró todo (ej: seleccionó y presionó suprimir)
        modelValue.value[index] = ''
    }
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
    // Navegación con flechas
    if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault()
        inputRefs.value[index - 1]?.focus()
        return
    }
    if (event.key === 'ArrowRight' && index < 5) {
        event.preventDefault()
        inputRefs.value[index + 1]?.focus()
        return
    }

    // Backspace: Si la casilla está vacía, retrocedemos y borramos la anterior
    if (event.key === 'Backspace') {
        if (!modelValue.value[index] && index > 0) {
            modelValue.value[index - 1] = ''
            nextTick(() => inputRefs.value[index - 1]?.focus())
        } else {
            // Si tiene valor, se borra el actual (comportamiento default),
            // pero aseguramos limpiar el modelo
            modelValue.value[index] = ''
        }
    }
}

// Mantenemos soporte explícito para pegar (Ctrl+V) en escritorio
const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault() // Evitamos el pegado default para control total
    const text = event.clipboardData?.getData('text') || ''
    const numbers = text.replace(/\D/g, '').split('').slice(0, 6)

    if (numbers.length > 0) {
        // Llenamos desde la posición actual (index)
        // Nota: handlePaste no recibe index directamente en el template event si no se pasa,
        // pero como los inputs son individuales, el evento ocurre en el focused.
        // Simplificamos asumiendo llenado desde el 0 o lógica inteligente:
        
        // Estrategia simple: Llenar desde el primer slot vacío o desde el 0
        // Para consistencia con OTPs, usualmente pegar llena todo el array
        numbers.forEach((num, i) => {
            if (i < 6) modelValue.value[i] = num
        })
        const nextIndex = Math.min(numbers.length - 1, 5)
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
            @focus="handleFocus" 
            @paste="handlePaste"
            class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm caret-transparent"
            :class="{ 'border-primary ring-1 ring-primary/20': modelValue[index] }" 
        />
    </div>
</template>