const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Intention = require('../bdi/Intention');
const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Goal = require('../bdi/Goal')
const PlanningGoal = require('../pddl/PlanningGoal')

//devices
const Dev = require('../devices/Devices')
const Light = require('../devices/Light')

const AutomatedCurtains = require('../devices/AutomatedCurtains')
const AutomatedCoffeeMachine = require('../devices/AutomatedCoffeeMachine')
const Heater = require('../devices/Heating')

const SleepTracker = require('../devices/SleepTracker')
const VacuumCleaner = require('../devices/VacuumCleaner')
const Irrigator = require('../devices/Irrigator')

const Person = require('./Person')
const Room = require('./Room')

const {ElectricityGoal, ElectricityIntention} = require('./electricitySensor')
const {WaterGoal, WaterIntention} = require('./waterSensor')

const {WeatherGoal, WeatherIntention} = require('./weatherSensor')

//Agents
const {AlarmGoal, AlarmIntention} = require('./Alarm')

const {OnlySensePresenceGoal, OnlySensePresenceIntention} = require('./PresenceSensorRoom')
const {LightsGoal, LightIntention} = require('./OnlyLightSensor')

const {ThermostatGoal, ThermostatIntention} = require('./ThermostatSensor')
const {PresInHouseGoal, PresInHouseIntention} = require('./sensePresenceInHouse')

const {CookerHoodGoal, CookerHoodIntention} = require('./CookerHoodSensor')
const {SleepGoal, SleepIntention} = require('./SleepQualitySensor')

const {VacuumBatteryGoal, VacuumBatteryIntention} = require('./VacuumBatterySensor')
const {VacuumCleanerGoal, VacuumCleanerIntention} = require('./VacuumCleanerSensor')
const {VacuumPositionGoal, VacuumPositionIntention} = require('./VacuumPosition')
const {CleanlinessGoal, CleanlinessIntention} = require('./CleanlinessRoomSensor')
const {CleanlinessHouseGoal, CleanlinessHouseIntention} = require('./CleanlinessHouseSensor')


const {WaterLevelGoal, WaterLevelIntention} = require('./WaterLevelSensor')
const {IrrigatorGoal, IrrigatorIntention} = require('./IrrigationSensor')

const {CoffeeMachineGoal, CoffeeMachineIntention} = require ('./CoffeeMachineSensor')
const {CoffeeGoal, CoffeeIntention} = require ('./CoffeeSensor');
const {CoffeeTimeGoal, CoffeeTimeIntention} = require ('./CoffeeTimeSensor');


class House extends Observable{
    constructor (){
        super()
        this.people = {
            Michael: new Person(this, "Michael", 'sleepTrackerMichael', 7),
            Holly: new Person(this, "Holly", 'sleepTrackerHolly', 7),
            Dwight: new Person(this, "Dwight", 'sleepTrackerDwight', 7)
        }
        this.devices = {
            //lights:
            kitchen_light: new Light(this, 'kitchen'),
            living_room_light: new Light(this, 'living_room'),
            aisle_light: new Light(this, 'aisle'),
            master_bedroom_light: new Light(this, 'master_bedroom'),
            bedroom2_light: new Light(this, 'bedroom2'),
            bathroom1_light: new Light(this, 'bathroom1'),
            bathroom2_light: new Light(this, 'bathroom2'),
            studio_light: new Light(this, 'studio'),
            garage_light: new Light(this, 'garage'),

            //heaters:
            kitchen_heater: new Heater(this, 'kitchen'),
            living_room_heater: new Heater(this, 'living_room'),
            aisle_heater: new Heater(this, 'aisle'),
            master_bedroom_heater: new Heater(this, 'master_bedroom'),
            bedroom2_heater: new Heater(this, 'bedroom2'),
            bathroom1_heater: new Heater(this, 'bathroom1'),
            bathroom2_heater: new Heater(this, 'bathroom2'),
            studio_heater: new Heater(this, 'studio'),

            coffee_machine: new AutomatedCoffeeMachine(this, 'kitchen'),
            kitchen_curtains: new AutomatedCurtains(this, 'kitchen'),
            living_room_curtains: new AutomatedCurtains(this, 'living_room'),
            
            irrigation: new Irrigator(this, 'balcony'), 
            vacuumCleaner: new VacuumCleaner(this, 'aisle'),

            //simpleDevices
            TV: new  Dev (this, 'living_room'),
            homeTheatre: new Dev (this, 'living_room'),
            oven: new Dev (this, 'kitchen'),
            dishwasher: new Dev (this, 'kitchen'),
            cookerHood: new Dev (this, 'kitchen'),
            PC: new Dev (this, 'studio'),
            printer: new Dev (this, 'studio'),
            washingMachine: new Dev (this, 'bathroom1'),
            dryer: new Dev (this, 'bathroom1'),

            //sleeptrackers
            sleepTrackerMichael: new SleepTracker(this, 'master_bedroom', 'Michael', 7),
            sleepTrackerHolly: new SleepTracker(this, 'master_bedrooom', 'Holly', 7),
            sleepTrackerDwight: new SleepTracker(this, 'bedroom2', 'Dwight', 7)
        }
        
        this.rooms = {
            aisle: new Room (this, 'aisle', ['living_room', 'outside', 'master_bedroom', 'bedroom2', 'bathroom1', 'studio'],
                            this.devices.aisle_light, 0, this.devices.aisle_heater, 18, 19, 17),
            living_room: new Room (this, 'living_room', ['aisle', 'kitchen', 'balcony'], this.devices.living_room_light, 0, this.devices.living_room_heater, 20, 21, 18),
            kitchen: new Room (this, 'kitchen', ['living_room'], this.devices.kitchen_light, 0, this.devices.kitchen_heater, 20, 21, 18),
            balcony: new Room (this, 'balcony', ['living_room'], 'no_light', 0, 'no_heater', 0, 0, 0),
            master_bedroom: new Room (this, 'master_bedroom', ['aisle', 'bathroom2'], this.devices.master_bedroom_light, 0, this.devices.master_bedroom_heater, 19, 20, 17),
            bedroom2: new Room (this, 'bedroom2', ['aisle'], this.devices.bedroom2_light, 0, this.devices.bedroom2_heater, 19, 20, 17),
            bathroom1: new Room (this, 'bathroom1', ['aisle'], this.devices.bathroom1_light, 0, this.devices.bathroom1_heater, 19, 20, 17),
            bathroom2: new Room (this, 'bathroom2', ['master_bedroom'], this.devices.bathroom2_light, 0, this.devices.bathroom2_heater, 19, 20, 17),
            studio: new Room (this, 'studio', ['aisle'], this.devices.bedroom2_light, 0, this.devices.studio_heater, 19, 20, 17),
            garage: new Room (this, 'garage', ['outside'], this.devices.garage_light,  Object.keys(this.people).length, 'no_heater', 0, 0, 0),
            outside: new Room (this, 'outside', ['aisle', 'garage'], 'no_light', 0, 'no_heater', 0, 0, 0)    
        }
        this.utilities = {
            electricity: new Observable ( {consumption : 0} ),
            water: new Observable ( {consumption : 0} )
        }

        this.dailyElectricity = 0
        this.dailyWater = 0
        this.presence = null
        this.set ('status', 'not_empty')
        this.set ('cleanliness', 'clean')
        this.set ('weather', 'sunny') //weather forecast 
    }
    cleanOrNot(){
        this.cleanliness = 'clean'
        for (r in this.rooms){
            if (r.cleanliness == 'dirty' && r.name != 'garage' && r.name != 'outside' && r.name != 'balcony'){
                this.cleanliness = 'dirty'
            }

        }
    }

}

var myHouse = new House()

//var wheather = new Observable ('sunny') //it can be sunny or rainy
//var weatherForecast = 'sunny' //it can be sunny or rainy

console.log('House created')
//console.log(myHouse)

// Agents
var myAgent = new Agent('myAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal(5, 30) )
myAgent.postSubGoal( new AlarmGoal(7, 15) )

var PresenceAgent = new Agent('PresenceAgent')
PresenceAgent.intentions.push(OnlySensePresenceIntention)
PresenceAgent.postSubGoal( new OnlySensePresenceGoal( [myHouse.people.Michael, myHouse.people.Holly, myHouse.people.Dwight] ) )

var LightsAgent = new Agent('LightAgent')
LightsAgent.intentions.push(LightIntention)
LightsAgent.postSubGoal( new LightsGoal( [myHouse.rooms.aisle, myHouse.rooms.balcony, myHouse.rooms.kitchen, myHouse.rooms.living_room, myHouse.rooms.outside, 
    myHouse.rooms.master_bedroom, myHouse.rooms.bedroom2, myHouse.rooms.bathroom1, myHouse.rooms.bathroom2, myHouse.rooms.studio, myHouse.rooms.garage] ) )                    

//inserire il termostato (sensore temperatura)
var ThermostatAgent = new Agent('ThermostatAgent')

ThermostatAgent.intentions.push(ThermostatIntention)
ThermostatAgent.postSubGoal( new ThermostatGoal( [myHouse.rooms.aisle, myHouse.rooms.balcony, myHouse.rooms.kitchen, myHouse.rooms.living_room, myHouse.rooms.outside, 
    myHouse.rooms.master_bedroom, myHouse.rooms.bedroom2, myHouse.rooms.bathroom1, myHouse.rooms.bathroom2, myHouse.rooms.studio, myHouse.rooms.garage]) )

//ThermostatAgent.intentions.push(PresenceHouseIntention)
//ThermostatAgent.postSubGoal( new PresenceHouseGoal(myHouse))
ThermostatAgent.intentions.push(PresInHouseIntention)
ThermostatAgent.postSubGoal( new PresInHouseGoal(myHouse))


var CookerHoodAgent = new Agent('CookerHoodAgent')
CookerHoodAgent.intentions.push(CookerHoodIntention)
CookerHoodAgent.postSubGoal( new CookerHoodGoal(myHouse.rooms.kitchen ) )

var SleepTrackerAgent = new Agent('SleepTrackerAgent')
SleepTrackerAgent.intentions.push(SleepIntention)
SleepTrackerAgent.postSubGoal( new SleepGoal([myHouse.people.Michael, myHouse.people.Holly, myHouse.people.Dwight]) )

var ElectricityConsumption = new Agent('ElectricityConsumption')
ElectricityConsumption.intentions.push(ElectricityIntention)
ElectricityConsumption.postSubGoal( new ElectricityGoal(myHouse))

var WaterConsumption = new Agent('WaterConsumption')
WaterConsumption.intentions.push(WaterIntention)
WaterConsumption.postSubGoal( new WaterGoal(myHouse))

//var WeatherForecast = new Agent('WeatherForecast')
//WeatherForecast.intentions.push(WeatherIntention)
//WeatherForecast.postSubGoal( new WeatherGoal(myHouse))

class RetryGoal extends Goal {}
class RetryFourTimesIntention extends Intention {
    static applicable (goal) {
        return goal instanceof RetryGoal
    }
    *exec ({goal}=parameters) {
        for(let i=0; i<4; i++) {
            let goalAchieved = yield this.agent.postSubGoal( goal )
            if (goalAchieved)
                return;
            this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
            yield this.agent.beliefs.notifyAnyChange()
        }
    }
}

//VacuumCleaner __________________________________

var VacuumAgent = new Agent('VacuumAgent')

//to check if house is empty or not
//VacuumAgent.intentions.push(PresInHouseIntention)
//VacuumAgent.postSubGoal( new PresInHouseGoal( myHouse ) )

//room cleanliness
//VacuumAgent.intentions.push(CleanlinessIntention)
//VacuumAgent.postSubGoal( new CleanlinessGoal( [myHouse.rooms.aisle, myHouse.rooms.kitchen, myHouse.rooms.living_room, 
//    myHouse.rooms.master_bedroom, myHouse.rooms.bedroom2, myHouse.rooms.bathroom1, myHouse.rooms.bathroom2, myHouse.rooms.studio] ) )

//house and room Cleanliness
VacuumAgent.intentions.push(CleanlinessHouseIntention)
VacuumAgent.postSubGoal( new CleanlinessHouseGoal( [myHouse.rooms.aisle, myHouse.rooms.kitchen, myHouse.rooms.living_room, 
    myHouse.rooms.master_bedroom, myHouse.rooms.bedroom2, myHouse.rooms.bathroom1, myHouse.rooms.bathroom2, myHouse.rooms.studio] ) )

//battery status
VacuumAgent.intentions.push(VacuumBatteryIntention)
VacuumAgent.postSubGoal( new VacuumBatteryGoal( myHouse.devices.vacuumCleaner ) )

//status (on/off)
VacuumAgent.intentions.push(VacuumCleanerIntention)
VacuumAgent.postSubGoal( new VacuumCleanerGoal( myHouse.devices.vacuumCleaner ) )

//location of the Vacuum cleaner in the house + doors
VacuumAgent.intentions.push(VacuumPositionIntention)
VacuumAgent.postSubGoal( new VacuumPositionGoal( myHouse.devices.vacuumCleaner ) )

{
    class switchOnV extends pddlActionIntention {
        static parameters = ['b', 'r', 'vacuumCleaner'];
        static precondition = [ ['switched_off', 'vacuumCleaner'], ['charge', 'b'], ['atStation', 'r'], ['in_room', 'r']];
        static effect = [ ['switched_on', 'vacuumCleaner'], ['not switched_off', 'vacuumCleaner'], ['not atStation', 'r'] ];
        *exec ({b, r, vacuumCleaner}=parameters) {
            yield myHouse.devices.vacuumCleaner.switchOnVacuum()
        }
    }

    class moveV extends pddlActionIntention {
        static parameters = ['r', 'to', 'b', 'vacuumCleaner'];
        static precondition = [ ['in_room', 'r'], ['doors_to', 'r', 'to'], ['clean', 'r'], ['charge', 'b'], ['switched_on', 'vacuumCleaner']];
        static effect = [ ['in_room', 'to'], ['doors_to', 'to', 'r'], ['not in_room', 'r'], ['not atStation', 'r'] ];
        *exec ({r, to, b, vacuumCleaner}=parameters) {
            yield myHouse.devices.vacuumCleaner.moveTo(to)
        }
    }

    class goToStationV extends pddlActionIntention {
        static parameters = ['r', 'ais', 'vacuumCleaner'];
        static precondition = [ ['in_room', 'r'], ['doors_to', 'r', 'ais'], ['switched_on', 'vacuumCleaner'] ];
        static effect = [ ['atStation', 'ais'], ['not in_room', 'r'] ];
        *exec ({r, ais, vacuumCleaner}=parameters) {
            yield myHouse.devices.vacuumCleaner.returnToStation()
        }
    }

    class rechargeV extends pddlActionIntention {
        static parameters = ['r', 'b'];
        static precondition = [ ['exhaust', 'b'], ['in_room', 'r'], ['atStation', 'r'] ];
        static effect = [ ['charge', 'b'], ['not exhaust', 'b'] ];
        *exec ({r, b}=parameters) {
            yield myHouse.devices.vacuumCleaner.recharge()
        }
    }

    class cleanV extends pddlActionIntention {
        static parameters = ['b', 'r', 'vacuumCleaner'];
        static precondition = [ ['switched_on', 'vacuumCleaner'], ['charge', 'b'], ['dirty', 'r'], ['in_room', 'r']];
        static effect = [ ['clean', 'r'], ['not dirty', 'r'] ];
        *exec ({b, r, vacuumCleaner}=parameters) {
            yield myHouse.devices.vacuumCleaner.clean()
        }
    }

    class switchOffV extends pddlActionIntention {
        static parameters = ['r', 'vacuumCleaner'];
        static precondition = [ ['atStation', 'r'], ['switched_on', 'vacuumCleaner'] ];
        static effect = [ ['switched_off', 'vacuumCleaner'], ['not switched_on', 'vacuumCleaner'] ];
        *exec ({r, vacuumCleaner}=parameters) {
            yield myHouse.devices.vacuumCleaner.switchOffVacuum()
        }
    }

    let {OnlinePlanning} = require('../pddl/OnlinePlanner')([switchOnV, cleanV, goToStationV, rechargeV, moveV, switchOffV])
    VacuumAgent.intentions.push(OnlinePlanning)
    VacuumAgent.intentions.push(RetryFourTimesIntention)
}

//IRRIGATION

var IrrigAgent = new Agent('IrrigAgent')

//water level (enough or not enough)
IrrigAgent.intentions.push(WaterLevelIntention)
IrrigAgent.postSubGoal( new WaterLevelGoal( myHouse.devices.irrigation ) )

//irrigation status (on/off)
IrrigAgent.intentions.push(IrrigatorIntention)
IrrigAgent.postSubGoal( new IrrigatorGoal( myHouse.devices.irrigation ) )

//Wheater forecast (rainy/sunny)
IrrigAgent.intentions.push(WeatherIntention)
IrrigAgent.postSubGoal( new WeatherGoal(myHouse) )

//IRRIGATION PLAN
{   
    class turnOn extends pddlActionIntention {
        static parameters = ['irrigator', 'forecast'];
        static precondition = [['switched_off', 'irrigator'], ['sunny', 'forecast']];
        static effect = [['switched_on', 'irrigator'], ['not switched_off', 'irrigator'] ];
        *exec ({w, irrigator, forecast}=parameters) {
            yield myHouse.devices.irrigation.switchOn()
        }
    }

    class irrigateI extends pddlActionIntention {
        static parameters = ['w', 'irrigator', 'forecast'];
        static precondition = [['switched_on', 'irrigator'], ['water_not_enough', 'w'], ['sunny', 'forecast']];
        static effect = [['water_enough', 'w'], ['not water_not_enough', 'w'] ];
        *exec ({w, irrigator, forecast}=parameters) {
            yield myHouse.devices.irrigation.irrigate()
        }
    }
    
    class turnOff extends pddlActionIntention {
        static parameters = ['w', 'irrigator'];
        static precondition = [['switched_on', 'irrigator'], ['water_enough', 'w']];
        static effect = [ ['switched_off', 'irrigator'], ['not switched_on', 'irrigator'] ];
        *exec ({w, irrigator}=parameters) {
            yield myHouse.devices.irrigation.switchOff()
        }
    }

    let {OnlinePlanning} = require('../pddl/OnlinePlanner')([turnOn, irrigateI, turnOff])
    IrrigAgent.intentions.push(OnlinePlanning)
    IrrigAgent.intentions.push(RetryFourTimesIntention)

}

//COFFEE MACHINE

var CoffeeMachineAgent = new Agent('CoffeeMachineAgent')
//coffee Time sensor
CoffeeMachineAgent.intentions.push(CoffeeTimeIntention)
CoffeeMachineAgent.postSubGoal( new CoffeeTimeGoal(myHouse.devices.coffee_machine ) )
//CoffeeMachine status (on/off)
CoffeeMachineAgent.intentions.push(CoffeeMachineIntention)
CoffeeMachineAgent.postSubGoal( new CoffeeMachineGoal(myHouse.devices.coffee_machine ) )
//Coffee status (ready or not)
CoffeeMachineAgent.intentions.push(CoffeeIntention)
CoffeeMachineAgent.postSubGoal( new CoffeeGoal(myHouse.devices.coffee_machine ) )

//COFFEEMACHINE PLAN
{
    class switchOnCoffeeMachineC extends pddlActionIntention {
        static parameters = ['r', 't', 'm'];
        static precondition = [['switched-off', 'm'], ['coffee-not-ready', 'r'], ['coffee-time', 't']];
        static effect = [['switched-on', 'm'], ['not switched-off', 'm'], ['coffee-ready', 'r'], ['not coffee-not-ready', 'r'] ];
        *exec ({r, t, m}=parameters) {
            yield myHouse.devices.coffee_machine.switchOnCoffeeMachine()
        }
    }
    
    class switchOffCoffeeMachineC extends pddlActionIntention {
        static parameters = ['r', 'm'];
        static precondition = [ ['switched-on', 'm'], ['coffee-ready', 'r'] ];
        static effect = [ ['switched-off', 'm'], ['not switched-on', 'm'] ];
        *exec ({r, m}=parameters) {
            yield myHouse.devices.coffee_machine.switchOffCoffeeMachine()
        }
    }

    
    let {OnlinePlanning} = require('../pddl/OnlinePlanner')([switchOnCoffeeMachineC, switchOffCoffeeMachineC])
    CoffeeMachineAgent.intentions.push(OnlinePlanning)
    CoffeeMachineAgent.intentions.push(RetryFourTimesIntention)
}


//_______________



// Daily schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global

    if (time.dd == 0 && time.hh == 0 && time.mm == 0){
        myHouse.utilities.electricity.consumption = 0
        myHouse.utilities.water.consumption = 0

        myHouse.dailyElectricity = 0 
        myHouse.dailyWater = 0
    }

    if ((time.dd == 1 || time.dd == 3 || time.dd == 4) && time.hh == 0 && time.mm == 0){
        myHouse.weather = 'rainy'
    }
    else if (time.hh == 0 && time.mm == 0){
        myHouse.weather = 'sunny'
    }

    //Weekend schedule
    if (time.dd!= 0 && (time.dd%6 == 0 || time.dd%7 == 0)){
        //console.log('(day:)', time.dd)
        if (time.hh==9 && time.mm==0) {
            console.log('The family wakes up')
            myHouse.people.Holly.wakeUp()
            myHouse.people.Dwight.wakeUp()
            myHouse.people.Michael.wakeUp()
        }
        if (time.hh==9 && time.mm==30) {
            myHouse.devices.coffee_machine.switchOn(),
            myHouse.people.Holly.moveTo('aisle')
            myHouse.people.Dwight.moveTo('aisle')
            myHouse.people.Michael.moveTo('aisle')
            
            console.log('Coffee Machine makes Holly coffee')
        }
        if (time.hh==9 && time.mm==31) {
            myHouse.people.Holly.moveTo('living_room')
            myHouse.people.Dwight.moveTo('living_room')
            myHouse.people.Michael.moveTo('living_room')
        }
        if (time.hh==9 && time.mm==32) {
            myHouse.people.Holly.moveTo('kitchen')
            myHouse.people.Dwight.moveTo('kitchen')
            myHouse.people.Michael.moveTo('kitchen')

            console.log('The family has breakfast')
        }
        if (time.hh=10 && time.mm == 00){
            myHouse.people.Holly.moveTo('living_room')
            myHouse.people.Dwight.moveTo('living_room')
            myHouse.people.Michael.moveTo('living_room')
        }
        if (time.hh==10 && time.mm==01) {
            myHouse.people.Holly.moveTo('aisle')
            myHouse.people.Dwight.moveTo('aisle')
            myHouse.people.Michael.moveTo('aisle')
        }
        if (time.hh=10 && time.mm == 02){
            myHouse.people.Holly.moveTo('master_bedroom')
            myHouse.people.Dwight.moveTo('bathroom1')
            myHouse.people.Michael.moveTo('master_bedroom')
        }

        if (time.hh=10 && time.mm == 03){
            myHouse.people.Holly.moveTo('bathroom2') 
        }

        if (time.hh=10 && time.mm == 20){
            myHouse.people.Holly.moveTo('bathroom2')
            myHouse.people.Dwight.moveTo('aisle')
            myHouse.people.Michael.moveTo('master_bedroom')
        }

        if (time.hh=10 && time.mm == 20){
            myHouse.people.Dwight.moveTo('bedroom2')
        }

        if (time.hh=10 && time.mm == 39){
            myHouse.people.Holly.moveTo('master_bedroom')
            myHouse.people.Dwight.moveTo('aisle')
        }

        if (time.hh=10 && time.mm == 40){
            myHouse.people.Holly.moveTo('aisle')
            myHouse.people.Michael.moveTo('aisle')
        }

        if (time.hh==10 && time.mm==01) {
            myHouse.people.Holly.moveTo('outside')
            myHouse.people.Dwight.moveTo('outside')
            myHouse.people.Michael.moveTo('outside')
        }
        if (time.hh==10 && time.mm==05) {
            myHouse.people.Holly.moveTo('garage')
            myHouse.people.Dwight.moveTo('garage')
            myHouse.people.Michael.moveTo('garage')
        }
        if (time.hh==10 && time.mm==10) {
            myHouse.people.Holly.moveTo('outside')
            myHouse.people.Dwight.moveTo('outside')
            myHouse.people.Michael.moveTo('outside')
        }

        if (time.hh==22 && time.mm==15) {
            myHouse.people.Holly.moveTo('garage')
            myHouse.people.Dwight.moveTo('garage')
            myHouse.people.Michael.moveTo('garage')
        }

        if (time.hh==22 && time.mm==20) {
            myHouse.people.Holly.moveTo('outside')
            myHouse.people.Dwight.moveTo('outside')
            myHouse.people.Michael.moveTo('outside')
        }

        if (time.hh==22 && time.mm==21) {
            myHouse.people.Holly.moveTo('aisle')
            myHouse.people.Dwight.moveTo('aisle')
            myHouse.people.Michael.moveTo('aisle')
        }

        if (time.hh==22 && time.mm==25) {
            myHouse.people.Holly.moveTo('master_bedroom')
            myHouse.people.Dwight.moveTo('bathroom1')
            myHouse.people.Michael.moveTo('master_bedroom')
        }
        if (time.hh==22 && time.mm==26) {
            myHouse.people.Holly.moveTo('bathroom2')
            myHouse.people.Michael.moveTo('bathroom2')
        }
        if (time.hh==22 && time.mm==34) {
            myHouse.people.Dwight.moveTo('aisle')
        }
        if (time.hh==22 && time.mm==35) {
            myHouse.people.Holly.moveTo('master_bedroom')
            myHouse.people.Dwight.moveTo('bedroom2')
            myHouse.people.Michael.moveTo('master_bedroom')
        }
    }
    //weekly schedule
    else {
        //console.log('(day:)', time.dd)
        if (time.hh==5 && time.mm==15) {
            console.log('___________________________________________________________________________')
            console.log('Holly wakes up')
            myHouse.people.Holly.wakeUp()
        }

        if (time.hh==5 && time.mm==30) {
            console.log('___________________________________________________________________________')
            //myHouse.devices.coffee_machine.switchOn()
            myHouse.devices.coffee_machine.coffeeTime = 'yes'
            myHouse.devices.coffee_machine.coffeeStatus = 'not_ready'
            console.log('Coffee Machine makes Holly coffee')

            {
                CoffeeMachineAgent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['coffee-ready r', 'switched-off  coffee_machine'] } ) } ) )
            }
            myHouse.people.Holly.moveTo('aisle')
        }

        if (time.hh==5 && time.mm==31) {
            console.log('___________________________________________________________________________')
            
            myHouse.people.Holly.moveTo('living_room')
        }
        if (time.hh==5 && time.mm==32) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('kitchen')

            console.log('Holly has breakfast')
        }

        if (time.hh==5 && time.mm==43) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('living_room')
        }
        if (time.hh==5 && time.mm==44) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('aisle')
        }
        if (time.hh==5 && time.mm==45) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('outside')
            
            console.log('Holly leaves for work')
        }

        if (time.hh==7 && time.mm==00){
            console.log('___________________________________________________________________________')
            if (myHouse.weather == 'sunny'){
                console.log('In the balcony the automatic irrigation starts')
                {
                    IrrigAgent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['water_enough w', 'switched_off irrigator'] } ) } ) )
                }

                console.log('now the water level is: ', myHouse.devices.irrigation.waterLevel)
            }
            else {
                myHouse.devices.irrigation.waterLevel = 100
                myHouse.devices.irrigation.waterStatus = 'enough'
                console.log('it is a rainy day, no need to use irrigation')
            }
            console.log('Dwight and Michael wake up')
            myHouse.people.Dwight.wakeUp()
            myHouse.people.Michael.wakeUp()
        }

        if(time.hh==7 && time.mm==15) {
            console.log('___________________________________________________________________________')
            myHouse.devices.coffee_machine.coffeeTime = 'yes'
            myHouse.devices.coffee_machine.coffeeStatus = 'not_ready'
            
            {
                CoffeeMachineAgent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['coffee-ready r', 'switched-off  coffee_machine'] } ) } ) )
            }

            myHouse.people.Michael.moveTo('aisle'),
            myHouse.people.Dwight.moveTo('aisle'),
            console.log('Coffee Machine makes Michael coffee')
            console.log('now the water level is: ', myHouse.devices.irrigation.waterLevel)
        }
        if(time.hh==7 && time.mm==16) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('living_room'),
            myHouse.people.Dwight.moveTo('living_room')
        }
        if(time.hh==7 && time.mm==17) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('kitchen'),
            myHouse.people.Dwight.moveTo('kitchen')
            console.log('Michael and Dwight have breakfast')
        }

        if (time.hh==7 && time.mm==43) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('living_room'),
            myHouse.people.Dwight.moveTo('living_room')
        }
        if (time.hh==7 && time.mm==44) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('aisle'),
            myHouse.people.Dwight.moveTo('aisle')
        }
        if (time.hh==7 && time.mm==45) {
            console.log('_____________________________________________________________________')
            myHouse.people.Michael.moveTo('outside'),
            myHouse.people.Dwight.moveTo('outside')
            console.log('Michael and Dwight leave the house')
            
            {
                VacuumAgent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( {
                    goal: [
                        'clean aisle',
                        'clean kitchen',
                        'clean living_room',
                        'clean studio',
                        'clean bathroom1',
                        'clean bedroom2',
                        'clean master_bedroom',
                        'clean bathroom2',
                        'atStation aisle', 
                        'charge battery',
                        'switched_off vacuumCleaner'
                    ] 
                        
                } ) } ) )
            }
        }
        if (time.hh==7 && time.mm==47) {
            console.log('___________________________________________________________________________')
            myHouse.people.Dwight.moveTo('garage')
            myHouse.people.Michael.moveTo('garage')
            console.log(myHouse.status)
            console.log(myHouse.presence)
        }
        if (time.hh==7 && time.mm==48) {
            console.log('___________________________________________________________________________')
            myHouse.people.Dwight.moveTo('outside')
            myHouse.people.Michael.moveTo('outside')
            console.log('EMPTY HOUSEEE')
            console.log(myHouse.status)
            console.log(myHouse.presence)
        }
        if (time.hh==7 && time.mm==50){
            console.log('___________________________________________________________________________')
            console.log(myHouse.status)
        }

        if (time.hh==13 && time.mm==15) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('aisle'),
            myHouse.people.Dwight.moveTo('aisle')
            console.log('Holly and Dwight come home')
        }
        if (time.hh==13 && time.mm==16) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('living_room'),
            myHouse.people.Dwight.moveTo('living_room')
        }
        if (time.hh==13 && time.mm==17) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('kitchen'),
            myHouse.people.Dwight.moveTo('kitchen'),
            console.log('Holly prepares lunch')
            myHouse.rooms['kitchen'].vapor()
        }
        if (time.hh==13 && time.mm==30) {
            console.log('___________________________________________________________________________')
            console.log('Holly and Dwight have lunch')
            myHouse.rooms['kitchen'].vapor_removed()
        }

        if (time.hh==14 && time.mm==30){
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('living_room'),
            myHouse.people.Dwight.moveTo('living_room')
            console.log('Holly and Dwight go in the living room, Dwight does his homework')
        }
        
        if (time.hh==16 && time.mm==10) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('garage')
        }
        if (time.hh==16 && time.mm==13) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('outside')
        }
        if (time.hh==16 && time.mm==15) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('aisle')
            console.log('Michael come home')
        }
        
        if (time.hh==16 && time.mm==30) {
            console.log('___________________________________________________________________________')
            myHouse.devices.kitchen_curtains.closeCurtains(),
            myHouse.devices.living_room_curtains.closeCurtains()
            myHouse.devices.TV.switchOn()
            myHouse.devices.homeTheatre.switchOn()
            myHouse.people.Michael.moveTo('living_room')
            console.log('Movie')
        }
        
        if (time.hh==19 && time.mm==30){
            console.log('___________________________________________________________________________')
            myHouse.devices.kitchen_curtains.openCurtains(),
            myHouse.devices.living_room_curtains.openCurtains()
            myHouse.devices.TV.switchOff()
            myHouse.devices.homeTheatre.switchOff()
            myHouse.people.Michael.moveTo('kitchen')
            console.log('Michael prepares dinner')
            myHouse.rooms['kitchen'].vapor()
        }
        if (time.hh==20 && time.mm==15) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('living_room')
            console.log('The family has dinner in the living room')
            myHouse.rooms['kitchen'].vapor_removed()
        }

        if (time.hh==22 && time.mm==14) {
            console.log('___________________________________________________________________________')
            myHouse.people.Dwight.moveTo('aisle')
        }
        if (time.hh==22 && time.mm==15) {
            console.log('___________________________________________________________________________')
            myHouse.people.Dwight.moveTo('bedroom2')
            console.log('DwightGoToSleep')
            myHouse.people.Dwight.sleep()
        }

        if (time.hh==22 && time.mm==44) {
            console.log('___________________________________________________________________________')
            myHouse.people.Holly.moveTo('aisle')
        }
        if (time.hh==22 && time.mm==45) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('master_bedroom')
            console.log('Holly go to sleep')
            myHouse.people.Holly.sleep()
        }

        if (time.hh==22 && time.mm==14) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('aisle')
        }
        if (time.hh==23 && time.mm==45) {
            console.log('___________________________________________________________________________')
            myHouse.people.Michael.moveTo('master_bedroom')
            console.log('Michael go to sleep')
            myHouse.people.Michael.sleep()
            myHouse.devices.irrigation.waterLevel = 0
            myHouse.devices.irrigation.waterStatus = 'not_enough'
            
            console.log('today total electricity consumption:', myHouse.dailyElectricity)
            console.log('today total water consumption:', myHouse.dailyWater)
            myHouse.dailyElectricity = 0
            myHouse.dailyWater = 0
        }
    }
    

    //change of temperature in the rooms through time
    
    if ((time.mm == 0) || (time.mm == 30)){
        for(r in myHouse.rooms){
            if (myHouse.rooms[r].heater != 'no_heater'){     
                if (myHouse.rooms[r].heater.status == 'on'){
                    
                    myHouse.rooms[r].increaseTemp()
                    //console.log('INCREASE OF TEMPERATURE in ', r, ' temp: ', myHouse.rooms[r].temperature)
                    
                }
                else if(myHouse.rooms[r].heater.status == 'eco') {

                    myHouse.rooms[r].increaseTempEco()
                    //console.log('ECHO INCREASE OF TEMP in ', r, ' temp: ', myHouse.rooms[r].temperature)

                }
                else{

                    myHouse.rooms[r].decreaseTemp()
                    //console.log('DECREASE OF TEMPERATURE in ', r, ' temp: ', myHouse.rooms[r].temperature)

                }
            }
        }
    }
})

Clock.startTimer()



exports.myHouse = myHouse