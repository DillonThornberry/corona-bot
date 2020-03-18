const mainOptions = require('./mainOptions.json')

class InfectedStream {
    contructor(name){
        this.name = name
        this.infector = null
        this.isContagious = null
    }

    newInfection(newInfector){
        this.isContagious = true
        this.infector = newInfector
        setTimeout(() => {
            if (this.infector === newInfector){
                this.isContagious = false
            }
        }, mainOptions.transmissionTime * 1000)
    }


}

module.exports = InfectedStream