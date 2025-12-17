import { getTours } from "@/app/actions/tours"
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
import { Plus, Edit } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { DeleteTourButton } from "@/components/admin/delete-tour-button"

export default async function AdminToursPage() {
    const tours = await getTours()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tours Management</h1>
                <Button asChild>
                    <Link href="/admin/tours/new">
                        <Plus className="mr-2 h-4 w-4" /> Add New Tour
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tours.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No tours found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tours.map((tour) => (
                                <TableRow key={tour.id}>
                                    <TableCell className="font-medium">{tour.name}</TableCell>
                                    <TableCell>{formatPrice(tour.price)}</TableCell>
                                    <TableCell>{tour.duration}</TableCell>
                                    <TableCell>
                                        {tour.is_active ? (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white shadow hover:bg-green-500/80">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-500 text-white shadow hover:bg-gray-500/80">
                                                Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/tours/${tour.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteTourButton id={tour.id} />
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
