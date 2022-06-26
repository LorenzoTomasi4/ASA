const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const Light = require('./Light');
//const Room = require('./Room');
const VacuumCleaner = require('../devices/VacuumCleaner');



class VacuumCleanerGoal extends Goal {

    constructor (VacuumCleaner) {
        super()

        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = VacuumCleaner

    }

}



class VacuumCleanerIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = this.goal.VacuumCleaner
    }
    
    static applicable (goal) {
        return goal instanceof VacuumCleanerGoal
    }

    *exec () {
        
        while (true) {
            
            let status = yield this.VacuumCleaner.notifyChange('status')

            this.log('sense:  VacuumCleaner in ' + this.VacuumCleaner.in_room + ' became ' + status)
            this.agent.beliefs.declare('switched_on '+ 'vacuumCleaner', status=='on')
            this.agent.beliefs.declare('switched_off '+ 'vacuumCleaner', status=='off')
            console.log('status of VacuumCleaner in: ', this.VacuumCleaner.in_room, ' : ', this.VacuumCleaner.status)

        }
        //});
    

        //CookerHoodGoals.push(CookerHoodGoalPromise)
        
        
        //yield Promise.all(CookerHoodGoals)
    }

}





module.exports = {VacuumCleanerGoal, VacuumCleanerIntention}