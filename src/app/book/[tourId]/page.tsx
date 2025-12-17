import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { BookingForm } from "@/components/booking-form"

export default async function BookingPage({ params }: { params: Promise<{ tourId: string }> }) {
    const { tourId } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: tour } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single()

    if (!tour) {
        notFound()
    }

    return <BookingForm tour={tour} />
}
