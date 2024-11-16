require('dotenv').config()

export const BOT_TOKEN = process.env.BOT_TOKEN as string
export const TELEGRAM_BOT_API_URL = process.env.TELEGRAM_ENV === 'test'
                                        ? "https://api.telegram.org/bot${BOT_TOKEN}/test/"
                                        : "https://api.telegram.org/bot${BOT_TOKEN}/"