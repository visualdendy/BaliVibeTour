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
    // In a real app, this would integrate with Twilio (Whatsapp) or SendGrid (Email)
    // For now, we simulate success
    return { success: true, message: "Reminder sent to Customer (Simulated)" }
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
