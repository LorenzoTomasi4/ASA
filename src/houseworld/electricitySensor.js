const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const myHouse = require('./scenario10');
const Clock =  require('../utils/Clock')


class ElectricityGoal extends Goal {

    constructor (house) {
        super()

        /** @type {myHouse} house */
        this.house = house

    }

}



class ElectricityIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof ElectricityGoal
    }

    *exec () {
        var houseGoals = []
        let ElectricityPromise = new Promise( async res => {
                
            while (true) {
                let elec = await (this.house.utilities.electricity.notifyChange('consumption'))
                console.log ('Electricity: ___________', elec)

                if (elec >= 4){
                    console.log ('electricity consumption over 4 (', elec, ')') 
                }

                this.agent.beliefs.declare('too much electricity used', elec >= 4)
            
                this.house.dailyElectricity *= elec

                
            }
        });
    
        houseGoals.push(ElectricityPromise)        
        
        yield Promise.all(houseGoals)
    }

}


module.exports = {ElectricityGoal, ElectricityIntention}