const InfectedStream = require('./InfectedStream.js')
const mainOptions = require('./mainOptions')

var state = {
    infectedUsers: [[], [], [], [], [], [], []],
    infectedChannels: {},
    transmissionLog: [],
}

const addNewInfectedChannel = (channel, infector) => {
    state.infectedChannels[channel] = new InfectedStream(channel, 30)
    state.infectedChannels[channel].newInfection(infector)
    if (!started){
        started = true
    }
}

const getStats = () => {
    const totalInfectedUsers = state.infectedUsers.reduce((a, c) => a + c.length, 0)
    const totalInfectedStreams = Object.keys(state.infectedChannels).length
    return { 
        game: mainOptions.game,
        transmissionTime: mainOptions.transmissionTime, 
        users: totalInfectedUsers, 
        streams: totalInfectedStreams,
     }
}

const hashKey = username => username.split('').reduce((a, c) => a + c.charCodeAt(), 0) % 7

const isInfected = username => {
    const hash = hashKey(username)
    return state.infectedUsers[hash].includes(username)
}

const newMessage = (target, context) => {
    const user = context.username
    const userIsInfected = isInfected(user)
    if (userIsInfected){
        if (!state.infectedChannels[target]){
            addNewInfectedChannel(target, user)
        } else {
            state.infectedChannels[target].newInfection(user)
        }

    } else {
        if (state.infectedChannels[target] && state.infectedChannels[target].isContagious) {
            state.infectedUsers[hashKey(user)].push(user)
            state.infectedChannels[target].newInfection(user)
        }
    }
}

for (var patient of mainOptions.patientZeroes){
    state.infectedUsers[hashKey(patient)].push(patient)
}


var count = 0
var started = false
setInterval(() => {
    if (started){
        count += 3
    }
    console.log('\n' + (count / 60).toFixed(2) + ' minutes')
    console.log('channels: ' + Object.keys(state.infectedChannels).length)
    console.log('users: ' + state.infectedUsers.reduce((a,c) => a + c.length, 0))
}, 3000)

module.exports = {
    getStats,
    newMessage,
}