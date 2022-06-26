const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const VacuumCleaner = require('../devices/VacuumCleaner');


//sense room position in the house and doors in the room

class VacuumPositionGoal extends Goal {

    constructor (VacuumCleaner) {
        super()

        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = VacuumCleaner

    }

}



class VacuumPositionIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = this.goal.VacuumCleaner
    }
    
    static applicable (goal) {
        return goal instanceof VacuumPositionGoal
    }

    *exec () {

        while (true) {
            
            let room = yield this.VacuumCleaner.notifyChange('position')
            
            var doors = this.VacuumCleaner.house.rooms[room].doors_to

            this.agent.beliefs.declare('in_room '+ this.VacuumCleaner.house.rooms[room].name, room == this.VacuumCleaner.in_room)
            
            this.agent.beliefs.declare('atStation '+ this.VacuumCleaner.house.rooms[room].name, room == 'aisle')

            this.agent.beliefs.declare('in_room '+ this.VacuumCleaner.prev_room, room == this.VacuumCleaner.prev_room)
            
            doors.forEach(nearRoom => {
            
                if (nearRoom != 'outside' && nearRoom != 'garage' && nearRoom != 'balcony'){
                    this.agent.beliefs.declare('doors_to '+ room + ' ' + nearRoom, room == this.VacuumCleaner.in_room)
                    
                    var doors2 = this.VacuumCleaner.house.rooms[nearRoom].doors_to
                    doors2.forEach(nearRoom2 =>{
                        
                        if (nearRoom2 != 'outside' && nearRoom2 != 'garage' && nearRoom2 != 'balcony'){
                            this.agent.beliefs.declare('doors_to '+ nearRoom + ' ' + nearRoom2, room == this.VacuumCleaner.in_room)
                        }
                    });
                }
            });
            

            this.log('sense:  VacuumCleaner in ' + this.VacuumCleaner.in_room + ' from ' + this.VacuumCleaner.prev_room)
            
            
        }
        
    }

}



module.exports = {VacuumPositionGoal, VacuumPositionIntention}