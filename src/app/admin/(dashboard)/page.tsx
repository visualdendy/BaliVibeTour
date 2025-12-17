import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { BookingChart } from "@/components/dashboard/booking-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Activity, CalendarCheck } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch Bookings with Tour Info
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            tours (name)
        `)
        .order('created_at', { ascending: false })

    if (!bookings) return <div>Loading...</div>

    // --- Statistics Calculations ---

    // 1. Total Revenue (Confirmed Only)
    const confirmedBookings = bookings.filter(b => ['confirmed', 'completed', 'guide_assigned'].includes(b.status))
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

    // 2. Total Bookings Count
    const totalBookingsCount = bookings.length

    // 3. Pending/New Sales (Pending)
    const pendingBookings = bookings.filter(b => b.status === 'pending')
    const pendingCount = pendingBookings.length

    // 4. Bookings Today
    const today = new Date().toISOString().split('T')[0]
    const bookingsToday = bookings.filter(b => b.created_at.startsWith(today)).length

    // --- Chart Data Preparation (Last 7 Days) ---
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    type ChartData = {
        name: string
        bookings: number
        dateStr: string
    }
    const chartData: ChartData[] = []

    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayName = days[d.getDay()]
        chartData.push({ name: dayName, bookings: 0, dateStr: d.toISOString().split('T')[0] })
    }

    bookings.forEach(b => {
        const dateStr = b.created_at.split('T')[0]
        const dataPoint = chartData.find(d => d.dateStr === dateStr)
        if (dataPoint) {
            dataPoint.bookings += 1
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Realized Revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookingsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Needs attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Bookings Today
                        </CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookingsToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Started today
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <BookingChart data={chartData} />

                {/* Recent Bookings List */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {bookings.slice(0, 5).map((b) => (
                                <div key={b.id} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {b.customer_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {b.tours?.name}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">{formatPrice(b.total_price)}</div>
                                </div>
                            ))}
                            {bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
