const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./Room');






class CleanlinessGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>}  */
        this.rooms = rooms

    }

}



class CleanlinessIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Room>}  */
        this.rooms = this.goal.rooms
    }
    
    static applicable (goal) {
        return goal instanceof CleanlinessGoal
    }

    *exec () {
        var roomsGoals = []
        //scorro le stanze
        for (let r of this.rooms) {
            let roomGoalPromise = new Promise( async res => {
                while (true) {
                    let cleanliness = await (r.notifyChange('cleanliness'))

                    this.log('sense: ' + r.name + ' became ' + cleanliness)
                    this.agent.beliefs.declare('clean '+r.name, cleanliness=='clean')                    
                    this.agent.beliefs.declare('dirty '+r.name, cleanliness=='dirty')
                
                }
            });
            roomsGoals.push(roomGoalPromise)
        
            
            
        }
        yield Promise.all(roomsGoals)
    }

}





module.exports = {CleanlinessGoal, CleanlinessIntention}