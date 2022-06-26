const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('./scenario10');



class PresenceHouseGoal extends Goal {

    constructor (house) {
        super()

        /** @type {myHouse} house */
        this.house = house

    }

}



class PresenceHouseIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof PresenceHouseGoal
    }

    *exec () {
        var houseGoals = []
        let PresenceHouseGoalPromise = new Promise( async res => {
                
            while (true) {
                let status = await (this.house.notifyChange('status'))
                console.log ('now the house is:::::', status)
                
                //var ro = this.house.rooms
                //ro.forEach(r => {
                
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
                            this.house.rooms[r].heater.switchOn()
                            this.log('sense:  temperature ' + r + ' is ' + this.house.rooms[r].temp_status)
                            this.agent.beliefs.declare('Heater_eco '+r, this.house.rooms[r].heater.status=='eco')
                            this.agent.beliefs.declare('Heater_on '+r, this.house.rooms[r].heater.status=='on')
                            this.agent.beliefs.declare('Heater_off '+r, this.house.rooms[r].heater.status=='off')
                            console.log('status of HEATER in: ', r, ' : ', this.house.rooms[r].heater.status) 
                            
                        }
                        else if (this.house.rooms[r].heater.status=='off'){
                            console.log ('heater is already off')            
                        }

                        
                    }
                }
                
            }
        });
    
        houseGoals.push(PresenceHouseGoalPromise)        
        
        yield Promise.all(houseGoals)
    }

}





module.exports = {PresenceHouseGoal, PresenceHouseIntention}