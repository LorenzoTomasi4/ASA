const Observable = require('../utils/Observable')


class HomeTheatre extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    turnOnHomeTheatre() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            console.log(this.name,  'home theatre turned on')
        }
    }
    turnOffHomeTheatre() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'home theatre turned off')
        }
    }
}

module.exports = HomeTheatre