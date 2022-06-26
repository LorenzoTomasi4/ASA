const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./Room');




class LightsGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} lights */
        this.rooms = rooms

    }

}



class LightIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Room>} lights */
        this.rooms = this.goal.rooms
    }
    
    static applicable (goal) {
        return goal instanceof LightsGoal
    }

    *exec () {
        var roomsGoals = []
        for (let r of this.rooms) {
            
            let roomGoalPromise = new Promise( async res => {
                while (true) {
                    
                    let status = await (r.notifyChange('status'))
                    if (r.house.rooms[r.name].light != 'no_light') {
                        
                        if (status == 'not_empty'){
                            if (r.house.rooms[r.name].light.status == 'off'){
                                r.house.rooms[r.name].light.switchOn()
                                
                                this.log('sense:  presence in ' + r.name + ' became ' + status)
                                this.agent.beliefs.declare('light_on '+r.name, r.house.rooms[r.name].light.status=='on')
                                console.log('status of LIGHT IN: ', r.name, ' : ', r.house.rooms[r.name].light.status)
                            }
                        }
                        else {
                            //check if it is already off
                            if (r.house.rooms[r.name].light.status == 'off'){
                                r.house.rooms[r.name].light.switchOff()
                                this.log('sense: presence in ' + r.name + ' became ' + status)
                                this.agent.beliefs.declare('light_off '+r.name, r.house.rooms[r.name].light.status=='off')
                                console.log('status of LIGHT IN: ', r.name, ' : ', r.house.rooms[r.name].light.status)
                            }
                        }
                    }
                }
            });

            roomsGoals.push(roomGoalPromise)
            
        }
        yield Promise.all(roomsGoals)
    }

}


module.exports = {LightsGoal, LightIntention}