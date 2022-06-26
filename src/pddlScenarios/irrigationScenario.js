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

    class switchOnIrrigation extends FakeAction {
        static parameters = ['i', 'r', 'w', 'irrig']
        static precondition = [ ['switched-off', 'i'], ['rain-not-expected', 'r'], ['water-not-enough', 'w'] ]
        static effect = [ ['switched-on', 'i'], ['not switched-off', 'i'], ['enough-water', 'w'], ['not water-not-enough', 'w'] ]
    }

    class switchOffIrrigation extends FakeAction {
        static parameters = ['i', 'w', 'irrig']
        static precondition = [ ['switched-on', 'i'], ['enough-water', 'w'] ]
        static effect = [ ['switched-off', 'i'], ['not switched-on', 'i'] ]
    }

    world.switchOnIrrigation = function ({i, r, w, irrig} = args) {
        this.log('switchOnIrrigation', i, r, w, irrig)
        return new switchOnIrrigation(world, {i, r, w, irrig} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.switchOnIrrigation failed:', err.message || err); throw err;})
    }

    world.switchOffIrrigation = function ({i, w, irrig} = args) {
        this.log('switchOffIrrigation', i, w, irrig)
        return new switchOffIrrigation(world, {i, w, irrig} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.switchOffIrrigation failed:', err.message || err); throw err;})
    }

}



/**
 * irrig agents
 */
{
    class switchOnIrrigation extends pddlActionIntention {
        static parameters = ['i', 'r', 'w'];
        static precondition = [ ['switched-off', 'i'], ['rain-not-expected', 'r'], ['water-not-enough', 'w']];
        static effect = [ ['switched-on', 'i'], ['not switched-off', 'i'], ['enough-water', 'w'], ['not water-not-enough', 'w'] ];
        *exec ({i, r, w}=parameters) {
            yield world.switchOnIrrigation({i, r, w, irrig: this.agent.name})
        }
    }

    class switchOffIrrigation extends pddlActionIntention {
        static parameters = ['i', 'w'];
        static precondition = [ ['switched-on', 'i'], ['enough-water', 'w'] ];
        static effect = [ ['switched-off', 'i'], ['not switched-on', 'i'] ];
        *exec ({i, w}=parameters) {
            yield world.switchOffIrrigation({i, w, irrig: this.agent.name})
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
                key = 'holding '+arg1; //key.split(' ').slice(0,2).join(' ')
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
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([switchOnIrrigation, switchOffIrrigation])
        a1.intentions.push(OnlinePlanning)
        a1.intentions.push(RetryFourTimesIntention)
        a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['switched-off i', 'enough-water w'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
    }
}


world.beliefs.declare('switched-off i')
world.beliefs.declare('rain-not-expected r')
world.beliefs.declare('water-not-enough w')