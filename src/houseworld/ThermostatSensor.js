const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Room = require('./Room');


class ThermostatGoal extends Goal {

    constructor (rooms = []) {
        super()

        /** @type {Array<Room>} rooms */
        this.rooms = rooms

    }

}



class ThermostatIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Room>} rooms */
        this.rooms = this.goal.rooms
    }
    
    static applicable (goal) {
        return goal instanceof ThermostatGoal
    }

    *exec () {
        var roomsGoals = []
        for (let r of this.rooms) {
            
            let roomGoalPromise = new Promise( async res => {
                while (true) {

                    let temp_status = await (r.notifyChange('temp_status'))
                    if (r.house.rooms[r.name].heater != 'no_heater') {
                        
                        if (temp_status == 'too_hot'){
                            console.log('TOO HOT', r.house.rooms[r.name].temperature)
                            r.house.rooms[r.name].heater.turnOffHeater()
                            
                        }
                        else if (temp_status == 'too_cold'){
                            console.log('TOO COLD', r.house.rooms[r.name].temperature)
                            if (r.house.status == 'not_empty'){
                                r.house.rooms[r.name].heater.turnOnHeater()
                            }
                            else {
                                r.house.rooms[r.name].heater.turnOnHeaterEcoMode()
                            }
                        }
                        this.log('sense:  temperature ' + r.name + ' is ' + temp_status)
                        this.agent.beliefs.declare('Heater_on '+r.name, r.house.rooms[r.name].heater.status=='on')
                        this.agent.beliefs.declare('Heater_eco '+r.name, r.house.rooms[r.name].heater.status=='eco')
                        this.agent.beliefs.declare('Heater_off '+r.name, r.house.rooms[r.name].heater.status=='off')
                        console.log('status of HEATER in: ', r.name, ' : ', r.house.rooms[r.name].heater.status)
                    }
                }
            });

            

            roomsGoals.push(roomGoalPromise)
            
        }
        yield Promise.all(roomsGoals)
    }

}





module.exports = {ThermostatGoal, ThermostatIntention}