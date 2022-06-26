;; domain file: domain-automated-irrigation.pddl
(define (domain automated-irrigation)
    (:requirements :strips)
    (:predicates
        (switched-on ?i)
		(switched-off ?i)
		(rain-expected ?r)
		(rain-not-expected ?r)
		(enough-water ?w)
		(water-not-enough ?w)
    )
    
    (:action switchOnIrrigation
        :parameters (?i ?r ?w)
        :precondition (and 
            (switched-off ?i) 
            (rain-not-expected ?t)
            (water-not-enough ?r))
        :effect (and
            (switched-on ?i)
			(not (switched-off ?i))
			(enough-water ?w)
			(not (water-not-enough ?w))
        )
    )
    
    (:action switchOffIrrigation
        :parameters (?i ?w)
        :precondition (and 
            (switched-on ?i) 
            (enough-water ?w))
        :effect (and
            (switched-off ?i)
			(not (switched-on ?i))
        )
    )
)