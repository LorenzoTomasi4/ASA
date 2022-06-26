const Observable = require('../utils/Observable')
const Dev = require('../devices/Devices')


class Irrigator extends Dev {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.waterLevel = 25
        this.set ('status', 'off')
        this.set ('waterStatus', 'not_enough')
    }
    
    irrigate(){
        //this.house.utilities.water.consumption += 1;
        this.waterLevel += 25
        console.log('irrigate the plants!')
        while (this.waterLevel <= 75){
            this.house.utilities.water.consumption += 1;
            this.waterLevel += 25
        }
        if (this.waterLevel >= 80){
            this.waterStatus = 'enough'
            this.house.utilities.water.consumption = 0;
            console.log('enough water')
        }
        else {
            this.waterStatus = 'not_enough'
            console.log('water not enough')
        }
    }

}

module.exports = Irrigator