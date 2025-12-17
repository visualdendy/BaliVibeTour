'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportCustomersButtonProps {
    customers: any[]
}

export function ExportCustomersButton({ customers }: ExportCustomersButtonProps) {
    const handleExport = () => {
        // Create CSV content
        const headers = ['Client Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Last Seen']
        const rows = customers.map(c => [
            c.name || '',
            c.email || '',
            c.phone || '',
            c.bookings_count || 0,
            c.total_spent || 0,
            c.last_booking || ''
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
        link.setAttribute('download', `customers_report_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
        </Button>
    )
}
