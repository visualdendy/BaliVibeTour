'use client'

import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
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

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${guideName}?`)) return

        setDeleting(true)
        try {
            const res = await fetch(`/api/guides/${guideId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success("Guide deleted successfully!")
                router.refresh()
            } else {
                toast.error("Failed to delete guide")
            }
        } catch (error) {
            toast.error("Error deleting guide")
        } finally {
            setDeleting(false)
        }
    }

    return (
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
                onClick={handleDelete}
                disabled={deleting}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}
