'use client'

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteTour } from "@/app/actions/tours"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteTourButton({ id }: { id: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        setIsLoading(true)
        try {
            await deleteTour(id)
            toast.success("Tour deleted successfully")
            router.refresh()
            setShowConfirm(false)
        } catch (error) {
            toast.error("Failed to delete tour")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 animate-in zoom-in-50 duration-300">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                            <Trash className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-gray-900">Delete Tour?</h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete this tour? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowConfirm(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </>
    )
}
