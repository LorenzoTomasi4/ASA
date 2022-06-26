const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')
const VacuumCleaner = require('..device/VacuumCleaner')



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

    class move extends FakeAction {
        static parameters = ['r', 'to', 'vacuumCleaner']
        static precondition = [ ['inRoom', 'r'], ['doorsTo', 'r', 'to'], ['clean', 'r'] ]
        static effect = [ ['inRoom', 'to'], ['doorsTo', 'to', 'r'], ['not inRoom', 'r'] ]
    }

    class clean extends  FakeAction{
        static parameters = ['r']
        static precondition = [ ['dirty', 'r'], ['inRoom', 'r'] ]
        static effect = [ ['clean', 'r'], ['not dirty', 'r'] ]
    }

    world.move = function ({r, to, vacuumCleaner} = args) {
        this.log('move', r, to, vacuumCleaner)
        return new move(world, {r, to, vacuumCleaner} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.move failed:', err.message || err); throw err;})
    }

    world.clean = function ({m, r, coffMach} = args) {
        this.log('clean', r, vacuumCleaner)
        return new clean(world, {r, vacuumCleaner} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.clean failed:', err.message || err); throw err;})
    }

}




/**
 * coffMach agents
 */
{
    class move extends pddlActionIntention {
        static parameters = ['r', 'to'];
        static precondition = [ ['inRoom', 'r'], ['doorsTo', 'r', 'to'], ['clean', 'r']];
        static effect = [ ['inRoom', 'to'], ['doorsTo', 'to', 'r'], ['not inRoom', 'r'] ];
        *exec ({r, to}=parameters) {
            yield world.move({r, to, vacuumCleaner: this.agent.name})
        }
    }

    class clean extends pddlActionIntention {
        static parameters = ['r'];
        static precondition = [ ['dirty', 'r'], ['inRoom', 'r'] ];
        static effect = [ ['clean', 'r'], ['not dirty', 'r'] ];
        *exec ({r}=parameters) {
            yield world.clean({r, vacuumCleaner: this.agent.name})
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
        // a1.beliefs.declare('on-table a')
        // a1.beliefs.declare('on b a')
        // a1.beliefs.declare('clear b')
        // a1.beliefs.declare('empty')
        world.beliefs.observeAny( sensor(a1) )
        // let {PlanningIntention} = require('../pddl/BlackboxIntentionGenerator')([PickUp, PutDown, Stack, UnStack])
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([switchOnCoffeeMachine, switchOffCoffeeMachine])
        a1.intentions.push(OnlinePlanning)
        a1.intentions.push(RetryFourTimesIntention)
        // console.log('a1 entries', a1.beliefs.entries)
        // console.log('a1 literals', a1.beliefs.literals)
        // a1.postSubGoal( new PlanningGoal( { goal: ['holding a'] } ) ) // by default give up after trying all intention to achieve the goal
        a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['switched-off m', 'coffee-ready r'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
    }
}


world.beliefs.declare('inRoom r')
world.beliefs.declare('inRoom m')
world.beliefs.declare('coffee-not-ready r')
world.beliefs.declare('coffee-time t')