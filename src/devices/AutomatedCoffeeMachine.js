const Observable = require('../utils/Observable')
const Dev = require('../devices/Devices')

class AutomatedCoffeeMachine extends Dev {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off')
        this.set ('coffeeStatus', 'not_ready')
        this.set ('coffeeTime', 'no')
    }
    switchOnCoffeeMachine(){
        if (this.status == 'off'){
            this.status = 'on'
            this.coffeeStatus = 'ready'
            this.coffeeTime = 'no'
            this.house.utilities.electricity.consumption += 1;
            console.log('Coffee Machine turned on')
        }
    }
    switchOffCoffeeMachine() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log('Coffee Machine turned off')
        }
    }
}

module.exports = AutomatedCoffeeMachine