import asyncMiddleware from 'middleware-async'
import {Request} from 'express'
import ServerError from './ServerError'

const verifyToken = async (token: string) => {
	if (token !== '1234') throw new ServerError('Invalid token', 401)
	return {id: '1'}
}
const fetchUser = async (id: string) => ({id, name: 'test user'})

interface IUser {
	id: string
	name: string
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/683f1d930563dced6c187a1a9a9e0e026b0aba94/types/express-serve-static-core/index.d.ts#L15-L23
declare global {
	namespace Express {
		export interface Request {
			user: IUser
		}
	}
}
export default asyncMiddleware(async (req, _res, next) => {
	const authorizationHeader = req.get('Authorization')
	const bearer = 'Bearer '
	if (authorizationHeader?.startsWith(bearer)) {
		const token = authorizationHeader.slice(bearer.length)
		try {
			const decodedToken = await verifyToken(token)
			req.user = await fetchUser(decodedToken.id)
		} catch (e) {
			console.error(e)
		}
	}
	next()
})
export const requireAuth = (req: Request) => {
	if (!req.user) throw new ServerError('Login required', 401)
}
