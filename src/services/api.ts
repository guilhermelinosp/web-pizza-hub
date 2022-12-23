import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { signOut } from '../context/AuthContext'
import { AuthError } from '../utils/errors/AuthError'

export const setupAPIClient = (ctx = undefined) => {
	const cookies = parseCookies(ctx)

	const api = axios.create({
		baseURL: 'https://api-pizza-hub.herokuapp.com/api/v1',
		headers: {
			Authorization: `Bearer ${cookies['@pizzaHub:token']}`
		}
	})

	api.interceptors.response.use(
		(response) => {
			return response
		},
		(error: AxiosError) => {
			if (error.response?.status === 401) {
				if (typeof window !== undefined) {
					signOut()
				} else {
					return Promise.reject(new AuthError())
				}
			}

			return Promise.reject(error)
		}
	)

	return api
}

export const api = setupAPIClient()
