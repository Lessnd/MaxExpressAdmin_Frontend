import type { Component } from 'vue'

export interface Protocol {
    title: string
    text: string
    icon: Component
}

export interface Rule {
    text: string
}

export interface Fee {
    category: string
    price: string
}

export interface Contact {
    area: string
    name: string
    phone: string
}