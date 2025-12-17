import { NextRequest, NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'
import { createClient } from '@supabase/supabase-js'

// Handle POST request (Webhook)
export async function POST(req: NextRequest) {
    try {
        // Initialize inside handler to ensure env vars are available
        const token = process.env.TELEGRAM_BOT_TOKEN
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!token || !supabaseUrl || !supabaseKey) {
            console.error('Missing environment variables')
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
        }

        const bot = new TelegramBot(token, { polling: false })
        const supabase = createClient(supabaseUrl, supabaseKey)

        const body = await req.json()

        if (body.callback_query) {
            await handleCallbackQuery(body.callback_query, bot, supabase)
        } else if (body.message) {
            console.log("Received message:", body.message.text)
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Error handling webhook:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

async function handleCallbackQuery(
    query: TelegramBot.CallbackQuery,
    bot: TelegramBot,
    supabase: any
) {
    const { id, data, from, message } = query
    if (!data || !message) return

    const [action, bookingId, telegramUserId] = data.split('_')

    // Copying logic from bot/index.ts
    if (action === 'accept') {
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
            // Update message context if possible, or just fail silently/notify
            try {
                await bot.editMessageText(`🔒 Booking ${bookingId.slice(0, 8)}... is already ${booking.status}.`, {
                    chat_id: message.chat.id,
                    message_id: message.message_id
                })
            } catch (e) { console.error('Edit failed', e) }
            return
        }

        // Logic: Assign Guide
        // 1. Find existing guide by telegram_user_id
        const { data: existingGuide } = await supabase
            .from('guides')
            .select('id, name')
            .eq('telegram_user_id', from.id.toString())
            .single()

        let guideId = existingGuide?.id

        if (!existingGuide) {
            // Create new guide
            const newGuideName = from.first_name + (from.last_name ? ` ${from.last_name}` : '')
            const { data: newGuide, error: createGuideError } = await supabase
                .from('guides')
                .insert({
                    name: newGuideName || `Guide ${from.username}`,
                    telegram_username: from.username || `user_${from.id}`,
                    telegram_user_id: from.id.toString(),
                    phone: 'N/A', // Placeholder
                    languages: ['English'],
                    rating: 5.0,
                    photo_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80'
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
            .eq('status', 'pending')

        if (updateError) {
            await bot.answerCallbackQuery(id, { text: 'Failed to assign. Someone might have took it.' })
        } else {
            const guideName = from.first_name || from.username || "The Guide"
            await bot.answerCallbackQuery(id, { text: '✅ You got the job!' })

            try {
                // Update the group message
                await bot.editMessageText(
                    `✅ **ACCEPTED**\n\nBookingRef: \`${bookingId.slice(0, 8)}\`\nAssigned to: ${guideName} (@${from.username})\n\nDate: ${booking.booking_date}\nPax: ${booking.pax}`,
                    {
                        chat_id: message.chat.id,
                        message_id: message.message_id,
                        parse_mode: 'Markdown'
                    }
                )
            } catch (err) {
                console.log("Message edit failed", err)
            }
        }
    } else if (action === 'decline') {
        await bot.answerCallbackQuery(id, { text: 'Declined.' })
    }
}
