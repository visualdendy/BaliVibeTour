import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { GuideForm } from "@/components/admin/guide-form"

export default async function EditGuidePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: guide } = await supabase
        .from('guides')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!guide) return notFound()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Edit Guide</h1>
            <GuideForm initialData={guide} />
        </div>
    )
}
