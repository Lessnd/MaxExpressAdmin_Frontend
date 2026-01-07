<script setup lang="ts">
import WelcomeCard from '../components/WelcomeCard.vue'
import QuickActions from '../components/QuickActions.vue'
import { QUICK_ACTIONS } from '../constants/menu'

// En una app real, esto vendría de un store de Auth (Pinia)
const userName = 'Administrador'
</script>

<template>
    <div class="space-y-8 animate-fade-in-up">
        <WelcomeCard :user-name="userName" />

        <QuickActions :actions="QUICK_ACTIONS" />
    </div>
</template>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>