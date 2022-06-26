;; problem file: problem-automated-curtains.pddl
(define (problem automated-curtains)
    (:domain automated-curtains)
    (:objects kitchenCurtains livingRoomCurtains clock)
	(:init 
	    (open kitchenCurtains) 
	    (open livingRoomCurtains)
	    (movie-time clock)
	)
	(:goal (and 
	    (closed kitchenCurtains)
	    (closed livingRoomCurtains)
	    ;(end-movie-time clock)
	))
)
