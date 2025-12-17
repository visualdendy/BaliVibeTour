import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { BookingForm } from "@/components/admin/booking-form"

export default async function NewBookingPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch active tours for the dropdown
    const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('name')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
            <BookingForm tours={tours || []} />
        </div>
    )
}
