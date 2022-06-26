const Observable = require('../utils/Observable')


class SmartFridge extends Observable {
    constructor (house, name){
        super()
        this.house = house
        this.name = name
        this.set ('status', 'camerOff') 
        this.set ('door', 'closed')
        this.set ('lightStatus', 'off')
    }
    alarmSmartFridge() {
        this.status = 'alarmOn'
        this.house.utilities.electricity.consumption += 1;
        //console.log(this.name, '\t moved from', this.in_room, 'to', to)
        console.log(this.name,  'alarm (door open)')
    }
    turnOnFridgeCamera() {
        if (this.status == 'cameraOff'){
            this.status = 'cameraOn'
            this.lightStatus = 'on'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'Fridge camera turned on')
        }
    }
    turnOffFridgeCamera() {
        if (this.status == 'camerOn'){
            this.status = 'cameraOff'
            this.lightStatus = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.name, 'Fridge camera turned off')
        }
    }
    TurnOffLight(){

    }
}

module.exports = SmartFridge