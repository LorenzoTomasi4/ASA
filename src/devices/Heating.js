const Observable = require('../utils/Observable')
const Dev = require('../devices/Devices')

class Heater extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }

    turnOnHeater() {
        this.status = 'on'
        //this.house.utilities.electricity.consumption += 1;
        console.log(this.name,  'Heating turned on')
    }

    turnOffHeater() {
        this.status = 'off'
        //this.house.utilities.electricity.consumption -= 1;
        console.log(this.name, 'Heating turned off')
    }

    turnOnHeaterEcoMode(){
        this.status = 'eco'
        //this.house.utilities.electricity.consumption += 0.5
        console.log(this.name,  'Heating turned on in eco Mode')
    }
}

module.exports = Heater