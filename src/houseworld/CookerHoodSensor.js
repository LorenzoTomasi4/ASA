const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const Light = require('./Light');
const Room = require('./Room');
//const myHouse = require('./scenario');
//var {House, Kitchen, People, Rooms} = require('./scenario');
//var prova = require('./scenario')

//qui non devo scorrere sulle stanze perché devo solo controllare la cucina
//quindi tolgo il ciclo sulle stanze, aspettando solo che tornino per alzarle

class CookerHoodGoal extends Goal {

    constructor (kitchen) {
        super()

        /** @type {<Room>} room */
        this.kitchen = kitchen

    }

}



class CookerHoodIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {<Room>} room */
        this.kitchen = this.goal.kitchen
    }
    
    static applicable (goal) {
        return goal instanceof CookerHoodGoal
    }

    *exec () {
        //let CookerHoodGoalPromise = new Promise( async res => {
        while (true) {
            
            let vapor_status = yield this.kitchen.notifyChange('vapor_status')
            //console.log('status of ', k.name, ' : ', vapor_status)
            //console.log('status of HEATER in: ', r.name, ' : ', r.house.rooms[k.name].heater.status)
            if (vapor_status == 'vapor'){
                console.log('Vapor Present')
                //console.log(this.kitchen.house.devices['cookerHood'])
                this.kitchen.house.devices['cookerHood'].switchOn()
                this.log('sense:  vapor in ' + this.kitchen.house.devices['cookerHood'].name + ' became ' + vapor_status)
                this.agent.beliefs.declare('CookerHood_on '+this.kitchen.house.devices['cookerHood'].name, this.kitchen.house.devices['cookerHood'].status=='on')
                console.log('status of CookerHood in: ', this.kitchen.house.devices['cookerHood'].name, ' : ', this.kitchen.house.devices['cookerHood'].status)
            }
            else if (vapor_status == 'no_vapor'){
                console.log('No vapor')
                this.kitchen.house.devices['cookerHood'].switchOff()
                this.log('sense:  vapor in ' + this.kitchen.house.devices['cookerHood'].name + ' became ' + vapor_status)
                this.agent.beliefs.declare('CookerHood_off '+this.kitchen.house.devices['cookerHood'].name, this.kitchen.house.devices['cookerHood'].status=='off')
                console.log('status of CookerHood in: ', this.kitchen.house.devices['cookerHood'].name, ' : ', this.kitchen.house.devices['cookerHood'].status)
            }
        
        }
        //});
    

        //CookerHoodGoals.push(CookerHoodGoalPromise)
            
        
        //yield Promise.all(CookerHoodGoals)
    }

}





module.exports = {CookerHoodGoal, CookerHoodIntention}