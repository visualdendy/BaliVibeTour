import Link from "next/link"
import { Tour } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Clock, Users } from "lucide-react"

export function TourCard({ tour }: { tour: Tour }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video w-full bg-muted relative">
                {/* Placeholder for image if no gallery */}
                {tour.gallery_urls && tour.gallery_urls.length > 0 ? (
                    <img
                        src={tour.gallery_urls[0]}
                        alt={tour.name}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1">{tour.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {tour.description_en}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Max {tour.capacity}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/50 gap-2">
                <span className="text-lg font-bold text-primary">
                    {formatPrice(tour.price)}
                </span>
                <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                        <Link href={`/tours/${tour.slug}`}>Details</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href={`/book/${tour.id}`}>Book Now</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
