const Observable = require('../utils/Observable')


class Dev extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    switchOn() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1
            //console.log(this.name, '\t moved from', this.in_room, 'to', to)
            //console.log('Dev turned on')
        }
    }
    switchOff() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1
            //console.log('Dev turned off')
        }
    }
}

module.exports = Dev

