import { GuideForm } from "@/components/admin/guide-form"

export default function NewGuidePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Add New Guide</h1>
            <GuideForm />
        </div>
    )
}
