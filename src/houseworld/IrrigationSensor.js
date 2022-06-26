const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const Light = require('./Light');
//const Room = require('./Room');
const Irrigator = require('../devices/Irrigator');
//const myHouse = require('./scenario');
//var {House, Kitchen, People, Rooms} = require('./scenario');
const Clock = ('..utils/Clock');

const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const PlanningGoal = require('../pddl/PlanningGoal')

const {WaterLevelGoal, WaterLevelIntention} = require('./WaterLevelSensor')



class IrrigatorGoal extends Goal {

    constructor (Irrigator) {
        super()

        /** @type {Irrigator} Irrigator */
        this.Irrigator = Irrigator

    }

}



class IrrigatorIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Irrigator} Irrigator */
        this.Irrigator = this.goal.Irrigator
    }
    
    static applicable (goal) {
        return goal instanceof IrrigatorGoal
    }

    *exec () {
        
        while (true) {
            
            let status = yield this.Irrigator.notifyChange('status')
            
            console.log('the Irrigator plan starts')
            console.log(this.Irrigator.status)
            this.log('sense:  Irrigator in ' + this.Irrigator.name+ ' became ' + status)
            
            
            this.agent.beliefs.declare('switched_on ' + 'irrigator', status=='on')
            this.agent.beliefs.declare('switched_off ' + 'irrigator', status=='off')

            console.log('status of Irrigator in: ', this.Irrigator.name, ' : ', this.Irrigator.status)

                
        }

    }

}


module.exports = {IrrigatorGoal, IrrigatorIntention}