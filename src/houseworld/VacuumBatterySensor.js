const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const VacuumCleaner = require('../devices/VacuumCleaner');


//sense the battery status of the vacuum cleaner

class VacuumBatteryGoal extends Goal {

    constructor (VacuumCleaner) {
        super()

        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = VacuumCleaner

    }

}

class VacuumBatteryIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {VacuumCleaner} vacuumCleaner */
        this.VacuumCleaner = this.goal.VacuumCleaner
    }
    
    static applicable (goal) {
        return goal instanceof VacuumBatteryGoal
    }

    *exec () {
        
        while (true) {
            
            let chargeStatus = yield this.VacuumCleaner.notifyChange('chargeStatus')

            this.log('sense:  battery status became ' + chargeStatus)
            this.agent.beliefs.declare('charge '+ 'battery', chargeStatus=='charge')
            this.agent.beliefs.declare('exhaust '+ 'battery', chargeStatus == 'exhaust')                
            
        }

    }

}

module.exports = {VacuumBatteryGoal, VacuumBatteryIntention}