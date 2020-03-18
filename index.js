var userCount = document.querySelector('#user-count')
var channelCount = document.querySelector('#channel-count')
var timer = document.querySelector('#timer')

console.log('index.js running')

var time = 0

const parseTime = time => {
    var totalSeconds = Math.floor(time)
    var minutes = Math.floor(totalSeconds / 60)
    var seconds = Math.floor(totalSeconds % 60)
    return `${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`
}

var reloadInterval = setInterval(() => {
    fetch('/data').then(res => res.json()).then(data => {
        if (!data){
            this.clearInterval()
        }
        if (data.streams > 0){
            time += .25
        }
        userCount.innerHTML = data.users
        channelCount.innerHTML = data.streams
        timer.innerHTML = parseTime(time)
    })
}, 250)

const end = () => {
    clearInterval(reloadInterval)
    fetch('/end').then(res => res.json()).then(data => console.log(data))
}
