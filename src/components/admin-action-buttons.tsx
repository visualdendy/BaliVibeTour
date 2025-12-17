"use client"

import { Button } from "@/components/ui/button"
import { Send, MessageSquare, CheckCircle, Smartphone } from "lucide-react"
import { broadcastBookingAction, sendReminderAction, markCompletedAction } from "@/app/actions/admin-logic"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
    bookingId: string
    status: string
    hasGuide: boolean
}

export function AdminActionButtons({ bookingId, status, hasGuide }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleBroadcast = async () => {
        setLoading('broadcast')
        try {
            const res = await broadcastBookingAction(bookingId)
            if (res.success) toast.success(res.message)
            else toast.error(res.message)
        } catch {
            toast.error("Failed to broadcast")
        } finally {
            setLoading(null)
            router.refresh()
        }
    }

    const handleReminder = async () => {
        setLoading('reminder')
        try {
            const res = await sendReminderAction(bookingId)
            if (res.success) {
                toast.success(res.message)
                // Open WhatsApp if URL is provided
                if (res.whatsappUrl) {
                    window.open(res.whatsappUrl, '_blank')
                }
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Failed to send reminder")
        } finally {
            setLoading(null)
        }
    }

    const handleComplete = async () => {
        setLoading('complete')
        try {
            const res = await markCompletedAction(bookingId)
            if (res.success) toast.success(res.message)
            else toast.error(res.message)
        } finally {
            setLoading(null)
            router.refresh()
        }
    }

    if (status === 'completed') {
        return (
            <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Tour Completed</span>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* 1. Broadcast Button (Only if no guide) */}
            {!hasGuide && (
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleBroadcast}
                    disabled={!!loading}
                >
                    {loading === 'broadcast' ? "Sending..." : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Broadcast to Telegram
                        </>
                    )}
                </Button>
            )}

            {/* 2. Reminder Button (Only if has guide) */}
            {hasGuide && (
                <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={handleReminder}
                    disabled={!!loading}
                >
                    {loading === 'reminder' ? "Sending..." : (
                        <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Reminder to Customer
                        </>
                    )}
                </Button>
            )}

            {/* 3. Mark Complete (If confirmed/assigned) */}
            {hasGuide && (
                <Button
                    variant="ghost"
                    className="w-full text-green-700 hover:text-green-800 hover:bg-green-50"
                    onClick={handleComplete}
                    disabled={!!loading}
                >
                    {loading === 'complete' ? "Updating..." : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Completed
                        </>
                    )}
                </Button>
            )}
        </div>
    )
}
