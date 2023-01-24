// Library Imports
import { Container } from "react-bootstrap"

// CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Page Components
import MainView from "./views/main/MainView";
import NavBar from "./views/NavBar"
import { GlobalProvider } from "./contexts/global-context/GlobalContext";

function App() {
  return (
	<GlobalProvider>
    <Container  style={{ minHeight: "100vh", minWidth: '100vw'}}
		className="d-flex align-items-center flex-column">

		<div style={{ minHeight: "100vh", minWidth: '1250px'}}
			className="d-flex flex-column justify-content-center">
			<header> <NavBar/> </header>

			
				<main> <MainView/> </main>
			
		</div>
    </Container>
	</GlobalProvider>
  )
}

export default App