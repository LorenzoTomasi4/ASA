const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');



class AlarmGoal extends Goal {
    constructor (hour, min) {
        super()

        this.hour = hour
        this.min = min

    }
}

class AlarmIntention extends Intention {
    constructor (hour, min) {
        super(hour, min)

        this.hour = this.goal.hour
        this.min = this.goal.min

    }

    static applicable(goal) {
        return goal instanceof AlarmGoal
    }
    *exec(){
        while(true) {
            //console.log('look at the hour!!', Clock.global.hh, ':', Clock.global.mm)
            //console.log('The alarm is set at: ', this.hour, ':', this.min)
            Clock.global.notifyChange('mm')
            if (Clock.global.hh == this.hour && Clock.global.mm == this.min) this.log('ALARM' + Clock.global.mm)
            yield
            if (Clock.global.hh == this.hour && Clock.global.mm == this.min) {
                // Log a message!
                this.log('ALARM, it\'s ', Clock.global.hh, ':', Clock.global.mm, ' !!')
                break;
            }
        }
    }
}

module.exports = {AlarmGoal, AlarmIntention}