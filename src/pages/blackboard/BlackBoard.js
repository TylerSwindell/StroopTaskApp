import React, { useEffect, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { useBlackboard } from '../../contexts/blackboard-context/BlackboardContext'
import { useGlobal } from '../../contexts/global-context/GlobalContext'
import { useStroopTask } from '../../contexts/stroop-context/task-context/StoopTaskContext'
import { StroopTextProvider } from '../../contexts/stroop-context/text-context/StroopTextContext'
import SearchForm from '../dashboard/components/SearchForm'

export default function BlackBoard() {

  	// Contexts
	const {enableFullscreen, disableFullscreen} = useGlobal()
    const { currentElement, mode, prevSlide, startSlides, setUserState, setCurrentElement, startPractice, 
			startStroop, endStroop, BLACKBOARD_MODES, checkMode, nextSlide, currentRound } = useBlackboard(), 
	{ LOGIN, SLIDES, PRACTICE, PRACTICE_COMPLETE, FINAL, FINAL_COMPLETE } = BLACKBOARD_MODES

	const 	{ trial,round } = useStroopTask(),
			{ newTrial, trialState } = trial,
			{ roundState, setRound } = round


    // State
    const [error, setError] = useState('')
    const [ searchState, setSearchState ] = useState(null)

    const searchFormEle = (
		<SearchForm 
			styles={{backgroundColor: 'none'}} 
			errorState={{error, setError}} 
			searchState={{setSearchState}}
			customClasses='blackboardsearch'/>
	)

  	useEffect(()=> {
		if (!searchState) setCurrentElement(searchFormEle)
		else {
      		setUserState(searchState)
			startSlides()
			newTrial()
    	}
  	}, [ searchState ])

	function handleSlidesKeyDown(keyPressed) {
		console.log('keyDown: ', keyPressed, '\nMode:', mode)
		switch(keyPressed) {
			case 32: 
				if (checkMode(SLIDES) && nextSlide()) return
				else startPractice()
				if (checkMode(PRACTICE_COMPLETE)) startStroop()
				// if (checkMode(FINAL_COMPLETE)) endStroop()
				else console.error('slides: no bound action to key', keyPressed, 'while in mode', mode)
				
				break
			case 37: if (checkMode(SLIDES)) prevSlide()
				break
			case 70: console.log('fullscreen')
				break
			default: console.error('slides: no bound action to key', keyPressed)
		}
	}

	function handleKeyDown(e) {
		if (mode !== LOGIN) e.preventDefault()

		const keyCode = e.keyCode

		
		if (keyCode === 70) return enableFullscreen()
		if (keyCode === 27) return disableFullscreen()

		switch(mode) {
			case LOGIN: console.log('login: ', keyCode)
				break
			case SLIDES: handleSlidesKeyDown(keyCode)
				break
			case PRACTICE:
				break
			case PRACTICE_COMPLETE: 
				if (keyCode === 32) startStroop()
				break
			case FINAL:
				break
			case FINAL_COMPLETE:
				if (keyCode === 32) endStroop()
				break
			default: console.error('No case provided for keyDown in [', mode, ']: BlackBoard.js')
		}
	}

	return (
		<div className='wh-full noselect' tabIndex={0} onKeyDown={(e)=>handleKeyDown(e)}>
			<Card tabIndex={0} className='blackboard'>

				<p className='user-id'> ID: {(searchState && searchState.pid) || 'Unassigned'} </p>
				<StroopTextProvider>
					{ currentElement }
				</StroopTextProvider>

				<div className='error-container'>{error && <Alert variant="danger">{error}</Alert>}</div>
			</Card>
		</div>  
	)
}
