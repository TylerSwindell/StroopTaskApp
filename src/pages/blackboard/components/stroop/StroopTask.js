import { useEffect, useState } from "react"
import Slide from "../Slide"
import SlideContent from '../../config/SlideContent'
import StroopText from "./StroopText"
import { useBlackboard } from "../../../../contexts/blackboard-context/BlackboardContext"
import { useStroopTask } from "../../../../contexts/stroop-context/task-context/StoopTaskContext"
import { useStroopText } from "../../../../contexts/stroop-context/text-context/StroopTextContext"
import { stroopWordInterval } from "../../config/TextSettings"

export default function StroopTask() {
	// Contexts
	const { textState, setText, renderFixationCross, renderPauseText } = useStroopText()
	const { trial, round, CONSTANTS, getTime } = useStroopTask(),
	{ trialState, newTrial, pushPracticeRounds, pushButtonPress, pushStartTime, pushEndTime } = trial,
	{ roundState, setRound, setCorrect } = round,
	{ stroopTaskInterval, fixationCrossTimeout, practiceRoundCount, finalRoundCount } = CONSTANTS
	
	const { mode, endStroop, endPractice, nextRound, BLACKBOARD_MODES, blackboardState } = useBlackboard(),
	{ currentRound } = blackboardState
	
	const { 
		LOGIN, PRACTICE, PRACTICE_COMPLETE,
		FINAL, FINAL_COMPLETE, SLIDES
	} = BLACKBOARD_MODES

	// Local State
		const [ keyDown, setKeyDown ] = useState(false)
		const [ isPaused, setIsPaused ] = useState(false)
		const [roundInitialized,setRoundInitialized] = useState(false)

		/* TODO:
		 * Figure out setRound discrepency in this section
		 * Rounds are being set more rapidly than the UI can update
		 */

	const mainLoop = () => {
		console.log(`%cMAIN LOOP START | NUM: ${currentRound}`, 'color:orange; font-size: 1.2rem')

		let timeoutOne = setTimeout(() => {
			const {color, text} = roundState
			pushStartTime({mode, roundNum:currentRound})
			setText({color, text})
			setKeyDown(false)
			console.log(roundState)
			console.log(trialState)
		}, fixationCrossTimeout)

		let timeoutTwo = setTimeout(() => {
			if (!keyDown) pushEndTime({mode, roundNum:currentRound, keyDown: false})
			setRound(trialState[`${mode}Rounds`][currentRound])
			renderFixationCross()
			nextRound()
		}, stroopWordInterval)
		
	}

	useEffect(() => {
		console.log(`%cROUND START | NUM: ${currentRound}`, 'color:green; font-size: 1.3rem')
		if (!roundInitialized) {
			setRound(trialState[`${mode}Rounds`][0])
			setRoundInitialized(true)
			return
		}

		switch (mode) {
			case PRACTICE:
				if (currentRound > 10) endPractice()
				else mainLoop()
				break
			case FINAL:
				if (currentRound > 40) endStroop()
				else mainLoop()
				break
			default: console.error(`NO MODE FOUND:`, mode)
		}
		
	}, [currentRound, roundInitialized])

	const handleKeyDown = e => {
		e.preventDefault()
		const keyUpper = String.fromCharCode(e.keyCode).toUpperCase()
		const keyLower = String.fromCharCode(e.keyCode).toLowerCase()


		switch(keyUpper) {
			case 'P': 
				setIsPaused(!isPaused)
				if (isPaused) setText({color: 'white', text: 'PAUSED'})
				console.log((isPaused) ? 'UNPAUSED' : 'PAUSED')
				
				break
			case 'R': case 'G': case 'B': case 'Y':
				if (keyDown !== false) return
				setKeyDown(keyLower)
				const isCorrect = (keyLower === roundState.color.charAt(0))
				const timePressed = getTime()
				pushEndTime({mode, roundNum:currentRound, keyDown: keyUpper})
				pushButtonPress({mode, roundNum: currentRound, keyPressed: keyUpper, isCorrect, timePressed})
				console.log('pressed:',keyLower,'\nstate:', roundState.color.charAt(0))
				console.log(roundState)

				setText({
					text: (isCorrect) ? 'Correct' : 'Incorrect',
					color: (isCorrect) ? 'green' : 'red',
				})
				break

			default: console.error('Not a valid keyPress')
		}		
	}

  	return ( 
		<div style={{width: '100%', height: '100%'}} 
			onKeyDown={handleKeyDown}
			tabIndex={0}>
				{<StroopText color={textState.color} text={textState.text} />}
				{keyDown}
		</div> 
	)
}
