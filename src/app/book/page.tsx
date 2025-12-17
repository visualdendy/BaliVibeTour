import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { BookingFormGeneric } from "@/components/booking-form-generic"

export default async function GenericBookingPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('price')

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Book Your Adventure</h1>
                    <p className="text-muted-foreground">Select a tour and start your journey.</p>
                </div>
                <BookingFormGeneric tours={tours || []} />
            </div>
        </div>
    )
}
