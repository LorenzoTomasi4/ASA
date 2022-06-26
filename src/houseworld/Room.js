const Observable = require('../utils/Observable');


class Room extends Observable{
    constructor (house, name, doors_to = [], light, presence, heater, temperature, maxTemp, minTemp){
        super()
        this.house = house;
        this.name = name;
        this.doors_to = doors_to;
        this.light = light;
        this.presence = presence;
        this.heater = heater;
        this.temperature = temperature;
        this.maxTemp = maxTemp;     //maxTemperature for the heating
        this.minTemp = minTemp;
        
        this.set ('temp_status', 'temp_ok');
        this.set ('status', 'empty');
        this.set ('vapor_status', 'no_vapor');
        this.set ('cleanliness', 'dirty');
    }
    includ(to){
        if (this.doors_to.includes(to))
            return true
        else
            return false
    }
    addPresence(){
        this.presence+=1
        //console.log(this.presence)
    }
    remPresence(){
        this.presence-=1
        //console.log('after removePresence', this.presence)
    }

    increaseTempEco(){
        this.temperature += 0.25
        if (this.temperature >= this.maxTemp){
            this.temp_status = 'too_hot'
        }
        else {
            this.temp_status = 'temp_ok'
        }
    }
    increaseTemp(){
        this.temperature += 0.5
        if (this.temperature >= this.maxTemp){
            this.temp_status = 'too_hot'
        }
        else {
            this.temp_status = 'temp_ok'
        }
    }
    decreaseTemp(){
        this.temperature -= 2
        if (this.temperature <= this.minTemp){
            this.temp_status = 'too_cold'
        }
        else {
            this.temp_status = 'temp_ok'
        }
    }
    vapor(){
        this.vapor_status = 'vapor'
    }

    vapor_removed(){
        this.vapor_status = 'no_vapor'
    }
    
}

module.exports = Room