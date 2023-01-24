import { useState } from "react"
import { Card, Alert, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/auth-context/AuthContext"
import { useNavigate } from "react-router-dom"
import PathList from "../../config/Paths"

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import AddParticipant from "./components/AddParticipant"
import SearchParticipant from "./components/SearchParticipant"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { logoutAuth } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setError("")
    try {
      await logoutAuth()
      navigate(PathList.login)
    } catch {
      setError("Failed to log out")
    }
  }

  return (
      <div>
          <h2>Dashboard</h2>
          <Card.Body className="d-flex form-control" style={{height: '100%', padding: '0'}}>
            <SearchParticipant errorState={{error, setError}}/>
            <div style={{borderRight: '1px solid rgba(0, 0, 0, 0.175)'}}></div>
            <div className="d-flex flex-column justify-content-evenly">
              <AddParticipant/>
              <div className="d-flex align-items-center" style={{height: '100%', borderTop: '1px solid rgba(0, 0, 0, 0.175)'}}>
                <Button style={{padding: '6px 12px', maxHeight: '3rem'}} className="w-50 text-center"  onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </Card.Body>
          <div className="d-flex justify-content-center" style={{height: '60px'}}> {error && <Alert className='error-container' variant="danger">{error}</Alert>} </div>
      </div>
  )
}