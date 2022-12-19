import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

export function SSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx)

		if (cookies['@pizzaHub:token']) {
			return {
				redirect: {
					destination: '/dashboard',
					permanent: false
				}
			}
		}

		return await fn(ctx)
	}
}
