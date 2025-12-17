'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportFinanceButtonProps {
    bookings: any[]
}

export function ExportFinanceButton({ bookings }: ExportFinanceButtonProps) {
    const handleExport = () => {
        // Create CSV content
        const headers = ['Customer', 'Tour/Product', 'Status', 'Date', 'Pax', 'Amount']
        const rows = bookings.map(b => [
            b.customer_name || '',
            b.tours?.name || '',
            b.status || '',
            new Date(b.created_at).toLocaleDateString(),
            b.pax || 0,
            b.total_price || 0
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
        link.setAttribute('download', `finance_report_${new Date().toISOString().split('T')[0]}.csv`)
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
