import React from 'react'
import { destroyCookie, setCookie } from 'nookies'
import Router from 'next/router'
import { api } from '../services/api'
import { toast } from 'react-toastify'

type AuthContextData = {
	user: UserProps
	isAuthenticated: boolean
	signIn: (credentials: SignInProps) => Promise<void>
	signUp: (credentials: SignUpProps) => Promise<void>
	signOut: () => void
}

type UserProps = {
	name: string
	email: string
}

type SignInProps = {
	email: string
	password: string
}

type SignUpProps = {
	name: string
	email: string
	password: string
}

type AuthProviderProps = {
	children: React.ReactNode
}

export const AuthContext = React.createContext({} as AuthContextData)

export function signOut() {
	destroyCookie(undefined, '@pizzaHub:token')

	if (typeof window !== 'undefined') {
		Router.push('/')
	}
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = React.useState<UserProps>({
		name: '',
		email: ''
	} as UserProps)

	const isAuthenticated = !!user

	const signIn = async ({ email, password }: SignInProps): Promise<void> => {
		try {
			const { data } = await api.post('/signin', {
				email,
				password
			})

			console.log(data)

			setCookie(undefined, '@pizzaHub:token', data.token, {
				maxAge: 60 * 60 * 1
			})

			setUser({
				name: data.user.name,
				email: data.user.email
			})

			api.defaults.headers['Authorization'] = `Bearer ${data.token}`

			setCookie(undefined, '@pizzaHub:token', data.token, {
				maxAge: 60 * 60 * 24,
				path: '/'
			})

			Router.push('/dashboard')
		} catch (err) {
			toast.error('Email or password incorrect')
			console.log(err)
		}
	}

	const signUp = async ({ name, email, password }: SignUpProps): Promise<void> => {
		try {
			await api.post('/signup', {
				name,
				email,
				password,
				password_confirmation: password
			})

			toast.success('Account created successfully')

			Router.push('/')
		} catch (err) {
			toast.error('Email already in use')
			console.log(err)
		}
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
			{children}
		</AuthContext.Provider>
	)
}
