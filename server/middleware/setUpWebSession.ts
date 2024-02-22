import { v4 as uuidv4 } from 'uuid'
import session, { MemoryStore } from 'express-session'
import express, { Router } from 'express'
import config from '../config'

export default function setUpWebSession(): Router {
  const store = new MemoryStore()

  const router = express.Router()
  router.use(
    session({
      store,
      name: 'hmpps-one-plan-ui.session',
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    }),
  )

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  router.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  router.use((req, res, next) => {
    const headerName = 'X-Request-Id'
    const oldValue = req.get(headerName)
    const id = oldValue === undefined ? uuidv4() : oldValue

    res.set(headerName, id)
    req.id = id

    next()
  })

  return router
}
