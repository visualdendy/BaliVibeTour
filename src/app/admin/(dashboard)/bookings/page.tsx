import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Eye, CheckCircle, Clock, Plus } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { ExportBookingsButton } from "@/components/admin/export-bookings-button"
// import { Badge } from "@/components/ui/badge" // If I had a badge component

export default async function AdminBookingsPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Join tours and guides
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
      *,
      tours (name),
      guides (name)
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/admin/bookings/new">
                            <Plus className="mr-2 h-4 w-4" /> New Booking
                        </Link>
                    </Button>
                    <ExportBookingsButton bookings={bookings || []} />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ref</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Tour</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Guide</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!bookings || bookings.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking: any) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{booking.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">{booking.customer_phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate" title={booking.tours?.name}>
                                        {booking.tours?.name}
                                    </TableCell>
                                    <TableCell>{formatDate(booking.booking_date)}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={booking.status} />
                                    </TableCell>
                                    <TableCell>
                                        {booking.guides?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/bookings/${booking.id}`}>
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        guide_assigned: "bg-purple-100 text-purple-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    }
    const label = status.replace('_', ' ').toUpperCase()
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
            {label}
        </span>
    )
}
