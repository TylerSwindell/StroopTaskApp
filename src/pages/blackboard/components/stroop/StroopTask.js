import StroopText from "./StroopText"
import { useStroopText } from "../../../../contexts/StroopTextContext"
import { useStroopTask } from "../../../../contexts/StoopTaskContext"
import { useEffect } from "react"
import { useState } from "react"

export default function StroopTask() {
	// Contexts
	const {pushTrial} = useStroopTask()
	const {stroopText, randomizeText, renderFixationCross, CONSTANTS} = useStroopText()

	const {color, text} = stroopText,
		{	fixationCrossTimeout, 
			stroopWordInterval, 
			stroopTaskInterval, 
			fixationCross, 
			colorOptions
		} = CONSTANTS

	// Local State
		const [ inputDisabled, setInputDisabled ] = useState(false)
		const [ keyDown, setKeyDown ] = useState(false)
		const [ mainIntervalId, setMainIntervalId] = useState(null)

	useEffect(() => {
		renderFixationCross()
		// setMainIntervalId(setInterval(() => {
		// 	if (inputDisabled) {clearInterval(mainIntervalId);return}
		// 	randomizeText()
		// 	setTimeout(()=>{
		// 		renderFixationCross()
		// 	}, stroopWordInterval)
		// }, stroopTaskInterval))
	}, [keyDown])


	const handleKeyDown = e => {
		e.preventDefault()
		if (inputDisabled) return
		const keyCode = e.keyCode
	
		const keyUpper = String.fromCharCode(keyCode).toUpperCase()
	
		switch(keyUpper) {
			case 'R': 
			case 'G': 
			case 'B': 
			case 'Y': 
				console.log(keyUpper)
				// setKeyDown(keyUpper)
				// setInputDisabled(true)
				// renderFixationCross()
				// setTimeout(() => {
				// 	setInputDisabled(false)
				// }, fixationCrossTimeout)
				break 
			default: console.error('Not a valid keyPress')
		}		
	}

  	return ( 
		<div style={{width: '100%', height: '100%'}} 
			onKeyDown={handleKeyDown}
			tabIndex={0}>
				<StroopText color={color} 
					text={
						text.charAt(0).toUpperCase() + text.slice(1)
					} 
				/>
		</div> 
	)
}
