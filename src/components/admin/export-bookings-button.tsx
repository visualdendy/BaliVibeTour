'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportBookingsButtonProps {
    bookings: any[]
}

export function ExportBookingsButton({ bookings }: ExportBookingsButtonProps) {
    const handleExport = () => {
        // Create CSV content
        const headers = ['Ref', 'Customer Name', 'Email', 'Phone', 'Tour', 'Date', 'Pax', 'Pickup Location', 'Status', 'Guide', 'Total Price', 'Special Requests']
        const rows = bookings.map(b => [
            b.id.slice(0, 8),
            b.customer_name || '',
            b.customer_email || '',
            b.customer_phone || '',
            b.tours?.name || '',
            b.booking_date || '',
            b.pax || '',
            b.pickup_location || '',
            b.status || '',
            b.guides?.name || 'Unassigned',
            b.total_price || '',
            b.special_requests || ''
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        // Create download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    )
}
