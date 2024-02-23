import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/plp', (req, res, next) => {
    res.render('pages/plp')
  })

  get('/resettlement', (req, res, next) => {
    res.render('pages/resettlement')
  })

  get('/sentence-plan', (req, res, next) => {
    res.render('pages/sentence-plan')
  })

  get('/db-ui', (req, res, next) => {
    res.render('pages/db-ui')
  })

  get('/db-raw', (req, res, next) => {
    res.render('pages/db-raw')
  })

  return router
}
