'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createGuide(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const name = formData.get('name') as string
    const photo_url = formData.get('photo_url') as string
    const languagesRaw = formData.get('languages') as string
    const telegram_username = formData.get('telegram_username') as string
    const phone = formData.get('phone') as string
    const rating = formData.get('rating') as string
    const isActive = formData.get('is_active') === 'true'

    // Process languages (comma separated string -> array)
    const languages = languagesRaw ? languagesRaw.split(',').map(s => s.trim()).filter(Boolean) : []

    const { error } = await supabase.from('guides').insert({
        name,
        photo_url,
        languages,
        telegram_username,
        phone,
        rating: rating ? parseFloat(rating) : 5.0,
        is_active: isActive
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/guides')
}

export async function updateGuide(id: string, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const name = formData.get('name') as string
    const photo_url = formData.get('photo_url') as string
    const languagesRaw = formData.get('languages') as string
    const telegram_username = formData.get('telegram_username') as string
    const phone = formData.get('phone') as string
    const rating = formData.get('rating') as string
    const isActive = formData.get('is_active') === 'true'

    const languages = languagesRaw ? languagesRaw.split(',').map(s => s.trim()).filter(Boolean) : []

    const { error } = await supabase.from('guides').update({
        name,
        photo_url,
        languages,
        telegram_username,
        phone,
        rating: rating ? parseFloat(rating) : 5.0,
        is_active: isActive
    }).eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/guides')
    revalidatePath(`/admin/guides/${id}`)
}
