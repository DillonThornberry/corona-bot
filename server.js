const express = require('express')
var bot = require('./app.js')

const app = express()

app.use(express.static(__dirname))

app.get('/data', (req, res) => {
    res.send(JSON.stringify(bot.getStats()))
})

app.get('/end', (req, res) => {
    bot.end()
    res.send(JSON.stringify('end received'))
})

app.listen(3000, () => console.log('listening on 3000'))