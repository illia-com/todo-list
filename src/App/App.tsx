import { Container } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from '../core/context/AuthContext'
import Router from '../routes/Router'

function App() {
	return (
		<AuthContextProvider>
			<BrowserRouter>
				<Container maxWidth='lg'>
					<Router />
				</Container>
			</BrowserRouter>
		</AuthContextProvider>
	)
}

export default App
