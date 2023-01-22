import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App'
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from './contexts/AuthContext'
import { GlobalContext } from './contexts/GlobalContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
<>
	<AuthProvider>
		<App />
	</AuthProvider>
</>
)