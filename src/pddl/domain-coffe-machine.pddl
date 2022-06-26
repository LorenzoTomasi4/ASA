;; domain file: domain-coffee-machine.pddl
(define (domain coffee-machine)
    (:requirements :strips)
    (:predicates
        (switched-on ?m)
		(switched-off ?m)
		(cup-present ?c)
		(coffee-ready ?r)
	    (coffee-not-ready ?r)
		(coffee-time ?t)
    )
    
    (:action switchOnCoffeeMachine
        :parameters (?m ?c ?r ?t)
        :precondition (and 
            (switched-off ?m) 
            (cup-present ?c)
            (coffee-not-ready ?r)
            (coffee-time ?t)
        )
        
        :effect (and
            (switched-on ?m)
			(not (switched-off ?m))
			(coffee-ready ?r)
			(not(coffee-not-ready ?r))
        )
    )
    
    (:action switchOffCoffeeMachine
        :parameters (?m ?r)
        :precondition (and 
            (switched-on ?m)
            (coffee-ready ?r)
        )
        :effect (and
            (switched-off ?m)
            (not (switched-on ?m))
        )
    )
)