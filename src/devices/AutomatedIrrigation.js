const Observable = require('../utils/Observable')


class AutomatedIrrigation extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off')
    }
    switchOn() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            this.house.utilities.water.consumption +=1;

            console.log('Irrigation turned on')
        }
    }
    switchOff() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            this.house.utilities.water.consumption -=1;

            console.log('Irrigation stopped')
        }
    }
}

module.exports = AutomatedIrrigation