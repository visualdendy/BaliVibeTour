'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"
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

export async function createBooking(prevState: any, formData: FormData) {
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
        return { error: 'Validation failed', fields: result.error.flatten().fieldErrors }
    }

    const { data: tourData } = await supabase
        .from('tours')
        .select('price')
        .eq('id', result.data.tourId)
        .single()

    const totalPrice = tourData ? tourData.price : 0 // Flat price per group or calc based on pax if needed. Assuming flat for now based on typical Bali driver model 

    const { data, error } = await supabase.from('bookings').insert({
        tour_id: result.data.tourId,
        booking_date: result.data.date,
        pax: result.data.pax,
        customer_name: result.data.name,
        customer_email: result.data.email || null,
        customer_phone: result.data.phone,
        pickup_location: result.data.pickupLocation,
        special_requests: result.data.specialRequests,
        total_price: totalPrice,
        status: 'pending' // Default status
    }).select().single()

    if (error) {
        console.error('Booking Error:', error)
        return { error: 'Failed to create booking. Please try again.' }
    }

    // Trigger Telegram Notification
    try {
        const { sendTelegramNotification } = await import('@/lib/telegram')
        await sendTelegramNotification(data)
    } catch (err) {
        console.error("Notification failed", err)
    }

    redirect(`/book/thank-you?id=${data.id}`)
}
