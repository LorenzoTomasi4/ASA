;; domain file: domain-automated-curtains.pddl
(define (domain automated-curtains)
    (:requirements :strips)
    (:predicates
        (open ?c)
		(closed ?c)
		(movie-time ?t)
		(end-movie-time ?t)
    )
    
    (:action openCurtains
        :parameters (?c ?t)
        :precondition (and 
            (closed ?c) 
            (end-movie-time ?t))
        :effect (and
            (open ?c)
			(not (closed ?c))
        )
    )
    
    (:action closeCurtains
        :parameters (?c ?t)
        :precondition (and 
            (open ?c) 
            (movie-time ?t))
        :effect (and
            (closed ?c)
			(not (open ?c))
        )
    )
)