import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { ExportCustomersButton } from "@/components/admin/export-customers-button"

export default async function AdminCustomersPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // We can treat unique emails in bookings as customers since we don't force auth for booking
    // Or fetch from 'bookings' distinct on email
    // Supabase distinct is tricky with complex queries, but let's try a simple approach:
    // Get all bookings, process in JS (for small scale). In real app, use a View or SQL function.

    const { data: bookings } = await supabase
        .from('bookings')
        .select('customer_name, customer_email, customer_phone, created_at, total_price')
        .order('created_at', { ascending: false })

    // Deduplicate by email
    const customersMap = new Map()

    bookings?.forEach(b => {
        const key = b.customer_email || b.customer_phone || b.customer_name // Fallback key
        if (!customersMap.has(key)) {
            customersMap.set(key, {
                name: b.customer_name,
                email: b.customer_email,
                phone: b.customer_phone,
                last_booking: b.created_at,
                total_spent: 0,
                bookings_count: 0
            })
        }
        const customer = customersMap.get(key)
        customer.total_spent += (b.total_price || 0)
        customer.bookings_count += 1
    })

    const customers = Array.from(customersMap.values())

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Customers</h1>
                <ExportCustomersButton customers={customers} />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Total Bookings</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Last Seen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((c, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>{c.email}</span>
                                            <span className="text-muted-foreground">{c.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{c.bookings_count}</TableCell>
                                    <TableCell>${c.total_spent}</TableCell>
                                    <TableCell>{formatDate(c.last_booking)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
