# BaliVibe Tours - Detailed Testing Guide

Follow these steps to run and test the entire application from start to finish.

## 1. Setup Prerequisites

### A. Supabase (Database)
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Create a new project.
3.  Go to **SQL Editor** in the left sidebar.
4.  Copy the content of `supabase/schema.sql` (from your project files) and paste it into the query editor.
5.  Click **Run** to create the tables.
6.  Go to **Project Settings > API**.
7.  Copy the `Project URL` and `anon public` key.

### B. Telegram Bot
1.  Open Telegram and chat with [@BotFather](https://t.me/BotFather).
2.  Send `/newbot`, name it (e.g., "BaliVibeTestBot"), and get the **API Token**.
3.  Create a new Telegram Group.
4.  Add your new bot to the group as a member (and make it Admin if possible, but member is usually fine).
5.  **Important**: You need the `CHAT_ID` of this group.
    - Simplest way: Add `@RawDataBot` to the group, it will print a JSON. Look for `"chat": { "id": -100xxxxxxx }`. Copy that number (including the negative sign).
    - Remove `@RawDataBot` afterwards.

### C. Environment Variables
1.  In VS Code, rename `.env.example` to `.env.local`.
2.  Fill in the values:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    TELEGRAM_BOT_TOKEN=your_bot_token
    TELEGRAM_GROUP_CHAT_ID=your_group_chat_id
    ```

## 2. Initialize Data

Open your terminal in VS Code (`Ctrl + ~`) and run:

1.  **Install Dependencies** (if you haven't yet):
    ```bash
    npm install
    ```
2.  **Seed Database** (Populate with tours):
    ```bash
    npx tsx scripts/seed.ts
    ```
    *You should see "✅ Seeding complete!"*

## 3. Run the Application

You will need **two** terminal tabs running simultaneously.

Submit the following commands:

**Terminal 1: The Web App**
```bash
npm run dev
```
*Wait for "Ready in ... ms". Open http://localhost:3000.*

**Terminal 2: The Telegram Bot**
Open a new terminal (Click `+` in terminal panel) and run:
```bash
npx tsx bot/index.ts
```
*You should see "Bot is running..."*

---

## 4. Testing Scenarios (Walkthrough)

### Scenario A: Customer Booking
1.  Go to `http://localhost:3000` in your browser.
2.  You should see the "BaliVibe Tours" hero and a list of tours.
3.  Click "View Details" on **"Ubud Cultural Day Trip"**.
4.  Click **"Book Now"**.
5.  Fill in the form:
    - Date: Select tomorrow.
    - Guests: 2.
    - Phone: Any number.
    - Pickup: "Grand Hyatt Bali".
6.  Click **"Confirm Booking"**.
7.  You should be redirected to a **"Booking Received!"** page.

### Scenario B: Admin Notification & Telegram Assignment
1.  **Check your Telegram Group**: You should see a message from your bot:
    > "🆕 **NEW BOOKING REQUEST** ... Who wants to take this?"
    > [✅ Yes, I can do it 👍] [❌ No, I cannot 👎]
2.  **Act as a Driver**: Click the "✅ Yes" button in Telegram.
    - The bot should reply "✅ You got the job!".
    - The original message should update to say "✅ **ACCEPTED**... Assigned to: @yourusername".

### Scenario C: Admin Dashboard
1.  Go to `http://localhost:3000/admin`
2.  Go to **Bookings** (`/admin/bookings`).
3.  You should see your new booking there.
4.  The "Assigned Guide" column should show the name corresponding to the Telegram user (if linked in `guides` table) or match the ID logic.
