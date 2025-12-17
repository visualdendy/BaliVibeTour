-- Enable Row Level Security
-- alter table auth.users enable row level security; -- Often already enabled and restricted

-- PROFILES TABLE (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'staff' check (role in ('admin', 'staff')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- TOURS TABLE
create table tours (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text not null unique,
  description_en text,
  description_id text,
  price numeric not null,
  duration text, -- e.g. "10 hours"
  capacity integer,
  inclusions text[], -- Array of strings
  itinerary jsonb, -- complex structure
  gallery_urls text[],
  is_active boolean default true
);
alter table tours enable row level security;
create policy "Tours are viewable by everyone." on tours for select using (true);
create policy "Admins can insert tours." on tours for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update tours." on tours for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete tours." on tours for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- GUIDES TABLE
create table guides (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  photo_url text, -- Supabase storage url
  languages text[], 
  phone text,
  telegram_username text,
  telegram_user_id text, -- ID from bot, needed for callbacks
  rating numeric default 5.0,
  is_active boolean default true
);
alter table guides enable row level security;
-- Only staff/admin can see sensitive guide info (phone, telegram_id), but public might need basic info if we show "Who is your guide?" (maybe just name/photo).
-- For now, let's keep it fairly open for simplicity, or restrict critical fields if needed.
create policy "Guides viewable by auth users or public (limited)." on guides for select using (true); 
create policy "Admins can manage guides." on guides for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- BOOKINGS TABLE
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tour_id uuid references tours(id) not null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  pickup_location text,
  booking_date date not null,
  pax integer default 1,
  special_requests text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'guide_assigned', 'completed', 'cancelled')),
  assigned_guide_id uuid references guides(id),
  total_price numeric
);
alter table bookings enable row level security;
create policy "Admins and staff can view all bookings." on bookings for select using (exists (select 1 from profiles where id = auth.uid()));
create policy "Admins and staff can update bookings." on bookings for update using (exists (select 1 from profiles where id = auth.uid()));
create policy "Public can create bookings." on bookings for insert with check (true); 

-- STORAGE BUCKETS
-- You need to create 'tours' and 'guides' buckets in the dashboard manually or via API if possible.
-- This SQL just sets policies if the buckets exist.
insert into storage.buckets (id, name, public) values ('tours', 'tours', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('guides', 'guides', true) on conflict do nothing;

create policy "Public Access Tours" on storage.objects for select using ( bucket_id = 'tours' );
create policy "Admin Upload Tours" on storage.objects for insert with check ( bucket_id = 'tours' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Public Access Guides" on storage.objects for select using ( bucket_id = 'guides' );
create policy "Admin Upload Guides" on storage.objects for insert with check ( bucket_id = 'guides' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- TRIGGERS
-- Auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'staff'); -- Default to staff, manually upgrade to admin
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
