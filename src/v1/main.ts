import {Router} from 'express'
import ServerError from './ServerError'
import auth, {requireAuth} from './auth'
import asyncMiddleware from 'middleware-async'
import ms from 'ms'
import {parseZodSchema} from './lib'
import {z} from 'zod'

const router = Router()
router.use(auth)

/**
 * get private information
 * test with
 * curl localhost:3000/v1/me -H "Authorization: Bearer 1234"
 */
router.get('/me', (req, res) => {
	requireAuth(req)
	res.status(200).json({user: req.user})
})

/**
 * get public information
 */
router.get('/public', asyncMiddleware(async (req, res) => {
	await new Promise(resolve => setTimeout(resolve, ms('1s')))
	res.status(200).json({message: 'ok'})
}))

/**
 * create an object with data validation
 * test with
 * curl localhost:3000/v1/create -X POST -d '{"name": "a"}' -H "Content-Type: application/json"
 */
router.post('/create', asyncMiddleware(async (req, res) => {
	const body = parseZodSchema(z.object({name: z.string()}).strict(), req.body)
	console.log(`created object with name ${body.name}`)
	res.status(200).json({obj: body})
}))

/**
 * get auth token for testing
 */
router.get('/gen-token', asyncMiddleware(async (_, res) => {
	res.status(200).send('1234')
}))

router.use((_, res) => {
	res.status(404).json({message: 'Not Found'})
})

// @ts-ignore
router.use((err, _req, res, _next) => {
	console.error(err)
	if (err instanceof ServerError) res.status(err.status).json({message: err.message})
	else res.status(500).json({message: 'Internal Server Error'})
})
export default router
