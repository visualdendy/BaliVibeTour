'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTour, updateTour } from "@/app/actions/tours"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2 } from "lucide-react"
import { Tour } from "@/types"

interface TourFormProps {
    initialData?: Tour
    isEditMode?: boolean
}

export function TourForm({ initialData, isEditMode = false }: TourFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        // Ensure checkbox value is explicitly captured if needed, though FormData usually handles 'on'
        // If uncheck, formData.get('is_active') is null. We need to normalize this in the server action 
        // OR we can manually append it. The server action seems to check `formData.get('is_active') === 'true'`.

        try {
            if (isEditMode && initialData) {
                await updateTour(initialData.id, formData)
                // toast.success("Tour updated successfully") - Removing toast to show modal instead
                setShowSuccess(true)
                return
            } else {
                await createTour(formData)
                // Show Success Modal instead of immediate redirect
                setShowSuccess(true)
                return // Exit early so we show modal instead of redirecting logic below
            }
        } catch (error) {
            toast.error(isEditMode ? "Failed to update tour" : "Failed to create tour")
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
                                {isEditMode ? "Tour Updated Successfully!" : "New Tour Successfully Added!"}
                            </p>
                        </div>
                        <Button
                            className="w-full text-lg h-12"
                            onClick={() => {
                                router.push('/admin/tours')
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
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tour Name</Label>
                                <Input id="name" name="name" required defaultValue={initialData?.name || ''} placeholder="e.g. Ubud Cultural Tour" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" name="slug" required defaultValue={initialData?.slug || ''} placeholder="e.g. ubud-cultural-tour" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" name="price" type="number" step="0.01" required defaultValue={initialData?.price || ''} placeholder="45.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" required defaultValue={initialData?.duration || ''} placeholder="e.g. 10 Hours" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity (Pax)</Label>
                                <Input id="capacity" name="capacity" type="number" required defaultValue={initialData?.capacity || ''} placeholder="4" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description_en">Description</Label>
                            <Textarea id="description_en" name="description_en" required defaultValue={initialData?.description_en || ''} className="min-h-[100px]" placeholder="Detailed description of the tour..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gallery_urls">Image URLs (Comma separated)</Label>
                            <Input id="gallery_urls" name="gallery_urls" defaultValue={initialData?.gallery_urls?.join(', ')} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
                            <p className="text-xs text-muted-foreground">Provide full URLs separated by commas.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />
                            <Button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full text-lg font-bold h-12 transition-all duration-300 ${isActive
                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}
                            >
                                {isActive ? "ACTIVE (Visible to customers)" : "NOT ACTIVE (Hidden from customers)"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Click the button above to toggle visibility.
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "saving..." : (isEditMode ? "Update Tour" : "Create Tour")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}
