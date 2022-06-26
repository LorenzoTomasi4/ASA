const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Person = require('./Person');

class OnlySensePresenceGoal extends Goal {

    constructor (people = []) {
        super()

        /** @type {Array<Person>} people */
        this.people = people

    }

}

class OnlySensePresenceIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Person>} people */
        this.people = this.goal.people
    }
    
    static applicable (goal) {
        return goal instanceof OnlySensePresenceGoal
    }

    *exec () {
        var roomsGoals = []
        for (let p of this.people) {
            
            let roomGoalPromise = new Promise( async res => {
                while (true) {
                    
                    
                    let newRoom = await (p.notifyChange('in_room'))

                    
                    p.house.rooms[newRoom].addPresence()
                    p.house.rooms[p.prev_room].remPresence()

                    //check the presence in the newRoom 
                    if (p.house.rooms[newRoom].presence > 0){
                        p.house.rooms[newRoom].status = 'not_empty'
                        //console.log('now ', newRoom, ' is ', p.house.rooms[newRoom].status)
                    }
                    else {
                        p.house.rooms[newRoom].status = 'empty'
                        //console.log('now ', newRoom, ' is ', p.house.rooms[newRoom].status)
                    }

                    //check the presence in the previous room
                    if (p.house.rooms[p.prev_room].presence == 0){
                        p.house.rooms[p.prev_room].status = 'empty'
                        //console.log('now ', p.prev_room, ' is ', p.house.rooms[p.prev_room].status)
                    }
                    else {
                        p.house.rooms[p.prev_room].status = 'not_empty'
                        //console.log('now ', p.prev_room, ' is ', p.house.rooms[p.prev_room].status)
                    }

                    //console.log('presence in the new room: ', newRoom, ' is :', p.house.rooms[newRoom].presence)
                    //console.log('presence in the previous room: ', p.prev_room, ' is :', p.house.rooms[p.prev_room].presence)
                    

                    this.log('sense: ' + p.name + ' is gone in ' + newRoom)
                    this.agent.beliefs.declare('presenceIn '+p.in_room, p.house.rooms[newRoom].status == 'not_empty')

                    //update the presence in the house
                
                    p.house.presence = 0

                    for (r in p.house.rooms){
                        if (r != 'outside' && r != 'garage'){
                            p.house.presence += p.house.rooms[r].presence
                        }
                    }

                    if (p.house.presence == 0){
                        if(p.house.status != 'empty')
                            p.house.status = 'empty'
                    }
                    else {
                        if(p.house.status === 'empty')
                            p.house.status = 'not_empty'
                    }

                }
            });

            roomsGoals.push(roomGoalPromise)
            
        }
        yield Promise.all(roomsGoals)
    }

}





module.exports = {OnlySensePresenceGoal, OnlySensePresenceIntention}