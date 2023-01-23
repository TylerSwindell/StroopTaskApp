import StroopText from "./StroopText"
import { useStroopText } from "../../../../contexts/StroopTextContext"

export default function StroopTask() {
	const {stroopText, randomizeText} = useStroopText()
	const {color, text} = stroopText

	const handleKeyDown = e => {
		e.preventDefault()
		const keyCode = e.keyCode
	
		const keyPressed = String.fromCharCode(keyCode).toUpperCase()
	
		switch(keyPressed) {
			case 'R': 
			case 'G': 
			case 'B': 
			case 'Y': console.log(keyPressed)
				randomizeText()
				break 
			default: console.error('Not a valid keyPress')
		}
	}

  	return ( 
		<div style={{width: '100%', height: '100%'}} 
			onKeyDown={handleKeyDown}
			tabIndex={0}>
				<StroopText color={color} text={text} />
		</div> 
	)
}
