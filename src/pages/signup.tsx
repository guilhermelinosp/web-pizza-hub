import React from 'react'
import Head from 'next/head'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import styles from '../styles/signup.module.scss'
import { AuthContext } from '../context/AuthContext'
import { SSRGuest } from '../utils/SSR/SSRGuest'
import { toast } from 'react-toastify'

export default function SignUp() {
	const [name, setName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [passwordConfirmation, setPasswordConfirmation] = React.useState('')
	const [loading, setLoading] = React.useState(false)

	const { signUp } = React.useContext(AuthContext)

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault()

		if (name === '' || email === '' || password === '' || passwordConfirmation === '') {
			toast.warning('All fields are required')

			return
		}

		if (password !== passwordConfirmation) {
			toast.warning('Passwords do not match')
			return
		}

		setLoading(true)

		await signUp({
			name,
			email,
			password
		})

		setLoading(false)
	}

	return (
		<>
			<Head>
				<title>Sign Up | Pizza Hub</title>
			</Head>

			<div className={styles.container}>
				<h1>Pizza Hub</h1>
				<h2>Create Account!</h2>

				<div className={styles.form}>
					<form onSubmit={handleSubmit}>
						<Input
							placeholder="Name"
							type="text"
							autoCapitalize="none"
							value={name}
							onChange={(name) => setName(name.target.value)}
						/>
						<Input
							placeholder="Email"
							type="text"
							autoCapitalize="none"
							value={email}
							onChange={(email) => setEmail(email.target.value)}
						/>
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={(password) => setPassword(password.target.value)}
						/>
						<Input
							placeholder="Password Confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(passwordConfirmation) =>
								setPasswordConfirmation(passwordConfirmation.target.value)
							}
						/>

						<Button type="submit" loading={loading}>
							Sign up
						</Button>
					</form>
				</div>

				<p>Pizza Hub © 2022</p>
			</div>
		</>
	)
}

export const getServerSideProps = SSRGuest(async (ctx) => {
	return {
		props: {}
	}
})
