export default function StroopText(props) {
	const {color, text} = props
	return (
		<p 
		
		className={`
			${color}-text
			stroop-text
			noselect
		`}
	> {text} </p>
	
	)
}