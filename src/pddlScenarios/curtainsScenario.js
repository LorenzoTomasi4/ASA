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

    class closeCurtains extends FakeAction {
        static parameters = ['c', 't', 'curt']
        static precondition = [ ['open', 'c'], ['movie-time', 't'] ]
        static effect = [ ['closed', 'c'], ['not open', 'c'] ]
    }

    class openCurtains extends FakeAction {
        static parameters = ['c', 't', 'curt']
        static precondition = [ ['closed', 'c'], ['end-movie-time', 't'] ]
        static effect = [ ['open', 'c'], ['not closed', 'c'] ]
    }

    world.closeCurtains = function ({c, t, curt} = args) {
        this.log('closeCurtains', c, t, curt)
        return new closeCurtains(world, {c, t, curt} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.closeCurtains failed:', err.message || err); throw err;})
    }

    world.openCurtains = function ({c, t, curt} = args) {
        this.log('openCurtains', c, t, curt)
        return new openCurtains(world, {c, t, curt} ).checkPreconditionAndApplyEffect()
        .catch(err=>{this.error('world.openCurtains failed:', err.message || err); throw err;})
    }

}



/**
 * curt agents
 */
{
    class closeCurtains extends pddlActionIntention {
        static parameters = ['c', 't'];
        static precondition = [ ['open', 'c'], ['movie-time', 't']];
        static effect = [ ['closed', 'c'], ['not open', 'c'] ];
        *exec ({c, t}=parameters) {
            yield world.closeCurtains({c, t, curt: this.agent.name})
        }
    }

    class openCurtains extends pddlActionIntention {
        static parameters = ['c', 't'];
        static precondition = [ ['closed', 'c'], ['end-movie-time', 't'] ];
        static effect = [ ['open', 'c'], ['not closed', 'c'] ];
        *exec ({c, t}=parameters) {
            yield world.openCurtains({c, t, curt: this.agent.name})
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
        let {OnlinePlanning} = require('../pddl/OnlinePlanner')([closeCurtains, openCurtains])
        a1.intentions.push(OnlinePlanning)
        a1.intentions.push(RetryFourTimesIntention)
        
        a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['closed kc', 'closed lc'] } ) } ) ) // try to achieve the PlanningGoal for 4 times
    }
    
}


world.beliefs.declare('open kc')
world.beliefs.declare('open lc')
world.beliefs.declare('movie-time t')