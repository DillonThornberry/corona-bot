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
            client.say('#americanape', 'info')
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