import TelegramBot from 'node-telegram-bot-api';
import midjourney from 'midjourney-client';
import { translate } from 'bing-translate-api';
const token = "6276159722:AAHb0W9KMqxpREh5Rjtw4Eqi8MVDr6idhw4";
const chatGPTToken = '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'
const bot = new TelegramBot(token, { polling: true });

async function translateText(chatId, text) {
    translate(text, null, 'en').then(res => {
        return res.translation
    })
}
async function getImage(chatId, text, messageId) {
    const link = await midjourney(text)
    console.log(link)
    if (link) {
        bot.sendPhoto(chatId, link[0])
        bot.deleteMessage(chatId, messageId)
    } else {
        bot.sendMessage(chatId, 'Произошла ошибка, попробуйте ещё раз.')
    }
    // try {
    //     bot.sendPhoto(chatId, link[0])
    //     bot.deleteMessage(chatId, messageId)
    // } catch (error) {
    //     console.log(error)
    // }
}

console.log('started')
bot.on('message', msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
        return bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}, я умею отправлять картинки по любому твоему описанию, для этого надо просто написать любой текст.`)
    }
    bot.sendMessage(chatId, 'Загрузка...')
    async function sendBotMessage(text, chatId) {
        translate(text, null, 'en').then(res => {
            const botMessage = msg.message_id + 1
            getImage(chatId, res.translation, botMessage)
            console.log(`${text} (${res.translation})`)
        })        
    } 
    sendBotMessage(text,chatId)


})