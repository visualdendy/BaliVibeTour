import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // We need to check if badge exists or use standard UI
import { CheckCircle2, MapPin, Calendar, Users, Phone } from "lucide-react"
import { formatDate, formatPrice } from "@/lib/utils"
// Assuming Badge component might be missing, using standard span styling fallback if needed.
// But let's assume standard shadcn badge or just div.

export default async function BookingConfirmedPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: booking } = await supabase
        .from('bookings')
        .select(`
            *,
            tours (name, duration, gallery_urls),
            guides (name, photo_url, phone, rating)
        `)
        .eq('id', params.id)
        .single()

    if (!booking) return notFound()

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        guide_assigned: "bg-green-100 text-green-800",
        completed: "bg-gray-100 text-gray-800",
        cancelled: "bg-red-100 text-red-800"
    } // Simple map

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
                    <p className="text-slate-500">Please save this page for your records.</p>
                </div>

                <Card className="shadow-lg border-slate-200">
                    <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">ref: {booking.id.slice(0, 8)}</CardTitle>
                                <CardDescription className="text-slate-300 mt-1">
                                    {booking.tours?.name}
                                </CardDescription>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-slate-900`}>
                                {booking.status.replace('_', ' ')}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 space-y-8">

                        {/* Trip Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 border-b pb-2">Trip Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{formatDate(booking.booking_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>{booking.pax} Guests</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                                        <span>Pickup: <span className="font-medium text-slate-900">{booking.pickup_location || "Not specified"}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 border-b pb-2">Your Guide</h3>
                                {booking.guides ? (
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={booking.guides.photo_url || "/avatar-placeholder.png"}
                                            alt={booking.guides.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                                        />
                                        <div>
                                            <p className="font-bold text-slate-900">{booking.guides.name}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                ★ {booking.guides.rating} Rating
                                            </p>
                                            <div className="mt-1 flex gap-2">
                                                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">English</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                                        We are currently assigning the best guide for you. You will be notified shortly!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-2 text-sm">Contact Info Provided</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-slate-600">
                                <p>{booking.customer_name}</p>
                                <p>{booking.customer_email}</p>
                                <p>{booking.customer_phone}</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-400">
                    Need help? Contact our support at +62 812 3456 7890
                </p>
            </div>
        </div>
    )
}
