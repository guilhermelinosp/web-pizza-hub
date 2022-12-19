import '../styles/globals.scss'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<AuthProvider>
				<Component {...pageProps} />
				<ToastContainer autoClose={3000} />
			</AuthProvider>
		</>
	)
}
