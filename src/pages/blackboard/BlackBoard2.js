import { Card, Alert } from 'react-bootstrap'
import StroopText from './components/stroop/StroopTask'
import Slide from './components/Slide'
import SlideContent from './config/SlideContent'
import { useState } from 'react'
import SearchForm from '../dashboard/components/SearchForm'

import './styles/BlackBoard.css'
import { useBlackboard } from '../../contexts/BlackboardContext'

import { BLACKBOARD } from '../../config/actionTypes'

/* Control Module
  * Contains user info collection process and stroop test
  */


const keyCodes = {
  fullscreen: 70,
  esc: 27,
  space: 32
}

// Keeps track of slides
let currentSlideNumber = 0

const endOfSlideArray = SlideContent.slides.length-1
const { PAUSE, SET_MODE, SET_STARTED, SET_CONTENT } = BLACKBOARD

function BlackBoard(props) {
	// Props
	const setRequiresInput = props.setRequiresInput
	
	// State
	const [ searchState, setSearchState ] = useState(null)
	const [ error, setError ] = useState()
	
	// Contexts
	const {userData} = useGlobal()
	const { state, dispatch } = useBlackboard()
	
	// Props to drill
	const localProps = {
		errorState: { error, setError },
	}

	// Prestructered elements`
	const searchFormEle = (
		<SearchForm 
		styles={{backgroundColor: 'none'}} 
		errorState={localProps.errorState} 
		searchState={{setSearchState}}
		customClasses='blackboardsearch'/>
	)

	const areSlidesDone = () => ( state.currentSlideNumber === endOfSlideArray)


	function handleKeyDown(e) {
		const keyPressed = e.keyCode

		if (userData !== null) {
			console.log(userData)
			setRequiresInput(false)

			if (keyPressed === keyCodes.space) {
				
				switch(state.mode) {
					case 'practice':
						dispatch({type: SET_CONTENT, payload: (<StroopText />)})
						dispatch({type: SET_STARTED, payload: true})
					break
					case 'final':
						dispatch({type: SET_CONTENT, payload: (<StroopText  />)})
						dispatch({type: SET_STARTED, payload: true})	
					break
					case 'slides':
						if(!areSlidesDone()) 
						dispatch({type: SET_CONTENT, payload: (<Slide slideContent={SlideContent.slides[++currentSlideNumber]}/>)})

						if (areSlidesDone()) 
							dispatch({type: SET_MODE, payload: 'practice'})

						dispatch({type: PAUSE, payload: true})
					break
					default:
				}
			}
		}

		if (state.paused === true) {
			dispatch({type: PAUSE, payload: false})
			dispatch({type: SET_CONTENT, payload: (<StroopText state={localProps.state} />)})
		}

	}

	return (
		<div className='wh-full' onKeyDown={(e)=>handleKeyDown(e)}>
			<Card className='blackboard noselect'>

				<p className='user-id'> ID: {(userData && userData.pid) || 'Unassigned'} </p>

				{ !userData ? searchFormEle : state.currentElement }

				<div className='error-container'>{error && <Alert variant="danger">{error}</Alert>}</div>
			</Card>
		</div>
	)
}

export default BlackBoard;
