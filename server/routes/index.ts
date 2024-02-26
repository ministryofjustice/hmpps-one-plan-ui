import { type RequestHandler, Router } from 'express'
import csrf from 'csurf'
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

  get('/db-raw', (req, res, next) => {
    res.render('pages/db-raw')
  })

  router.use('/post-objective', (req, res, next) => {
    let { state, selectedPathway, _csrf }: { state?: string; selectedPathway?: string; _csrf?: string } = req.query
    // If query parameters are not provided, try to get values from the request body
    if (!state || !selectedPathway || !_csrf) {
      const { state: bodyState, selectedPathway: bodyPathway, _csrf: bodyCsrf } = req.body
      // Use the values from the request body if they exist
      state = state || bodyState
      selectedPathway = selectedPathway || bodyPathway
      _csrf = _csrf || bodyCsrf
    }
    res.render('pages/post-objective')
  })

  return router
}
