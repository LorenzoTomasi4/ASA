const Observable = require('../utils/Observable')
//const Dev = require('../devices/Device')


class VacuumCleaner extends Observable {
    constructor (house, in_room){
        super()
        this.house = house
        this.in_room = in_room
        this.prev_room = null
        this.chargeLevel = 100
        this.set ('status', 'off')
        this.set ('position', 'aisle')
        this.set ('chargeStatus', 'charge')
    }
    switchOnVacuum() {
        this.status = 'on'
        //this.house.utilities.electricity.consumption -= 1;
        console.log('VacuumCleaner', this.status)
    }
    clean(){
        this.house.rooms[this.in_room].cleanliness = 'clean'
        console.log (this.in_room, 'is now: ', this.house.rooms[this.in_room].cleanliness)
        this.chargeLevel -= 25
        if (this.chargeLevel <= 25){
            this.chargeStatus = 'exhaust'
        }
    }

    moveTo (to) {
        if (this.house.rooms[this.in_room].includ(to)){
            //console.log('vacuum Cleaner', '\t moved from', this.in_room, 'to', to)

            this.prev_room = this.in_room                        
            this.in_room = to
            this.position = to

            //console.log('POSITION OF VACUUM CLEANER: ', this.position)
            //console.log('this.in_room', this.in_room)
            //console.log(this.in_room, this.house.rooms[this.in_room].status)
            //console.log('prev_room', this.prev_room)
            return true;
        }
        if (this.in_room == to){
            //console.log('vacuum Cleaner', '\t is already in', to)
            return false;
        }
        else {
            console.log('vacuum Cleaner', '\t cannot move from', this.in_room, 'to', to)
            return false;
        }
    }

    returnToStation(){
        if (this.in_room == 'kitchen'){
            this.moveTo('livingRoom')
        }
        if (this.in_room == 'bathroom2'){
            this.moveTo('masterBedroom')
        }
        if (this.in_room != 'aisle'){
            this.moveTo('aisle')
        }
    }

    recharge(){
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0.5;
        while(this.chargeLevel <= 75){
            this.chargeLevel += 25
        }
        this.chargeStatus = 'charge'
        this.house.utilities.electricity.consumption -= 0.5;
    }

    switchOffVacuum() {
        this.status = 'off'
        //this.house.utilities.electricity.consumption -= 1;
        console.log('vacuum cleaner turned off')
    }
}

module.exports = VacuumCleaner