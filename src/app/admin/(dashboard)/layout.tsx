import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminRealtimeListener } from "@/components/admin-realtime-listener"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminRealtimeListener />
            <AdminSidebar />
            <main className="md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
