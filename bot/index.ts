import TelegramBot from 'node-telegram-bot-api'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Setup
const token = process.env.TELEGRAM_BOT_TOKEN
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Should be SERVICE_ROLE key in real prod for admin rights, using anon for now if policy allows or assumption

if (!token || !supabaseUrl || !supabaseKey) {
    console.error('Missing env variables for Bot')
    process.exit(1)
}

const bot = new TelegramBot(token, { polling: true })
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Bot is running...')

// Handle Callback Queries (Button Clicks)
bot.on('callback_query', async (query) => {
    const { id, data, from, message } = query
    if (!data || !message) return

    const [action, bookingId, telegramUserId] = data.split('_')

    // Basic validation
    // In real world, check if 'from.id' matches 'telegramUserId' (security)
    // But here we might be strictly matching internal IDs.

    if (action === 'accept') {
        // 1. Check if booking is still pending
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

        if (fetchError || !booking) {
            await bot.answerCallbackQuery(id, { text: 'Error fetching booking.' })
            return
        }

        if (booking.status !== 'pending') {
            await bot.answerCallbackQuery(id, { text: 'Booking already assigned or cancelled.' })
            // Update message to reflect status
            await bot.editMessageText(`🔒 Booking ${bookingId} is already ${booking.status}.`, {
                chat_id: message.chat.id,
                message_id: message.message_id
            })
            return
        }

        // 2. Assign Guide
        // Auto-register logic for "Real Case" allowing anyone to be a guide
        const { data: existingGuide } = await supabase
            .from('guides')
            .select('id, name')
            .eq('telegram_user_id', from.id.toString())
            .single()

        let guideId = existingGuide?.id

        if (!existingGuide) {
            // Create new guide on the fly
            const newGuideName = from.first_name + (from.last_name ? ` ${from.last_name}` : '')
            const { data: newGuide, error: createGuideError } = await supabase
                .from('guides')
                .insert({
                    name: newGuideName || `Guide ${from.username}`,
                    telegram_username: from.username || `user_${from.id}`,
                    telegram_user_id: from.id.toString(),
                    phone: 'N/A', // Placeholder
                    languages: ['English'], // Default
                    rating: 5.0, // Newbie boost
                    photo_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80' // Default avatar
                })
                .select()
                .single()

            if (createGuideError || !newGuide) {
                console.error("Failed to create guide", createGuideError)
                await bot.answerCallbackQuery(id, { text: 'System Error: Could not register you.' })
                return
            }
            guideId = newGuide.id
        }

        // 3. Update Booking
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                status: 'guide_assigned',
                assigned_guide_id: guideId
            })
            .eq('id', bookingId)
            .eq('status', 'pending') // Optimistic lock

        if (updateError) {
            await bot.answerCallbackQuery(id, { text: 'Failed to assign. Someone might have took it.' })
        } else {
            const guideName = from.first_name || from.username || "The Guide"
            await bot.answerCallbackQuery(id, { text: '✅ You got the job!' })

            try {
                // Update the group message
                await bot.editMessageText(
                    `✅ **ACCEPTED**\n\nBooking #${bookingId.slice(0, 8)}\nAssigned to: ${guideName} (@${from.username})\n\nDate: ${booking.booking_date}\nPax: ${booking.pax}`,
                    {
                        chat_id: message.chat.id,
                        message_id: message.message_id,
                        parse_mode: 'Markdown'
                    }
                )
            } catch (err) {
                console.log("Message edit failed", err)
            }

            // Send DM to guide
            try {
                await bot.sendMessage(from.id, `You have been assigned to Booking #${bookingId}.\nSee details in dashboard.`)
            } catch (e) {
                console.log('Cannot DM guide (maybe blocked)')
            }
        }

    } else if (action === 'decline') {
        await bot.answerCallbackQuery(id, { text: 'Declined.' })
        // Optional: Log decline
    }
})

// Error handling
bot.on('polling_error', (error) => {
    console.log(error)
})
