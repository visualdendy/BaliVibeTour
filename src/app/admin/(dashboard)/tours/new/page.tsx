import { TourForm } from "@/components/admin/tour-form"

export default function NewTourPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Add New Tour</h1>
            </div>
            <TourForm />
        </div>
    )
}
