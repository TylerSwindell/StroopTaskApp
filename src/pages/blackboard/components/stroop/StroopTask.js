import { useEffect, useState, useRef } from "react";
import StroopText from "./StroopText";
import { useBlackboard } from "../../../../contexts/blackboard-context/BlackboardContext";
import { useStroopTask } from "../../../../contexts/stroop-context/task-context/StoopTaskContext";
import { useStroopText } from "../../../../contexts/stroop-context/text-context/StroopTextContext";
import { stroopWordInterval } from "../../config/TextSettings";

export default function StroopTask() {
  // Contexts

  // Stroop Text Context
  const { textState, setText, renderFixationCross } = useStroopText();

  // Stroop Task / Round Contexts
  const { trial, round, CONSTANTS, getTime } = useStroopTask();

  // context destructuring
  const {
    trialState,
    pushButtonPress,
    pushStartTime,
    pushEndTime,
    consolidateData,
    setEndTime,
    getPracticeRoundCount,
    getFinalRoundCount,
  } = trial;
  const { roundState, setRound } = round;

  // Blackboard Context / State
  const {
    mode,
    endStroop,
    endPractice,
    nextRound,
    BLACKBOARD_MODES,
    blackboardState,
    saveStroop,
  } = useBlackboard();
  const { currentRound } = blackboardState;

  // CONSTANTS
  const { fixationCrossTimeout } = CONSTANTS;
  const { PRACTICE, FINAL, SAVE_MODE } = BLACKBOARD_MODES;

  // Local State
  const [keyDown, setKeyDown] = useState(false);
  const [saveState, setSaveState] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [roundInitialized, setRoundInitialized] = useState(false);
  const [isStroopComplete, setStroopComplete] = useState(false);

  const focusRef = useRef(null);

  const mainLoop = () => {
    console.log(
      `%cMAIN LOOP START | NUM: ${currentRound}`,
      "color:orange; font-size: 1.2rem"
    );

    setTimeout(() => {
      const { color, text } = roundState;
      pushStartTime({ mode, roundNum: currentRound });
      setText({ color, text });
      console.log(roundState);
      setKeyDown(false);
      console.log(roundState);
      console.log(trialState);
    }, fixationCrossTimeout);

    setTimeout(() => {
      if (trialState.endTimeList.length === currentRound)
        pushEndTime({ mode, roundNum: currentRound, keyDown: false });
      setRound(trialState[`${mode}Rounds`][currentRound]);
      renderFixationCross();
      nextRound();
    }, stroopWordInterval);
  };

  useEffect(() => {
    focusRef.current.focus();
    console.log(
      `%cROUND START | NUM: ${currentRound}`,
      "color:green; font-size: 1.3rem"
    );
    if (!roundInitialized) {
      setRound(trialState[`${mode}Rounds`][0]);
      setKeyDown(false);
      setRoundInitialized(true);
      return;
    }

    switch (mode) {
      case PRACTICE:
        if (currentRound >= getPracticeRoundCount()) endPractice();
        else mainLoop();
        break;
      case FINAL:
        if (currentRound >= getFinalRoundCount()) {
          saveStroop();
          setStroopComplete(true);
        } else mainLoop();
        break;
      case SAVE_MODE:
        console.log("SAVE MODE!!!");
        setEndTime();
        consolidateData();
        endStroop();
        break;
      default:
        console.error(`NO MODE FOUND:`, mode);
    }
  }, [currentRound, roundInitialized, saveState, isStroopComplete]);

  const handleKeyDown = (e) => {
    e.preventDefault();
    const keyUpper = String.fromCharCode(e.keyCode).toUpperCase();
    const keyLower = String.fromCharCode(e.keyCode).toLowerCase();

    switch (keyUpper) {
      case "P":
        setIsPaused(!isPaused);
        if (isPaused) setText({ color: "white", text: "PAUSED" });
        console.log(isPaused ? "UNPAUSED" : "PAUSED");

        break;
      case "R":
      case "G":
      case "B":
      case "Y":
        if (keyDown === true) return;
        setKeyDown(true);
        const isCorrect = keyLower === roundState.color.charAt(0);
        const isCongruent =
          roundState.color.charAt(0) === roundState.text.charAt(0);
        const timePressed = getTime();
        pushEndTime({ mode, roundNum: currentRound, keyDown: keyUpper });
        pushButtonPress({
          mode,
          roundNum: currentRound,
          keyPressed: keyUpper,
          isCorrect,
          isCongruent,
          timePressed,
        });

        const msgStyleProps = isCorrect
          ? { textColor: "green", backgroundColor: "rgb(9, 15, 9)" }
          : { textColor: "red", backgroundColor: "rgb(26, 7, 7)" };
        const msgStyle = `color:${msgStyleProps.textColor}; background-color: ${msgStyleProps.backgroundColor}; font-size: 1.5rem; padding: .5rem 1rem; width: 100%`;
        const roundColorCode = roundState.color.charAt(0).toUpperCase();
        console.log(
          `%croundNum: ${currentRound}\nkeyPressed: ${keyUpper}\nroundColor: ${roundColorCode}`,
          msgStyle
        );

        if (mode === PRACTICE) {
          setText({
            text: isCorrect ? "Correct" : "Incorrect",
            color: isCorrect ? "green" : "red",
          });
        } else if (mode === FINAL) renderFixationCross();
        break;

      default:
        console.error("Not a valid keyPress");
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={focusRef}
    >
      {<StroopText color={textState.color} text={textState.text} />}
      {keyDown}
    </div>
  );
}
