/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-html-link-for-pages */

import Head from 'next/head'
import React from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthContext } from '../context/AuthContext'
import styles from '../styles/home.module.scss'
import { SSRGuest } from '../utils/SSR/SSRGuest'
import { toast } from 'react-toastify'

export default function Home() {
	const { signIn } = React.useContext(AuthContext)

	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [loading, setLoading] = React.useState(false)

	const handleSignIn = async (event: React.FormEvent) => {
		event.preventDefault()

		if (email === '' || password === '') {
			toast.warning('Email and password are required')
			return
		}

		setLoading(true)

		await signIn({ email, password })

		setLoading(false)
	}

	return (
		<>
			<Head>
				<title>Sign In | Pizza Hub</title>
			</Head>

			<div className={styles.container}>
				<h1>Pizza Hub</h1>
				<h2>Welcome back!</h2>

				<div className={styles.form}>
					<form onSubmit={handleSignIn}>
						<Input
							placeholder="Email"
							type="text"
							autoCapitalize="none"
							value={email}
							onChange={email => setEmail(email.target.value)}
						/>
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={password => setPassword(password.target.value)}
						/>

						<Button type="submit" loading={loading}>
							Sign In
						</Button>
					</form>
				</div>

				<div className={styles.footer}>
					<p>
						Don't have an account? <a href="/signup">Sign Up</a>
					</p>
				</div>

				<p>Pizza Hub © 2022</p>
			</div>
		</>
	)
}

export const getServerSideProps = SSRGuest(async ctx => {
	return {
		props: {}
	}
})
