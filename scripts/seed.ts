import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use service key if available for bypassing RLS, otherwise anon key (might fail if RLS blocks inserts)
// For local dev with `npx supabase start`, use service_role key. 
// Here we assume user might put service key in separate var or use anon if policy allows.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('🌱 Seeding database...')

    // 1. Create Tours
    const tours = [
        {
            name: "Ubud Cultural Day Trip",
            slug: "ubud-cultural-day-trip",
            description_en: "Explore the heart of Bali with a visit to the Monkey Forest, Tegalalang Rice Terrace, and ancient temples.",
            price: 50,
            duration: "10 Hours",
            capacity: 4,
            inclusions: ["AC Car", "English Speaking Driver", "Mineral Water", "Sarong for Temple"],
            gallery_urls: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80"],
            is_active: true
        },
        {
            name: "Nusa Penida West Tour",
            slug: "nusa-penida-west",
            description_en: "Visit Kelingking Beach, Broken Beach, and Angel's Billabong in this unforgettable island adventure.",
            price: 85,
            duration: "12 Hours",
            capacity: 6,
            inclusions: ["Fast Boat Tickets", "Island Transport", "Lunch", "Entry Fees"],
            gallery_urls: ["https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&q=80"],
            is_active: true
        },
        {
            name: "Mount Batur Sunrise Trek",
            slug: "batur-sunrise-trek",
            description_en: "Hike up an active volcano and watch the sunrise while enjoying breakfast cooked by volcanic steam.",
            price: 45,
            duration: "6 Hours",
            capacity: 10,
            inclusions: ["Flashlight", "Breakfast", "Guide", "Hotel Transfer"],
            gallery_urls: ["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80"],
            is_active: true
        }
    ]

    for (const tour of tours) {
        const { error } = await supabase.from('tours').upsert(tour, { onConflict: 'slug' })
        if (error) console.error('Error inserting tour:', tour.name, error)
    }

    // 2. Create Guides
    const guides = [
        {
            name: "Wayan Sudra",
            telegram_username: "wayansudra123", // Fake
            telegram_user_id: "123456789", // Fake
            languages: ["English", "Indonesian"],
            phone: "+62 812 3456 7890",
            rating: 4.9
        },
        {
            name: "Made Driver",
            telegram_username: "madedriverbali", // Fake
            telegram_user_id: "987654321", // Fake 
            languages: ["English", "Japanese"],
            phone: "+62 819 8765 4321",
            rating: 4.8
        }
    ]

    for (const guide of guides) {
        // We don't have a unique constraint on name, so this might duplicate if run multiple times without cleanup.
        // Ideally use upsert with ID if we pre-defined IDs, or just insert.
        // For this demo, let's just insert.
        const { error } = await supabase.from('guides').insert(guide)
        if (error) console.error('Error inserting guide:', guide.name, error)
    }

    console.log('✅ Seeding complete!')
}

seed().catch(console.error)
