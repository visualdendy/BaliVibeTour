import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Plus, Edit, Trash, MessageSquare } from "lucide-react"

export default async function AdminGuidesPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: guides } = await supabase.from('guides').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Guides Management</h1>
                <Button asChild>
                    <Link href="/admin/guides/new">
                        <Plus className="mr-2 h-4 w-4" /> Add New Guide
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Guide</TableHead>
                            <TableHead>Telegram</TableHead>
                            <TableHead>Languages</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!guides || guides.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No guides found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            guides.map((guide) => (
                                <TableRow key={guide.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {guide.photo_url && (
                                                <img src={guide.photo_url} alt={guide.name} className="w-8 h-8 rounded-full object-cover" />
                                            )}
                                            <span>{guide.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {guide.telegram_username ? (
                                            <a href={`https://t.me/${guide.telegram_username}`} target="_blank" className="flex items-center text-blue-500 hover:underline">
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                @{guide.telegram_username}
                                            </a>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>{guide.languages?.join(', ')}</TableCell>
                                    <TableCell>⭐ {guide.rating}</TableCell>
                                    <TableCell>
                                        {guide.is_active ? (
                                            <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-1 rounded-full">Active</span>
                                        ) : (
                                            <span className="text-gray-600 font-medium text-xs bg-gray-100 px-2 py-1 rounded-full">Inactive</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/guides/${guide.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
