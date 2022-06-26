const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('./scenario10');
const Clock =  require('../utils/Clock')


class WaterGoal extends Goal {

    constructor (house) {
        super()

        /** @type {myHouse} house */
        this.house = house

    }

}



class WaterIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof WaterGoal
    }

    *exec () {
        var houseGoals = []
        let WaterPromise = new Promise( async res => {
                
            while (true) {
                let wat = await (this.house.utilities.water.notifyChange('consumption'))
                console.log ('water: ___________', wat)

                if (wat >= 3){
                    console.log ('water consumption over 3 (', wat, ')') 
                }

                this.agent.beliefs.declare('too much water used', wat >= 3)
            
                this.house.dailyWater *= wat

                
            }
        });
    
        houseGoals.push(WaterPromise)        
        
        yield Promise.all(houseGoals)
    }

}


module.exports = {WaterGoal, WaterIntention}