const Observable = require('../utils/Observable')
const Clock =  require('../utils/Clock')

class SleepTracker extends Observable {
    constructor (house, name, person, sleepTimeDesired){
        super()
        this.house = house
        this.name = name
        this.person = person
        this.timeFallAsleep = null 
        this.timeAwake = null 
        this.sleepTimeDesired = sleepTimeDesired
        this.set1 = ('status', 'off')
        this.set2 = ('sleep', 'not enough')
        this.set3 = ('personStatus', 'awake');
    }
    
    switchOnSleepTracker() {
        if (this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += 1;
            console.log(this.person, 'Sleep tracker turned on')
        }
    }
    switchOffSleepTracker() {
        if (this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= 1;
            console.log(this.person, 'Sleep tracker turned off')
        }
    }
    
    addSleep(){
        sleepTime += 1
    }
    sleepQuality(){
        if (sleepTime >= sleepTimeGoal){
            this.sleep = 'enough'
        }
        else {
            this.sleep = 'not enough'
        } 
    }
    
    fallAsleep(){    
        var FAmin = Clock.global.dd*1440 + Clock.global.hh*60+Clock.global.mm
        this.timeFallAsleep = FAmin
        process.stdout.write( Clock.format() + '\t')
        //console.log(this.person, 'fall Asleep AT THIS TIME')
    }
    
    awaken(){
        if (this.timeFallAsleep != null){
            var Amin = Clock.global.dd*1440 + Clock.global.hh*60+Clock.global.mm
            this.timeAwake = Amin
            var sleepTime = this.timeAwake - this.timeFallAsleep 
            //var sleepTime = this.timeFallAsleep.hh - this.timeAwake.hh //bastano le ore(?)
            //console.log(this.timeFallAsleep)
            //console.log(this.timeAwake)
            //console.log(sleepTime)
            this.sleepTimeDesired = this.sleepTimeDesired*60
            //console.log('ore dormite', sleepTime)
            //console.log('ore dormite DESIDERATE', this.sleepTimeDesired)
            if (sleepTime >= this.sleepTimeDesired){
                this.sleep = 'enough'
                console.log(this.person, 'slept', this.sleep)
                console.log(this.person, 'slept', sleepTime/60, 'hours')
            }
            else {
                this.sleep = 'not enough'
                console.log(this.person, 'slept', this.sleep)
                console.log(this.person, 'slept only', sleepTime/60, 'hours')
            }
            process.stdout.write( Clock.format() + '\t')
            //console.log(this.person, 'Awake AT THIS TIME')
        }
    }
}

module.exports = SleepTracker