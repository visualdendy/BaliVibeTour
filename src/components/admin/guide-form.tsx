'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createGuide, updateGuide } from "@/app/actions/guides"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Guide } from "@/types"

interface GuideFormProps {
    initialData?: Guide
    isEditMode?: boolean
}

export function GuideForm({ initialData, isEditMode = false }: GuideFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            if (isEditMode && initialData) {
                await updateGuide(initialData.id, formData)
                setShowSuccess(true)
                return
            } else {
                await createGuide(formData)
                setShowSuccess(true)
                return
            }
        } catch (error) {
            toast.error(isEditMode ? "Failed to update guide" : "Failed to create guide")
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
                                {isEditMode ? "Guide Updated Successfully!" : "New Guide Successfully Added!"}
                            </p>
                        </div>
                        <Button
                            className="w-full text-lg h-12"
                            onClick={() => {
                                router.push('/admin/guides')
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
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" required defaultValue={initialData?.name} placeholder="e.g. Made Suka" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" defaultValue={initialData?.phone || ''} placeholder="e.g. +62 812 3456 7890" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo_url">Photo URL</Label>
                            <Input id="photo_url" name="photo_url" defaultValue={initialData?.photo_url || ''} placeholder="https://example.com/photo.jpg" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="telegram_username">Telegram Username</Label>
                                <Input id="telegram_username" name="telegram_username" defaultValue={initialData?.telegram_username || ''} placeholder="Without @" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (0-5)</Label>
                                <Input id="rating" name="rating" type="number" step="0.1" max="5" min="0" defaultValue={initialData?.rating ?? 5.0} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="languages">Languages (Comma separated)</Label>
                            <Input id="languages" name="languages" defaultValue={initialData?.languages?.join(', ')} placeholder="e.g. English, Japanese, French" />
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
                                {isActive ? "ACTIVE (Can receive bookings)" : "NOT ACTIVE (Cannot receive bookings)"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Click the button above to toggle active status.
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "saving..." : (isEditMode ? "Update Guide" : "Create Guide")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}
