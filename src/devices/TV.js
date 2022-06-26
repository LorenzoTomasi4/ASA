const Observable = require('../utils/Observable')


class TV extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOnTV() {
        if (this.status == 'off'){
        this.status = 'on'
        this.house.utilities.electricity.consumption += 1;
        console.log(this.name,  'TV turned on')
        }
    }
    turnOffTV() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'TV turned off')
        }
    }
}

module.exports = TV