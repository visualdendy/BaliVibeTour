import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Need component or fallback
import { CheckCircle2, Clock, MapPin, Send, MessageSquare, AlertCircle } from "lucide-react"
import { formatDate, formatPrice } from "@/lib/utils"
import Link from "next/link"
import { AdminActionButtons } from "@/components/admin-action-buttons"

// Need a client component for buttons to use server actions with interactivity
// Creating that inline for now or separating? Separating is cleaner.

export default async function AdminBookingDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: booking } = await supabase
        .from('bookings')
        .select(`
            *,
            tours (name, duration, price),
            guides (name, phone, photo_url, telegram_username)
        `)
        .eq('id', params.id)
        .single()

    if (!booking) return notFound()

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/bookings" className="text-sm text-muted-foreground hover:underline mb-2 block">
                        &larr; Back to Bookings
                    </Link>
                    <h1 className="text-3xl font-bold">Booking #{booking.id.slice(0, 6)}</h1>
                    <p className="text-muted-foreground">Created on {formatDate(booking.created_at)}</p>
                </div>
                <div className="flex gap-2">
                    {/* Status Badge */}
                    <div className="px-3 py-1 rounded bg-slate-900 text-white font-medium uppercase text-sm">
                        {booking.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tour Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-lg">{booking.tours?.name}</h3>
                                <span className="font-mono text-lg">{formatPrice(booking.total_price)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Date</span>
                                    <span className="font-medium">{formatDate(booking.booking_date)}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Pax</span>
                                    <span className="font-medium">{booking.pax} People</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Duration</span>
                                    <span className="font-medium">{booking.tours?.duration}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Pickup</span>
                                    <span className="font-medium">{booking.pickup_location}</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="text-muted-foreground block text-xs uppercase tracking-wide">Special Requests</span>
                                <p className="text-sm mt-1">{booking.special_requests || "None"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <span className="block text-xs text-muted-foreground">Name</span>
                                    <span className="font-medium">{booking.customer_name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">Email</span>
                                    <span className="font-medium">{booking.customer_email}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">Phone</span>
                                    <span className="font-medium">{booking.customer_phone}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions & Guide */}
                <div className="space-y-6">

                    {/* CONTROL CENTER */}
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-indigo-600" />
                                Actions
                            </CardTitle>
                            <CardDescription>Control Center</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminActionButtons
                                bookingId={booking.id}
                                status={booking.status}
                                hasGuide={!!booking.assigned_guide_id}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Guide</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.guides ? (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={booking.guides.photo_url || "/avatar-placeholder.png"}
                                        alt={booking.guides.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{booking.guides.name}</p>
                                        <p className="text-xs text-muted-foreground">{booking.guides.phone}</p>
                                        {booking.guides.telegram_username && (
                                            <p className="text-xs text-blue-500">@{booking.guides.telegram_username}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-lg">
                                    No guide assigned yet.
                                    <br />
                                    Use "Broadcast" to find one.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
