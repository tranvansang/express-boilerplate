import 'source-map-support/register'
import express from 'express'
import {promisify} from 'util'
import health from './health'
import v1 from './v1/main'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const main = async () => {
	const app = express()
	app.set('trust proxy', true)
	if (process.env.NODE_ENV !== 'production') app.set('json spaces', 2)

	app.use(
		morgan('common'),
		bodyParser.urlencoded({extended: true}),
		bodyParser.json(),
		health,
	)
	app.get('/', (req, res) => res.status(200).send('ok'))
	app.use('/v1', v1)
	app.use((_, res) => {
		res.status(404).send('not found')
	})
	// @ts-ignore
	app.use((err, _req, res, _next) => {
		console.error(err)
		res.status(500).send('internal server error')
	})

	const port = +(process.env.PORT ?? 3000)
	await promisify(app.listen.bind(app))(port)
	console.log(`server is listening at ${port}`)
}
main().catch(console.error)
export {}

