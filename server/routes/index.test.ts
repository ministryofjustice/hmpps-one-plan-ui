import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('One Plan Demo')
        expect(res.text).toContain('PLP')
        expect(res.text).toContain('Resettlement')
        expect(res.text).toContain('Sentence Plan')
        expect(res.text).toContain('Database Raw')
        expect(res.text).toContain('Database with UI')
      })
  })
})
