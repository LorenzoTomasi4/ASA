### Autonomous Software Agent Assignment 2

In - src/myWorld , src/myWorld/scenario.js - main file

People:
    - src/myWorld/Person.js - minor changes to moveTo
    Holly (the mother)
    Michael (the dad)
    Dwight (the son)
Devices: 
    - src/myWorld/Alarm.js -  Alarm (now work with all hours)  
    - src/myWorld/Lights.js - Lights in kitchen, living room and aisle - src/myWorld/PresenceSensorRoom.js - with presence sensor 
    - src/myWorld/AutomatedCoffeeMachine.js - Automated coffee machine in kitchen 
    - src/myWorld/AutomatedIrrigation.js - Automated irrigation on balcony 
    - src/myWorld/AutomatedCurtains.js - Automated curtains in kitchen and living room 
Rooms:
    New class - src/myWorld/Room.js - with the number of people inside the room (presence) and the status to know if it's empty or not
    Aisle
    Kitchen
    Living room
    Balcony 
    (Outside)

Changes to - src/utils/Clock.js - 
it made the hour go until 24:45, 
also now it goes by minute (to better manage the passage of people in the house in the schedule)

Assignment 3:
The automated coffee machine has to prepare the coffee at the right time, the presence of a cup to contain the coffee is required for the machine to work, then when the coffee is ready the machine is turned off.

The automated curtains are closed when someone want to watch a movie

The automated irrigation switch on only only when rain is not expected and switch off when there is enough water for the plants
