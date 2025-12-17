import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminFinancePage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch all bookings to aggregate on the server
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            total_price, 
            status, 
            created_at, 
            pax, 
            customer_name, 
            tours (name)
        `)
        .order('created_at', { ascending: false })
        .returns<any[]>() // Bypass strict typing for the join to avoid 'tours' array vs object confusion

    if (!bookings) return <div>No data available.</div>

    // 1. Calculate Metrics
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

    const paidBookings = bookings.filter(b => ['completed', 'guide_assigned', 'confirmed'].includes(b.status))
    const pendingBookings = bookings.filter(b => b.status === 'pending')

    const realizedRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const potentialRevenue = pendingBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

    const totalPax = bookings.reduce((sum, b) => sum + (b.pax || 0), 0)
    const averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Finance & Analytics</h1>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Realized Revenue</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatPrice(realizedRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Confirmed/Completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pipeline (Pending)</CardTitle>
                        <CreditCard className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{formatPrice(potentialRevenue)}</div>
                        <p className="text-xs text-muted-foreground">{pendingBookings.length} bookings pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Ticket Size</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
                        <p className="text-xs text-muted-foreground">{totalPax} total guests served</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.slice(0, 10).map((b, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                                    <TableCell>{b.tours?.name}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase 
                                            ${b.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {b.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(b.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{formatPrice(b.total_price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
