import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { getObjectiveData, resetDemoData } from '../data/api'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res, next) => {
    res.render('pages/index', { reset: req.query.reset })
  })

  get('/plp', (req, res, next) => {
    res.render('pages/plp')
  })

  get('/resettlement', (req, res, next) => {
    res.render('pages/resettlement')
  })

  get('/sentence-plan', (req, res, next) => {
    res.render('pages/sentence-plan1')
  })

  get('/sentence-plan-2', (req, res, next) => {
    res.render('pages/sentence-plan2')
  })

  get('/db-ui', (req, res, next) => {
    getObjectiveData(req.user.token).then(({ objectives, objectiveRefToPlanType }) => {
      res.render('pages/db-ui', { objectives, objectiveRefToPlanType, formatDate })
    })
  })

  get('/db-raw', (req, res, next) => {
    res.render('pages/db-raw')
  })

  router.use('/post-objective', (req, res, next) => {
    const dateString = req.query['goal-timeline'] as string
    let targetCompletionDate
    if (dateString.includes('3')) {
      targetCompletionDate = '2023-12-30'
    } else if (dateString.includes('6')) {
      targetCompletionDate = '2024-07-30'
    } else if (dateString.includes('12')) {
      targetCompletionDate = '2024-09-30'
    } else {
      targetCompletionDate = `${req.query['goal-timeline-year']}-${req.query['goal-timeline-month']}-${req.query['goal-timeline-day']}`
    }
    const queryObject = {
      title: req.query['goal-detail'],
      targetCompletionDate,
      status: 'NOT_STARTED',
    }
    fetch(`${config.apis.onePlanApi.url}/person/12345678/objectives`, {
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
    }).then(_ => res.redirect('pages/db-ui'))
  })

  router.post('/reset-data', (req, res) => {
    resetDemoData(req.user.token).then(() => res.redirect('/?reset=true'))
  })

  return router
}

const formatDate = (dateString: string, monthStyle: 'short' | 'long' = 'short'): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: monthStyle, year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}
