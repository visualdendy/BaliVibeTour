'use client'

import { Button } from "@/components/ui/button"
import { Edit, Trash, AlertTriangle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface GuideActionsProps {
    guideId: string
    guideName: string
}

export function GuideActions({ guideId, guideName }: GuideActionsProps) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false)
        setDeleting(true)

        try {
            const res = await fetch(`/api/guides/${guideId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    router.refresh()
                }, 2000)
            } else {
                toast.error("Failed to delete guide")
                setDeleting(false)
            }
        } catch (error) {
            toast.error("Error deleting guide")
            setDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false)
    }

    return (
        <>
            {/* Delete Confirmation Popup */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <AlertTriangle className="h-10 w-10 text-red-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Delete Guide?</h3>
                            <p className="text-lg text-gray-600">
                                Are you sure you want to delete <strong>{guideName}</strong>?
                            </p>
                            <p className="text-sm text-gray-500">This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 w-full pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Deleted!</h3>
                            <p className="text-lg text-gray-600">Guide deleted successfully</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/guides/${guideId}`}>
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleDeleteClick}
                    disabled={deleting}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </>
    )
}
