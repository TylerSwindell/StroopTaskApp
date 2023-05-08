import "../LoginScreen.css";
import { useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Button, Container, Form } from "react-bootstrap";
import {
  colorOptions,
  textOptions,
} from "../../blackboard/config/TextSettings";
import { activeFirestore, demoMode } from "../../../config/MainConfig";

const generateSampleData = demoMode;

function AddParticipant() {
  const pidRef = useRef(100);
  const [loading, setLoading] = useState(false);

  // Initialize Cloud Firestore and get a reference to the service

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    let currentDate = new Date();

    let userData = {
      pid: pidRef.current.value,
      signupDate: currentDate.toString(),
      listOfTrials: [],
    };

    if (generateSampleData) {
      function generateRandomCodes() {
        const HIGH = colorOptions.length - 1,
          LOW = 1;
        const textCode = Math.floor(Math.random() * HIGH) + LOW;
        const colorCode = Math.floor(Math.random() * HIGH) + LOW;
        return { textCode, colorCode, congruent: colorCode === textCode };
      }

      function getRandomStroopText() {
        const { textCode, colorCode, congruent } = generateRandomCodes();
        return {
          text: textOptions[textCode],
          color: colorOptions[colorCode],
          congruent,
        };
      }

      let i = 0;

      while (i++ < 3) {
        currentDate = new Date();
        userData.listOfTrials.push({
          date: {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
          },
          startTime:
            currentDate.getHours().toString() +
            ":" +
            currentDate.getMinutes().toString() +
            ":" +
            currentDate.getSeconds().toString(),
          endTime: null,
          practiceRounds: [],
          finalRounds: [],
          totalCongruent: 0,
          totalCorrect: 0,
        });

        const HIGH = 1500,
          LOW = 0;
        for (let p = 1; p <= 50; p++) {
          const { text, color, congruent } = getRandomStroopText(),
            practice = p <= 10,
            keyPressed =
              textOptions[Math.floor(Math.random() * 4) + 1].charAt(0),
            correct = keyPressed === color.charAt(0),
            roundTime = Math.floor(Math.random() * HIGH) + LOW,
            currentTrial = userData.listOfTrials[i - 1];

          const roundType = practice ? "practice" : "final";
          userData.listOfTrials[i - 1][roundType + "Rounds"].push({
            roundNum: p,
            keyPressed,
            text,
            color: color.split("-")[0],
            congruent,
            correct,
            roundTime, // Measured in MS
          }); // End listOfTrials.push

          if (!practice) {
            if (congruent) currentTrial.totalCongruent++;
            if (correct) currentTrial.totalCorrect++;
          }
        } // For End
      } // While End
      console.log(userData);
    }

    try {
      let docref = await getDoc(doc(db, activeFirestore, userData.pid));
      if (!docref._document) {
        await setDoc(doc(db, activeFirestore, userData.pid), userData);
      } else {
        throw new Error("This document already exists.");
      }
      console.log(docref);
      alert(`PID Created: ${userData.pid}`);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert(`ERROR CREATING PID: ${userData.pid}\n${e}`);
    }

    setLoading(false);
  }

  return (
    <Container style={{ padding: "2rem" }}>
      <h3 className="text-center mb-4">Add Participant</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          id="Pid"
          className="d-flex justify-content-center align-items-center"
        >
          <Form.Label style={{ padding: "1rem" }}>Pid</Form.Label>
          <Form.Control type="Pid" ref={pidRef} required />
        </Form.Group>

        <Button disabled={loading} className="w-100 mt-3" type="submit">
          Add Participant
        </Button>
      </Form>
    </Container>
  );
}

export default AddParticipant;
