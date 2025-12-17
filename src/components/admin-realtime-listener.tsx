"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminRealtimeListener() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to new bookings
        const channel = supabase
            .channel('admin-bookings-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookings',
                },
                (payload) => {
                    console.log('New booking received!', payload)

                    const newBooking = payload.new as any // Type assertion for simplicity

                    toast.success(`New Booking Received!`, {
                        description: `${newBooking.customer_name} booked a tour for $${newBooking.total_price}`,
                        duration: 8000,
                        action: {
                            label: "View",
                            onClick: () => router.push(`/admin/bookings`),
                        },
                    })

                    // Refresh data on the page
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    return null // This component doesn't render anything visible
}
