'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, Users, Calendar, Banknote, Settings, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Map, label: "Tours", href: "/admin/tours" },
    { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
    { icon: Users, label: "Guides", href: "/admin/guides" },
    { icon: Users, label: "Customers", href: "/admin/customers" }, // Re-using Users icon for now
    { icon: Banknote, label: "Finance", href: "/admin/finance" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r bg-slate-950 text-slate-100 hidden md:flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider">BALIVIBE ADMIN</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={async () => {
                        await logout()
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-900 w-full rounded-md transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
