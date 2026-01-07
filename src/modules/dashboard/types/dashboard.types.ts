import type { Component } from 'vue'

export interface DashboardAction {
    id?: number
    label: string
    icon: Component
    route: string
}