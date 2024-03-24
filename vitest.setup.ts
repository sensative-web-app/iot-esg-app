import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './tests/mocks'

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
