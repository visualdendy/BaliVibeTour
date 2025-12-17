'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Tour } from '@/types'

export async function getTours() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)

    if (error) {
        console.error('Error fetching tours:', error)
        return []
    }

    return data as Tour[]
}

export async function getTourBySlug(slug: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) return null
    return data as Tour
}

export async function createTour(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const rawData = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        price: parseFloat(formData.get('price') as string),
        duration: formData.get('duration') as string,
        capacity: parseInt(formData.get('capacity') as string),
        description_en: formData.get('description_en') as string,
        is_active: formData.get('is_active') === 'true',
        gallery_urls: (formData.get('gallery_urls') as string).split(',').map(url => url.trim()).filter(url => url.length > 0)
    }

    const { error } = await supabase
        .from('tours')
        .insert(rawData)

    if (error) {
        throw new Error(error.message)
    }

    return { success: true }
}

export async function updateTour(id: string, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const rawData = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        price: parseFloat(formData.get('price') as string),
        duration: formData.get('duration') as string,
        capacity: parseInt(formData.get('capacity') as string),
        description_en: formData.get('description_en') as string,
        is_active: formData.get('is_active') === 'true',
        gallery_urls: (formData.get('gallery_urls') as string).split(',').map(url => url.trim()).filter(url => url.length > 0)
    }

    const { error } = await supabase
        .from('tours')
        .update(rawData)
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return { success: true }
}

export async function deleteTour(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return { success: true }
}

export async function getTourById(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return null
    return data as Tour
}
