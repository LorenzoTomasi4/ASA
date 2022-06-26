;; problem file: problem-coffee-machine.pddl
(define (problem coffee-machine)
    (:domain coffee-machine)
    (:objects coffee-mach cup coffee clock)
	(:init 
	    (switched-off coffee-mach) 
	    (cup-present cup)
	    (coffee-not-ready coffee)
	    (coffee-time clock)
	)
	(:goal (and 
	            (switched-off coffee-mach)
	            (coffee-ready coffee)
	       )
	)
)
