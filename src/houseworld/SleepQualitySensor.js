const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Person = require('./Person');
//const Light = require('./Light');
const Room = require('./Room');
//const myHouse = require('./scenario');
//var {House, Kitchen, People, Rooms} = require('./scenario');
//var prova = require('./scenario')
//const Clock =  require('../utils/Clock')



class SleepGoal extends Goal {

    constructor (people = []) {
        super()

        /** @type {Array<Person>} people */
        this.people = people

    }

}



class SleepIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Person>} people */
        this.people = this.goal.people
    }
    
    static applicable (goal) {
        return goal instanceof SleepGoal
    }

    *exec () {
        var peopleGoals = []
        for (let p of this.people) {
            
            let personGoalPromise = new Promise( async res => {
                while (true) {
                    
                    let status = await (p.notifyChange('status'))
                    
                    if (p.house.people[p.name].status == 'awake') {
                        p.house.devices[p.sleepTracker].awaken()
                        this.log('sense: ' + p.name + ' is ' + status)
                        this.agent.beliefs.declare('awake '+p.name, p.house.people[p.name].status=='awake')
                        console.log('status of : ', p.name, ' : ', p.house.people[p.name].status)
                    }
                    else {
                        p.house.devices[p.sleepTracker].fallAsleep()
                        this.log('sense: ' + p.name + ' is ' + status)
                        this.agent.beliefs.declare('asleep '+p.name, p.house.people[p.name].status=='asleep')
                        console.log('status of : ', p.name, ' : ', p.house.people[p.name].status)
                        
                    }
                }
            });

            peopleGoals.push(personGoalPromise)
            
        }
        yield Promise.all(peopleGoals)
    }

}





module.exports = {SleepGoal, SleepIntention}