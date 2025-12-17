import { TourForm } from "@/components/admin/tour-form"
import { getTourById } from "@/app/actions/tours"
import { notFound } from "next/navigation"

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const tour = await getTourById(id)

    if (!tour) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Tour</h1>
            </div>
            <TourForm initialData={tour} isEditMode={true} />
        </div>
    )
}
