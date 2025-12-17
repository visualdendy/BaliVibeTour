'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BookingChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Weekly Booking Trends</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-sm font-medium" />
                        <YAxis className="text-sm font-medium" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
