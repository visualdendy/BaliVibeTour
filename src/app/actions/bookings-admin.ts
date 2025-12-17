'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BookingSchema = z.object({
    tourId: z.string(),
    date: z.string(),
    pax: z.coerce.number().min(1),
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(6),
    pickupLocation: z.string().min(3),
    specialRequests: z.string().optional()
})

export async function createBookingAdmin(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const rawData = {
        tourId: formData.get('tourId'),
        date: formData.get('date'),
        pax: formData.get('pax'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        pickupLocation: formData.get('pickupLocation'),
        specialRequests: formData.get('specialRequests'),
    }

    const result = BookingSchema.safeParse(rawData)

    if (!result.success) {
        throw new Error("Validation failed: " + JSON.stringify(result.error.flatten().fieldErrors))
    }

    // Fetch Tour Price
    const { data: tourData } = await supabase
        .from('tours')
        .select('price')
        .eq('id', result.data.tourId)
        .single()

    const totalPrice = tourData ? tourData.price : 0

    const { error } = await supabase.from('bookings').insert({
        tour_id: result.data.tourId,
        booking_date: result.data.date,
        pax: result.data.pax,
        customer_name: result.data.name,
        customer_email: result.data.email || null,
        customer_phone: result.data.phone,
        pickup_location: result.data.pickupLocation,
        special_requests: result.data.specialRequests,
        total_price: totalPrice,
        status: 'pending' // Admin created bookings start as pending too, or maybe confirmed? Let's stick to pending for flow consistency
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/bookings')
}
