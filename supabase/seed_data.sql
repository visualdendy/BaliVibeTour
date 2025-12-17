-- ========================================================
-- REAL CASE SEED DATA
-- Includes Real Images, Descriptions, and Bookings.
-- ========================================================

-- 1. TOURS (Upsert to fix missing images)
INSERT INTO public.tours (name, slug, price, duration, capacity, description_en, is_active, gallery_urls)
VALUES 
(
  'Ubud & Volcano Kintamani', 
  'ubud-volcano', 
  45, 
  '10 Hours', 
  5, 
  'Witness the magnificent Mount Batur volcano and explore the cultural heart of Bali in Ubud. Visit the Sacred Monkey Forest, Tegalalang Rice Terrace, and Tirta Empul Temple.', 
  true,
  ARRAY['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1539301936306-61314ff95b9d?auto=format&fit=crop&q=80']
),
(
  'Nusa Penida West Trip', 
  'nusa-penida-west', 
  70, 
  '12 Hours', 
  10, 
  'Sail to Nusa Penida and visit Kelingking Beach, Broken Beach, and Angel Billabong. Includes fast boat tickets and lunch.', 
  true,
  ARRAY['https://images.unsplash.com/photo-1596401057633-565652b8ddbe?auto=format&fit=crop&q=80']
),
(
  'Uluwatu Sunset & Kecak', 
  'uluwatu-sunset', 
  40, 
  '6 Hours', 
  4, 
  'Experience the dramatic cliffside temple of Uluwatu at sunset, followed by the mesmerizing Kecak Fire Dance performance.', 
  true,
  ARRAY['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description_en = EXCLUDED.description_en,
  price = EXCLUDED.price,
  gallery_urls = EXCLUDED.gallery_urls;

-- 2. GUIDES
INSERT INTO public.guides (name, languages, phone, telegram_username, rating, photo_url)
VALUES
('Wayan Dharma', ARRAY['English', 'Indonesian'], '+628123456789', 'wayan_demo_driver', 4.9, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80'),
('Made Suka', ARRAY['English', 'Japanese'], '+628987654321', 'made_demo_driver', 4.8, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING; -- No unique constraint on name, but it's fine for now

-- 3. BOOKINGS (Dynamic ID lookup)
DO $$
DECLARE
  tour1_id uuid;
  tour2_id uuid;
  guide1_id uuid;
BEGIN
  SELECT id INTO tour1_id FROM public.tours WHERE slug = 'ubud-volcano' LIMIT 1;
  SELECT id INTO tour2_id FROM public.tours WHERE slug = 'nusa-penida-west' LIMIT 1;
  SELECT id INTO guide1_id FROM public.guides WHERE name = 'Wayan Dharma' LIMIT 1;

  -- Clear old sample bookings to avoid clutter if re-seeded
  -- DELETE FROM public.bookings WHERE customer_email LIKE '%example.com';

  INSERT INTO public.bookings (tour_id, customer_name, customer_email, customer_phone, booking_date, pax, total_price, status, assigned_guide_id)
  VALUES 
  (tour1_id, 'Sarah Conner', 'sarah@example.com', '+1987654321', CURRENT_DATE + 3, 2, 90, 'confirmed', guide1_id),
  (tour2_id, 'John Matrix', 'john@example.com', '+1123456789', CURRENT_DATE + 5, 4, 280, 'pending', NULL),
  (tour1_id, 'Ellen Ripley', 'ellen@example.com', '+1555555555', CURRENT_DATE - 1, 3, 135, 'completed', guide1_id);
END $$;
