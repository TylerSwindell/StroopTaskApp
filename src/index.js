import ReactDOM from 'react-dom/client'
import './styles/index.css'
import App from './App'
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from './contexts/auth-context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
<>
	<AuthProvider>
		<App />
	</AuthProvider>
</>
)