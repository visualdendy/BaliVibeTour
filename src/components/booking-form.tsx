'use client'

import { createBooking } from "@/app/actions/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useFormStatus } from "react-dom"
import { useActionState } from "react" // React 19
import { Tour } from "@/types"
import { formatPrice } from "@/lib/utils"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Confirming..." : "Confirm Booking"}
        </Button>
    )
}

const initialState = {
    error: '',
    fields: {} as Record<string, string[]>
}

export function BookingForm({ tour }: { tour: Tour }) {
    // @ts-ignore - straightforward useActionState usage, types might lag
    const [state, formAction] = useActionState(createBooking, initialState)

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Book Your Tour</h1>
                <p className="text-muted-foreground">
                    {tour.name}
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="tourId" value={tour.id} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date">Tour Date</Label>
                                <Input type="date" id="date" name="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pax">Number of Guests</Label>
                                <Input type="number" id="pax" name="pax" min="1" max={tour.capacity || 10} defaultValue="2" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email (Optional)</Label>
                                <Input type="email" id="email" name="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">WhatsApp / Phone</Label>
                                <Input type="tel" id="phone" name="phone" placeholder="+62..." required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickupLocation">Pickup Location (Hotel/Villa)</Label>
                            <Textarea id="pickupLocation" name="pickupLocation" placeholder="Hotel name, address..." required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialRequests">Special Requests</Label>
                            <Textarea id="specialRequests" name="specialRequests" placeholder="Vegetarian meal, car seat, etc..." />
                        </div>

                        {state?.error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                {state.error}
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-medium">Total Price (approx)</span>
                                <span className="text-xl font-bold text-primary">{formatPrice(tour.price)}</span>
                            </div>
                            <SubmitButton />
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Payment is collected by the driver (Cash/Transfer).
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
