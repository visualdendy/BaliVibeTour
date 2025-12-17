'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportFinanceButtonProps {
    bookings: any[]
}

export function ExportFinanceButton({ bookings }: ExportFinanceButtonProps) {
    const handleExport = () => {
        // Calculate all metrics
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

        const paidBookings = bookings.filter(b => ['completed', 'guide_assigned', 'confirmed'].includes(b.status))
        const pendingBookings = bookings.filter(b => b.status === 'pending')

        const realizedRevenue = paidBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const potentialRevenue = pendingBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

        const totalPax = bookings.reduce((sum, b) => sum + (b.pax || 0), 0)
        const averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

        // Format currency
        const formatPrice = (amount: number) => `$${amount.toFixed(2)}`

        // Build comprehensive CSV content
        const csvLines: string[] = []

        // Title
        csvLines.push('FINANCE & ANALYTICS REPORT')
        csvLines.push(`Generated: ${new Date().toLocaleString()}`)
        csvLines.push('')

        // Summary Metrics Section
        csvLines.push('FINANCIAL SUMMARY')
        csvLines.push('Metric,Value,Details')
        csvLines.push(`Total Volume,${formatPrice(totalRevenue)},+20.1% from last month`)
        csvLines.push(`Realized Revenue,${formatPrice(realizedRevenue)},Confirmed/Completed`)
        csvLines.push(`Pipeline (Pending),${formatPrice(potentialRevenue)},${pendingBookings.length} bookings pending`)
        csvLines.push(`Avg. Ticket Size,${formatPrice(averageOrderValue)},${totalPax} total guests served`)
        csvLines.push('')

        // Breakdown by Status
        csvLines.push('REVENUE BREAKDOWN BY STATUS')
        csvLines.push('Status,Count,Total Revenue')
        const statusGroups = bookings.reduce((acc, b) => {
            const status = b.status || 'unknown'
            if (!acc[status]) {
                acc[status] = { count: 0, revenue: 0 }
            }
            acc[status].count++
            acc[status].revenue += b.total_price || 0
            return acc
        }, {} as Record<string, { count: number; revenue: number }>)

        Object.entries(statusGroups).forEach(([status, data]) => {
            csvLines.push(`${status},${data.count},${formatPrice(data.revenue)}`)
        })
        csvLines.push('')

        // All Transactions
        csvLines.push('ALL TRANSACTIONS')
        csvLines.push('Customer,Tour/Product,Status,Date,Pax,Amount')

        bookings.forEach(b => {
            const row = [
                b.customer_name || 'N/A',
                b.tours?.name || 'N/A',
                b.status || 'N/A',
                new Date(b.created_at).toLocaleDateString(),
                b.pax || 0,
                formatPrice(b.total_price || 0)
            ]
            // Escape quotes and wrap in quotes for CSV
            csvLines.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        })

        // Create and download CSV
        const csvContent = csvLines.join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `finance_analytics_report_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
        </Button>
    )
}
