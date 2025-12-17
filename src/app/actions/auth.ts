'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')

    if (username === 'admin' && password === 'admin2025!') {
        const cookieStore = await cookies()

        // Set cookie manually 
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        redirect('/admin')
    }

    return { error: 'Invalid credentials' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/admin/login')
}
