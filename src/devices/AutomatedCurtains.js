const Observable = require('../utils/Observable')


class AutomatedCurtains extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'close')
    }
    openCurtains() {
        if (this.status = 'close'){
            this.status = 'open'
            this.house.utilities.electricity.consumption += 1;
            console.log('Curtains open')
        }
    }
    closeCurtains() {
        if (this.status = 'open'){
            this.status = 'close'
            this.house.utilities.electricity.consumption -= 1;
            console.log('Curtains closed')
        }
    }
}

module.exports = AutomatedCurtains