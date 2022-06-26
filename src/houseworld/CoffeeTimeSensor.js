const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const AutomatedCoffeeMachine = require('../devices/AutomatedCoffeeMachine');

//check when is time to make coffee


class CoffeeTimeGoal extends Goal {

    constructor (coffeeMachine) {
        super()

        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = coffeeMachine

    }

}

class CoffeeTimeIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = this.goal.coffeeMachine
    }
    
    static applicable (goal) {
        return goal instanceof CoffeeTimeGoal
    }

    *exec () {
        var coffeeTimeGoals = []
            
        let coffeeTimeGoalPromise = new Promise( async res => {
            while (true) {
                
                let coffeeTime = await (this.coffeeMachine.notifyChange('coffeeTime'))
                
                this.log('sense:  coffeeTime? ' + coffeeTime)
                this.agent.beliefs.declare('coffee-time '+ 't', coffeeTime=='yes')
            
            }
        });
        
        coffeeTimeGoals.push(coffeeTimeGoalPromise)
        
        yield Promise.all(coffeeTimeGoals)
    }

}



module.exports = {CoffeeTimeGoal, CoffeeTimeIntention}