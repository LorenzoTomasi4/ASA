const Observable = require('../utils/Observable')


class CookerHood extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        //this.set1 ('vapor_status', 'no_vapor')
        this.set ('status', 'off')
    }
    turnOnCookerHood() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            console.log(this.name,  'Cooker hood turned on')
        }
    }
    turnOffCookerHood() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'Cooker hood turned off')
        }
    }
}

module.exports = CookerHood