# BaliVibe Tours

A full-stack Booking System & Admin Dashboard for a Bali Tour Agency. Built with Next.js 16, Supabase, and Telegram Bot.

## Features
- **Public**: Browse tours, details page, multi-step booking form.
- **Admin**: Dashboard stats, Manage Tours, Guides, Bookings (Kanban/Table).
- **Bot**: Telegram integration to broadcast bookings to drivers and handle assignment via inline buttons.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Server Actions)
- **Database**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Bot**: node-telegram-bot-api

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Supabase & Telegram keys.
   ```bash
   cp .env.example .env.local
   ```

3. **Database Setup**
   - Go to Supabase SQL Editor.
   - Run the contents of `supabase/schema.sql`.

4. **Seed Data** (Optional)
   Populate the database with sample tours and guides.
   ```bash
   npx tsx scripts/seed.ts
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

6. **Run Telegram Bot**
   in a separate terminal:
   ```bash
   npx tsx bot/index.ts
   ```

## Folder Structure
- `src/app`: App Router pages
- `src/components`: Reusable UI components
- `src/lib`: Utilities (Supabase client, helpers)
- `bot`: Telegram bot script
- `supabase`: SQL schema

## License
Private Property of BaliVibe Tours.
