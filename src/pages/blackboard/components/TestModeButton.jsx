import React from 'react'
import { Button } from 'react-bootstrap'
import { useGlobal } from '../../../contexts/global-context/GlobalContext'
import { getExperimentalSetting } from '@firebase/util'

export default function TestModeButton(props) {
  const {styles: stylesProp} = props

  console.log(stylesProp)

    const { isInTestMode, toggleTestMode } = useGlobal()

    function handleClick() {
        toggleTestMode()
        console.log(isInTestMode)
    }


    
    const readyToRecordTaskText = () => isInTestMode ? 'Test Mode' : 'Stroop Mode'
    
    const buttonStyles = {...localStyles, ...stylesProp}
    const stroopActiveSyles = {...buttonStyles, color: 'green', border: 'green'}
    const testActiveStyles = {...buttonStyles, color: 'red', border: 'red'}
    
    return (
      <Button style={(isInTestMode) ? testActiveStyles : stroopActiveSyles} onClick={handleClick}>{readyToRecordTaskText()}</Button>
    )
  }
  
  const localStyles = {
    maxHeight: '3rem', boxShadow: 'none', background: 'none'
    
  }