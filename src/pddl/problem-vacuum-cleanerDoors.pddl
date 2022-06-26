; Problem description

(define (problem pbVacuumCleaner)
  (:domain vacuum-cleaner)

  (:objects aisle kitchen livingRoom studio bathroom1 bathroom2
    masterBedroom bedroom2)

  ; The initial state describe what is currently true
  ; Everything else is considered false
  (:init
    ; all the rooms are dirty
    (dirty aisle) (dirty kitchen) (dirty livingRoom)
    (dirty studio) (dirty bathroom1) (dirty bathroom2)
    (dirty masterBedroom) (dirty bedroom2)
    
    ;doors:
    (doorsTo aisle livingRoom) 
    (doorsTo livingRoom kitchen) 
    (doorsTo aisle studio) 
    (doorsTo aisle bathroom1) 
    (doorsTo aisle bedroom2) 
    (doorsTo aisle masterBedroom) 
    (doorsTo masterBedroom bathroom2)
    
    ; vacuum Cleaner starts from aisle
    (inRoom aisle)
  )

  ; The goal state describe what we desire to achieve
  (:goal (and
    (clean aisle) (clean kitchen) (clean livingRoom)
    (clean studio) (clean bathroom1) (clean bathroom2)
    (clean masterBedroom) (clean bedroom2)
  ))
)


