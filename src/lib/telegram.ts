import TelegramBot from 'node-telegram-bot-api'

// We create a new instance just for sending, stateless.
// In a serverless env, this is okay.
export async function sendTelegramNotification(booking: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_GROUP_CHAT_ID

    if (!token || !chatId) {
        console.warn("Telegram credentials missing, skipping notification.")
        return
    }

    const bot = new TelegramBot(token, { polling: false })

    const tourName = booking.tours?.name || "Private Tour"
    const message = `
🆕 **NEW BOOKING REQUEST**

🆔 Ref: \`${booking.id}\`
🏝️ **${tourName}**
📅 Date: ${booking.booking_date}
👥 Pax: ${booking.pax}
📍 Pickup: ${booking.pickup_location}
👤 Name: ${booking.customer_name}
💰 Price: $${booking.total_price}

Who wants to take this?
`

    // Send to Group
    try {
        await bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Yes, I can do it 👍", callback_data: `accept_${booking.id}_0` }, // 0 is placeholder for UserID, handled in callback since we get from.id
                        { text: "❌ No, I cannot 👎", callback_data: `decline_${booking.id}_0` }
                    ]
                ]
            }
        })
    } catch (err) {
        console.error("Failed to send Telegram message", err)
    }
}
