export type Tour = {
    id: string
    created_at: string
    name: string
    slug: string
    description_en: string | null
    description_id: string | null
    price: number
    duration: string | null
    capacity: number | null
    inclusions: string[] | null
    itinerary: any | null // JSONB
    gallery_urls: string[] | null
    is_active: boolean
}

export type Guide = {
    id: string
    created_at: string
    name: string
    photo_url: string | null
    languages: string[] | null
    phone: string | null
    telegram_username: string | null
    telegram_user_id: string | null
    rating: number
    is_active: boolean
}

export type BookingStatus = 'pending' | 'confirmed' | 'guide_assigned' | 'completed' | 'cancelled'

export type Booking = {
    id: string
    created_at: string
    tour_id: string
    customer_name: string
    customer_email: string | null
    customer_phone: string | null
    pickup_location: string | null
    booking_date: string
    pax: number
    special_requests: string | null
    status: BookingStatus
    assigned_guide_id: string | null
    total_price: number | null

    // Joins
    tours?: Tour
    guides?: Guide
}
