const Observable = require('../utils/Observable')


class Printer extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'off') 
    }
    switchOnPrinter() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            console.log(this.name,  'print turned on')
        }
    }

    print(){
        this.status = 'printing'
        console.log(this.name, 'printing...')
    }

    switchOffPrinter() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'print turned off')
        }
    }
}

module.exports = Printer