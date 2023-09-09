import { ServiceBroker } from 'moleculer'
import CronMixin, { CronJobSchema } from '../src/index'
import { jest } from '@jest/globals'

function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('cronjob mixin', () => {
  describe('cronjob runs after 1 second', () => {
    let mockCall = jest.fn()
    const serviceSchema = {
      name: 'cron-test',
      crons: {
        test: {
          cronTime: '* * * * * *',
          onTick: function () {
            mockCall()
          },
        }
      },
      mixins: [CronMixin]
    }
    let broker = new ServiceBroker({ logger: false })
      // Create the actual service
    broker.createService(serviceSchema)
  
    // Start the broker. It will also init the service
    beforeAll(() => broker.start())
  
    // Gracefully stop the broker after all tests
    afterAll(() => broker.stop())

    it('runs the onTick function after 1 second', async () => {
      // wait for 1st tick
      await wait(1200)
  
      expect(mockCall).toHaveBeenCalled()
    })
  })

  describe('cronjob runs when runOnInit boolean is set', () => {
    let mockCall = jest.fn()
    const serviceSchema = {
      name: 'cron-test',
      crons: {
        test: {
          // most likely time it wont run
          cronTime: '*/4 */4 */4 */4 */4',
          onTick: function () {
            mockCall()
          },
          runOnInit: true
        }
      },
      mixins: [CronMixin]
    }
    let broker = new ServiceBroker({ logger: false })
      // Create the actual service
    broker.createService(serviceSchema)
  
    // Start the broker. It will also init the service
    beforeAll(() => broker.start())
  
    // Gracefully stop the broker after all tests
    afterAll(() => broker.stop())

    it('runs the onTick immediately after start', async () => {
      expect(mockCall).toHaveBeenCalled()
    })
  })

})