const Observable = require('../utils/Observable');
const chalk = require('chalk')

class Person extends Observable{
    constructor (house, name, sleepTracker, sleepTimeGoal){
        super()
        this.house = house;
        this.name = name;
        //this.sleepTime = sleepTime;
        this.sleepTracker = sleepTracker;
        this.timeFallAsleep = 0
        this.timeWakeUp = 0
        this.sleepTimeGoal = sleepTimeGoal;
        this.set ('in_room', 'outside');
        this.set ('status', 'awake');
        this.set ('prev_room', 'garage');
        
    }
    moveTo (to) {
        if (this.house.rooms[this.in_room].includ(to)){
            console.log(this.name, '\t moved from', this.in_room, 'to', to)

            this.prev_room = this.in_room                       
            this.in_room = to
            
            //when someone enter in a room the room becomes dirty 
            this.house.rooms[this.in_room].cleanliness = 'dirty'

            //console.log('this.in_room', this.in_room)
            //console.log(this.in_room, this.house.rooms[this.in_room].status)
            //console.log(this.in_room, this.house.rooms[this.in_room].cleanliness)
            //console.log('prev_room', this.prev_room)
            return true;
        }
        if (this.in_room == to){
            console.log(this.name, '\t is already in', to)
            return false;
        }
        else {
            console.log(this.name, '\t cannot move from', this.in_room, 'to', to)
            return false;
        }
    }
    sleep(){
        this.status = 'asleep'
        console.log(this.name, "FALL ASLEEP")
        //this.timeFallAsleep = time
    }
    wakeUp(){
        this.status = 'awake'
        console.log(this.name, "WOKE UP")
        //this.timeWakeUp = time
    }

}

module.exports = Person