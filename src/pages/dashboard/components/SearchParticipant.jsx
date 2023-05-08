import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import SearchForm from "./SearchForm";
import { queryAll } from "../../../setup/QueryDB";
import { activeFirestore } from "../../../config/MainConfig";

const CSV_HEADER =
  "PID,SessionNumber,TotalCorrect,TotalCongruent,AverageReactionTime,AverageCongruentReactionTime,AverageIncongruentReactionTime\n";

export default function SearchParticipant(props) {
  const { error, setError } = props.errorState;
  const [searchState, setSearchState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchDisplayData, setSearchDisplayData] = useState({
    pid: "",
    trialCount: "",
    totalCongruent: "",
    totalCorrect: "",
  });

  const insertAt = (array, index, ...elementsArray) =>
    array.splice(index, 0, ...elementsArray);

  useEffect(() => {
    // Stop points
    // pid will be blank in at the start
    // it will only populate on valid or invalid entries
    if (error !== "" || searchState === null) return;

    // null is set if the data is not returned
    if (searchState === undefined) {
      return setSearchDisplayData({
        pid: "Invalid",
        trialCount: "N/A",
        totalCongruent: "N/A",
        totalCorrect: "N/A",
      });
    }

    // If there is data run the population section
    const totalCongruent = searchState.listOfTrials.length
      ? searchState.listOfTrials
          .map((i) => i.dataSummary.totalCongruent)
          .reduce((accu, curr) => accu + curr)
      : 0;
    const totalCorrect = searchState.listOfTrials.length
      ? searchState.listOfTrials
          .map((i) => i.dataSummary.totalCorrect)
          .reduce((accu, curr) => accu + curr)
      : 0;

    setSearchDisplayData({
      pid: searchState.pid,
      trialCount: searchState.listOfTrials.length,
      totalCongruent,
      totalCorrect,
    });
    // useEffect fires when userData changes
  }, [error, searchState]); // End useEffect

  const filterParticipantData = (participant) => {
    const { listOfTrials } = participant;

    let dataSummariesArr = [];
    let roundDataArr = [];
    let filteredDataArr = [];

    listOfTrials.forEach((trial) => dataSummariesArr.push(trial.dataSummary));
    listOfTrials.forEach((trial) =>
      roundDataArr.push(trial.roundData.slice(10))
    );

    listOfTrials.forEach((trial, trialIndex) => {
      const { endTimeList } = trial;

      let tempTimeList = {
        rounds: [],
        sessionNumber: trialIndex, // number
      };
      let tempRoundNumberList = []; // Keeps track of what roundNums had key enters

      // Filter Duplicates and Practice rounds
      endTimeList.forEach((round, roundIndex) => {
        const { mode, roundNum } = round;

        if (mode === "practice") return;

        if (!tempRoundNumberList.includes(roundNum)) {
          tempTimeList.rounds.push(round);
          tempRoundNumberList.push(roundNum);
        }
      });

      // Insert Empty Data
      for (let i = 0; i < 40; i++) {
        if (!tempRoundNumberList.includes(i)) {
          insertAt(tempTimeList.rounds, i, {
            roundNum: i,
            keyPress: null,
          });
          insertAt(tempRoundNumberList, i, i);
        }
      }

      filteredDataArr.push(tempTimeList);
    });

    // Add congruency values
    filteredDataArr.forEach((trial, trialIndex) =>
      trial.rounds.forEach(
        (round, roundIndex) =>
          (round["congruent"] = roundDataArr[trialIndex][roundIndex].congruent)
      )
    );

    return {
      pid: participant.pid,
      dataSummaries: dataSummariesArr,
      trialReferenceData: roundDataArr,
      filteredData: filteredDataArr,
    };
  };

  const downloadTxtFile = (text) => {
    // file object
    const file = new Blob(text, { type: "text/plain" });
    // anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "stroop-task-data" + Date.now() + ".csv";
    // simulate link click
    document.body.appendChild(element);
    // Required for this to work in FireFox
    element.click();
  };

  const generateParticipantCSV = (participantData) => {
    const { filteredData, dataSummaries, pid } = participantData;
    // console.log(participantData);

    let participantTrials = {
      pid,
      trialList: [],
    };
    // Process trials held in filteredData array
    filteredData.forEach((trial, trialIndex) => {
      const { sessionNumber } = trial;
      const { totalCongruent, totalCorrect } = dataSummaries[trialIndex];

      let tempTrial = {
        sessionNumber,
        reactionList: [],
        avgReaction: 0,
        totalCongruent,
        totalCorrect,
        avgCongruentReaction: 0,
        avgIncongruentReaction: 0,
      };

      // Process each round of trial
      trial.rounds.forEach((round, roundIndex) => {
        let milliseconds = 0;

        // No key input for round
        if (round.keyPress === null) milliseconds = 1500;
        else {
          const HOUR_TO_MIN = 60,
            MIN_TO_SEC = 60,
            SEC_TO_MS = 1000;
          let tempCounter = round.h * HOUR_TO_MIN;
          tempCounter += round.m * MIN_TO_SEC + round.sec;
          tempCounter /= SEC_TO_MS;
          tempCounter = Math.floor(tempCounter + round.ms);
          milliseconds = tempCounter;
        }

        round.congruent
          ? (tempTrial.avgCongruentReaction += milliseconds)
          : (tempTrial.avgIncongruentReaction += milliseconds);

        tempTrial.reactionList.push(milliseconds);
      }); // End of

      const totalIncongruent =
        tempTrial.reactionList.length - tempTrial.totalCongruent;

      tempTrial.avgIncongruentReaction = Math.floor(
        tempTrial.avgIncongruentReaction / totalIncongruent
      );
      tempTrial.avgCongruentReaction = Math.floor(
        tempTrial.avgCongruentReaction / tempTrial.totalCongruent
      );

      tempTrial.avgReaction = Math.floor(
        tempTrial.reactionList.reduce((a, b) => a + b) /
          tempTrial.reactionList.length
      );

      participantTrials.trialList.push(tempTrial);
    }); // End of filteredData list

    return participantTrials;

    // add both lists and average to total round count (40)
    // fill in the dataSummary totalAverage section

    // Add participant to csv string
    // Parse dataSummaries into csv format:
    // pid | sessionNumber | totalCorrect | totalCongruent | avgReaction | avgCongruentReaction | avgIncongruentReaction
    // Should be 3 rows per participant * 25 participants = 75 lines of csv
  };

  async function downloadAll(ev) {
    ev.preventDefault();

    setLoading(true);
    setError("");

    const qSnap = await queryAll(ev, activeFirestore);

    if (!qSnap) setError("ERROR DOWNLOAD ALL");
    else {
      let participantDataList = [];
      qSnap.docs.forEach((doc, i) => {
        const participant = doc.data();
        const { pid } = participant;

        // if (pid !== "101") return console.log("PID Cancelled");

        const participantData = filterParticipantData(participant);
        participantDataList.push(generateParticipantCSV(participantData));
      });

      // console.log(participantDataList);

      let csvFileString = [CSV_HEADER];

      participantDataList.forEach((participant) => {
        const { pid, trialList } = participant;
        let tempString = "";

        trialList.forEach((trial) => {
          tempString += `${pid},${trial.sessionNumber},${trial.totalCorrect},${trial.totalCongruent},${trial.avgReaction},${trial.avgCongruentReaction},${trial.avgIncongruentReaction},\n`;
        });

        csvFileString.push(tempString);
      });

      downloadTxtFile(csvFileString);
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex justify-content-center flex-column"
      style={{ padding: "2rem" }}
    >
      <h3 className="text-center mb-4">Search Participant</h3>
      <div className="d-flex flex-row justify-content-center">
        <Table striped bordered hover style={{ width: "45%" }}>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td style={{ fontWeight: "bold", width: "50%" }}>Summary</td>
            </tr>
            <tr>
              <td>Participant</td>
              <td style={(error && { color: "red", fontWeight: "bold" }) || {}}>
                {searchDisplayData && searchDisplayData.pid} &nbsp;
              </td>
            </tr>
            <tr>
              <td>Trial Count</td>
              <td style={(error && { color: "red", fontWeight: "bold" }) || {}}>
                {searchDisplayData && searchDisplayData.trialCount} &nbsp;
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td style={{ fontWeight: "bold" }}>Final</td>
            </tr>
            <tr>
              <td>Correct</td>
              <td style={(error && { color: "red", fontWeight: "bold" }) || {}}>
                {searchDisplayData && searchDisplayData.totalCorrect} &nbsp;
              </td>
            </tr>
            <tr>
              <td>Congruent</td>
              <td style={(error && { color: "red", fontWeight: "bold" }) || {}}>
                {searchDisplayData && searchDisplayData.totalCongruent} &nbsp;
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="d-flex flex-row">
        <SearchForm
          errorState={{ error, setError }}
          searchState={{ setSearchState }}
          styles={{ margin: "1rem auto", padding: "1rem 2rem" }}
        />
        <div className="d-flex flex-column">
          <Button
            style={{ margin: "auto", width: "auto" }}
            disabled={!searchState && loading}
          >
            Download Pid
          </Button>
          <Button
            onClick={downloadAll}
            style={{ margin: "auto", width: "auto" }}
            disabled={loading}
          >
            Download All
          </Button>
        </div>
      </div>
    </Container>
  );
}
