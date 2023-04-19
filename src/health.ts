import {Router} from 'express'

const router = Router()
router.get('/health', (_, res) => res.status(200).send('ok'))
router.get('/ready', (_, res) => res.status(200).send('ok'))

export default router
