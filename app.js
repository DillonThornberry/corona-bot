const tmi = require('tmi.js')
const getStreams = require('./getStreams.js')
const corona = require('./corona.js')
const mainOptions = require('./mainOptions.json')

require('dotenv').config()

var opts = {
    identity: {
        username: process.env.BOT_CHANNEL,
        password: process.env.PASS,
    }, 
    channels: ['americanape'] 
}

const client = new tmi.client(opts)

getStreams(mainOptions.game, 100, streams => {
    opts.channels.push(...streams)
    client.connect()
})

const knownBots = ['streamlabs', 'nightbot', 'streamelements', 'wizebot']

const onMessageHandler = (target, context, message, self) => {
    if (self || knownBots.includes(context.username)) { return }
    if (target === '#americanape'){
        if (message === '!info'){
            client.say('#americanape', `We are watching chat in the top 100 ${mainOptions.game ? 
                mainOptions.game + ' ' : ''}streams on Twitch. I am patient zero. I comment in one of the streams.
                Anyone who comments within ${mainOptions.transmissionTime} seconds after me will become "infected".
                Anyone who comments after an infected person becomes infected. If an infected person comments in another
                top 100 stream, they start infecting people in that stream.`)
        }
    } else {
        corona.newMessage(target, context)
    }
}

const end = () => {
    console.log('end called')
    client.disconnect()
}

client.on('message', onMessageHandler)
client.on('connected', () => console.log('chatbot connected'))

module.exports = { 
    getStats: corona.getStats,
    end,
}