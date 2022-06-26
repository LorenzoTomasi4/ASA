const Observable = require('../utils/Observable')


class Dishwasher extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOnDishwasher() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            this.house.utilities.water.consumption += 1;
            console.log(this.name,  'dishwasher turned on')
        }
    }
    turnOffDishwasher() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            this.house.utilities.water.consumption -= 1;
            console.log(this.name, 'dishwasher turned off')
        }
    }
}

module.exports = Dishwasher