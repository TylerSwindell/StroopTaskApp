import React, { useEffect, useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { useBlackboard } from '../../contexts/BlackboardContext'
import SearchForm from '../dashboard/components/SearchForm'
import SlideContent from './config/SlideContent'
import StroopText from './components/stroop/StroopTask'



const endOfSlideArray = SlideContent.slides.length-1
export default function BlackBoard(props) {

	const setRequiresInput = props.setRequiresInput

  	// Contexts
    const { currentElement, mode, prevSlide, nextSlide, setCurrentElement,
            setMode, userState,setUserState, totalSlides, currentSlide 
    } = useBlackboard()

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
    	}
  	}, [searchState])

	function handleKeyDown(e) {
		const keyPressed = e.keyCode

		if (userState !== null) {
			console.log(userState)
			setRequiresInput(false)
			console.log(keyPressed)
		}



		switch(mode) {
		case 'login': console.log('login: ', keyPressed)
			break
		case 'slides': console.log('slides: ', keyPressed)
			if (keyPressed === 32) {
				if (currentSlide < totalSlides-1) nextSlide()
				else { 
					setMode('practice')
					setCurrentElement(<StroopText />)
				} 
			}
			else if (keyPressed === 37) prevSlide()
			else console.log('slides: no bound action to key', keyPressed)
			break
		case 'practice': console.log('practice: ', keyPressed)
			
			break
		default: throw new Error('No case provided for keyDown in ', mode, ': BlackBoard.js')
    }

		// if (userData !== null) {
		// 	console.log(userData)
		// 	setRequiresInput(false)

		// 	if (keyPressed === keyCodes.space) {
				
		// 		switch(state.mode) {
		// 			case 'practice':
		// 				dispatch({type: SET_CONTENT, payload: (<StroopText />)})
		// 				dispatch({type: SET_STARTED, payload: true})
		// 			break
		// 			case 'final':
		// 				dispatch({type: SET_CONTENT, payload: (<StroopText  />)})
		// 				dispatch({type: SET_STARTED, payload: true})	
		// 			break
		// 			case 'slides':
		// 				if(!areSlidesDone()) 
		// 				dispatch({type: SET_CONTENT, payload: (<Slide slideContent={SlideContent.slides[++currentSlideNumber]}/>)})

		// 				if (areSlidesDone()) 
		// 					dispatch({type: SET_MODE, payload: 'practice'})

		// 				dispatch({type: PAUSE, payload: true})
		// 			break
		// 			default:
		// 		}
		// 	}
		// }

		// if (state.paused === true) {
		// 	dispatch({type: PAUSE, payload: false})
		// 	dispatch({type: SET_CONTENT, payload: (<StroopText state={localProps.state} />)})
		// }

	}

  return (
		<div className='wh-full' onKeyDown={(e)=>handleKeyDown(e)}>
			<Card className='blackboard noselect'>

				<p className='user-id'> ID: {(searchState && searchState.pid) || 'Unassigned'} </p>

				{ !searchState ? searchFormEle : currentElement }

				<div className='error-container'>{error && <Alert variant="danger">{error}</Alert>}</div>
			</Card>
		</div>  )
}
