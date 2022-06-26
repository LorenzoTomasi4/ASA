const Observable = require('../utils/Observable')


class Oven extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOnOven() {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 1;
        console.log(this.name,  'oven turned on')
    }
    turnOffOven() {
        this.status = 'off'
        this.house.utilities.electricity.consumption -= 1;
        console.log(this.name, 'oven turned off')
    }
}

module.exports = Oven