;; problem file: problem-automated-irrigation.pddl
(define (problem automated-irrigation)
    (:domain automated-irrigation)
    (:objects irrigation forecast water)
	(:init 
        (switched-off irrigation) 
        (rain-not-expected forecast)
        (water-not-enough water)
	)
	(:goal (and 
	    (switched-off irrigation)
	    (enough-water water)
	))
)
