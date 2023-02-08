import React from 'react'
import { Button } from 'react-bootstrap'
import { useGlobal } from '../../../contexts/global-context/GlobalContext'

export default function TestModeButton() {

    const { isInTestMode, toggleTestMode } = useGlobal()

    function handleClick() {
        toggleTestMode()
        console.log(isInTestMode)
    }

  return (
    <Button style={styles} className="text-center"  onClick={handleClick}>Test Mode</Button>
  )
}

const styles = {
    padding: '6px 12px', maxHeight: '3rem', minWidth: "50%"
}