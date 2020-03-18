const request = require('request')

require('dotenv').config()

const getStreams = (gameName, total, callback) => {

    if (!gameName){
        var options = {
            url: `https://api.twitch.tv/helix/streams?first=${total}`,
            headers: { "Client-ID": process.env.TWITCH_CLIENT_ID },
            json: true
        }

        request(options, (err, res) => {
            callback(res.body.data.map(stream => stream.user_name))
        })
    }

    else {
        var options = {
            url: 'https://api.twitch.tv/helix/games?name=' + encodeURI(gameName),
            headers: { "Client-ID": process.env.TWITCH_CLIENT_ID },
            json: true
        }
        
        request(options, (err, res) => {
            const gameId = res.body.data[0].id
    
            options.url = `https://api.twitch.tv/helix/streams?first=${total}&game_id=${gameId}`
            request(options, (err, res) => {
                callback(res.body.data.map(stream => stream.user_name))
            })
        })
    }
}

module.exports = getStreams