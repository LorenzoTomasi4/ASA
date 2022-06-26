const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Irrigator = require('../devices/Irrigator');


//sense if the water is enough or not

class WaterLevelGoal extends Goal {

    constructor (Irrigator) {
        super()

        /** @type {Irrigator} irrigator */
        this.Irrigator = Irrigator

    }

}



class WaterLevelIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Irrigator} irrigator */
        this.Irrigator = this.goal.Irrigator
    }
    
    static applicable (goal) {
        return goal instanceof WaterLevelGoal
    }

    *exec () {
        
        while (true) {
            
            let waterStat = yield this.Irrigator.notifyChange('waterStatus')
            console.log('check the water level')
            
            this.log('sense:  Water Status: ' + this.Irrigator.name + ': ' + waterStat)
            

            this.agent.beliefs.declare('water_enough ' + 'w', waterStat == 'enough')
            this.agent.beliefs.declare('water_not_enough ' + 'w', waterStat == 'not_enough')            
            
        }
        
    }

}

module.exports = {WaterLevelGoal, WaterLevelIntention}