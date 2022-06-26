const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const Light = require('./Light');
//const Room = require('./Room');
const AutomatedCoffeeMachine = require('../devices/AutomatedCoffeeMachine');
//const myHouse = require('./scenario');
//var {House, Kitchen, People, Rooms} = require('./scenario');
//var prova = require('./scenario')



class CoffeeMachineGoal extends Goal {

    constructor (coffeeMachine) {
        super()

        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = coffeeMachine

    }

}



class CoffeeMachineIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = this.goal.coffeeMachine
    }
    
    static applicable (goal) {
        return goal instanceof CoffeeMachineGoal
    }

    *exec () {
        var coffeeMachineGoals = []
        //scorro le stanze
        
            
        let coffeeMachineGoalPromise = new Promise( async res => {
            while (true) {
                //wait that coffeeMachine status changes
                let status = await (this.coffeeMachine.notifyChange('status'))
            
                this.log('sense:  coffeeMachine in ' + this.coffeeMachine.name + ' became ' + status)
                this.agent.beliefs.declare('switched-on ' + 'coffee_machine', status=='on')
                this.agent.beliefs.declare('switched-off ' + 'coffee_machine', status=='off')
                console.log('status of coffeeMachine: ', this.coffeeMachine.name, ' : ', status)
            
            }
        });
        
        coffeeMachineGoals.push(coffeeMachineGoalPromise)
            
        yield Promise.all(coffeeMachineGoals)
    }

}



module.exports = {CoffeeMachineGoal, CoffeeMachineIntention}