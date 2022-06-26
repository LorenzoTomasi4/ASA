; Domain description

(define (domain vacuum-cleaner)

  
  (:requirements
    :strips                 
    
  )

  ; Define the relations
  ; Question mark prefix denotes free variables
  (:predicates
    (inRoom ?r)      ; A room where the vacuum robot is
    (doorsTo ?r ?to)
    (clean ?r)      ; The room is clean
    (dirty ?r) ; The room is dirty
  )

  
  (:action move
    :parameters (?room ?to)
    
    :precondition (and
      (inRoom ?room)
      (doorsTo ?room ?to)
      (clean ?room)
    )
    
    :effect (and
      (inRoom ?to)
      (doorsTo ?to ?room)  ;if i go in a way i can come back too
      (not (inRoom ?room))
    )
  )
  
  (:action clean
    :parameters (?room)
    
    :precondition (and
      (inRoom ?room)
      (dirty ?room)
    )
    
    :effect (and
      (clean ?room)
      (not (dirty ?room))
    )
  )

(:action recharge
    :parameters (?room)
    
    :precondition (and
      (inRoom ?room)
      (dirty ?room)
    )
    
    :effect (and
      (clean ?room)
      (not (dirty ?room))
    )
  )
  
  
)