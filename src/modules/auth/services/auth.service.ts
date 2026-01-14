// 📁 src/modules/auth/services/auth.service.ts

export const authService = {
    async login(email: string, password: string): Promise<boolean> {
        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Simular validación (Acepta cualquier email, pero password debe ser "admin123")
        // En producción esto iría a tu API real
        if (email === 'david.alessandre04@gmail.com' && password === '123123') {
            return true
        }
        return false
    },

    async verifyCode(code: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simular código correcto "123456"
        return code === '123456'
    }
}