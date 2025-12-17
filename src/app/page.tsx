import Link from "next/link"
import { getTours } from "@/app/actions/tours"
import { TourCard } from "@/components/tour-card"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const tours = await getTours()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-slow-zoom"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80)' }}
        />

        <div className="relative z-20 text-center space-y-4 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover the Real Bali
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Experience authentic culture, breathtaking landscapes, and unforgettable adventures with verified local guides.
          </p>
          <div className="pt-4">
            <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90 text-white border-none" asChild>
              <Link href="/book">Book Now!</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tours List */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Popular Tour Packages
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Hand-picked adventures for every type of traveler.
          </p>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium">No tours available right now.</h3>
            <p className="text-muted-foreground">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-xl mb-4">BaliVibe Tours</h3>
            <p className="text-sm text-slate-400">
              Your trusted partner for exploring the Island of Gods.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-sm text-slate-400">Phone: +62 812 3456 7890</p>
            <p className="text-sm text-slate-400">Email: booking@balivibe.com</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <p className="text-sm text-slate-400 hover:underline cursor-pointer">Privacy Policy</p>
            <p className="text-sm text-slate-400 hover:underline cursor-pointer">Terms of Service</p>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500">
          © {new Date().getFullYear()} BaliVibe Tours. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
