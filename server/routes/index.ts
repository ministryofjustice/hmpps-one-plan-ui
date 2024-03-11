import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { getObjectiveData, resetDemoData } from '../data/api'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', (req, res) => {
    res.render('pages/index', { reset: req.query.reset })
  })

  get('/plp', (_, res) => {
    res.render('pages/plp')
  })

  get('/resettlement', (req, res) => {
    res.render('pages/resettlement')
  })

  get('/sentence-plan', (req, res) => {
    res.render('pages/sentence-plan1')
  })

  router.post('/sentence-plan-2', (req, res) => {
    const queryObject = {
      title: req.body.objective,
      targetCompletionDate: '2024-09-11',
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
    }).then(resp => {
      resp.json().then(body => res.render('pages/sentence-plan2', { objectiveReference: body.reference }))
    })
  })

  router.post('/sentence-plan-action', (req, res) => {
    const queryObject = {
      description: req.body.intervention ?? req.body.withHint,
      targetCompletionDate: `${req.body['target-date-Year']}-${req.body['target-date-Month']}-01`,
      status: req.body.status,
      staffTask: req.body.responsibility === 'SERVICE_USER',
    }
    fetch(`${config.apis.onePlanApi.url}/person/12345678/objectives/${req.body.objective}/steps`, {
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
    }).then(_ => {
      if (req.body.continue === '') {
        res.redirect('/db-ui')
      } else {
        res.render('pages/sentence-plan2', { objectiveReference: req.body.objective })
      }
    })
  })

  get('/db-ui', (req, res) => {
    getObjectiveData(req.user.token).then(({ objectives, objectiveRefToPlanType }) => {
      res.render('pages/db-ui', { objectives, objectiveRefToPlanType, formatDate })
    })
  })

  get('/db-raw', (_, res) => {
    res.render('pages/db-raw')
  })

  router.post('/post-objective', (req, res) => {
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
    }).then(_ => res.redirect('/db-ui'))
  })

  router.post('/reset-data', (req, res) => {
    resetDemoData(req.user.token).then(() => res.redirect('/?reset=true'))
  })

  router.post('/sentence-plan', (req, res) => {
    const queryObject = {}
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
    }).then(_ => res.redirect('/db-ui'))
  })

  return router
}

const formatDate = (dateString: string, monthStyle: 'short' | 'long' = 'short'): string => {
  if (!dateString) return null
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: monthStyle, year: 'numeric' }
  return date.toLocaleDateString('en-GB', options)
}
