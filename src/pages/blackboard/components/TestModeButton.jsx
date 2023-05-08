import React from 'react'
import { Button } from 'react-bootstrap'
import { useGlobal } from '../../../contexts/global-context/GlobalContext'

export default function TestModeButton(props) {
  const {styles: stylesProp} = props

  console.log(stylesProp)

    const { isInTestMode, toggleTestMode } = useGlobal()
    
    const modeText = () => isInTestMode ? 'Test Mode Active' : 'Stroop Mode Active'
    
    const buttonStyles = {...localStyles, ...stylesProp}
    const stroopActiveSyles = {...buttonStyles, color: 'green', border: 'green'}
    const testActiveStyles = {...buttonStyles, color: 'red', border: 'red'}
    
    return (
      <Button style={(isInTestMode) ? testActiveStyles : stroopActiveSyles} onClick={toggleTestMode}>{modeText()}</Button>
    )
  }
  
  const localStyles = {
    maxHeight: '3rem', boxShadow: 'none', background: 'none', width: 'auto'
    
  }