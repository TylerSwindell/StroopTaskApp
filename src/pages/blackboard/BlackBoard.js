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
    const { currentElement, mode, prevSlide, nextSlide, setCurrentElement,
            setMode, userState, setUserState, totalSlides, currentSlide, startPractice, 
    } = useBlackboard()

	const { trial } = useStroopTask()
	const { newTrial } = trial

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
    	if (searchState) {
      		setUserState(searchState)
      		setMode('slides')
			newTrial()
    	}
  	}, [searchState])

	function handleSlidesKeyDown(keyPressed) {
		switch(keyPressed) {
			case 32: if (!nextSlide()) startPractice()
				break
			case 37: prevSlide()
				break
			case 70: console.log('fullscreen')
				break
			default: console.error('slides: no bound action to key', keyPressed)
		}
	}
	function handleKeyDown(e) {
		if (mode !== 'login') e.preventDefault()

		const keyCode = e.keyCode

		
		if (keyCode === 70) return enableFullscreen()
		if (keyCode === 27) return disableFullscreen()

		switch(mode) {
			case 'login': console.log('login: ', keyCode)
				break
			case 'slides': handleSlidesKeyDown(keyCode)
				break
			case 'practice':
			case 'final':
				break
			default: console.error('No case provided for keyDown in ', mode, ': BlackBoard.js')
		}
	}

  return (
		<div className='wh-full noselect' tabIndex={0} onKeyDown={(e)=>handleKeyDown(e)}>
			<Card tabIndex={0} className='blackboard'>

				<p className='user-id'> ID: {(searchState && searchState.pid) || 'Unassigned'} </p>
				<StroopTextProvider>
					{ !searchState ? searchFormEle : currentElement }
				</StroopTextProvider>

				<div className='error-container'>{error && <Alert variant="danger">{error}</Alert>}</div>
			</Card>
		</div>  )
}
