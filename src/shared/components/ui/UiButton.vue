<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@shared/utils/cn'

// Definimos las props con TypeScript estricto
interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    class?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    class: ''
})

// Mapeo de estilos base (Tailwind)
const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700 bg-transparent shadow-none',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
}

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10 p-2 flex items-center justify-center',
}

// Computamos las clases finales usando 'cn'
const buttonClass = computed(() => {
    return cn(
        // Clases base obligatorias (layout, focus, transition)
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
        variants[props.variant],
        sizes[props.size],
        props.class // Permite sobreescribir desde fuera si es necesario
    )
})
</script>

<template>
    <button :type="type" :class="buttonClass" :disabled="disabled">
        <slot />
    </button>
</template>