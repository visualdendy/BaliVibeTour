import { getTourBySlug } from "@/app/actions/tours"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, CheckCircle2, MapPin, Users } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function TourPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const tour = await getTourBySlug(params.slug)

    if (!tour) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero / Header */}
            <div className="relative h-[50vh] w-full bg-slate-900">
                {tour.gallery_urls && tour.gallery_urls.length > 0 && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{ backgroundImage: `url(${tour.gallery_urls[0]})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{tour.name}</h1>
                    <div className="flex flex-wrap gap-4 text-white/90">
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Users className="w-4 h-4" />
                            <span>Max {tour.capacity} Guests</span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/90 px-3 py-1 rounded-full backdrop-blur-sm text-white font-semibold">
                            <span>{formatPrice(tour.price)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About this tour</h2>
                        <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
                            {tour.description_en}
                        </div>
                    </section>


                    {/* Itinerary could go here if parsed from JSONB */}
                </div>

                {/* Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 p-6 border rounded-xl shadow-lg bg-card space-y-6">
                        <div>
                            <span className="text-sm text-muted-foreground">Price per group</span>
                            <div className="text-3xl font-bold text-primary">{formatPrice(tour.price)}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Free cancellation up to 24h before</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Instant confirmation</span>
                            </div>
                        </div>

                        <Button size="lg" className="w-full text-lg h-12" asChild>
                            <Link href={`/book/${tour.id}`}>
                                Book Now
                            </Link>
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            No credit card required for booking request.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
