'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBookingAdmin } from "@/app/actions/bookings-admin"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Tour } from "@/types"
import { formatPrice } from "@/lib/utils"

interface BookingFormProps {
    tours: Tour[]
}

export function BookingForm({ tours }: BookingFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [selectedTourId, setSelectedTourId] = useState<string>("")

    const selectedTour = tours.find(t => t.id === selectedTourId)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            await createBookingAdmin(formData)
            setShowSuccess(true)
        } catch (error) {
            toast.error("Failed to create booking")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                            <p className="text-lg text-gray-600">
                                Booking Created Successfully!
                            </p>
                        </div>
                        <Button
                            className="w-full text-lg h-12"
                            onClick={() => {
                                router.push('/admin/bookings')
                                router.refresh()
                            }}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tourId">Select Tour</Label>
                            <Select name="tourId" onValueChange={setSelectedTourId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a tour..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {tours.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name} ({formatPrice(t.price)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedTour && (
                            <div className="p-4 bg-slate-50 border rounded-lg text-sm space-y-1">
                                <p><strong>Duration:</strong> {selectedTour.duration}</p>
                                <p><strong>Max Capacity:</strong> {selectedTour.capacity} Pax</p>
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date">Tour Date</Label>
                                <Input type="date" id="date" name="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pax">Number of Guests</Label>
                                <Input type="number" id="pax" name="pax" min="1" max={selectedTour?.capacity || 20} defaultValue="2" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Customer Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" name="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone / WhatsApp</Label>
                                <Input id="phone" name="phone" placeholder="+62..." required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickupLocation">Pickup Location</Label>
                            <Textarea id="pickupLocation" name="pickupLocation" placeholder="Hotel Name, Address..." required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialRequests">Special Requests / Notes</Label>
                            <Textarea id="specialRequests" name="specialRequests" placeholder="Vegetarian, Car Seat, etc..." />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "saving..." : "Create Booking"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}
