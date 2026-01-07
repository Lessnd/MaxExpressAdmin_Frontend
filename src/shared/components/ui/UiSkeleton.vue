<script setup lang="ts">
import { cn } from '@shared/utils/cn'

defineProps<{
    class?: string
}>()
</script>

<template>
    <div :class="cn('animate-pulse rounded-md bg-gray-200/80', $props.class)" />
</template>