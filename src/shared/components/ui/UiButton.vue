<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/utils/cn' // Asegúrate de que la ruta sea correcta según tu alias

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

const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700 bg-transparent shadow-none border border-transparent',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
}

// 🔥 CAMBIO CRÍTICO: Tamaños Responsivos (Mobile First)
// En móvil (default) son un poco más pequeños. En 'sm:' (tablets+) crecen.
const sizes = {
    // Pequeño: ideal para tablas o acciones secundarias
    sm: 'h-7 sm:h-8 px-2 sm:px-3 text-xs',
    
    // Medio (Default): Reducimos altura a h-9 y padding en móvil
    md: 'h-9 sm:h-10 px-3 sm:px-4 py-2 text-sm',
    
    // Grande: Para llamadas a la acción principales
    lg: 'h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base',
    
    // Icono: Cuadrado perfecto ajustado
    icon: 'h-9 w-9 sm:h-10 sm:w-10 p-2 flex items-center justify-center shrink-0',
}

const buttonClass = computed(() => {
    return cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        variants[props.variant],
        sizes[props.size],
        props.class
    )
})
</script>

<template>
    <button :type="type" :class="buttonClass" :disabled="disabled">
        <slot />
    </button>
</template>