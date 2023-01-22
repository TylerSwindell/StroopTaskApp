import { useEffect, useRef, useState } from "react";
import {colorOptions, textOptions, fixationCrossTimeout, stroopWordInterval} from '../../config/TextSettings'
import { getRandomStroopText } from './StroopHelper'
import SlideContent from '../../config/SlideContent'
import Slide from "../Slide";
import { useBlackboard } from "../../../../contexts/BlackboardContext";

let modes = {
    practice: {
        rounds: 10, 
        showCorrect: true,
        complete: false
    },
    final: {
        rounds: 40, 
        showCorrect: false,
        complete: false
    }
}

let trialData = {
    date: {
        day: null,
        month: null,
        year: null
    }, 
    startTime: null,
    endTime: null,
    practiceRounds: [],
    finalRounds: [],
    totalCongruent: 0,
    totalCorrect: 0 
}
const stroopKeys = textOptions.map((text) => text.charAt(0)).slice(1)

/* Control Module
* Contains entire stroop test functionality 
*/
function StroopText() {
    const { currentElement, currentRound, mode, prevSlide, nextSlide, setCurrentElement, setPaused, setTimestamp,
        setMode, setUserState, totalSlides, currentSlide, paused, complete, timestamp, nextRound, setComplete
} = useBlackboard()

    //console.log(user)
    
    // Initial Stroop Setup
    const [stroopText, setStroopText] = useState(null)
    const keyPressRef = useRef(false)
    
    const renderFixationCross = () => setStroopText({text: textOptions[0], color: colorOptions[0], congruent: true})
    const renderStroopText = (cb) => {
    //console.log('timestamp: ', stroopRef.current.timestamp.sec, stroopRef.current.timestamp.ms)
    renderFixationCross()
        setTimeout(() => {
            setStroopText(getRandomStroopText())
            //console.log('renderStroopText1 - keyPressRef:', keyPressRef.current)
            if (!keyPressRef.current) cb()
            keyPressRef.current = false
    }, fixationCrossTimeout)

    console.log(trialData)
}

    // REWRITE STROOP TASK USING NEW REDUCER FUNCTION
    useEffect(() => {
        initializeTrialData()
        renderFixationCross()
        const intervalId = setInterval(() => {
            if(!paused) {
                nextRound()
                if (currentRound > modes.practice.rounds && mode !== 'final') {
                    clearInterval(intervalId)
                    setPaused(true)
                    setComplete(true)
                    setCurrentElement(<Slide slideContent={SlideContent.final}/>)
                    setMode('final')
                    console.log(paused, mode)
                }
                if (currentRound === modes.final.rounds) {
                    clearInterval(intervalId)
                    setComplete(true)

                    setCurrentElement(<Slide slideContent={SlideContent.endscreen}/>)
                }

                setTimestamp({
                    sec: new Date().getSeconds(), 
                    ms: new Date().getMilliseconds()
                })

                const randomStroopData = getRandomStroopText()

                renderStroopText(() => {
                    trialData[`${mode}Rounds`].push({
                        roundNum: currentRound,
                        keyPressed: 0,
                        text: randomStroopData.text,
                        color: randomStroopData.color.split('-')[0],
                        congruent: randomStroopData.congruent,
                        correct: false,
                        roundTime: {
                            startTime: timestamp,
                            endTime: {
                                sec: new Date().getSeconds(),
                                ms: new Date().getMilliseconds()
                            }
                        }
                    })
                })
            }
        }, stroopWordInterval)
    }, [])

    function initializeTrialData() {
        const currentDate = new Date(), 
            day = currentDate.getDate(), 
            month = currentDate.getMonth() + 1, 
            year = currentDate.getFullYear()

        trialData.startTime = `${currentDate.getHours}:${currentDate.getMinutes}:${currentDate.getSeconds}`
        trialData.date = { day, month, year }
    }

    // Handles main key press for each round of the stroop text
    function handleKeyDown(e) {
        if (!complete) {
            e.preventDefault();

            const keyCode = e.keyCode
            const keyPressed = String.fromCharCode(keyCode).toUpperCase();

            // If one of the specified keys is pressed
            if (stroopKeys.includes(keyPressed)) {

                if (!keyPressRef.current) {
                    console.log(keyPressed)
                    keyPressRef.current = true

                    const {text, congruent} = stroopText
                    let {color} = stroopText

                    const correct = (keyPressed === color.charAt(0))
                    const endTime = {
                        sec: new Date().getSeconds(),
                        ms: new Date().getMilliseconds()
                    }
                    const startTime = timestamp

                    trialData[`${mode}Rounds`].push({
                        roundNum: currentRound,
                        keyPressed,
                        text,
                        color: color.split('-')[0],
                        congruent,
                        correct,
                        roundTime: {
                            startTime,
                            endTime
                        }
                    })

                    if (congruent) trialData.totalCongruent++
                    if (correct) trialData.totalCorrect++

                    console.log(trialData)
                }
            } else {
                e.preventDefault()
                console.log('Nothing corresponding to: ', keyPressed)
            }
        }
    }


    // RETURN
    return ( <p onKeyDown={(e) => handleKeyDown(e)}
                tabIndex="0"
                className={`
                    ${stroopText && stroopText.color}
                    stroop-text
                    noselect
                `}
            > {stroopText && stroopText.text} </p>
    )
}



export default StroopText

