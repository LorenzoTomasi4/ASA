const Observable = require('../utils/Observable')


class PC extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOnPC() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            console.log(this.name,  'PC turned on')
        }
    }
    turnOffPC() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'PC turned off')
        }
    }
}

module.exports = PC