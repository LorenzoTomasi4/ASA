const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('./scenario10');



class PresInHouseGoal extends Goal {

    constructor (house) {
        super()

        /** @type {myHouse} house */
        this.house = house

    }

}



class PresInHouseIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof PresInHouseGoal
    }

    *exec () {
        var houseGoals = []
        let PresInHouseGoalPromise = new Promise( async res => {
                
            while (true) {
                let status = await (this.house.notifyChange('status'))
                console.log ('now the status of the house is: ___________', status)

                this.agent.beliefs.declare('empty '+ 'h', status=='empty')
                
                for (let r in this.house.rooms) {
            
                    if (this.house.rooms[r].heater != 'no_heater') {
                        
                        if (status == 'empty' && this.house.rooms[r].heater.status=='on'){
                            //house is empty I can turn heater in eco mode
                            //console.log('I can turn the heater in eco mode')
                            this.house.rooms[r].heater.turnOnHeaterEcoMode()
                            this.log('sense:  temperature ' + r + ' is ' + this.house.rooms[r].temp_status)
                            this.agent.beliefs.declare('Heater_eco '+r, this.house.rooms[r].heater.status=='eco')
                            this.agent.beliefs.declare('Heater_on '+r, this.house.rooms[r].heater.status=='on')
                            this.agent.beliefs.declare('Heater_off '+r, this.house.rooms[r].heater.status=='off')
                            console.log('status of HEATER in: ', r, ' : ', this.house.rooms[r].heater.status) 
                        }
                        else if (status == 'not_empty' && this.house.rooms[r].heater.status=='eco'){
                            //someone enters in the house, i have to turn the heater full power
                            this.house.rooms[r].heater.turnOnHeater()
                            this.log('sense:  temperature ' + r + ' is ' + this.house.rooms[r].temp_status)
                            this.agent.beliefs.declare('Heater_eco '+r, this.house.rooms[r].heater.status=='eco')
                            this.agent.beliefs.declare('Heater_on '+r, this.house.rooms[r].heater.status=='on')
                            this.agent.beliefs.declare('Heater_off '+r, this.house.rooms[r].heater.status=='off')
                            console.log('status of HEATER in: ', r, ' : ', this.house.rooms[r].heater.status) 
                            
                        }
                        else if (this.house.rooms[r].heater.status=='off'){
                            console.log ('heater is already off')            
                        }
                        else {
                            console.log('STATUS:', status, 'HEATER STATUS: ',  this.house.rooms[r].heater.status)
                        }

                        
                    }
                }
                
            }
        });
    
        houseGoals.push(PresInHouseGoalPromise)        
        
        yield Promise.all(houseGoals)
    }

}





module.exports = {PresInHouseGoal, PresInHouseIntention}