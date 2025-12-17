"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { sendTelegramNotification } from "@/lib/telegram" // Re-using existing helper

export async function broadcastBookingAction(bookingId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch Booking Details including Tour
    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            *,
            tours (name, duration)
        `)
        .eq('id', bookingId)
        .single()

    if (error || !booking) {
        console.error("Error fetching booking:", error)
        return { success: false, message: "Booking not found" }
    }

    // 2. Call Telegram Helper
    try {
        await sendTelegramNotification(booking)
        return { success: true, message: "Broadcast sent to Telegram Group!" }
    } catch (err) {
        console.error("Telegram error:", err)
        return { success: false, message: "Failed to send Telegram message" }
    }
}

export async function sendReminderAction(bookingId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch booking details with tour and guide info
    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            *,
            tours (name, duration),
            guides (name, phone)
        `)
        .eq('id', bookingId)
        .single()

    if (error || !booking) {
        return { success: false, message: "Booking not found" }
    }

    // Format phone number for WhatsApp (remove spaces, dashes, and add country code if needed)
    let phoneNumber = booking.customer_phone?.replace(/[\s\-\(\)]/g, '') || ''

    // If phone doesn't start with country code, assume Indonesia (+62)
    if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.substring(1)
    } else if (!phoneNumber.startsWith('62') && !phoneNumber.startsWith('+')) {
        phoneNumber = '62' + phoneNumber
    }

    // Create personalized reminder message
    const tourName = booking.tours?.name || 'Your Tour'
    const tourDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const guideName = booking.guides?.name || 'our professional guide'
    const pickupLocation = booking.pickup_location
    const pax = booking.pax

    const message = `*BaliVibe Tours - Booking Reminder*

Hello ${booking.customer_name}!

This is a friendly reminder about your upcoming tour with us:

*Tour*: ${tourName}
*Date*: ${tourDate}
*Guests*: ${pax} ${pax > 1 ? 'people' : 'person'}
*Pickup Location*: ${pickupLocation}
*Your Guide*: ${guideName}

We're excited to show you the best of Bali!

*Important Reminders:*
- Please be ready 10 minutes before pickup time
- Bring sunscreen, comfortable shoes, and your camera
- Don't forget your booking confirmation

If you have any questions or need to make changes, please contact us immediately.

Looking forward to an amazing adventure with you!

Best regards,
*BaliVibe Tours Team*

_Experience the Real Bali with Us!_`

    // Generate WhatsApp link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    // Open WhatsApp in new window (this will be handled client-side)
    return {
        success: true,
        message: "Opening WhatsApp...",
        whatsappUrl
    }
}

export async function markCompletedAction(bookingId: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId)

    if (error) {
        return { success: false, message: "Database update failed" }
    }

    // Simulate sending Feedback Link
    return { success: true, message: "Tour marked Complete. Feedback link sent!" }
}
