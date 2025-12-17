-- ========================================================
-- HARD RESET & SEED ("REAL CASE MODE - V4 Ultimate")
-- Includes Data, Images, AND Security Policies
-- ========================================================

-- 1. TRUNCATE (Wipe clean)
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.guides CASCADE;
TRUNCATE TABLE public.tours CASCADE;

-- 2. INSERT 3 SPECIFIC TOURS (Accurate Images)
INSERT INTO public.tours (name, slug, price, duration, capacity, description_en, is_active, gallery_urls)
VALUES 
(
  'Ubud & Volcano Kintamani', 
  'ubud-volcano', 
  45, 
  '10 Hours', 
  5, 
  'Witness the magnificent Mount Batur volcano and explore the cultural heart of Bali in Ubud.', 
  true,
  ARRAY['https://www.balifulldaytour.com/images/ubudkintamanitour.jpg']
),
(
  'Nusa Penida West Trip', 
  'nusa-penida-west', 
  70, 
  '12 Hours', 
  10, 
  'Sail to Nusa Penida and visit the famous Kelingking Beach (T-Rex Cliff).', 
  true,
  ARRAY['https://i0.wp.com/inclusivebalitour.com/wp-content/uploads/2019/11/Kelingking-Beach.jpg?resize=768%2C384&ssl=1']
),
(
  'Uluwatu Sunset & Kecak', 
  'uluwatu-sunset', 
  40, 
  '6 Hours', 
  4, 
  'Experience the dramatic cliffside temple of Uluwatu at sunset.', 
  true,
  ARRAY['https://www.raftingbali.net/wp-content/uploads/2025/11/uluwatu-kecak-tickets-sunset-amphitheater-hero.webp']
);

-- 3. INSERT GUIDES (Accurate Profiles)
INSERT INTO public.guides (name, languages, phone, telegram_username, rating, photo_url)
VALUES
('Wayan Dharma', ARRAY['English', 'Indonesian'], '+62 812 3456 7890', 'wayan_demo_driver', 4.9, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80'),
('Made Suka', ARRAY['English', 'Japanese'], '+62 898 7654 3210', 'made_demo_driver', 4.8, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80'),
('Ketut Pande', ARRAY['English', 'French'], '+62 811 2233 4455', 'ketut_demo', 5.0, 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?auto=format&fit=crop&q=80');

-- 4. INSERT BOOKINGS (Sample "Pending" for Admin to Act On)
DO $$
DECLARE
  tour1_id uuid;
  tour2_id uuid;
BEGIN
  SELECT id INTO tour1_id FROM public.tours WHERE slug = 'ubud-volcano' LIMIT 1;
  SELECT id INTO tour2_id FROM public.tours WHERE slug = 'nusa-penida-west' LIMIT 1;

  INSERT INTO public.bookings (tour_id, customer_name, customer_email, customer_phone, booking_date, pax, total_price, status, assigned_guide_id, pickup_location)
  VALUES 
  (tour1_id, 'Sarah Conner', 'sarah@example.com', '+1 987 654 321', CURRENT_DATE + 3, 2, 90, 'pending', NULL, 'Kuta Paradiso Hotel'),
  (tour2_id, 'John Matrix', 'john@example.com', '+1 123 456 789', CURRENT_DATE + 5, 4, 280, 'pending', NULL, 'Grand Hyatt Nusa Dua');
END $$;

-- 5. RELAX SECURITY (Demo Mode - Fix 404s)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
  END;
END $$;

drop policy if exists "Enable full access for everyone (DEMO)" on bookings;
create policy "Enable full access for everyone (DEMO)" on bookings for all using (true);

drop policy if exists "Enable full access for everyone (DEMO)" on guides;
create policy "Enable full access for everyone (DEMO)" on guides for all using (true);

drop policy if exists "Enable full access for everyone (DEMO)" on tours;
create policy "Enable full access for everyone (DEMO)" on tours for all using (true);
