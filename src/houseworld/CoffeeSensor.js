const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const AutomatedCoffeeMachine = require('../devices/AutomatedCoffeeMachine');




class CoffeeGoal extends Goal {

    constructor (coffeeMachine) {
        super()

        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = coffeeMachine

    }

}



class CoffeeIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {AutomatedCoffeeMachine} coffeeMachine */
        this.coffeeMachine = this.goal.coffeeMachine
    }
    
    static applicable (goal) {
        return goal instanceof CoffeeGoal
    }

    *exec () {
        var coffeeGoals = []
        //scorro le stanze
        
            
        let coffeeGoalPromise = new Promise( async res => {
            while (true) {
                //wait that coffee status changes
                let coffeeStatus = await (this.coffeeMachine.notifyChange('coffeeStatus'))
            
                this.log('sense:  coffee is ' + coffeeStatus)
                this.agent.beliefs.declare('coffee-ready ' + 'r', coffeeStatus=='ready')
                this.agent.beliefs.declare('coffee-not-ready ' + 'r', coffeeStatus=='not_ready')
                console.log('status of coffee: ', coffeeStatus)
            
            }
        });
        
        coffeeGoals.push(coffeeGoalPromise)
            
        yield Promise.all(coffeeGoals)
    }

}



module.exports = {CoffeeGoal, CoffeeIntention}