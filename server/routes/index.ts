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

  router.use('/post-objective', (req, res, next) => {
    const queryObject = {
      title: 'Chris Atkinson Objective 1',
      targetCompletionDate: '2024-07-30',
      status: 'IN_PROGRESS',
      note: req.query['goal-detail'],
    }
    fetch('https://one-plan-api-dev.hmpps.service.justice.gov.uk/person/12345678/objectives', {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.user.token}`,
      },
      body: JSON.stringify(queryObject),
    }).then(_ => res.render('pages/db-ui'))
  })

  return router
}
