const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./Room');

//check the cleanliness of the House

class CleanlinessHouseGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} lights */
        this.rooms = rooms

    }

}

class CleanlinessHouseIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Room>} lights */
        this.rooms = this.goal.rooms
    }
    
    static applicable (goal) {
        return goal instanceof CleanlinessHouseGoal
    }

    *exec () {
        var roomsGoals = []
        for (let r of this.rooms) {
            
            let roomGoalPromise = new Promise( async res => {
                while (true) {                
                    //wait that the cleanliness of a room change to check if the house is clean or not                
                    let cleanliness = await (r.notifyChange('cleanliness'))
                    
                    this.log('sense: ' + r.name + ' became ' + cleanliness)
                    this.agent.beliefs.declare('clean '+r.name, cleanliness=='clean')                    
                    this.agent.beliefs.declare('dirty '+r.name, cleanliness=='dirty')
                    
                    if (cleanliness == 'dirty'){
                        r.house.cleanliness = 'dirty'
                    }
                     
                    this.log('sense: the house is: ' + r.house.cleanliness)
                    this.agent.beliefs.declare('clean '+ 'h', r.house.cleanliness=='clean')
                    //this.agent.beliefs.declare('house-not-clean'+ 'h', r.house.cleanliness=='dirty')
                }
            });

            roomsGoals.push(roomGoalPromise)
            
        }
        yield Promise.all(roomsGoals)
    }

}


module.exports = {CleanlinessHouseGoal, CleanlinessHouseIntention}