const Observable = require('../utils/Observable')
const Dev = require('../devices/Devices')


class Light extends Dev {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    switchOnLight() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            //console.log(this.name, '\t moved from', this.in_room, 'to', to)
            console.log(this.name,  'light turned on')
        }
    }
    switchOffLight() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'light turned off')
        }
    }
}

module.exports = Light