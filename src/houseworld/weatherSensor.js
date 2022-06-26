const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');


class WeatherGoal extends Goal {

    constructor (house) {
        super()

        /** @type {House} house */
        this.house = house

    }

}



class WeatherIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof WeatherGoal
    }

    *exec () {
        var weatherGoals = []
        let WeatherPromise = new Promise( async res => {
                
            while (true) {
                let weath = await (this.house.notifyChange('weather'))
                console.log ('weather forescast:::::', weath)
            
                this.agent.beliefs.declare('sunny ' + 'forecast', weath == 'sunny')
                this.agent.beliefs.declare('rainy ' + 'forecast', weath == 'rainy')

                if (weath == 'rainy'){
                    //no need to irrigate plants

                }
                else if (weath == 'sunny'){
                    //need to irrigate plants
                    console.log('no need to activate irrigation today')
                }

                
            }
        });
    
        weatherGoals.push(WeatherPromise)        
        
        yield Promise.all(weatherGoals)
    }

}


module.exports = {WeatherGoal, WeatherIntention}