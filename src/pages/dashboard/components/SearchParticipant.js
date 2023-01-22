import { useEffect, useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import SearchForm from './SearchForm'
import { queryAll } from '../../../setup/QueryDB'
import csvDownload from 'json-to-csv-export'

export default function SearchParticipant(props) {
    const { error, setError } = props.errorState
    const [ searchState, setSearchState ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ searchDisplayData, setSearchDisplayData ] = useState({ 
        pid: '',
        trialCount: '',
        totalCongruent: '',
        totalCorrect: ''
    })

    useEffect(() => {
        console.log(searchDisplayData)
        // Stop points
        // pid will be blank in at the start
        // it will only populate on valid or invalid entries
        if (error !== '' || searchState === null) return

        // null is set if the data is not returned
        if (searchState === undefined) { 
            return setSearchDisplayData({ 
                pid: 'Invalid',
                trialCount: 'N/A',
                totalCongruent: 'N/A',
                totalCorrect: 'N/A'
            })
        }

        // If there is data run the population section
        const totalCongruent = (searchState.listOfTrials.length) 
                                ? searchState.listOfTrials
                                    .map((i) => i.totalCongruent)
                                    .reduce((accu, curr) => accu + curr) 
                                : 0
        const totalCorrect = (searchState.listOfTrials.length) 
                                ? searchState.listOfTrials
                                    .map((i) => i.totalCorrect)
                                    .reduce((accu, curr) => accu + curr) 
                                : 0

        setSearchDisplayData({ 
            pid: searchState.pid,
            trialCount: searchState.listOfTrials.length,
            totalCongruent,
            totalCorrect
        })
        // useEffect fires when userData changes
    }, [error, searchState]) // End useEffect

    async function downloadAll(ev) {
        ev.preventDefault()
        
        setLoading(true)
        setError("")
      
        //console.log(e)
        const qSnap = await queryAll(ev, "participants")
        
        if (!qSnap) setError('ERROR DOWNLOAD ALL')
        else {
            let tempData = []
            qSnap.docs.forEach((doc, i) => {
                tempData.push({})
                tempData[i]['pid'] = (doc.data().pid)
                tempData[i]['signupDate'] = (doc.data().signupDate)
                tempData[i]['listOfTrials'] = (doc.data().listOfTrials)
                if (tempData[i]['listOfTrials'].length) {
                    tempData[i]['listOfTrials'].forEach(trial => {
                        console.log(trial)
                    })

                }
            })

            csvDownload({ 
                data: tempData, 
                filename: 'participants', 
                delimiter: ',', 
                headers: ['pid', 'signupDate', 'listOfTrials'] 
            })
        }
        setLoading(false)
    }

    return (
        <Container className="d-flex justify-content-center flex-column" style={{padding: '2rem'}}>
        <h3 className="text-center mb-4">Search Participant</h3>
        <div className='d-flex flex-row justify-content-center'>
            <Table striped bordered hover style={{width: '45%'}}>
                <tbody>
                    <tr>
                        <td>&nbsp;</td>
                        <td style={{ fontWeight: "bold", width: '50%' }}>Summary</td>
                    </tr>
                    <tr>
                        <td>Participant</td>
                        <td style={(error && {color: 'red', fontWeight: 'bold'}) || {}}>{(searchDisplayData && searchDisplayData.pid)} &nbsp;</td>
                    </tr>
                    <tr>
                        <td>Trial Count</td>
                        <td style={(error && {color: 'red', fontWeight: 'bold'}) || {}}>{(searchDisplayData && searchDisplayData.trialCount)} &nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td style={{ fontWeight: "bold" }}>Final</td>
                    </tr>
                    <tr>
                        <td>Correct</td>
                        <td style={(error && {color: 'red', fontWeight: 'bold'}) || {}}>{searchDisplayData && searchDisplayData.totalCorrect} &nbsp;</td>
                    </tr>
                    <tr>
                        <td>Congruent</td>
                        <td style={(error && {color: 'red', fontWeight: 'bold'}) || {}}>{searchDisplayData && searchDisplayData.totalCongruent} &nbsp;</td>
                    </tr>
                </tbody>
                </Table>
            </div>

            <div className='d-flex flex-row'>
            <SearchForm 
                errorState={{error, setError}} 
                searchState={{setSearchState}}
                styles={{margin: '1rem auto', padding: '1rem 2rem'}}/>
                <div className='d-flex flex-column'>
                    <Button style={{margin: 'auto', width: 'auto'}} disabled={!searchState && loading}>
                            Download Pid
                    </Button>
                    <Button onClick={downloadAll} style={{margin: 'auto', width: 'auto'}} disabled={loading}>
                        Download All
                    </Button>
                </div>
            </div>
        </Container>
    )
}
