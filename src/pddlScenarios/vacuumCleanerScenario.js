const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')
const VacuumCleaner = require('..device/VacuumCleaner')


const world = new Agent('world');
/**
 * vacuumCleaner agents
 */
{
    class moveV extends pddlActionIntention {
        static parameters = ['r', 'to', 'vacuumCleaner'];
        static precondition = [ ['in_room', 'r'], ['doorsTo', 'r', 'to'], ['clean', 'r']];
        static effect = [ ['in_room', 'to'], ['doorsTo', 'to', 'r'], ['not inRoom', 'r'] ];
        *exec ({r, to, vacuumCleaner}=parameters) {
            yield VacuumCleaner.moveTo(to)
        }
    }

    class cleanV extends pddlActionIntention {
        static parameters = ['r', 'vacuumCleaner'];
        static precondition = [ ['dirty', 'r'], ['inRoom', 'r'] ];
        static effect = [ ['clean', 'r'], ['not dirty', 'r'] ];
        *exec ({r, vacuumCleaner}=parameters) {
            yield VacuumCleaner.clean()
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