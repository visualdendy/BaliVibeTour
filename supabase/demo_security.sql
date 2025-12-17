-- ========================================================
-- DEMO SECURITY SETTINGS ("Real Case" Open Mode)
-- ========================================================
-- This script relaxes security so you can see data on localhost
-- without complex login/auth steps. 
-- run this to fix "No Bookings Found" or empty tables.
-- ========================================================

-- 1. Enable Realtime for bookings (so notifications work)
alter publication supabase_realtime add table bookings;

-- 2. Allow Public Read/Write on Bookings (Simplest for Demo)
drop policy if exists "Admins and staff can view all bookings." on bookings;
drop policy if exists "Admins and staff can update bookings." on bookings;
drop policy if exists "Public can create bookings." on bookings;

create policy "Enable full access for everyone (DEMO)" on bookings for all using (true);

-- 3. Allow Public Read on Guides
drop policy if exists "Guides viewable by auth users or public (limited)." on guides;
drop policy if exists "Admins can manage guides." on guides;

create policy "Enable full access for everyone (DEMO)" on guides for all using (true);

-- 4. Allow Public Read on Tours
drop policy if exists "Tours are viewable by everyone." on tours;
drop policy if exists "Admins can insert tours." on tours;
drop policy if exists "Admins can update tours." on tours;
drop policy if exists "Admins can delete tours." on tours;

create policy "Enable full access for everyone (DEMO)" on tours for all using (true);
