var userCount = document.querySelector('#user-count')
var channelCount = document.querySelector('#channel-count')
var timer = document.querySelector('#timer')
var notification = document.querySelector('#notification')
var gameName = document.querySelector('#game-name')
var transmissionTime = document.querySelector('#transmission-time')
var userRate = document.querySelector('#user-rate')

console.log('index.js running')

var time = 0
var users = 0
var channels = 0

const parseTime = time => {
    var totalSeconds = Math.floor(time)
    var minutes = Math.floor(totalSeconds / 60)
    var seconds = Math.floor(totalSeconds % 60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

var reloadInterval = setInterval(() => {
    fetch('/data').then(res => res.json()).then(data => {
        if (!data){
            this.clearInterval()
        }
        if (data.streams > 0){
            time += .25
        }
        if (!transmissionTime.innerHTML.length){
            transmissionTime.innerHTML = data.transmissionTime + 's'
            gameName.innerHTML = data.game || 'All'
        }
        users = data.users
        userCount.innerHTML = data.users
        channels = data.streams
        channelCount.innerHTML = data.streams
        timer.innerHTML = parseTime(time)
        if (data.streams != channels && data.streams < 10){
            notify('New stream has been infected!', 3)
            channels = data.streams
        }
    })
}, 250)

const avg = nums => nums.reduce((a,c) => a+c) / nums.length

var recentUserChecks = []
var lastUserCount = 1
var userRateInterval = setInterval(() => {
    recentUserChecks.push(users - lastUserCount)
    if (recentUserChecks.length > 3){
        recentUserChecks.shift()
    }
    userRate.innerHTML = avg(recentUserChecks).toFixed(1) + '/s'
    lastUserCount = users
}, 1000)

const end = () => {
    clearInterval(reloadInterval)
    fetch('/end').then(res => res.json()).then(data => console.log(data))
}

const notify = (message, blinks) => {
    var counter = 0
    var blinker = setInterval(() => {
        notification.innerHTML = message
        setTimeout(() => notification.innerHTML = "", 500)
        counter++
        if (counter >= blinks) {
            console.log('should clear')
            clearInterval(blinker)
        }
    }, 1000)
}