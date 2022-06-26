const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')



/**
 * World agent
 */
const world = new Agent('world');
{

    class FakeAction {

        constructor (agent, parameters) {
            this.agent = agent
            this.parameters = parameters
        }

        get precondition () {
            return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
        }
        
        checkPrecondition () {
            return this.agent.beliefs.check(...this.precondition);
        }

        get effect () {
            return pddlActionIntention.ground(this.constructor.effect, this.parameters)
        }

        applyEffect () {
            for ( let b of this.effect )
                this.agent.beliefs.apply(b)
        }

        async checkPreconditionAndApplyEffect () {
            if ( this.checkPrecondition() ) {
                this.applyEffect()
                await new Promise(res=>setTimeout(res,1000))
            }
            else
                throw new Error('pddl precondition not valid'); //Promise is rejected!
        }

    }

    class switchOnCoffeeMachine extends FakeAction {
        static parameters = ['m', 'c', 'r', 't', 'coffMach']
        static precondition = [ ['switched-off', 'm'], ['cup-present', 'c'], ['coffee-not-ready', 'r'], ['coffee-time', 't'] ]
        static effect = [ ['switched-on', 'm'], ['not switched-off', 'm'], ['coffee-ready', 'r'], ['not coffee-not-ready', 'r'] ]
    }

    class switchOffCoffeeMachine extends FakeAction {
        static parameters = ['m', 'r', 'coffMach']
        static precondition = [ ['switched-on', 'm'], ['coffee-ready', 'r'] ]
        static effect = [ ['switched-off', 'm'], ['not switched-on', 'm'] ]
    }

    world.switchOnCoffeeMachine = function ({m, c, r, t, coffMach} = args) {
        this.log('switchOnCoffeeMachine', m, c, r, t, coffMach)
        return new switchOnCoffeeMachine(world, {m, c, r, t, coffMach} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.switchOnCoffeeMachine failed:', err.message || err); throw err;})
    }

    world.switchOffCoffeeMachine = function ({m, r, coffMach} = args) {
        this.log('switchOffCoffeeMachine', m, r, coffMach)
        return new switchOffCoffeeMachine(world, {m, r, coffMach} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.switchOffCoffeeMachine failed:', err.message || err); throw err;})
    }

}




/**
 * coffMach agents
 */
{
    class switchOnCoffeeMachine extends pddlActionIntention {
        static parameters = ['m', 'c', 'r', 't'];
        static precondition = [ ['switched-off', 'm'], ['cup-present', 'c'], ['coffee-not-ready', 'r'], ['coffee-time', 't']];
        static effect = [ ['switched-on', 'm'], ['not switched-off', 'm'], ['coffee-ready', 'r'], ['not coffee-not-ready', 'r'] ];
        *exec ({m, c, r, t}=parameters) {
            yield world.switchOnCoffeeMachine({m, c, r, t, coffMach: this.agent.name})
        }
    }

    class switchOffCoffeeMachine extends pddlActionIntention {
        static parameters = ['m', 'r'];
        static precondition = [ ['switched-on', 'm'], ['coffee-ready', 'r'] ];
        static effect = [ ['switched-off', 'm'], ['not switched-on', 'm'] ];
        *exec ({m, r}=parameters) {
            yield world.switchOffCoffeeMachine({m, r, coffMach: this.agent.name})
        }
    }

    class RetryGoal extends Goal {}
    class RetryFourTimesIntention extends Intention {
        static applicable (goal) {
            return goal instanceof RetryGoal
        }
        *exec ({goal}=parameters) {
            for(let i=0; i<4; i++) {
                let goalAchieved = yield this.agent.postSubGoal( goal )
                if (goalAchieved)
                    return;
                this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
                yield this.agent.beliefs.notifyAnyChange()
            }
        }
    }

    var sensor = (agent) => (value,key,observable) => {
        let predicate = key.split(' ')[0]
        let arg1 = key.split(' ')[1]
        let arg2 = key.split(' ')[2]
        if (predicate=='holding')
            if (arg2==agent.name)
                key = ' '+arg1; //key.split(' ').slice(0,2).join(' ')
            else
                return;
        else if (predicate=='empty')
            if (arg1==agent.name)
                key = 'empty'
            else
                return;
        value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
    }
    
    {
        let a1 = new Agent('a1')
        
        world.beliefs.observeAny( sensor(a1) )
        
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([switchOnCoffeeMachine, switchOffCoffeeMachine])
        a1.intentions.push(OnlinePlanning)
        a1.intentions.push(RetryFourTimesIntention)
        
        a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['switched-off m', 'coffee-ready r'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
    }
}


world.beliefs.declare('switched-off m')
world.beliefs.declare('cup-present c')
world.beliefs.declare('coffee-not-ready r')
world.beliefs.declare('coffee-time t')