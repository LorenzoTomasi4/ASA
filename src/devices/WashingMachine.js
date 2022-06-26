const Observable = require('../utils/Observable')


class WashingMachine extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOffWashingMachine() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            this.house.utilities.water.consumption += 1;
        
            console.log(this.name,  'Washing machine turned on')
        }
    }
    turnOnWashingMachine() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            this.house.utilities.water.consumption -= 1;
            console.log(this.name, 'Washing machine turned off')
        }
    }
}

module.exports = WashingMachine